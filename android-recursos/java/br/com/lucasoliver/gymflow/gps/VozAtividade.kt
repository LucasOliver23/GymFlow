package br.com.lucasoliver.gymflow.gps

import android.content.Context
import android.media.AudioAttributes
import android.speech.tts.TextToSpeech
import android.util.Log
import java.util.Locale

/**
 * Aviso por voz a cada km, pelo TextToSpeech do próprio Android (sem internet, sem biblioteca).
 * Mesmo esquema do AvisoVoz do MotoristaPro: sem voz em português instalada, simplesmente não fala.
 * O áudio sai como orientação de navegação, então se mistura com a música em vez de cortá-la.
 */
class VozAtividade(context: Context) {
    private val app = context.applicationContext
    private var tts: TextToSpeech? = null
    private var pronto = false

    fun preparar() {
        if (tts != null) return
        tts = TextToSpeech(app) { status ->
            val motor = tts
            if (status != TextToSpeech.SUCCESS || motor == null) {
                Log.w(TAG, "TextToSpeech indisponível")
                return@TextToSpeech
            }
            val r = runCatching { motor.setLanguage(Locale("pt", "BR")) }.getOrNull()
            pronto = r != TextToSpeech.LANG_MISSING_DATA && r != TextToSpeech.LANG_NOT_SUPPORTED
            runCatching {
                motor.setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ASSISTANCE_NAVIGATION_GUIDANCE)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                        .build()
                )
            }
        }
    }

    fun falar(frase: String) {
        val motor = tts ?: return
        if (!pronto) return
        runCatching { motor.speak(frase, TextToSpeech.QUEUE_FLUSH, null, "km") }
            .onFailure { Log.w(TAG, "Falha ao falar", it) }
    }

    fun liberar() {
        runCatching { tts?.stop(); tts?.shutdown() }
        tts = null
        pronto = false
    }

    companion object {
        private const val TAG = "GymFlowGPS"

        /** "5 minutos e 40 segundos" — do jeito que a voz lê bem. */
        fun tempoFalado(ms: Long): String {
            val s = (ms / 1000).toInt()
            val h = s / 3600
            val m = (s / 60) % 60
            val seg = s % 60
            val partes = mutableListOf<String>()
            if (h > 0) partes += if (h == 1) "1 hora" else "$h horas"
            if (m > 0) partes += if (m == 1) "1 minuto" else "$m minutos"
            if (seg > 0 && h == 0) partes += if (seg == 1) "1 segundo" else "$seg segundos"
            return if (partes.isEmpty()) "0 segundos" else partes.joinToString(" e ")
        }

        /** Frase do km completado. Bike fala velocidade; caminhada e corrida falam ritmo. */
        fun fraseKm(tipo: String, km: Int, totalMs: Long, ultimoKmMs: Long): String {
            val inicio = if (km == 1) "1 quilômetro" else "$km quilômetros"
            return if (tipo == "bike") {
                val kmh = if (totalMs > 0) km / (totalMs / 3_600_000.0) else 0.0
                "$inicio. Tempo, ${tempoFalado(totalMs)}. Velocidade média, ${Math.round(kmh)} quilômetros por hora."
            } else {
                "$inicio. Tempo, ${tempoFalado(totalMs)}. Último quilômetro, ${tempoFalado(ultimoKmMs)}."
            }
        }
    }
}
