const CookiePolicy = () => (
  <article className="container-page py-10 max-w-3xl">
    <h1 className="heading-section mb-2">Cookie Policy</h1>
    <p className="text-sm text-muted-foreground mb-6 italic">
      Informativa rilasciata in base alle direttive del Garante della Privacy
      "Individuazione delle modalità semplificate per l'informativa e l'acquisizione
      del consenso per l'uso dei cookie" — 8 maggio 2014, e nel rispetto dell'art. 13
      del Codice privacy (D.Lgs. n. 196/2003).
    </p>

    <div className="space-y-5 text-foreground/85">
      <section>
        <h2 className="font-heading text-xl text-foreground mb-2">Cosa sono i cookie?</h2>
        <p>
          I cookie sono stringhe di testo di piccola dimensione che un sito web può inviare,
          durante la navigazione, al dispositivo dell'utente (sia esso un pc, uno smartphone,
          un notebook, un tablet); di norma sono conservati direttamente sul browser
          utilizzato per la navigazione. Lo stesso sito web che li ha trasmessi può poi
          leggere e registrare i cookie che si trovano sul dispositivo per ottenere
          informazioni di vario tipo.
        </p>
        <p className="mt-2">
          I cookie non possono causare danni al tuo computer; inoltre selezioniamo molto
          accuratamente tutti i fornitori di terze parti che possono impostare cookie per
          scopi di marketing.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-xl text-foreground mb-2">Tipi di cookie</h2>
        <p>
          Esistono due macro-categorie fondamentali, con caratteristiche diverse, sulla base
          delle finalità perseguite da chi li utilizza:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>cookie <strong>tecnici</strong></li>
          <li>cookie di <strong>profilazione</strong></li>
        </ul>
      </section>

      <section>
        <h2 className="font-heading text-xl text-foreground mb-2">Cookie tecnici</h2>
        <p>I cookie tecnici possono essere distinti in:</p>
        <ul className="list-disc pl-5 mt-2 space-y-2">
          <li>
            <strong>Cookie di navigazione</strong> — necessari per permettere la navigazione
            all'interno del sito e l'utilizzo delle sue funzioni (ad esempio per realizzare
            un acquisto o autenticarsi per accedere ad aree riservate).
          </li>
          <li>
            <strong>Cookie analytics</strong> — collezionano informazioni sulle modalità con
            cui gli utenti usano il sito, ad esempio quali sono le pagine più visitate o gli
            eventuali messaggi di errore ricevuti durante la navigazione.
          </li>
          <li>
            <strong>Cookie di funzionalità</strong> — permettono al sito di "ricordare" le
            scelte effettuate (come username, lingua, eventuali prodotti selezionati per
            l'acquisto) al fine di migliorare il servizio reso.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-heading text-xl text-foreground mb-2">Cookie di profilazione</h2>
        <p>
          I cookie di profilazione sono volti a creare profili relativi all'utente e vengono
          di norma utilizzati al fine di inviare messaggi pubblicitari in linea con le
          preferenze manifestate dallo stesso nell'ambito della navigazione in rete.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-xl text-foreground mb-2">Altre classificazioni</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Cookie di sessione</strong> — vengono cancellati immediatamente alla
            chiusura del browser.
          </li>
          <li>
            <strong>Cookie persistenti</strong> — rimangono all'interno del browser per un
            determinato periodo di tempo. Sono utilizzati, ad esempio, per riconoscere il
            dispositivo che si collega al sito agevolando le operazioni di autenticazione.
          </li>
          <li>
            <strong>Cookie di prima parte</strong> — generati e gestiti direttamente dal
            soggetto gestore del sito web sul quale l'utente sta navigando.
          </li>
          <li>
            <strong>Cookie di terza parte</strong> — generati e gestiti da soggetti diversi
            dal gestore del sito web (in forza, di regola, di un contratto tra il titolare
            del sito web e la terza parte).
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-heading text-xl text-foreground mb-2">
          Quali cookie sono utilizzati su questo sito?
        </h2>
        <p>
          Su questo sito sono utilizzati <strong>cookie tecnici</strong>, finalizzati a
          garantire la corretta fruizione dei contenuti del sito e a permettere la
          navigazione.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-xl text-foreground mb-2">Impostazioni dei cookie</h2>
        <p>
          Puoi decidere di permettere o meno l'impostazione dei cookie sul tuo computer, ma
          questo sito web funziona in modo ottimale con tutte le tipologie di cookie
          abilitate. Le impostazioni riguardanti i cookie possono essere controllate e
          modificate dalle "Preferenze" del browser (Chrome, Firefox, Safari, Edge, Opera).
        </p>
        <p className="mt-2">
          Se disattivi i cookie, questo potrebbe comportare la disabilitazione di alcune
          funzionalità del sito. Anche con tutti i cookie disabilitati, il tuo browser
          continuerà a memorizzare una piccola quantità di informazioni necessarie per le
          funzionalità di base del sito.
        </p>
      </section>
    </div>
  </article>
);

export default CookiePolicy;
