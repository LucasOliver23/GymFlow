package br.com.lucasoliver.gymflow.gps

import android.Manifest
import android.annotation.SuppressLint
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.content.pm.ServiceInfo
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.app.ServiceCompat
import androidx.core.content.ContextCompat
import br.com.lucasoliver.gymflow.R
import java.util.Locale

/** Estado da atividade em andamento, compartilhado entre o serviço e o plugin. */
object Percurso {
    @Volatile var calc: CalculoPercurso? = null
    @Volatile var voz: Boolean = true
    @Volatile var rodando: Boolean = false

    private const val PREFS = "gymflow_gps"
    private const val CHAVE = "atividade"

    /** Cópia de segurança: se o Android fechar o app no meio, o que foi medido não se perde. */
    fun salvarCopia(context: Context) {
        val c = calc ?: return
        runCatching {
            context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit()
                .putString(CHAVE, c.paraJson(System.currentTimeMillis()).toString()).apply()
        }
    }

    fun lerCopia(context: Context): String? =
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(CHAVE, null)

    fun apagarCopia(context: Context) {
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().remove(CHAVE).apply()
    }
}

/**
 * Serviço em primeiro plano da caminhada/corrida/pedalada. Adaptado do JornadaService do
 * MotoristaPro: notificação fixa com cronômetro e km, GPS pelo LocationManager (sem Google Play
 * Services), filtros de precisão e de saltos. Continua medindo com a tela desligada.
 */
class AtividadeService : Service() {

    private val handler = Handler(Looper.getMainLooper())
    private var locationManager: LocationManager? = null
    private var voz: VozAtividade? = null
    private var ultimaNotificacao = 0L
    private var ultimaCopia = 0L

    // Objeto completo (e não lambda): antes do Android 11 os outros métodos não têm corpo padrão
    private val listener = object : LocationListener {
        override fun onLocationChanged(loc: Location) {
            try { processar(loc) } catch (e: Throwable) { Log.e(TAG, "Erro no GPS", e) }
        }
        override fun onProviderEnabled(provider: String) = Unit
        override fun onProviderDisabled(provider: String) = Unit
        @Deprecated("Só existe até o Android 10")
        @Suppress("OVERRIDE_DEPRECATION")
        override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) = Unit
    }

    private val relogio = object : Runnable {
        override fun run() {
            val agora = System.currentTimeMillis()
            if (agora - ultimaNotificacao >= 5_000) atualizarNotificacao()
            if (agora - ultimaCopia >= 20_000) { ultimaCopia = agora; Percurso.salvarCopia(this@AtividadeService) }
            handler.postDelayed(this, 1_000)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACAO_PARAR -> { encerrar(); return START_NOT_STICKY }
            ACAO_ALTERNAR_PAUSA -> {
                val c = Percurso.calc
                if (c != null) {
                    val agora = System.currentTimeMillis()
                    if (c.pausadoManual) c.retomar(agora) else c.pausar(agora)
                    atualizarNotificacao()
                }
                return START_NOT_STICKY
            }
        }
        // Obrigatório entrar em primeiro plano logo após startForegroundService()
        criarCanal()
        if (!entrarEmPrimeiroPlano()) { stopSelf(); return START_NOT_STICKY }
        if (Percurso.calc == null) { stopSelf(); return START_NOT_STICKY }
        Percurso.rodando = true
        iniciarGps()
        if (Percurso.voz) voz = VozAtividade(this).also { it.preparar() }
        handler.removeCallbacks(relogio)
        handler.post(relogio)
        return START_NOT_STICKY
    }

    override fun onDestroy() {
        handler.removeCallbacks(relogio)
        pararGps()
        voz?.liberar(); voz = null
        Percurso.salvarCopia(this)
        Percurso.rodando = false
        super.onDestroy()
    }

    private fun temPermissao(): Boolean =
        ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED

    @SuppressLint("MissingPermission") // checado em temPermissao()
    private fun iniciarGps() {
        if (!temPermissao()) return
        val lm = getSystemService(Context.LOCATION_SERVICE) as LocationManager
        locationManager = lm
        try {
            lm.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1_000L, 0f, listener, Looper.getMainLooper())
        } catch (e: Exception) {
            Log.e(TAG, "Não foi possível ligar o GPS", e)
        }
    }

    private fun pararGps() {
        runCatching { locationManager?.removeUpdates(listener) }
        locationManager = null
    }

    private fun processar(loc: Location) {
        val c = Percurso.calc ?: return
        val km = c.adicionar(loc.latitude, loc.longitude, if (loc.hasAccuracy()) loc.accuracy else null, System.currentTimeMillis()) { a, b, x, y ->
            val r = FloatArray(1)
            Location.distanceBetween(a, b, x, y, r)
            r[0].toDouble()
        }
        if (km > 0) {
            if (Percurso.voz) {
                if (voz == null) voz = VozAtividade(this).also { it.preparar() }
                val agora = System.currentTimeMillis()
                voz?.falar(VozAtividade.fraseKm(c.tipo, c.parciais.size, c.tempoMovimento(agora), c.parciais.last()))
            }
            Percurso.salvarCopia(this)
            atualizarNotificacao()
        }
    }

    private fun encerrar() {
        pararGps()
        Percurso.rodando = false
        ServiceCompat.stopForeground(this, ServiceCompat.STOP_FOREGROUND_REMOVE)
        stopSelf()
    }

    // ------------------------------------------------------------------ notificação

    private fun criarCanal() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            val canal = NotificationChannel(CANAL, "Atividade em andamento", NotificationManager.IMPORTANCE_LOW)
            canal.description = "Tempo e distância da caminhada, corrida ou pedalada medidos pelo GPS"
            nm.createNotificationChannel(canal)
        }
    }

    private fun entrarEmPrimeiroPlano(): Boolean = try {
        val tipo = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION else 0
        ServiceCompat.startForeground(this, ID_NOTIFICACAO, montarNotificacao(), tipo)
        true
    } catch (e: Exception) {
        Log.e(TAG, "Não foi possível iniciar em primeiro plano", e)
        false
    }

    @SuppressLint("MissingPermission")
    private fun atualizarNotificacao() {
        ultimaNotificacao = System.currentTimeMillis()
        if (Build.VERSION.SDK_INT >= 33 &&
            ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) return
        runCatching { NotificationManagerCompat.from(this).notify(ID_NOTIFICACAO, montarNotificacao()) }
    }

    private fun montarNotificacao(): Notification {
        val c = Percurso.calc
        val agora = System.currentTimeMillis()
        val br = Locale("pt", "BR")
        val nome = when (c?.tipo) { "caminhada" -> "Caminhada"; "bike" -> "Pedalada"; else -> "Corrida" }
        val titulo = when {
            c == null -> "GymFlow"
            c.pausadoManual -> "$nome pausada"
            !c.temSinal -> "$nome · procurando sinal de GPS…"
            c.autoPausado(agora) -> "$nome · pausa automática"
            else -> "$nome em andamento"
        }
        val texto = if (c == null) "" else {
            val km = c.metros / 1000.0
            val t = c.tempoMovimento(agora) / 1000
            val tempo = if (t >= 3600) String.format(br, "%d:%02d:%02d", t / 3600, (t / 60) % 60, t % 60) else String.format(br, "%d:%02d", t / 60, t % 60)
            val leitura = if (km < 0.05) "" else if (c.tipo == "bike") String.format(br, " · %.1f km/h", km / (t / 3600.0).coerceAtLeast(1e-6))
            else { val p = (t / 60.0) / km; String.format(br, " · %d:%02d /km", p.toInt(), Math.round((p - p.toInt()) * 60).toInt().coerceAtMost(59)) }
            String.format(br, "%.2f km · %s%s", km, tempo, leitura)
        }
        val abrir = packageManager.getLaunchIntentForPackage(packageName)?.let {
            PendingIntent.getActivity(this, 0, it.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP), PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
        }
        val pausa = PendingIntent.getService(
            this, 1, Intent(this, AtividadeService::class.java).setAction(ACAO_ALTERNAR_PAUSA),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
        return NotificationCompat.Builder(this, CANAL)
            .setSmallIcon(R.drawable.ic_stat_gymflow)
            .setContentTitle(titulo)
            .setContentText(texto)
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .setShowWhen(false)
            .setContentIntent(abrir)
            .addAction(0, if (c?.pausadoManual == true) "Continuar" else "Pausar", pausa)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }

    companion object {
        private const val TAG = "GymFlowGPS"
        private const val CANAL = "atividade"
        private const val ID_NOTIFICACAO = 7101
        const val ACAO_INICIAR = "br.com.lucasoliver.gymflow.gps.INICIAR"
        const val ACAO_PARAR = "br.com.lucasoliver.gymflow.gps.PARAR"
        const val ACAO_ALTERNAR_PAUSA = "br.com.lucasoliver.gymflow.gps.PAUSA"
    }
}
