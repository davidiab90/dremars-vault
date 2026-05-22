'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';

interface Project {
  id: string;
  name: string;
  description: string | null;
}

interface SavedReference {
  id: string;
  reference_url: string;
  title: string;
  style: string;
}

interface PromptHistory {
  id: string;
  prompt: string;
  created_at: string;
  style?: string;
}

export default function ProjectDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [moodboardImages, setMoodboardImages] = useState<string[]>([]);
  const [savedReferences, setSavedReferences] = useState<SavedReference[]>([]);
  const [promptHistory, setPromptHistory] = useState<PromptHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isMoodboardOpen, setIsMoodboardOpen] = useState(false);
  const [showShots, setShowShots] = useState(false);   // ← ESTO FALTABA
  const [selectedAngle, setSelectedAngle] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      const { data: projData } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      if (projData) setProject(projData);

      const { data: storageData } = await supabase.storage
        .from('references')
        .list(id as string);

      const imageUrls = storageData?.map(file => 
        supabase.storage.from('references').getPublicUrl(`${id}/${file.name}`).data.publicUrl
      ) || [];
      setMoodboardImages(imageUrls);

      const { data: savedData } = await supabase
        .from('project_references')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });
      setSavedReferences(savedData || []);

      const { data: promptsData } = await supabase
        .from('project_prompts')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });
      setPromptHistory(promptsData || []);

      setLoading(false);
    };

    loadData();
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${id}/${Date.now()}-${cleanFileName}`;

    const { error } = await supabase.storage
      .from('references')
      .upload(fileName, file, { cacheControl: '3600', upsert: true });

    if (!error) {
      const { data: publicUrlData } = supabase.storage.from('references').getPublicUrl(fileName);
      setMoodboardImages(prev => [...prev, publicUrlData.publicUrl]);
      alert('✅ Imagen subida');
    }
  };

  const deleteUploadedImage = async (url: string) => {
    if (!confirm('¿Eliminar esta imagen?')) return;
    const fileName = url.split('/').pop();
    await supabase.storage.from('references').remove([`${id}/${fileName}`]);
    setMoodboardImages(prev => prev.filter(u => u !== url));
  };

  const deleteSavedReference = async (refId: string) => {
    if (!confirm('¿Eliminar esta referencia?')) return;
    await supabase.from('project_references').delete().eq('id', refId);
    setSavedReferences(prev => prev.filter(r => r.id !== refId));
  };

  const generateMixingPrompt = async () => {
    setGenerating(true);
    const newPrompt = {
      id: Date.now().toString(),
      prompt: "Fachada moderna minimalista con balcones flotantes, iluminación dorada al atardecer, materiales concreto y vidrio, atmósfera cinematográfica, ultra realista, 8k --ar 16:9",
      created_at: new Date().toISOString(),
      style: "Moderno Minimalista"
    };

    await supabase.from('project_prompts').insert({
      project_id: id,
      prompt: newPrompt.prompt,
      style: newPrompt.style
    });

    setPromptHistory(prev => [newPrompt, ...prev]);
    setGenerating(false);
    alert("✅ Prompt generado");
  };

  const [activeTab, setActiveTab] = useState<'normal' | 'linear' | 'nodal'>('normal');

  useEffect(() => {
    const loadData = async () => {
      const { data: projData } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      if (projData) setProject(projData);

      const { data: storageData } = await supabase.storage
        .from('references')
        .list(id as string);

      const imageUrls = storageData?.map(file => 
        supabase.storage.from('references').getPublicUrl(`${id}/${file.name}`).data.publicUrl
      ) || [];
      setMoodboardImages(imageUrls);

      const { data: savedData } = await supabase
        .from('project_references')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });
      setSavedReferences(savedData || []);

      const { data: promptsData } = await supabase
        .from('project_prompts')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });
      setPromptHistory(promptsData || []);

      setLoading(false);
    };

    loadData();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Cargando proyecto...</div>;
  if (!project) return <div>Proyecto no encontrado</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => router.push('/dashboard')} className="mb-8 text-zinc-400 hover:text-white flex items-center gap-2">
          ← Volver a Mis Proyectos
        </button>

        <h1 className="text-5xl font-bold mb-2">{project.name}</h1>
        <p className="text-zinc-400 text-xl mb-12">{project.description}</p>

        {/* MOODBOARD COLAPSABLE */}
        <div className="bg-zinc-900 rounded-3xl mb-12 overflow-hidden">
          <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-800">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsMoodboardOpen(!isMoodboardOpen)} className="text-3xl text-zinc-400 hover:text-white transition">
                {isMoodboardOpen ? '−' : '+'}
              </button>
              <h2 className="text-3xl font-semibold">Moodboard</h2>
            </div>

            <label className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-medium hover:bg-zinc-200 cursor-pointer">
              <span className="text-2xl leading-none">+</span>
              <span>Añadir referencia</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>

          {isMoodboardOpen && (
            <div className="px-8 pb-8 pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 min-h-[300px]">
                {/* Tu grid de imágenes aquí */}
                {moodboardImages.map((url, index) => (
                  <div key={`upload-${index}`} className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800 group">
                    <Image src={url} alt="Referencia subida" fill className="object-cover" />
                    <button onClick={() => deleteUploadedImage(url)} className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition">✕</button>
                  </div>
                ))}

                {savedReferences.map((ref) => (
                  <div key={ref.id} className="relative aspect-video rounded-2xl overflow-hidden border border-violet-500/30 group">
                    <Image src={ref.reference_url} alt={ref.title} fill className="object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-3">
                      <p className="text-xs text-violet-400">{ref.style}</p>
                      <p className="text-sm font-medium truncate">{ref.title}</p>
                    </div>
                    <button onClick={() => deleteSavedReference(ref.id)} className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition">✕</button>
                  </div>
                ))}

                {moodboardImages.length === 0 && savedReferences.length === 0 && (
                  <div className="col-span-full border border-dashed border-zinc-700 rounded-3xl p-12 flex items-center justify-center text-zinc-500">
                    Aún no tienes referencias. Explora y guarda desde el Vault.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
{/* ==================== MIXING STUDIO ==================== */}
<div className="bg-zinc-900 p-8 rounded-3xl">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-3xl font-semibold">Mixing Studio</h2>

    <div className="flex items-center gap-3">
      
      {/* Botón Seleccionar Ángulo (cambia de texto) */}
      <div className="relative">
        <button
          onClick={() => setShowShots(!showShots)}
          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-5 py-3 rounded-2xl text-sm font-medium transition min-w-[180px]"
        >
          {selectedAngle || "Seleccionar Ángulo"}
          <span className="text-lg">▼</span>
        </button>

        {/* Dropdown */}
        {showShots && (
          <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-700 rounded-3xl shadow-2xl z-50 py-2 max-h-[420px] overflow-auto">
            {[
              { name: "Long Shot", desc: "Vista completa del edificio", img: "https://picsum.photos/id/1015/80/50" },
              { name: "Wide Shot", desc: "Perspectiva amplia", img: "https://picsum.photos/id/133/80/50" },
              { name: "Medium Shot", desc: "Enfoque medio", img: "https://picsum.photos/id/201/80/50" },
              { name: "Close Shot", desc: "Detalle de texturas", img: "https://picsum.photos/id/237/80/50" },
              { name: "Aerial Shot", desc: "Vista aérea", img: "https://picsum.photos/id/1016/80/50" },
              { name: "Interior Shot", desc: "Vista interior", img: "https://picsum.photos/id/866/80/50" },
            ].map((shot, i) => (
              <div
                key={i}
                onClick={() => {
                  setSelectedAngle(shot.name);
                  setShowShots(false);
                  alert(`Ángulo seleccionado: ${shot.name}`);
                }}
                className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800 cursor-pointer border-b border-zinc-800 last:border-none"
              >
                <Image 
                  src={shot.img} 
                  alt={shot.name} 
                  width={80} 
                  height={50} 
                  className="rounded-lg object-cover flex-shrink-0" 
                />
                <div>
                  <p className="font-medium text-sm">{shot.name}</p>
                  <p className="text-xs text-zinc-400">{shot.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón Generar Prompt */}
      <button
        onClick={generateMixingPrompt}
        disabled={generating}
        className="bg-violet-600 hover:bg-violet-700 px-6 py-3 rounded-2xl font-medium transition disabled:opacity-70 flex items-center gap-2"
      >
        ✦ Generar Prompt
      </button>
    </div>
  </div>

  {/* Historial de prompts */}
  <div className="space-y-4">
    {promptHistory.length > 0 ? (
      promptHistory.map((p) => (
        <div key={p.id} className="bg-zinc-800 p-5 rounded-2xl border border-violet-500/20">
          <p className="text-violet-400 text-sm mb-2">{p.style}</p>
          <p className="text-zinc-300 italic">"{p.prompt}"</p>
          <p className="text-xs text-zinc-500 mt-3">
            {new Date(p.created_at).toLocaleDateString('es-ES')}
          </p>
        </div>
      ))
    ) : (
      <div className="text-center py-12 text-zinc-500">
        Aún no tienes prompts generados.<br />
        Selecciona un ángulo y genera tu primer prompt.
      </div>
    )}
  </div>
</div>
      </div>
    </div>
  );
}