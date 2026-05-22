'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';

interface Project {
  id: string;
  name: string;
  description: string | null;
}

export default function NodalProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      router.push('/dashboard');
      return;
    }

    const loadProject = async () => {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (data) setProject(data);
      setLoading(false);
    };

    loadProject();
  }, [id, router]);

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Cargando Modo Nodal...</div>;
  if (!project) return <div>Proyecto no encontrado</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-5 border-b border-zinc-800 bg-zinc-900">
        <div>
          <h1 className="text-4xl font-bold">{project.name}</h1>
          <p className="text-violet-400 text-xl mt-1">Modo: NODAL • Editor de Flujo</p>
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition"
        >
          ← Volver al Dashboard
        </button>
      </div>

      {/* Contenido Principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* BARRA IZQUIERDA - Referencias */}
        <div className="w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col">
          <div className="p-6 border-b border-zinc-800">
            <h3 className="text-xl font-semibold">📁 Referencias</h3>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-video bg-zinc-800 rounded-2xl flex items-center justify-center border border-zinc-700 hover:border-violet-500 transition">
                  <span className="text-xs text-zinc-500">Ref {i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border-t border-zinc-800 space-y-3">
            <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition flex items-center justify-center gap-2">
              📤 Subir Referencia
            </button>
            <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition flex items-center justify-center gap-2">
              ⬇️ Importar
            </button>
          </div>
        </div>

        {/* ÁREA CENTRAL */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar superior */}
          <div className="h-16 border-b border-zinc-800 bg-zinc-900 px-6 flex items-center gap-4 flex-shrink-0">
            <button className="bg-zinc-800 hover:bg-zinc-700 px-5 py-2 rounded-xl flex items-center gap-2">➕ Nuevo Nodo</button>
            <button className="bg-zinc-800 hover:bg-zinc-700 px-5 py-2 rounded-xl flex items-center gap-2">🔗 Conectar</button>
            <button className="bg-violet-600 hover:bg-violet-700 px-5 py-2 rounded-xl flex items-center gap-2">▶️ Generar Prompt Final</button>
            
            <button className="ml-auto bg-emerald-600 hover:bg-emerald-700 px-5 py-2 rounded-xl">Exportar</button>
          </div>

          {/* Zona de Nodos */}
          <div className="flex-1 relative bg-[#0a0a0a] flex items-center justify-center overflow-auto border-b border-zinc-800">
            <div className="text-center">
              <p className="text-6xl mb-6 opacity-30">🧩</p>
              <p className="text-3xl text-zinc-400">Editor Nodal</p>
              <p className="text-zinc-500 mt-3">Construye tu flujo conectando nodos</p>
            </div>
          </div>

          {/* BARRA INFERIOR - Resultados */}
          <div className="h-52 bg-zinc-900 border-t border-zinc-800 p-4 overflow-x-auto flex-shrink-0">
            <p className="text-sm text-zinc-400 mb-3 px-2">Resultados Generados</p>
            <div className="flex gap-4 h-[170px]">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-52 bg-zinc-800 rounded-2xl overflow-hidden flex-shrink-0 relative group">
                  <div className="h-28 bg-black flex items-center justify-center">
                    <span className="text-5xl opacity-40">🎬</span>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium">Resultado {i + 1}</p>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100">
                    <button className="w-7 h-7 bg-black/70 hover:bg-black rounded-lg flex items-center justify-center text-xs">⬇</button>
                    <button className="w-7 h-7 bg-black/70 hover:bg-black rounded-lg flex items-center justify-center text-xs">→</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BARRA DERECHA */}
        <div className="w-80 bg-zinc-900 border-l border-zinc-800 flex flex-col">
          {/* Resultados Finales */}
          <div className="p-6 border-b border-zinc-800">
            <h3 className="text-lg font-semibold mb-4">📊 Resultado Final</h3>
            <div className="aspect-video bg-black rounded-2xl flex items-center justify-center border border-zinc-700">
              <div className="text-center">
                <div className="text-6xl mb-4 opacity-40">🎥</div>
                <p className="text-zinc-500 text-sm">Vista del resultado</p>
              </div>
            </div>
          </div>

          {/* Asistente Virtual */}
          <div className="flex-1 p-6 border-b border-zinc-800 flex flex-col">
            <h4 className="font-semibold mb-3">🤖 Asistente Virtual</h4>
            <div className="flex-1 bg-zinc-950 rounded-2xl p-4 text-sm overflow-y-auto text-zinc-400">
              Estoy listo para ayudarte a mejorar los prompts o sugerir nodos.
            </div>
            <div className="mt-4 flex gap-2">
              <input type="text" placeholder="Mensaje al asistente..." className="flex-1 bg-zinc-800 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
              <button className="bg-violet-600 hover:bg-violet-700 px-5 rounded-2xl">↑</button>
            </div>
          </div>

          {/* Propiedades */}
          <div className="p-6">
            <h4 className="font-semibold mb-4">⚙️ Propiedades</h4>
            <p className="text-zinc-500 text-sm">Selecciona un nodo para editar sus propiedades</p>
          </div>
        </div>
      </div>
    </div>
  );
}