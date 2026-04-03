import { Mountain, Users, Heart } from 'lucide-react';

const ChiSiamo = () => (
  <div className="container-page py-10 max-w-3xl">
    <h1 className="heading-section mb-6">Chi siamo</h1>

    <div className="space-y-6 text-body text-muted-foreground">
      <p>
        <strong className="text-foreground">RifugiAlpini.it</strong> nasce dall'amore per la montagna e dalla volontà di creare uno strumento utile per chi vive e lavora nei rifugi italiani.
      </p>

      <p>
        Il nostro obiettivo è semplice: mettere in contatto i gestori dei rifugi con le persone che cercano lavoro stagionale in montagna. Cuochi, camerieri, aiuto-rifugisti, tuttofare — il mondo dei rifugi ha bisogno di persone appassionate e motivate, e noi vogliamo facilitare questo incontro.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
        {[
          { icon: Mountain, title: 'La montagna', desc: 'Un patrimonio naturale e culturale che merita di essere valorizzato e protetto.' },
          { icon: Users, title: 'La comunità', desc: 'Crediamo nel valore delle relazioni e nella forza di una rete di persone appassionate.' },
          { icon: Heart, title: 'Il lavoro', desc: 'Il lavoro in rifugio è un\'esperienza unica. Vogliamo renderla accessibile a tutti.' },
        ].map((item) => (
          <div key={item.title} className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-mountain-green-light text-primary">
              <item.icon className="h-5 w-5" />
            </div>
            <h3 className="heading-card text-foreground">{item.title}</h3>
            <p className="text-sm">{item.desc}</p>
          </div>
        ))}
      </div>

      <p>
        Parallelamente, stiamo costruendo un archivio completo dei rifugi e bivacchi italiani, con informazioni pratiche, servizi, contatti e modalità di accesso. Uno strumento utile per escursionisti, alpinisti e appassionati.
      </p>

      <p>
        Il progetto è in continua evoluzione. Se vuoi collaborare, segnalare un rifugio o semplicemente dirci cosa ne pensi, <a href="/contatti" className="text-primary hover:underline">scrivici</a>.
      </p>
    </div>
  </div>
);

export default ChiSiamo;
