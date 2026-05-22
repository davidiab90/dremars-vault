'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface Reference {
  id: string;
  url: string;
  title: string;
  style: string;
  location?: string;
  area?: string;
  description?: string;
  tags?: string;
  created_at: string;
}

export default function Upload() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile'>('dashboard');

  // Estados del formulario de subida
  const [title, setTitle] = useState('');
  const [style, setStyle] = useState('');
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Mis Aportaciones
  const [myReferences, setMyReferences] = useState<Reference[]>([]);
  const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent');

  useEffect(() => {
    const fetchMyRefs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('public_references')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: sortBy === 'recent' ? false : true });

      setMyReferences(data || []);
    };

    fetchMyRefs();
  }, [sortBy]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file || !title || !style || !location || !area) {
      alert('Faltan campos obligatorios');
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No estás logueado');

      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      const { error: uploadError } = await supabase.storage
        .from('public_references')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('public_references')
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from('public_references')
        .insert({
          user_id: user.id,
          url: urlData.publicUrl,
          title: title.trim(),
          style: style.trim(),
          location: location.trim(),
          area: area.trim(),
          description: description.trim() || null,
          tags: tags.trim() || null,
        });

      if (insertError) throw insertError;

      alert('✅ ¡Referencia subida correctamente!');
      window.location.reload();

    } catch (error: any) {
      console.error('Error completo:', error);
      alert('Error: ' + (error.message || 'Desconocido'));
    }

    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-10">Creador Vault</h1>

        {/* Tabs - Dashboard a la izquierda y Mi Perfil a la derecha */}
        <div className="flex border-b border-zinc-800 mb-10">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`flex-1 py-4 font-medium border-b-2 transition ${activeTab === 'dashboard' ? 'border-violet-500 text-white' : 'border-transparent text-zinc-400'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('profile')} 
            className={`flex-1 py-4 font-medium border-b-2 transition ${activeTab === 'profile' ? 'border-violet-500 text-white' : 'border-transparent text-zinc-400'}`}
          >
            Mi Perfil
          </button>
        </div>

        {/* ==================== DASHBOARD ==================== */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Formulario Subir Nueva */}
            <div className="bg-zinc-900 p-8 rounded-3xl">
              <h2 className="text-2xl font-semibold mb-6">Nueva Referencia</h2>

              <input type="text" placeholder="Título de la foto" className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 mb-4" value={title} onChange={(e) => setTitle(e.target.value)} />

              <div className="grid grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder="Lugar (Ciudad / País)" className="bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4" value={location} onChange={(e) => setLocation(e.target.value)} />
                <select className="bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4" value={area} onChange={(e) => setArea(e.target.value)}>
                  <option value="">Área</option>
                  <option value="Interiores">Interiores</option>
                  <option value="Exteriores">Exteriores / Fachadas</option>
                  <option value="Jardines">Jardines / Paisaje</option>
                  <option value="Detalles">Detalles / Texturas</option>
                </select>
              </div>

              <input type="text" placeholder="Estilo" className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 mb-4" value={style} onChange={(e) => setStyle(e.target.value)} />

              <textarea placeholder="Descripción opcional" className="w-full bg-zinc-800 border border-zinc-700 rounded-3xl px-6 py-4 h-32 mb-4" value={description} onChange={(e) => setDescription(e.target.value)} />

              <input type="text" placeholder="Tags (separados por coma)" className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 mb-6" value={tags} onChange={(e) => setTags(e.target.value)} />

              <label className="block border border-dashed border-zinc-700 rounded-3xl p-12 text-center cursor-pointer hover:border-violet-500 transition mb-6">
                {preview ? <Image src={preview} alt="preview" width={500} height={300} className="mx-auto rounded-2xl" /> : (
                  <div className="py-8">
                    <p className="text-4xl mb-3">📸</p>
                    <p className="text-lg">Haz clic para seleccionar imagen</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>

              <button onClick={handleUpload} disabled={uploading || !file || !title || !style || !location || !area} className="w-full bg-violet-600 hover:bg-violet-700 py-4 rounded-2xl font-medium disabled:opacity-50">
                {uploading ? 'Subiendo...' : 'Publicar en el Vault'}
              </button>
            </div>

            {/* Mis Aportaciones + Ganancias */}
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Mis Aportaciones ({myReferences.length})</h2>
                  <select className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-2.5 text-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value as 'recent' | 'oldest')}>
                    <option value="recent">Más recientes</option>
                    <option value="oldest">Más antiguos</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {myReferences.map((ref) => (
                    <div key={ref.id} className="bg-zinc-900 rounded-3xl overflow-hidden group">
                      <div className="relative aspect-video">
                        <Image src={ref.url} alt={ref.title} fill className="object-cover group-hover:scale-105 transition" />
                      </div>
                      <div className="p-5">
                        <p className="font-medium line-clamp-2">{ref.title}</p>
                        <p className="text-violet-400 text-sm">{ref.style}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-6">Mis Ganancias</h2>
                <div className="bg-zinc-900 rounded-3xl p-6">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <p className="text-zinc-400 text-sm">Ganancias Totales</p>
                      <p className="text-5xl font-bold text-emerald-400">$62.10</p>
                    </div>
                    <p className="text-emerald-500 text-sm">+ $18.60 este mes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== MI PERFIL ==================== */}
        {activeTab === 'profile' && (
          <div className="bg-zinc-900 rounded-3xl p-12 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Mi Perfil de Creador</h2>
            
            <div className="flex flex-col items-center mb-10">
              <div className="w-40 h-40 bg-zinc-800 rounded-full overflow-hidden border-4 border-violet-500">
                <div className="w-full h-full flex items-center justify-center text-6xl">📸</div>
              </div>
              <button className="mt-4 text-violet-400">Cambiar foto de perfil</button>
            </div>

            <input type="text" placeholder="Nombre o Alias" className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 mb-4" />
            <input type="text" placeholder="Ciudad / País" className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 mb-6" />

            <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-5 mb-8 flex items-center gap-5">
              <div className="text-4xl">𝕏</div>
              <div className="flex-1">
                <p className="font-medium">Conectar cuenta de X</p>
                <p className="text-sm text-zinc-500">@tuusuario • No conectado</p>
              </div>
              <button className="bg-white text-black px-8 py-3 rounded-2xl font-medium">Conectar</button>
            </div>

            <textarea placeholder="Cuéntanos sobre ti (opcional)" className="w-full bg-zinc-800 border border-zinc-700 rounded-3xl px-6 py-5 h-40" />

            <button className="w-full mt-8 bg-violet-600 hover:bg-violet-700 py-4 rounded-2xl font-medium">Guardar Perfil</button>
          </div>
        )}
      </div>
    </div>
  );
}