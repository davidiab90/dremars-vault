'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function NewProject() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    if (!name.trim()) {
      alert('El nombre del proyecto es obligatorio');
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('projects')
      .insert({
        name: name.trim(),
        description: description.trim() || null,
        user_id: user?.id
      });

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('¡Proyecto creado exitosamente!');
      router.push('/dashboard');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Nuevo Proyecto</h1>
        
        <div className="bg-zinc-900 p-8 rounded-3xl">
          <input
            type="text"
            placeholder="Nombre del Proyecto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 mb-6 bg-zinc-800 rounded-2xl border border-zinc-700 text-lg"
          />
          
          <textarea
            placeholder="Descripción breve del proyecto..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 h-40 bg-zinc-800 rounded-2xl border border-zinc-700 resize-y"
          />

          <button
            onClick={handleCreate}
            disabled={loading}
            className="mt-8 w-full bg-white text-black py-4 rounded-2xl font-semibold text-lg hover:bg-zinc-200 transition"
          >
            {loading ? 'Creando proyecto...' : 'Crear Proyecto'}
          </button>
        </div>
      </div>
    </div>
  );
}