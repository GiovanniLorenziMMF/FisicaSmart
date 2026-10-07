// FILE: Code.gs — Google Apps Script collegato al foglio dei risultati
// ---------------------------------------------------------------------------
// INSTALLAZIONE
// 1. Aprite il foglio Google > Estensioni > Apps Script e incollate questo file.
// 2. Esegui il deployment > Nuovo deployment > tipo "Applicazione web"
//      Esegui come: Me      Chi ha accesso: Chiunque
// 3. Copiate l'URL che termina con /exec in admin.js (app.scriptUrl).
// 4. A ogni modifica di questo file: Gestisci deployment > Modifica > Nuova versione.
// Aprendo l'URL /exec nel browser dovete leggere {"ok":true,...}: è il test di vita.
// ---------------------------------------------------------------------------

var SHEET_NAME = 'Risultati';

// [intestazione colonna, chiave nel payload inviato da index.html]
var COLUMNS = [
  ['Data', null],
  ['Squadra', 'teamName'],
  ['Punteggio', 'score'],
  ['Durata (min)', 'durationMin'],
  ['Punti P1', 'scoreM1'],
  ['Punti P2', 'scoreM2'],
  ['Punti P3', 'scoreM3'],
  ['Penalità aiuti', 'hintPenalty'],
  ['Misure sbagliate P1', 'wrongRows'],
  ['Frequenza misurata (Hz)', 'freqMeasured'],
  ['Pianeta', 'planet'],
  ['Suolo scelto', 'surface'],
  ['Angolo (°)', 'angle'],
  ['Raggio ruota (cm)', 'wheelRadius'],
  ['Grafico scelto', 'graph'],
  ['Aiuti usati', 'hints'],
  ['Telefono', 'deviceId'],        // stesso codice = stesso telefono (stesso browser)
  ['Consegna n.', 'attempt'],      // 1 = prima consegna da quel telefono; >1 = partita rifatta
  ['Versione app', 'version'],
  ['ID invio', 'submissionId']
];

function doGet() {
  return json_({ ok: true, service: 'Fisica Smart', time: new Date().toISOString() });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);                       // più squadre possono inviare nello stesso istante
    var d = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sh.getLastRow() === 0) {
      sh.appendRow(COLUMNS.map(function (c) { return c[0]; }));
      sh.setFrozenRows(1);
    }

    // Scarta i doppioni (l'app può ritentare l'invio se la rete è instabile)
    var idCol = COLUMNS.length;
    if (d.submissionId && sh.getLastRow() > 1) {
      var ids = sh.getRange(2, idCol, sh.getLastRow() - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (ids[i][0] === d.submissionId) return json_({ ok: true, duplicate: true });
      }
    }

    sh.appendRow(COLUMNS.map(function (c) {
      return c[1] === null ? new Date() : clean_(d[c[1]]);
    }));
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

// Evita che un nome squadra come "=IMPORTXML(...)" venga eseguito come formula
function clean_(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') {
    v = v.slice(0, 200);
    if (/^[=+\-@]/.test(v)) v = "'" + v;
  }
  return v;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
