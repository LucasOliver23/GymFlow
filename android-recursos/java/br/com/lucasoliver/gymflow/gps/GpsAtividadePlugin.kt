package br.com.lucasoliver.gymflow.gps

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import androidx.core.content.ContextCompat
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.annotation.Permission
import com.getcapacitor.annotation.PermissionCallback
import org.json.JSONObject

/**
 * Ponte entre a tela do GymFlow (JavaScript) e o GPS nativo.
 * No JS: Capacitor.Plugins.GpsAtividade.iniciar({ tipo, voz, pausaAuto }), estado(), pausar(),
 * retomar(), parar(), descartar(), copia(), apagarCopia(), permissao(), pedirPermissao().
 */
@CapacitorPlugin(
    name = "GpsAtividade",
    permissions = [
        Permission(alias = "localizacao", strings = [Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION]),
    ],
)
class GpsAtividadePlugin : Plugin() {

    private fun temPrecisa(): Boolean =
        ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED

    private fun respostaPermissao(call: PluginCall) {
        val r = JSObject()
        r.put("localizacao", getPermissionState("localizacao").toString())
        r.put("precisa", temPrecisa())
        call.resolve(r)
    }

    @PluginMethod
    fun permissao(call: PluginCall) = respostaPermissao(call)

    @PluginMethod
    fun pedirPermissao(call: PluginCall) {
        if (temPrecisa()) { respostaPermissao(call); return }
        requestPermissionForAlias("localizacao", call, "aoPedirPermissao")
    }

    @PermissionCallback
    private fun aoPedirPermissao(call: PluginCall) = respostaPermissao(call)

    @PluginMethod
    fun iniciar(call: PluginCall) {
        if (!temPrecisa()) { call.reject("Permita a localização precisa para medir pelo GPS.", "SEM_PERMISSAO"); return }
        if (Percurso.calc == null) {
            val tipo = call.getString("tipo") ?: "corrida"
            Percurso.calc = CalculoPercurso(tipo, System.currentTimeMillis(), call.getBoolean("pausaAuto") ?: true)
            Percurso.apagarCopia(context)
        }
        Percurso.voz = call.getBoolean("voz") ?: true
        try {
            ContextCompat.startForegroundService(context, Intent(context, AtividadeService::class.java).setAction(AtividadeService.ACAO_INICIAR))
            call.resolve(estadoJs())
        } catch (e: Exception) {
            Percurso.calc = null
            call.reject("Não foi possível iniciar o GPS: ${e.message}", "FALHA_INICIAR")
        }
    }

    @PluginMethod
    fun estado(call: PluginCall) = call.resolve(estadoJs())

    @PluginMethod
    fun pausar(call: PluginCall) {
        val c = Percurso.calc
        if (c != null && !c.pausadoManual) alternarPausa()
        call.resolve(estadoJs())
    }

    @PluginMethod
    fun retomar(call: PluginCall) {
        val c = Percurso.calc
        if (c != null && c.pausadoManual) alternarPausa()
        call.resolve(estadoJs())
    }

    @PluginMethod
    fun voz(call: PluginCall) {
        Percurso.voz = call.getBoolean("ativa") ?: true
        call.resolve(estadoJs())
    }

    /** Encerra e devolve tudo o que foi medido (o JS mostra o resumo e salva). */
    @PluginMethod
    fun parar(call: PluginCall) {
        val c = Percurso.calc
        if (c == null) { call.resolve(JSObject()); return }
        val r = JSObject.fromJSONObject(c.paraJson(System.currentTimeMillis()))
        encerrarServico()
        Percurso.calc = null
        Percurso.apagarCopia(context)
        call.resolve(r)
    }

    @PluginMethod
    fun descartar(call: PluginCall) {
        encerrarServico()
        Percurso.calc = null
        Percurso.apagarCopia(context)
        call.resolve()
    }

    /** Atividade que ficou pela metade (o Android fechou o app). */
    @PluginMethod
    fun copia(call: PluginCall) {
        if (Percurso.calc != null) { call.resolve(JSObject()); return }
        val txt = Percurso.lerCopia(context)
        if (txt == null) { call.resolve(JSObject()); return }
        val r = runCatching { JSObject.fromJSONObject(JSONObject(txt)) }.getOrNull()
        call.resolve(r ?: JSObject())
    }

    @PluginMethod
    fun apagarCopia(call: PluginCall) {
        Percurso.apagarCopia(context)
        call.resolve()
    }

    private fun alternarPausa() {
        runCatching {
            context.startService(Intent(context, AtividadeService::class.java).setAction(AtividadeService.ACAO_ALTERNAR_PAUSA))
        }.onFailure {
            // Serviço fora do ar: aplica direto no cálculo
            val c = Percurso.calc ?: return
            val agora = System.currentTimeMillis()
            if (c.pausadoManual) c.retomar(agora) else c.pausar(agora)
        }
    }

    private fun encerrarServico() {
        runCatching { context.startService(Intent(context, AtividadeService::class.java).setAction(AtividadeService.ACAO_PARAR)) }
    }

    private fun estadoJs(): JSObject {
        val r = JSObject()
        val c = Percurso.calc
        r.put("ativo", c != null)
        if (c == null) return r
        val agora = System.currentTimeMillis()
        r.put("tipo", c.tipo)
        r.put("ini", c.inicioEm)
        r.put("metros", c.metros)
        r.put("movMs", c.tempoMovimento(agora))
        r.put("pausado", c.pausadoManual)
        r.put("autoPausado", c.autoPausado(agora))
        r.put("sinal", c.temSinal)
        r.put("rodando", Percurso.rodando)
        r.put("voz", Percurso.voz)
        r.put("kms", c.parciais.size)
        r.put("ultimoKmMs", if (c.parciais.isEmpty()) 0L else c.parciais.last())
        val v = c.velocidadeAgora(agora)
        if (v != null) r.put("velAgora", v)
        return r
    }
}
