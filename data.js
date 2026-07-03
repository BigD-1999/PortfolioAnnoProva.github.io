// ============================================================================
// ANNO DI PROVA · B016 — data.js
// ----------------------------------------------------------------------------
// Sorgente unica di verità per i contenuti dinamici del sito.
// Modificare QUI per aggiornare/aggiungere/rimuovere competenze e UDA.
// Niente HTML, niente JS: solo dati. La logica di rendering è in script.js.
// ============================================================================

window.SITE_DATA = {

  // --------------------------------------------------------------------------
  // BILANCIO DELLE COMPETENZE
  // --------------------------------------------------------------------------
  // Ogni voce: { id, titolo, descrizione, inizio: {valore, label}, fine: {valore, label} }
  //   - id: stringa breve mostrata come "C.01" (usata anche per chiave React-style)
  //   - valore: 0–100 (percentuale che riempie la barra)
  //   - label: testo mostrato dentro la barra (es. "2/5"). Lascia vuoto per usare valore/20.
  //
  // Tabella di conversione veloce voto → valore:
  //   1/5=20 · 1.5/5=30 · 2/5=40 · 2.5/5=50 · 3/5=60 · 3.5/5=70 · 4/5=80 · 4.5/5=90 · 5/5=100
  // --------------------------------------------------------------------------

  competenze: [
    {
      id: 'S.01',
      titolo: 'Progettare e gestire situazioni di apprendimento',
      descrizione: 'Progettare e gestire situazioni di apprendimento che promuovano le otto competenze chiave europee per un apprendimento permanente, trasformando l’insegnamento in esperienze significative e critiche, anche attraverso l’utilizzo di strumenti digitali e didattici in presenza e a distanza, e utilizzando strumenti di lavoro per documentare, valutare e certificare le competenze personali di studenti e studentesse, anche in prospettiva orientativa',
      inizio: { valore: 60, label: '2/4' },
      fine:   { valore: 80, label: '3/4' }
    },
    {
      id: 'S.02',
      titolo: 'Adottare e adattare strategie e metodi didattici',
      descrizione: "Adottare e adattare strategie e metodi didattici, compresi quelli personalizzati per l’inclusione di studenti e studentesse con disabilità e bisogni educativi speciali, integrando epistemologie e metodologie disciplinari e interdisciplinari",
      inizio: { valore: 60, label: '2/4' },
      fine:   { valore: 80, label: '3/4' }
    },
    {
      id: 'S.03',
      titolo: 'Adottare strategie e metodi di valutazione',
      descrizione: 'Adottare strategie e metodi di valutazione per promuovere l’apprendimento',
      inizio: { valore: 60, label: '2/4' },
      fine:   { valore: 80, label: '3/4' }
    },
    {
      id: 'S.04',
      titolo: 'Gestire relazioni e comportamenti in classe',
      descrizione: 'Gestire relazioni e comportamenti in classe per favorire l’apprendimento in un clima disteso e collaborativo',
      inizio: { valore: 60, label: '2/4' },
      fine:   { valore: 80, label: '3/4' }
    },
    {
      id: 'S.05',
      titolo: 'Partecipare all’esperienza professionale a scuola',
      descrizione: "Partecipare attivamente all’esperienza professionale organizzata a scuola, comprendendo e applicando funzioni e modalità della valutazione interna ed esterna degli apprendimenti formali, non formali e informali",
      inizio: { valore: 60, label: '2/4' },
      fine:   { valore: 80, label: '3/4' }
    },
    {
      id: 'S.06',
      titolo: 'Lavorare in modo collaborativo con la comunità professionale',
      descrizione: 'Lavorare in modo collaborativo con la comunità professionale della scuola',
      inizio: { valore: 60, label: '2/4' },
      fine:   { valore: 80, label: '3/4' }
    },
    {
      id: 'S.07',
      titolo: 'Instaurare rapporti positivi con gli stakeholder',
      descrizione: 'Instaurare rapporti positivi con i familiari di studenti e studentesse e con i partner istituzionalie sociali',
      inizio: { valore: 60, label: '2/4' },
      fine:   { valore: 80, label: '3/4' }
    },
    {
      id: 'S.08',
      titolo: 'Impegnarsi nella formazione continua',
      descrizione: 'Impegnarsi nella formazione continua e nello sviluppo professionale, integrando i nuclei basilari dei saperi e della didattica specifici per i propri insegnamenti, con la capacità di progettare didatticamente e gestire con flessibilità gruppi-classe/interclasse per la personalizzazione e valorizzazione dei talenti e lo sviluppo di competenze trasversali e comunicative',
      inizio: { valore: 60, label: '2/4' },
      fine:   { valore: 100, label: '4/4' }
    }
  ],

  // --------------------------------------------------------------------------
  // UDA / TIMELINE ATTIVITÀ
  // --------------------------------------------------------------------------
  // Ogni voce: { periodo, titolo, descrizione? }
  //   - periodo: stringa breve mostrata sul lato (es. "SET — OTT", "GEN — FEB")
  //   - titolo: testo principale dell'attività
  //   - descrizione: opzionale, paragrafo di dettaglio (può contenere HTML)
  // L'ordine dell'array determina l'ordine in pagina.
  // --------------------------------------------------------------------------

  uda: [
    {
      periodo: 'SET — OTT',
      titolo: 'BILANCIO DELLE COMPETENZE INIZIALI'
    },
    {
      periodo: 'NOV — DIC',
      titolo: 'LABORATORIO SU SCUOLA FUTURA E INIZIO STESURA DEL PORTFOLIO',
      descrizione: 'Laboratorio seguito: CYBERSICUREZZA E COMPETENZE DI BASE'
    },
    {
      periodo: 'GEN — FEB',
      titolo: "INCONTRO INIZIALE DELL'ANNO DI PROVA E AVVIO DEL PEER TO PEER"
    },
    {
      periodo: 'MAR — APR',
      titolo: 'SVOLGIMENTO ATTIVITÀ DIDATTICA E ULTIMAZIONE PEER TO PEER',
      descrizione: 'Attività svolta: esercitazione sul sistema operativo Linux, tramite gamification'
    },
    {
      periodo: 'MAG — GIU',
      titolo: "CONSEGNA DEL PORTFOLIO E INCONTRO FINALE DELL'ANNO DI PROVA"
    }
  ]

};
