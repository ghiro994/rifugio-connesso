import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { MapPin, Mountain, ArrowLeft, Globe, Mail, Upload, X } from 'lucide-react';

const RifugioDetail = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [rifugio, setRifugio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadSlot, setUploadSlot] = useState<number>(0);

  const fetchRifugio = async () => {
    const { data } = await supabase.from('rifugi').select('*').eq('id', id).maybeSingle();
    setRifugio(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRifugio();
  }, [id]);

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from('rifugi-uploads').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleUploadClick = (slot: number) => {
    setUploadSlot(slot);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !rifugio) return;

    setUploading(uploadSlot);
    try {
      const ext = file.name.split('.').pop();
      const filePath = `${rifugio.id}/photo_${uploadSlot}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('rifugi-uploads')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const publicUrl = getPublicUrl(filePath);
      const newImages = [...(rifugio.images || [])];
      newImages[uploadSlot] = publicUrl;

      const { error: updateError } = await supabase
        .from('rifugi')
        .update({ images: newImages })
        .eq('id', rifugio.id);

      if (updateError) throw updateError;
      await fetchRifugio();
    } catch (err: any) {
      console.error('Upload error:', err.message);
    } finally {
      setUploading(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async (slot: number) => {
    if (!rifugio) return;
    const newImages = [...(rifugio.images || [])];
    newImages[slot] = '';
    await supabase.from('rifugi').update({ images: newImages }).eq('id', rifugio.id);
    await fetchRifugio();
  };

  if (loading) {
    return <div className="container-page py-20 text-center text-muted-foreground">Caricamento...</div>;
  }

  if (!rifugio) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="heading-section mb-4">Rifugio non trovato</h1>
        <Link to="/rifugi" className="text-primary hover:underline">Torna all'elenco</Link>
      </div>
    );
  }

  const r = rifugio;
  const images = r.images || [];
  const mailtoLink = r.contacts?.includes('@')
    ? `mailto:${r.contacts.match(/[\w.-]+@[\w.-]+/)?.[0] || ''}`
    : undefined;

  return (
    <div className="container-page py-10 max-w-4xl">
      <Link to="/rifugi" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-3.5 w-3.5" /> Torna all'elenco
      </Link>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="space-y-8">
        <div>
          <h1 className="heading-section mb-2">{r.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{r.region} — {r.province}</span>
            <span className="flex items-center gap-1"><Mountain className="h-4 w-4" />{r.mountain_range}</span>
            <span className="font-medium text-foreground">{r.altitude}m s.l.m.</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[0, 1].map((slot) => {
            const imgUrl = images[slot];
            const isUploading = uploading === slot;

            return (
              <div
                key={slot}
                className="relative aspect-[4/3] bg-secondary rounded-lg overflow-hidden flex items-center justify-center group"
              >
                {imgUrl ? (
                  <>
                    <img
                      src={imgUrl}
                      alt={`${r.name} foto ${slot + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {isAdmin && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleUploadClick(slot)}
                          className="bg-primary text-primary-foreground p-2 rounded-full hover:opacity-90 transition-opacity"
                          title="Sostituisci foto"
                        >
                          <Upload className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveImage(slot)}
                          className="bg-destructive text-destructive-foreground p-2 rounded-full hover:opacity-90 transition-opacity"
                          title="Rimuovi foto"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <Mountain className="h-12 w-12 opacity-30 text-muted-foreground" />
                    {isAdmin && (
                      <button
                        onClick={() => handleUploadClick(slot)}
                        disabled={isUploading}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-secondary/80"
                      >
                        <Upload className="h-6 w-6 text-primary" />
                        <span className="text-sm text-primary font-medium">
                          {isUploading ? 'Caricamento...' : 'Carica foto'}
                        </span>
                      </button>
                    )}
                  </>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <span className="text-sm text-muted-foreground animate-pulse">Caricamento...</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {r.description && (
          <div>
            <h2 className="heading-card mb-3">Descrizione</h2>
            <p className="text-body text-muted-foreground">{r.description}</p>
          </div>
        )}

        {r.services?.length > 0 && (
          <div>
            <h2 className="heading-card mb-3">Servizi</h2>
            <div className="flex flex-wrap gap-2">
              {r.services.map((s: string) => (
                <span key={s} className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">{s}</span>
              ))}
            </div>
          </div>
        )}

        {r.access && (
          <div>
            <h2 className="heading-card mb-3">Come arrivare</h2>
            <p className="text-body text-muted-foreground">{r.access}</p>
          </div>
        )}

        {(r.contacts || r.website) && (
          <div className="card-mountain space-y-3">
            <h2 className="heading-card">Contatti</h2>
            {r.contacts && <p className="text-body text-muted-foreground">{r.contacts}</p>}
            <div className="flex flex-wrap gap-3">
              {r.website && (
                <a href={r.website.startsWith('http') ? r.website : `https://${r.website}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                  <Globe className="h-3.5 w-3.5" /> {r.website}
                </a>
              )}
              {mailtoLink && (
                <a href={mailtoLink} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
                  <Mail className="h-3.5 w-3.5" /> Contatta il rifugio
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RifugioDetail;
