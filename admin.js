// FILE: admin.js

const CONFIG = {
    // --- POSTAZIONE 1: PENDOLO ---
    mod1: {
        alienGravity: 8.2,
        tableData: [
            { id: 1, length: 50, period: 1.42, isAlien: false }, 
            { id: 2, length: 55, period: 1.49, isAlien: false }, 
            { id: 3, length: 65, period: 1.77, isAlien: true },  
            { id: 4, length: 68, period: 1.65, isAlien: false }, 
            { id: 5, length: 74, period: 1.73, isAlien: false }  
        ],
        periodTolerancePerfect: 0.05, 
        periodToleranceGood: 0.15     
    },

    // --- POSTAZIONE 2: ATTRITO E MARTELLO ---
    mod2: {
        // Le tre superfici a disposizione
        surfaces: ["Suolo Roccioso", "Suolo Vegetale", "Suolo Liquido"],
        correctSurfaceIndex: 0, // Es: 0 corrisponde a Roccioso
        targetDistanceCm: 10, 
        correctAngle: 45,     
        angleTolerancePerfect: 3,  
        angleToleranceGood: 8      
    },

    // --- POSTAZIONE 3: ROTOLAMENTO ---
    mod3: {
        distanceCm: 157, // Distanza percorsa dal rover
        turns: 5,        // Giri effettuati
        // Circonferenza = 157 / 5 = 31.4 cm -> Diametro = 31.4 / 3.14 = 10 cm
        correctDiameterCm: 10, 
        diaTolerancePerfect: 1,  // Tolleranza in cm sul diametro
        diaToleranceGood: 3      
    },

    // --- REPORT FINALE ---
    final: {
        planets: [
            "Marte (g = 3.7 m/s²)", 
            "Kepler-186f (g = 4.3 m/s²)", 
            "Pianeta X-Tenebris (g = 8.2 m/s²)", 
            "Venere (g = 8.8 m/s²)"
        ],
        correctPlanetIndex: 2 
    }
};
