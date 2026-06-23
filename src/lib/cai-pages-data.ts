// Contenuti estratti dal sito storico CAI Lugo - rifugiebivacchi.cailugo.it
// Strutturati come sezioni con titolo + paragrafi

export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string; level?: 2 | 3 }
  | { type: 'list'; items: string[] }
  | { type: 'link'; href: string; label: string; external?: boolean };


export type CaiPage = {
  slug: string;
  title: string;
  breadcrumb?: string;
  intro?: string;
  blocks: ContentBlock[];
};

export const caiPages: Record<string, CaiPage> = {
  'cosa-trovi': {
    slug: 'cosa-trovi',
    title: 'Cosa trovi nel sito',
    intro:
      "Una guida ai contenuti e ai servizi disponibili nel portale dei rifugi e bivacchi italiani.",
    blocks: [
      {
        type: 'paragraph',
        text:
          "Questo servizio consente l'accesso a informazioni su tutti i rifugi e bivacchi presenti sulle montagne italiane, permettendone, qualora siano disponibili, anche la visione della fotografia e della carta geografica della zona di ubicazione.",
      },
      {
        type: 'paragraph',
        text:
          "La pagina della ricerca consente molteplici possibilità di accesso ai dati. Con il servizio prenotazione rifugi è possibile riservare i posti nei rifugi direttamente dal sito.",
      },
      {
        type: 'paragraph',
        text:
          "Per i rifugi del CAI si trova il regolamento e il tariffario vigente, così come per i rifugi dell'Alpenverein Suedtirol. Anche per le singole strutture private sono riportate le tariffe, se a noi note. Inoltre links alle home pages dei rifugi, accessi e itinerari, bibliografia e cartografia.",
      },
      {
        type: 'paragraph',
        text:
          "Ci scusiamo per la possibile incompletezza e inesattezza dei dati riportati. Il servizio è in continuo perfezionamento e ampliamento. Lo scopo è di fornire notizie sempre più aggiornate.",
      },
      { type: 'heading', text: 'Contribuisci' },
      {
        type: 'paragraph',
        text:
          "Invitiamo tutti coloro che si trovano in possesso di dati e fotografie utili al miglioramento del servizio a fornirceli inviandoci una email all'indirizzo rifugi@cailugo.it o scrivendo a:",
      },
      {
        type: 'paragraph',
        text:
          "CAI Lugo di Romagna — Piazza G. Savonarola 3 — 48022 Lugo (RA) — Italy",
      },
      {
        type: 'paragraph',
        text:
          "Chi fosse interessato a questo servizio può inserire nella propria pagina un link che rimandi al nostro sito.",
      },
    ],
  },


  tipologie: {
    slug: 'tipologie',
    title: 'Tipologie',
    intro:
      "Una panoramica delle diverse tipologie di strutture ricettive presenti sulle montagne italiane.",
    blocks: [
      { type: 'heading', text: 'Rifugi' },
      {
        type: 'paragraph',
        text:
          "Strutture gestite o custodite, convenientemente predisposte ed organizzate per dare ospitalità e possibilità di sosta, ristoro, pernottamento e servizi connessi. Alcuni rifugi offrono servizio di alberghetto, con trattamento di mezza pensione o pensione completa. Di norma aperti al pubblico solo stagionalmente. La maggior parte dei rifugi CAI e alcuni tra quelli privati sono dotati di un locale invernale con accesso indipendente per il ricovero di fortuna nei periodi di chiusura.",
      },
      { type: 'heading', text: 'Bivacchi' },
      {
        type: 'paragraph',
        text:
          "Strutture generalmente ubicate in zone elevate e/o in luoghi molto isolati, frequentate per alpinismo o escursionismo. Si distinguono in:",
      },
      {
        type: 'list',
        items: [
          "Costruzioni in muratura, talvolta derivanti dal recupero di strutture preesistenti, a più locali, con dotazione di materiale piuttosto ampia, spesso con possibilità di approvvigionamento di acqua;",
          "Costruzioni di tipo prefabbricato, monolocali di modeste dimensioni con capienza normalmente non superiore ai 15 posti, attrezzati solo con quanto essenziale per il riparo di fortuna.",
        ],
      },
      {
        type: 'paragraph',
        text:
          "Per la maggior parte incustoditi e aperti in permanenza, solo in taluni casi è necessario richiederne le chiavi per potervi accedere.",
      },
      { type: 'heading', text: 'Ricoveri' },
      {
        type: 'paragraph',
        text:
          "Strutture modeste, incustodite e aperte in permanenza, mancanti di posti letto e attrezzatura. Utilizzabili solo per soste di emergenza.",
      },
      { type: 'heading', text: 'Punti di appoggio' },
      {
        type: 'paragraph',
        text:
          "Strutture CAI, generalmente ricavate con modesti interventi di restauro e recupero di esistenti edifici tipici dell'ambiente montano quali casere, baite, malghe non più utilizzate. Ubicate in posizione intermedia tra il fondo valle e i rifugi alpini, devono consentire il ricovero ad alpinisti ed escursionisti, con una attrezzatura semplice, ma indispensabile al pernottamento, con eventuale dotazione di materiale da cucina e di riscaldamento. Hanno la funzione di punti di appoggio e di transito lungo itinerari in media quota, alte vie, traversate.",
      },
      { type: 'heading', text: 'Alberghi' },
      {
        type: 'paragraph',
        text:
          "Sono state inserite quelle strutture che per la loro ubicazione in luoghi particolarmente isolati possono costituire una buona base d'appoggio per le attività alpinistiche, escursionistiche o scialpinistiche nella zona.",
      },
      { type: 'heading', text: 'Agriturismo' },
      {
        type: 'paragraph',
        text:
          "Oltre a possedere i requisiti di ubicazione degli alberghi, tali strutture presentano caratteristiche ricettive intermedie tra un albergo e un rifugio.",
      },
      { type: 'heading', text: 'Capanne o Baite Sociali' },
      {
        type: 'paragraph',
        text:
          "Strutture CAI utilizzabili da parte delle Sezioni proprietarie per soggiorni di soci o incontri intersezionali. Generalmente chiuse, con le chiavi reperibili presso le Sezioni. Eventuali richieste di soggiorno vanno rivolte alle stesse Sezioni.",
      },
    ],
  },

  storia: {
    slug: 'storia',
    title: 'Storia',
    intro: "L'origine e l'evoluzione dei rifugi alpini in Italia.",
    blocks: [
      {
        type: 'paragraph',
        text:
          "\"Rifugio\" è una parola ormai entrata nel vocabolario di alpinisti ed escursionisti, e quando si usufruisce di queste strutture raramente ci si sofferma a pensare a quello che poteva essere il significato originario di queste costruzioni, ed a quello che può essere il loro significato attuale.",
      },
      {
        type: 'paragraph',
        text:
          "L'origine del Rifugio in montagna è fatta generalmente risalire al 1785 con la Capanna Vincent costruita sul versante meridionale del Monte Rosa quale punto di appoggio per lo sfruttamento delle adiacenti miniere d'oro, seguita nel 1851 da un ricovero al Colle Indren adibito ad osservazioni scientifiche.",
      },
      {
        type: 'paragraph',
        text:
          "Come si vede, le radici più profonde della parola \"rifugio\" affondano in un contesto culturale ben diverso da quello attuale: quello economico, degli scambi commerciali e delle spedizioni militari, e pure quello religioso, di pellegrinaggio ai grandi Santuari, che fece sorgere sui più importanti Passi i primi \"hospitia\" ad opera dei monaci, come quelli del Sempione, del Gottardo e del Gran San Bernardo.",
      },
      {
        type: 'paragraph',
        text:
          "Nel 1852 al Colle del Teodulo, sui resti di vecchie fortificazioni del 1688 e della capanna iniziata nel 1789 e terminata nel 1792 da Horace Bénédìct de Saussure per i suoi studi, viene costruito un modesto locale in pietra che dopo numerosi interventi e passaggi di proprietà viene acquisito nel 1891 dalla Sezione di Torino del Club Alpino Italiano per l'erezione di un rifugio: l'attuale Teodulo a quota 3317.",
      },
      {
        type: 'paragraph',
        text:
          "Seguono nell'arco di un decennio, l'Alpetto al Monviso nel 1866 (200 lire il suo costo globale!), la Balma della Cravatta al Pic Tyndall sul Cervino a m 4134 a cura del CAI e delle guide di Valtournenche nel 1867, mentre nel 1875 in rapida successione vengono inaugurate le Capanne delle Aiguilles Grises sul Monte Bianco (oggi Q. Sella), Linty sul versante sud del Monte Rosa (abbandonata nel 1888) e Regina Margherita al Colle del Gigante sull'area attualmente occupata dai rifugi Torino.",
      },
      {
        type: 'paragraph',
        text:
          "Nel 1876 per iniziativa della Sezione di Varallo del CAI viene costruita la Capanna Gnifetti a ricordo di un grande estimatore del Monte Rosa. Si tratta di un locale in legno interamente catramato all'esterno in grado di ospitare 6 persone. Nello stesso anno la Sezione di Aosta provvede alla costruzione della Capanna Carrel a pochi metri dalla vetta del Grand Tournalin salito per la prima volta da E. Whymper e J.A. Carrel nel 1863.",
      },
      {
        type: 'paragraph',
        text:
          "All'entusiasmo dei soci della Sezione di Agordo è da ascrivere il merito nel 1877 del primo rifugio sulle Dolomiti, scavato nella roccia per agevolare la salita alla Marmolada (all'opera collaborano P. Grohmann e la SAT). Nello stesso anno per iniziativa della Sezione di Aosta viene eretto poco sotto la vetta della Becca di Nona il rifugio Budden, abbandonato verso il 1900 dopo alcuni lavori di restauro.",
      },
      {
        type: 'paragraph',
        text:
          "Negli anni successivi molte Sezioni del CAI, con uomini di grande capacità ed entusiasmo, provvedono alla costruzione di nuovi rifugi in grado di facilitare ascensioni, traversate e superamento di colli elevati. All'inizio di questo secolo sono ormai un centinaio, mentre nel 1922 compare sulle Alpi Occidentali il bivacco fisso, tipo di rifugio dalle caratteristiche specifiche.",
      },
      {
        type: 'paragraph',
        text:
          "Esso viene ubicato nelle zone più alte dalle quali si possono iniziare ascensioni impegnative. I primi bivacchi erano costruiti in pietra e legno. Successivamente alle pietre sono state preferite pareti semiprefabbricate, in metallo rivestite in legno o materiali pressati, assemblate sul posto, oppure trasportati già completi con l'elicottero.",
      },
      {
        type: 'paragraph',
        text:
          "Oggi, grazie alle possibilità offerte dallo sviluppo della tecnica e date le mutate esigenze dei fruitori della montagna, i Rifugi Alpini tendono sempre più a diventare dei veri e propri alberghetti di montagna. Anche il rapporto con il Gestore tende ad evolversi in funzione di queste esigenze, e a diventare forse più \"professionale\".",
      },
      {
        type: 'paragraph',
        text:
          "La rete di Rifugi e punti d'appoggio che si è sviluppata è, nelle regioni alpine, più che soddisfacente per l'alpinista e l'escursionista (tanto che il CAI valuta oggi con molta attenzione i progetti di costruzione di nuove strutture, privilegiando semmai il recupero e la ristrutturazione di quelle già esistenti), mentre nel resto d'Italia ancora attende di essere sempre più organizzata e definita.",
      },
      {
        type: 'paragraph',
        text:
          "Anche se oggi non si vedono più salire i rifornimenti a dorso di mulo, come ai tempi eroico-romantici Ottocenteschi, ma con mezzi ben più moderni quali per esempio l'elicottero, talvolta affiora ancora l'originaria filosofia del Rifugio, più spesso in quelle strutture che presentano maggiori difficoltà di accesso e ridotta frequentazione, e quello strano sapore che rimane dopo avervi passato una serata, vicino a persone sconosciute ma amiche.",
      },
    ],
  },

  categorie: {
    slug: 'categorie',
    title: 'Categorie',
    breadcrumb: 'I rifugi del CAI',
    intro: 'Classificazione dei rifugi (art. 2 del Regolamento Generale Rifugi).',
    blocks: [
      {
        type: 'paragraph',
        text:
          "In relazione alla posizione topografica, finalità alpinistiche-escursionistiche, particolari condizioni d'ambiente - anche stagionali -, quota, difficoltà di accesso e conseguenti fattori economici di gestione, la Commissione centrale rifugi ed opere alpine conferisce alle strutture ricettive di cui all'art. 1/a distinte categorie. Tale classificazione viene determinata ad uso esclusivo interno del Sodalizio.",
      },
      { type: 'heading', text: '1° Gruppo - RIFUGI' },
      {
        type: 'paragraph',
        text:
          "Categoria A — quelli raggiungibili con strada rotabile o comunque ubicati in prossimità di questa. Per questi rifugi è ammessa una differente classificazione per il periodo invernale qualora la situazione ambientale risulti condizionare la possibilità di rifornimento.",
      },
      {
        type: 'paragraph',
        text:
          "Categoria B — quelli raggiungibili con mezzo meccanico di risalita in servizio pubblico, escluse le sciovie, o comunque ubicati in prossimità dello stesso.",
      },
      { type: 'heading', text: '2° Gruppo - RIFUGI ALPINI' },
      {
        type: 'paragraph',
        text:
          "Categoria C-D-E — rispettivamente, in relazione alla situazione locale con particolare riferimento alla quota, alla durata e difficoltà di accesso, nonché all'incidenza del sistema normalmente adottato per i rifornimenti. Per la categoria C è ammessa la divisione in sottocategorie.",
      },
      { type: 'heading', text: '3° Gruppo - PUNTI DI APPOGGIO - BIVACCHI FISSI - RICOVERI - CAPANNE SOCIALI' },
      {
        type: 'paragraph',
        text:
          'Per le loro specifiche caratteristiche non comportano alcuna classificazione.',
      },
    ],
  },

  commissione: {
    slug: 'commissione',
    title: 'La Commissione Centrale Rifugi',
    breadcrumb: 'I rifugi del CAI',
    blocks: [
      {
        type: 'paragraph',
        text:
          "La Commissione Rifugi, uno degli Organi Tecnici Centrali Operativi (OTCO) del Club Alpino Italiano, opera coordinando il lavoro delle Commissioni periferiche, che fanno capo ai vari Gruppi Regionali del CAI.",
      },
      {
        type: 'paragraph',
        text:
          "Suoi compiti sono l'emanazione di regolamenti e normative che riguardano i rifugi del CAI (primo tra tutti il Regolamento Generale Rifugi) e il controllo che tali regolamenti e normative siano rispettati. È inoltre la Commissione a stabilire annualmente il Tariffario per i rifugi del CAI.",
      },
      {
        type: 'paragraph',
        text:
          "È oggi possibile comunicare direttamente con la Commissione, attraverso un indirizzo e-mail, mentre in futuro verrà approntato anche uno spazio per la consultazione delle circolari e dei regolamenti mano a mano approvati.",
      },
    ],
  },

  regolamenti: {
    slug: 'regolamenti',
    title: 'Regolamenti',
    breadcrumb: 'I rifugi del CAI',
    intro: 'Estratto del Regolamento Generale Rifugi (approv. 1992, aggiorn. 1997).',
    blocks: [
      { type: 'heading', text: 'Art. 1 — Finalità, definizione, identificazione' },
      {
        type: 'paragraph',
        text:
          "In relazione alle specifiche caratteristiche costruttive e funzionali connesse alla funzionalità alpinistica, le strutture di proprietà del Sodalizio o delle singole Sezioni o dalle stesse gestite sono definite ed indicate come:",
      },
      {
        type: 'list',
        items: [
          "a) RIFUGI - RIFUGI ALPINI: strutture ricettive sorte per rispondere alle esigenze di carattere alpinistico ed escursionistico, gestite o custodite ed aperte al pubblico stagionalmente.",
          "b) PUNTI DI APPOGGIO: strutture fisse ricavate con modesti interventi di restauro di edifici tipici dell'ambiente montano (casere, baite, malghe non più utilizzate). Raggiungibili esclusivamente a piedi.",
          "c) BIVACCHI FISSI: costruzioni prefabbricate, monolocali di modeste dimensioni con capienza non superiore ai 15 posti, ubicati nelle zone più elevate. Incustoditi e aperti in permanenza.",
          "d) RICOVERI: strutture incustodite e aperte in permanenza, senza alcuna attrezzatura. Utilizzate per sosta di emergenza.",
          "e) CAPANNA SOCIALE: ricavata da immobile esistente, con disponibilità in via esclusiva da parte di una Sezione. Generalmente chiusa, chiavi reperibili presso la Sezione.",
        ],
      },
      { type: 'heading', text: 'Art. 4 — Custodia' },
      {
        type: 'paragraph',
        text:
          "Tutti i rifugi si intendono normalmente custoditi durante i previsti periodi stagionali di apertura; negli altri periodi restano agibili e sempre aperti — ove esistono — i «locali invernali», convenientemente dotati per un ricovero di emergenza. I ricoveri, i bivacchi ed i punti di appoggio in genere si intendono sempre aperti ed atti a permettere il pernottamento di fortuna.",
      },
      { type: 'heading', text: 'Art. 9 — Attrezzatura pronto soccorso' },
      {
        type: 'paragraph',
        text:
          "Le Sezioni devono dotare i loro rifugi di una cassetta di «Pronto soccorso e medicazione» costantemente aggiornata, nonché di una barella di soccorso e, in caso di apertura invernale, di pale e sonde da valanga. I rifugi debbono disporre, nelle immediate vicinanze, di una piazzola idonea all'atterraggio di elicotteri in azione di soccorso.",
      },
      { type: 'heading', text: 'Art. 11 — Apertura stagionale dei rifugi' },
      {
        type: 'paragraph',
        text:
          "In relazione all'andamento stagionale ed alla situazione dei luoghi, d'intesa con il Gestore/Custode, la Sezione fissa il periodo di apertura stagionale del rifugio. Al fine di facilitare l'individuazione del rifugio, il Gestore/Custode ha l'obbligo di esporre dall'alba al tramonto la bandiera nazionale, oppure in caso di scarsa visibilità tenere accesa una luce esterna.",
      },
      { type: 'heading', text: 'Art. 12 — Prenotazioni pernottamenti' },
      {
        type: 'paragraph',
        text:
          "Le prenotazioni per i pernottamenti non possono coprire l'intera capacità ricettiva del rifugio e si considerano valide solo se accettate. Restano valide — salvo patto contrario — sino alle ore 18:00, dopodiché i posti saranno assegnati seguendo l'ordine di arrivo. Resta salvo il diritto di precedenza, a titolo gratuito, per gli infortunati ed i componenti delle squadre del Corpo Nazionale Soccorso Alpino in azione di soccorso.",
      },
      {
        type: 'paragraph',
        text:
          "Nei bivacchi e nei rifugi non custoditi è vietata una permanenza prolungata se non motivata da condizioni atmosferiche tali da impedire il prosieguo dell'ascensione o il ritorno a valle.",
      },
      { type: 'heading', text: 'Art. 13 — Riunioni e pubblicità' },
      {
        type: 'paragraph',
        text:
          "Le riunioni nei rifugi debbono essere autorizzate dalle Sezioni di appartenenza. All'interno dei rifugi è assolutamente vietata l'esposizione di cartelli pubblicitari, manifesti, giornali murali e simili, se non stampati a cura del CAI, nonché la vendita di oggetti non attinenti all'attività del Sodalizio. È permesso esporre soltanto quadri, sculture, fotografie, disegni di interesse alpinistico.",
      },
      { type: 'heading', text: 'Art. 14 — Tariffario' },
      {
        type: 'paragraph',
        text:
          "A ciascuna categoria di rifugi corrisponde un apposito \"Tariffario stagionale\", comprendente quote fissate dalla Commissione centrale rifugi ed opere alpine e prezzi stabiliti dalle Sezioni di appartenenza dei rifugi. Il tariffario, firmato dal Presidente della Sezione, deve essere obbligatoriamente affisso in ogni rifugio in posizione di immediata visione.",
      },
      { type: 'heading', text: 'Art. 15 — Comportamento nei rifugi' },
      {
        type: 'paragraph',
        text:
          "Chi entra in un rifugio deve ricordare che è ospite del Club Alpino Italiano: sappia dunque comportarsi come tale e regoli la sua condotta in modo da non recare disturbo agli altri. Non chieda più di quello che il rifugio (in quanto tale) e il Gestore/Custode possono offrire.",
      },
      {
        type: 'paragraph',
        text:
          "Il Gestore/Custode deve ricordare che il rifugio del CAI è la casa degli alpinisti: sappia renderla ospitale ed accogliente, sia cordiale ed imparziale con tutti. Dalle ore 22:00 alle ore 6:00 deve far osservare assoluto silenzio. Nei rifugi muniti d'impianto d'illuminazione dalle ore 22:00 deve essere tenuto acceso solo il \"notturno\".",
      },
    ],
  },

  rifugiavs: {
    slug: 'rifugi-avs',
    title: "I rifugi dell'AVS",
    breadcrumb: 'I rifugi del CAI',
    intro:
      "Come i rifugi del CAI, anche i rifugi dell'Alpenverein Suedtirol sono soggetti a un regolamento generale e sono condotti e amministrati secondo criteri simili. Anche per essi sono previsti una divisione in categorie e prezzi fissi, che tendono ad avvicinarsi a quelli praticati nei rifugi del CAI.",
    blocks: [
      { type: 'heading', text: 'Categorie dei rifugi dell\'Alpenverein Suedtirol' },
      {
        type: 'list',
        items: [
          "U — Bassa: Tre Scarperi/Dreischuster, Merano/Meraner, Sterzinger Haus",
          "M — Media: Bressanone/Brixner, Bullaccia/Puflatsch, Lago Rodella/Radlsee, Malghetta Sciliar/Schlernbödele, Di Rasass/Sesvenna, Lago della Pausa/Tiefrasten",
          "O — Alta: Gran Pilastro/Hochfeiler, Martello/Marteller, Oberettes, Vedrette di Ries-F.lla Valfredda/Rieserferner-Gänsebichl Joch, Vipiteno/Sterzinger",
        ],
      },
      { type: 'heading', text: 'Tariffario AVS (in Euro) — Pernottamento' },
      {
        type: 'paragraph',
        text:
          "Camerata/Cuccetta — Non soci: U 17,00 / M 18,00 / O 21,00. Soci A: 8,50 / 9,00 / 10,50. Soci C: 3,50 / 3,70 / 3,70.",
      },
      {
        type: 'paragraph',
        text:
          "Camera/Letto — Non soci: U 21,00 / M 22,00 / O 23,00. Soci A: 10,50 / 11,00 / 12,00. Soci C: 6,50 / 6,50 / 6,50.",
      },
      { type: 'heading', text: 'Consumazioni' },
      {
        type: 'paragraph',
        text: "Colazione: U 5,50 / M 6,00 / O 6,20. Piatto alpinistico: U 10,50 / M 11,00 / O 11,50.",
      },
      { type: 'heading', text: 'Note' },
      {
        type: 'list',
        items: [
          "È d'obbligo l'uso del sacco-lenzuolo (100% cotone) in tutti i rifugi. Può essere acquistato presso i rifugi (Euro 10,50).",
          "I soci godono di uno sconto del 10% su ogni consumazione.",
          "Per i bambini sconto del 30% sul piatto alpinistico.",
          "I non soci che intendono consumare anche parzialmente cibi propri sono tenuti al pagamento di Euro 2,00.",
        ],
      },
    ],
  },

  tariffe: {
    slug: 'tariffe',
    title: 'Tariffe',
    breadcrumb: 'I rifugi del CAI',
    intro: 'Tariffario dei rifugi CAI per la stagione 2015 (01/06/2015 — 31/05/2016).',
    blocks: [
      { type: 'heading', text: 'Pernottamento (Soci / Non Soci)' },
      {
        type: 'list',
        items: [
          "Posto letto con materasso e coperte — Cat. A/B: 10,00 / 20,00 € — Cat. C: 10,00 / 20,00 € — Cat. D: 11,00 / 22,00 € — Cat. E: 13,00 / 26,00 € — Regina Margherita: 15,00 / 30,00 €",
          "Posto letto in cameretta fino a 4 posti — Cat. A/B-C: 12,00 / 24,00 € — Cat. D: 13,00 / 26,00 € — Cat. E: 15,00 / 30,00 €",
          "Posto emergenza — Cat. C-D: 3,00 / 6,00 € — Cat. E: 4,00 / 8,00 €",
          "Pernottamento Soci Giovani — Cat. A/B-C: 5,00 € — Cat. D: 5,50 € — Cat. E: 6,50 € — Regina Margherita: 7,50 €",
        ],
      },
      { type: 'heading', text: 'Consumazioni (Soci / Non Soci)' },
      {
        type: 'list',
        items: [
          "Tè (1/3 litro) — da 2,00 / 2,50 € (Cat. A/B) a 2,50 / 3,50 € (Regina Margherita)",
          "Tè (1 litro) — da 4,00 / 5,00 € a 4,50 / 5,50 €",
          "Minestrone con pasta o pastasciutta — da 6,00 / 7,50 € a 7,00 / 8,50 €",
          "Acqua minerale 0,5 l — da 1,50 / 1,80 € a 2,50 / 3,00 €",
          "Acqua minerale 1,5 l — da 2,30 / 2,80 € a 3,80 / 4,50 €",
          "Mezza pensione — supplemento per non soci da +10,00 € a +15,00 €",
        ],
      },
      { type: 'heading', text: 'Chiarimenti' },
      {
        type: 'paragraph',
        text:
          "Gli importi sopra indicati sono quelli massimi applicabili a discrezione delle Sezioni. Nel periodo invernale (1/12 — 30/4) è applicabile un aumento del 30% per i non soci della quota riscaldamento.",
      },
      {
        type: 'paragraph',
        text:
          "Le Sezioni sono invitate a fornire un servizio di ristorazione semplice. I non Soci che intendono consumare cibi propri sono tenuti al pagamento di una quota (max 3,00 Euro), a seconda della Sezione che gestisce il rifugio, quale contributo per il servizio.",
      },
    ],
  },

};

export const caiPageList = Object.values(caiPages);
