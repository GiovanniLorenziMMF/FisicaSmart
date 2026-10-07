// FILE: admin.js  —  Fisica Smart · Operazione: Riconoscimento Esoplanetario (v3.0)
// ---------------------------------------------------------------------------------
// Tutto ciò che il docente può voler cambiare sta qui. index.html non va toccato.
// ---------------------------------------------------------------------------------

const CONFIG = {

    // --- IMPOSTAZIONI GENERALI ---
    app: {
        version: "3.0",
        missionMinutes: 45,          // durata prevista (il timer diventa giallo oltre questo valore)
        // Incolla qui l'URL /exec della Web App di Google Apps Script (vedi Code.gs)
        scriptUrl: "https://script.google.com/macros/s/IL_TUO_CODICE_QUI/exec",
        revealSolutions: false,      // true = dopo l'invio mostra anche i valori attesi
        allowReset: true             // true = pulsante "Resetta partita" nella schermata del punteggio
                                     // (mettere false con le classi: una sola trasmissione per telefono)
    },

    // --- IMPOSTAZIONI PHYPHOX (compaiono nei box gialli delle postazioni 1 e 3) ---
    phyphox: {
        startDelayS: 3,
        durationS: 10
    },

    // --- PUNTEGGIO (massimo 10 = 4 + 3 + 3) ---
    scoring: {
        hintCost: 0.5,               // punti tolti per ogni "aiuto da Houston" usato
        wrongRowCost: 0.5            // punti tolti per ogni misura sbagliata confermata nella Postazione 1
    },

    // --- POSTAZIONE 1: PENDOLO ---
    // La tabella mostra le FREQUENZE (Hz) misurate a mano con il pendolo del laboratorio.
    // La riga con isAlien: true è quella "sballata":
    //   freq      = frequenza mostrata in tabella (dato alieno)
    //   earthFreq = frequenza che il pendolo reale dà sulla Terra a quella lunghezza
    // La g del pianeta è calcolata dall'app:  g = earthGravity · (freq / earthFreq)²
    //   -> 9,81 · (0,66 / 0,63)² = 10,8 m/s²
    // Il dato alieno deve restare compreso fra la riga prima e quella dopo (0,67 > 0,66 > 0,59).
    mod1: {
        earthGravity: 9.81,
        maxAmplitudeDeg: 9,          // ampiezza massima di lancio del pendolo
        rows: [
            { length: 44, freq: 0.73 },
            { length: 54, freq: 0.67 },
            { length: 64, freq: 0.66, isAlien: true, earthFreq: 0.63 },
            { length: 74, freq: 0.59 }
        ],
        // Tolleranze (Hz) sulla frequenza misurata dagli studenti alla lunghezza "aliena".
        // La più larga deve restare sotto |freq - earthFreq| = 0,03
        freqTolerancePerfect: 0.015,
        freqToleranceGood: 0.025
    },

    // --- PIANETI CANDIDATI ---
    // Sistema TRAPPIST-1 (a circa 40 anni luce): gravità superficiali stimate da masse e raggi
    // (Agol et al. 2021). Il pianeta "giusto" è scelto dall'app: quello con g più vicina a
    // quella calcolata nella Postazione 1. Non sono in elenco 1c (10,7) e 1g (10,2) perché
    // troppo vicini a 1b per essere distinti con un pendolo.
    final: {
        planets: [
            { name: "TRAPPIST-1b", g: 10.8, colors: ["#8a3b1e", "#d9793a", "#4a1d0f"],
              note: "Un mondo roccioso e rovente a circa 40 anni luce dalla Terra." },
            { name: "TRAPPIST-1d", g: 6.1,  colors: ["#6b8f71", "#a9c9a4", "#3d5a45"] },
            { name: "TRAPPIST-1e", g: 8.0,  colors: ["#3a6ea5", "#8fc1e3", "#1e3d5c"] },
            { name: "TRAPPIST-1f", g: 9.3,  colors: ["#7d7fa8", "#c3c5e6", "#44466b"] },
            { name: "TRAPPIST-1h", g: 5.6,  colors: ["#9aa7b5", "#e3ebf2", "#5a6570"] }
        ]
    },

    // --- POSTAZIONE 2: ATTRITO E MARTELLO ---
    mod2: {
        // Nell'ordine dei blocchetti 1, 2, 3 sul tavolo.
        // texture = disegno della scheda: "ice", "basalt" oppure "sand"
        surfaces: [
            { name: "Ghiaccio levigato",  texture: "ice" },
            { name: "Roccia basaltica",   texture: "basalt" },
            { name: "Regolite sabbiosa",  texture: "sand" }
        ],
        correctSurfaceIndex: 2,      // indice (0,1,2) del blocchetto ad attrito INTERMEDIO -> 2 = Suolo 3
        targetDistanceCm: 20,
        // Punteggio pieno (2 pt) per qualsiasi angolo fra Min e Max, estremi inclusi.
        // Fuori dall'intervallo cala in modo lineare e arriva a zero a "angleFalloffDeg" gradi di distanza.
        correctAngleMin: 27,
        correctAngleMax: 30,
        angleFalloffDeg: 8
    },

    // --- POSTAZIONE 3: ROTOLAMENTO ---
    mod3: {
        distanceCm: 113.1,           // 3 giri della ruota di raggio 6 cm: 3 · 2π · 6 = 113,097 cm
        turns: 3,
        wheelRadiiCm: [6, 8, 10],    // ruote sul tavolo. Quella corretta è calcolata dall'app:
                                     // la più vicina a  distanza / (giri · 2π)  ->  6 cm
        // Domanda Phyphox: forma del grafico "Accelerazione x". Valori: "line", "sine", "circle"
        correctGraph: "sine"
    }
};
