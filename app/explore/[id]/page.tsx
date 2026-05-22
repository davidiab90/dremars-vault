'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Reference {
  id: string;
  url: string;
  title: string;
  style: string;
  location?: string;
  author?: string;
  description?: string;
}

export default function ReferenceDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [ref, setRef] = useState<Reference | null>(null);
  const [suggestions, setSuggestions] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReference = async () => {
      const { data } = await supabase
        .from('public_references')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setRef(data);

        const { data: sugg } = await supabase
          .from('public_references')
          .select('*')
          .neq('id', id)
          .limit(12);

        setSuggestions(sugg || []);
      }
      setLoading(false);
    };

    fetchReference();
  }, [id]);

  const handleDownload = (resolution: string) => {
    if (!ref) return;
    alert(`Descargando ${resolution} de: ${ref.title}\n(En producción esto descargaría el archivo real)`);
    // Aquí iría la lógica real de descarga cuando tengas los archivos
  };

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white text-xl">Cargando...</div>;
  if (!ref) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white text-xl">Referencia no encontrada</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-400 hover:text-white mb-10 text-lg"
        >
          ← Regresar al Vault
        </button>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Imagen Grande */}
          <div className="lg:col-span-3">
            <div className="relative aspect-[16/9] bg-black rounded-3xl overflow-hidden">
              <Image
                src={ref.url}
                alt={ref.title}
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Información */}
          <div className="lg:col-span-2">
            <h1 className="text-5xl font-bold mb-4">{ref.title}</h1>
            <p className="text-3xl text-violet-400 mb-2">{ref.style}</p>
            <p className="text-zinc-400 text-xl mb-10">{ref.location}</p>

            <div className="mb-10">
              <p className="text-zinc-500">Fotógrafo</p>
              <p className="text-2xl font-medium">{ref.author || 'Anónimo'}</p>
            </div>

            <p className="text-zinc-300 text-lg leading-relaxed mb-10">
              {ref.description || 'Hermosa referencia arquitectónica con gran potencial para inspiración y renders.'}
            </p>

            {/* Botones de Descarga */}
            <div className="space-y-4 mb-8">
              <button 
                onClick={() => handleDownload('Baja Resolución')}
                className="w-full bg-zinc-800 hover:bg-zinc-700 py-4 rounded-2xl font-medium transition flex items-center justify-center gap-2"
              >
                📥 Descarga Gratis (Baja Resolución)
              </button>

              <button 
                onClick={() => handleDownload('FULL HD')}
                className="w-full bg-violet-600 hover:bg-violet-700 py-4 rounded-2xl font-medium transition flex items-center justify-center gap-2"
              >
                📥 Descarga FULL HD (Alta Resolución) — Pro
              </button>
            </div>

            <button className="w-full bg-white text-black py-5 rounded-2xl text-lg font-medium hover:bg-zinc-100 transition">
              Guardar en mi Proyecto
            </button>
          </div>
        </div>

        {/* Sugerencias horizontales */}
        <div className="mt-20">
          <h2 className="text-3xl font-semibold mb-8">You might also like these photos</h2>
          
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
            {suggestions.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push(`/explore/${item.id}`)}
                className="snap-start flex-shrink-0 w-80 cursor-pointer group"
              >
                <div className="relative aspect-video bg-black rounded-3xl overflow-hidden mb-4">
                  <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                  />
                </div>
                <p className="font-medium line-clamp-2">{item.title}</p>
                <p className="text-sm text-violet-400">{item.style}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}