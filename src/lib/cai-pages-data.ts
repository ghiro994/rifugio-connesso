// Contenuti estratti dal sito storico CAI Lugo - rifugiebivacchi.cailugo.it
// Strutturati come sezioni con titolo + paragrafi
import tariffarioPdf from '@/assets/tariffario-rifugi-2026.pdf.asset.json';

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
          "Rifugi & Bivacchi mette a disposizione informazioni su rifugi e bivacchi presenti sulle montagne italiane, con l'obiettivo di favorirne la conoscenza, la frequentazione consapevole e la valorizzazione come patrimonio della cultura alpina e appenninica.",
      },
      {
        type: 'paragraph',
        text:
          "Per ogni struttura sono raccolti, quando disponibili, dati utili alla pianificazione delle escursioni: contatti, servizi, modalità di accesso, posizione geografica, fotografie, collegamenti ai siti ufficiali e altre informazioni di interesse per escursionisti e alpinisti.",
      },
      {
        type: 'paragraph',
        text:
          "Il portale offre inoltre uno storico e un servizio dedicato agli annunci di offerta e ricerca di lavoro nei rifugi, attività che la Sezione CAI di Lugo di Romagna porta avanti da molti anni per sostenere i gestori e contribuire alla continuità di questi importanti presìdi della montagna.",
      },
      {
        type: 'paragraph',
        text:
          "I dati pubblicati provengono da fonti pubbliche, dai gestori e dalle segnalazioni ricevute dalla comunità degli utenti. Per questo invitiamo chiunque disponga di informazioni aggiornate, fotografie, correzioni o segnalazioni a collaborare al miglioramento del servizio.",
      },
      { type: 'heading', text: 'Contatti' },
      {
        type: 'paragraph',
        text: "Email: rifugi@cailugo.it",
      },
      {
        type: 'paragraph',
        text:
          "CAI Lugo di Romagna — Piazza G. Savonarola 3 — 48022 Lugo (RA)",
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
    title: 'La Commissione Centrale Rifugi ed Opere Alpine',
    breadcrumb: 'I rifugi del CAI',
    blocks: [
      {
        type: 'paragraph',
        text:
          "La Commissione Centrale Rifugi ed Opere Alpine (CCROA) è uno degli Organi Tecnici Centrali Operativi (OTCO) del Club Alpino Italiano (CAI). Si occupa di tutelare e gestire i rifugi alpini come strutture di pubblica utilità e presidi fondamentali in quota.",
      },
      {
        type: 'paragraph',
        text:
          "Le funzioni e gli scopi principali di questo organo includono la gestione e manutenzione dei rifugi: la Commissione lavora in stretta sinergia con le Commissioni Regionali e le sezioni territoriali CAI proprietarie dei rifugi, offrendo supporto tecnico, logistico e amministrativo. Definisce inoltre le direttive generali per garantire che tutti i rifugi offrano standard di accoglienza e sicurezza uniformi su tutto il territorio nazionale.",
      },
      {
        type: 'paragraph',
        text:
          "È possibile consultare l'elenco completo degli OTCO e le attività della commissione visitando la pagina ufficiale degli Organi Tecnici Centrali CAI.",
      },
      {
        type: 'link',
        href: 'https://www.cai.it/',
        label: 'Vai al sito ufficiale del CAI',
      },
    ],
  },


  regolamenti: {
    slug: 'regolamenti',
    title: 'Regolamenti',
    breadcrumb: 'I rifugi del CAI',
    blocks: [
      {
        type: 'paragraph',
        text:
          "Il Regolamento Generale Rifugi del CAI stabilisce le norme per una corretta frequentazione della montagna. Le strutture offrono ristoro, pernottamento e supporto per il soccorso, garantendo ai soci tariffe agevolate e precedenza.",
      },
      {
        type: 'paragraph',
        text:
          "Il regolamento è consultabile insieme alla documentazione ufficiale del Club Alpino Italiano:",
      },
      {
        type: 'link',
        href: 'https://www.cai.it/documentazione-rifugi-e-bivacchi/',
        label: 'Documentazione rifugi e bivacchi — cai.it',
      },
    ],
  },

  rifugiavs: {
    slug: 'rifugi-avs',
    title: "I rifugi dell'AVS",
    breadcrumb: 'I rifugi del CAI',
    intro:
      "Come i rifugi del CAI, anche i rifugi dell'Alpenverein Suedtirol sono soggetti a un regolamento generale e sono condotti e amministrati secondo criteri simili. Anche per essi è prevista una suddivisione in categorie.",
    blocks: [
      { type: 'heading', text: "Categorie dei rifugi dell'Alpenverein Suedtirol" },
      {
        type: 'list',
        items: [
          "U — Bassa: Tre Scarperi/Dreischuster, Merano/Meraner, Sterzinger Haus",
          "M — Media: Bressanone/Brixner, Bullaccia/Puflatsch, Lago Rodella/Radlsee, Malghetta Sciliar/Schlernbödele, Di Rasass/Sesvenna, Lago della Pausa/Tiefrasten",
          "O — Alta: Gran Pilastro/Hochfeiler, Martello/Marteller, Oberettes, Vedrette di Ries-F.lla Valfredda/Rieserferner-Gänsebichl Joch, Vipiteno/Sterzinger",
        ],
      },
      { type: 'heading', text: 'Note' },
      {
        type: 'list',
        items: [
          "È d'obbligo l'uso del sacco-lenzuolo (100% cotone) in tutti i rifugi. Può essere acquistato direttamente presso le strutture.",
          "I soci godono di agevolazioni su pernottamenti e consumazioni.",
          "Per informazioni aggiornate su tariffe e condizioni si rimanda al sito ufficiale dell'Alpenverein Südtirol.",
        ],
      },
      {
        type: 'link',
        href: 'https://www.alpenverein.it/',
        label: 'Sito ufficiale Alpenverein Südtirol',
      },
    ],
  },

  tariffe: {
    slug: 'tariffe',
    title: 'Tariffario Rifugi CAI 2026',
    breadcrumb: 'I rifugi del CAI',
    intro:
      "Tariffe ufficiali dei rifugi del Club Alpino Italiano in vigore dall'8 gennaio 2026 al 10 gennaio 2027.",
    blocks: [
      {
        type: 'paragraph',
        text:
          "In questa pagina sono riportate le tariffe ufficiali dei rifugi del Club Alpino Italiano in vigore dall'8 gennaio 2026 al 10 gennaio 2027, approvate dal Comitato Centrale di Indirizzo e Controllo del CAI. Le tariffe costituiscono il riferimento per tutte le strutture del Sodalizio e prevedono agevolazioni dedicate ai soci CAI e alle associazioni alpinistiche in regime di reciprocità.",
      },
      {
        type: 'paragraph',
        text:
          "I rifugi CAI svolgono un ruolo fondamentale nell'accoglienza degli escursionisti e nella presenza attiva nelle terre alte. Le agevolazioni riservate ai soci rappresentano uno dei benefici dell'appartenenza al Club Alpino Italiano e contribuiscono a sostenere la rete dei rifugi e la loro funzione di presidio della montagna.",
      },
      {
        type: 'paragraph',
        text: "Il documento completo con tutte le tariffe è consultabile e scaricabile qui:",
      },
      {
        type: 'link',
        href: tariffarioPdf.url,
        label: 'Scarica il tariffario ufficiale CAI 2026 (PDF)',
        external: true,
      },
    ],
  },

};


export const caiPageList = Object.values(caiPages);
