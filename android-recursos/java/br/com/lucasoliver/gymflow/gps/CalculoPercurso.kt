package br.com.lucasoliver.gymflow.gps

import org.json.JSONArray
import org.json.JSONObject

/**
 * As contas do percurso (distância, tempo em movimento, pausa automática e parciais por km),
 * sem nada de Android, para poder testar e reaproveitar.
 *
 * Mesma ideia do JornadaService do MotoristaPro: âncora + filtro de precisão + passo mínimo
 * + velocidade máxima. Os limites aqui são de quem anda, corre ou pedala, não de carro.
 */
class CalculoPercurso(
    val tipo: String,
    val inicioEm: Long,
    var pausaAuto: Boolean = true,
) {
    var metros = 0.0
        private set
    /** Tempo em movimento já fechado (ms). O tempo "ao vivo" é [tempoMovimento]. */
    private var movMs = 0L
    var pausadoManual = false
        private set
    var temSinal = false
        private set

    private var ancLat = 0.0
    private var ancLon = 0.0
    private var ancEm = 0L
    private var temAncora = false
    /** Hora do último passo aceito (ou da retomada): base do cronômetro ao vivo. */
    private var ultimoMovEm = inicioEm

    /** Trajeto para o mapa do resumo: [lat, lon] a cada passo aceito. */
    val pontos = ArrayList<DoubleArray>()
    /** Tempo em movimento de cada km completo (ms). */
    val parciais = ArrayList<Long>()

    // Janela curta para o ritmo "agora": (hora, metros) dos últimos passos
    private val janela = ArrayDeque<Pair<Long, Double>>()

    /** Parado há mais que isso = pausa automática (e o tempo para de contar). */
    val limiarParadoMs: Long = when (tipo) {
        "caminhada" -> 15_000L
        "bike" -> 8_000L
        else -> 10_000L
    }

    /** Acima disso é salto do GPS, não movimento real (m/s). */
    private val velocidadeMax: Double = when (tipo) {
        "caminhada" -> 4.5   // ~16 km/h
        "bike" -> 25.0       // ~90 km/h
        else -> 9.0          // ~32 km/h
    }

    /**
     * Soma um ponto do GPS. Devolve quantos km foram completados neste ponto (para o aviso de voz).
     * [distancia] calcula metros entre (lat1, lon1) e (lat2, lon2) — no Android, Location.distanceBetween.
     */
    fun adicionar(
        lat: Double, lon: Double, precisaoM: Float?, em: Long,
        distancia: (Double, Double, Double, Double) -> Double,
    ): Int {
        if (pausadoManual) return 0
        if (precisaoM != null && precisaoM > PRECISAO_MAX_M) return 0
        if (!temSinal) { temSinal = true; ultimoMovEm = em }
        if (!temAncora) {
            ancLat = lat; ancLon = lon; ancEm = em; temAncora = true
            if (pontos.isEmpty()) pontos.add(doubleArrayOf(lat, lon))
            return 0
        }
        val d = distancia(ancLat, ancLon, lat, lon)
        if (d < PASSO_MIN_M) return 0                     // parado ou deriva do GPS: mantém a âncora
        val dtSeg = (em - ancEm) / 1000.0
        if (dtSeg <= 0) return 0
        if (d / dtSeg > velocidadeMax) {                  // salto impossível: só move a âncora
            ancLat = lat; ancLon = lon; ancEm = em
            return 0
        }
        val antes = metros
        metros += d
        val dtMov = em - ultimoMovEm
        movMs += if (pausaAuto) minOf(dtMov, limiarParadoMs) else dtMov
        ultimoMovEm = em
        ancLat = lat; ancLon = lon; ancEm = em
        pontos.add(doubleArrayOf(lat, lon))
        if (pontos.size > MAX_PONTOS) afinarPontos()
        janela.addLast(em to metros)
        while (janela.size > 2 && em - janela.first().first > JANELA_RITMO_MS) janela.removeFirst()

        // Parciais: fecha um km sempre que a distância passa de mais um múltiplo de 1000 m
        var completos = 0
        while (metros >= (parciais.size + 1) * 1000.0) {
            val alvo = (parciais.size + 1) * 1000.0
            // Interpola o momento exato em que passou do km dentro deste passo
            val frac = if (metros > antes) (alvo - antes) / (metros - antes) else 1.0
            val tKm = movMs - ((1 - frac) * (if (pausaAuto) minOf(dtMov, limiarParadoMs) else dtMov)).toLong()
            parciais.add(tKm - parciais.sum())
            completos++
        }
        return completos
    }

    fun autoPausado(agora: Long): Boolean =
        pausaAuto && temSinal && !pausadoManual && agora - ultimoMovEm > limiarParadoMs

    /** Tempo em movimento até agora (ms), contando o trecho atual. */
    fun tempoMovimento(agora: Long): Long {
        if (pausadoManual || !temSinal) return movMs
        val trecho = agora - ultimoMovEm
        return movMs + if (pausaAuto) minOf(trecho, limiarParadoMs) else trecho
    }

    fun pausar(agora: Long) {
        if (pausadoManual) return
        movMs = tempoMovimento(agora)
        pausadoManual = true
        temAncora = false        // o que andar durante a pausa não conta
        janela.clear()
    }

    fun retomar(agora: Long) {
        if (!pausadoManual) return
        pausadoManual = false
        ultimoMovEm = agora
    }

    /** Velocidade dos últimos ~30 s (m/s), ou null se ainda não dá para medir. */
    fun velocidadeAgora(agora: Long): Double? {
        if (janela.size < 2 || autoPausado(agora) || pausadoManual) return null
        val (t0, m0) = janela.first()
        val (t1, m1) = janela.last()
        val dt = (t1 - t0) / 1000.0
        return if (dt >= 8 && m1 > m0) (m1 - m0) / dt else null
    }

    private fun afinarPontos() {
        val l = pontos.filterIndexed { i, _ -> i % 2 == 0 || i == pontos.size - 1 }
        pontos.clear(); pontos.addAll(l)
    }

    fun paraJson(agora: Long): JSONObject = JSONObject().apply {
        put("tipo", tipo)
        put("ini", inicioEm)
        put("metros", metros)
        put("movMs", tempoMovimento(agora))
        put("pausaAuto", pausaAuto)
        put("parciais", JSONArray(parciais.map { it / 1000.0 }))
        put("pontos", JSONArray(pontos.map { JSONArray(listOf(arred(it[0]), arred(it[1]))) }))
        put("salvoEm", agora)
    }

    companion object {
        const val PRECISAO_MAX_M = 30f
        const val PASSO_MIN_M = 8.0
        const val MAX_PONTOS = 4000
        const val JANELA_RITMO_MS = 30_000L
        private fun arred(v: Double) = Math.round(v * 100000.0) / 100000.0
    }
}
