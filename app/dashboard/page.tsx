'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  default_mode: 'normal' | 'linear' | 'nodal' | null;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const router = useRouter();

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('❌ Error cargando proyectos:', error);
    else setProjects(data || []);

    setLoading(false);
  };

  const saveDefaultMode = async (projectId: string, mode: 'normal' | 'linear' | 'nodal') => {
    setSavingId(projectId);

    // Actualización optimista
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, default_mode: mode } : p
    ));

    const { error } = await supabase
      .from('projects')
      .update({ default_mode: mode })
      .eq('id', projectId);

    if (error) {
      console.error('❌ Error guardando modo:', error);
      alert('Error al guardar el modo');
      loadProjects();
    } else {
      await loadProjects();
    }

    setSavingId(null);
  };


  // Función para obtener la ruta correcta según el modo
const getProjectLink = (project: Project) => {
  const mode = project.default_mode || 'normal';
  
  if (mode === 'linear') {
    return `/dashboard/linear/${project.id}`;
  }
  if (mode === 'nodal') {
    return `/dashboard/nodal/${project.id}`;
  }
  return `/dashboard/${project.id}`;   // Modo normal
};

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push('/auth/login');
      } else {
        setUser(data.user);
        loadProjects();
      }
    };
    checkUser();
  }, [router]);

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Bienvenido a DREMARS Vault</h1>
          <div className="flex items-center gap-4 text-zinc-400">
            <p>{user?.email}</p>
            <Link href="/subscription" className="text-sm text-violet-400 hover:text-violet-300 underline underline-offset-4 transition">
              Administrar Suscripción
            </Link>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold">Mis Proyectos</h2>
          <Link href="/dashboard/new" className="bg-white text-black px-6 py-3 rounded-2xl font-medium hover:bg-zinc-200 transition">
            + Nuevo Proyecto
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="bg-zinc-900 p-12 rounded-3xl text-center">
            <p className="text-zinc-400 text-lg">Aún no tienes proyectos.</p>
            <p className="text-zinc-500 mt-2">Crea tu primer proyecto para comenzar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-zinc-900 rounded-3xl p-8 hover:bg-zinc-800 transition group flex flex-col md:flex-row gap-8"
              >
                {/* Link a la ruta correcta según el modo */}
                <Link
                  href={getProjectLink(project)}
                  className="flex-1 block"
                >
                  <h3 className="text-2xl font-semibold mb-3 line-clamp-2 group-hover:text-violet-400 transition">
                    {project.name}
                  </h3>
                  <p className="text-zinc-400 line-clamp-4 text-[15px]">
                    {project.description || 'Sin descripción'}
                  </p>
                  <p className="text-xs text-zinc-500 mt-6">
                    Creado: {new Date(project.created_at).toLocaleDateString('es-ES')}
                  </p>
                  <p className="text-xs text-violet-400 mt-2">
                    Modo: <span className="capitalize">{project.default_mode || 'normal'}</span>
                  </p>
                </Link>

                {/* Selector de Modo */}
                <div className="md:w-80 flex-shrink-0 pt-2">
                  <p className="text-xs text-zinc-500 mb-3">Modo predeterminado</p>
                  <div className="flex flex-wrap gap-2">
                    {(['normal', 'linear', 'nodal'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => saveDefaultMode(project.id, mode)}
                        disabled={savingId === project.id}
                        className={`px-5 py-2.5 text-sm rounded-2xl transition flex-1 min-w-[90px] ${
                          project.default_mode === mode
                            ? 'bg-violet-600 text-white shadow-lg scale-105'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'
                        }`}
                      >
                        {mode === 'normal' && 'Normal'}
                        {mode === 'linear' && 'Lineal'}
                        {mode === 'nodal' && 'Nodal'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}