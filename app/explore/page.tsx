'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Reference {
  id: string;
  url: string;
  title: string;
  style: string;
  location?: string;
  author?: string;
  description?: string;
  space?: string;
  material?: string;
  license?: 'free' | 'pro';
  type?: 'photo' | 'video';   // ← Nuevo campo
}

export default function Explore() {
  const [references, setReferences] = useState<Reference[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpace, setSelectedSpace] = useState('Todos');
  const [selectedStyle, setSelectedStyle] = useState('Todos');
  const [selectedMaterial, setSelectedMaterial] = useState('Todos');
  const [selectedLicense, setSelectedLicense] = useState<'Todos' | 'Gratis' | 'Pro'>('Todos');
  const [selectedType, setSelectedType] = useState<'Todos' | 'Foto' | 'Video'>('Todos'); // ← Nuevo filtro
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const spaces = ['Todos', 'Interior', 'Exterior', 'Fachada'];
  const styles = ['Todos', 'Moderno', 'Minimalista', 'Brutalista', 'Clásico', 'Mediterráneo'];
  const materials = ['Todos', 'Piedra', 'Vidrio', 'Acero', 'Tabique'];

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('public_references')
        .select('*')
        .order('created_at', { ascending: false });
      setReferences(data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredReferences = references.filter((ref) => {
    const matchesSearch = ref.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (ref.style && ref.style.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSpace = selectedSpace === 'Todos' || ref.space === selectedSpace;
    const matchesStyle = selectedStyle === 'Todos' || ref.style === selectedStyle;
    const matchesMaterial = selectedMaterial === 'Todos' || ref.material === selectedMaterial;
    const matchesLicense = selectedLicense === 'Todos' ||
                          (selectedLicense === 'Gratis' && ref.license === 'free') ||
                          (selectedLicense === 'Pro' && ref.license === 'pro');
    const matchesType = selectedType === 'Todos' ||
                       (selectedType === 'Foto' && ref.type === 'photo') ||
                       (selectedType === 'Video' && ref.type === 'video');

    return matchesSearch && matchesSpace && matchesStyle && matchesMaterial && matchesLicense && matchesType;
  });

  const clearFilters = () => {
    setSelectedSpace('Todos');
    setSelectedStyle('Todos');
    setSelectedMaterial('Todos');
    setSelectedLicense('Todos');
    setSelectedType('Todos');
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="border-b border-zinc-800 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-2">Explorar Vault</h1>
          <p className="text-zinc-400 text-xl">Descubre referencias arquitectónicas reales de todo el mundo</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Buscar por estilo, ubicación o palabra clave..."
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-violet-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            onClick={() => setShowFilters(true)}
            className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl font-medium transition flex items-center gap-2 whitespace-nowrap"
          >
            Filtros
            <span className="text-lg">☰</span>
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredReferences.map((ref) => (
            <Link 
              key={ref.id} 
              href={`/explore/${ref.id}`}
              className="group bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-violet-500 transition-all cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image 
                  src={ref.url} 
                  alt={ref.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-1 line-clamp-1">{ref.title}</h3>
                <p className="text-violet-400 text-sm">{ref.style}</p>
                {ref.license === 'pro' && <span className="text-xs bg-violet-600 px-3 py-1 rounded-full mt-2 inline-block">PRO</span>}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* DRAWER DE FILTROS */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-end">
          <div className="bg-zinc-900 w-full max-w-md h-full overflow-auto p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Filtros</h2>
              <button onClick={() => setShowFilters(false)} className="text-3xl text-zinc-400 hover:text-white">✕</button>
            </div>

            {/* Espacio */}
            <div className="mb-8">
              <p className="text-sm text-zinc-400 mb-3">Espacio</p>
              <select value={selectedSpace} onChange={(e) => setSelectedSpace(e.target.value)} className="w-full bg-zinc-800 rounded-2xl px-5 py-4">
                {spaces.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Estilo */}
            <div className="mb-8">
              <p className="text-sm text-zinc-400 mb-3">Estilo</p>
              <select value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)} className="w-full bg-zinc-800 rounded-2xl px-5 py-4">
                {styles.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Materiales */}
            <div className="mb-8">
              <p className="text-sm text-zinc-400 mb-3">Materiales</p>
              <select value={selectedMaterial} onChange={(e) => setSelectedMaterial(e.target.value)} className="w-full bg-zinc-800 rounded-2xl px-5 py-4">
                {materials.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Tipo (Nuevo) */}
            <div className="mb-8">
              <p className="text-sm text-zinc-400 mb-3">Tipo de contenido</p>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value as 'Todos' | 'Foto' | 'Video')} className="w-full bg-zinc-800 rounded-2xl px-5 py-4">
                <option value="Todos">Todos</option>
                <option value="Foto">Foto</option>
                <option value="Video">Video</option>
              </select>
            </div>

            {/* Licencia */}
            <div className="mb-8">
              <p className="text-sm text-zinc-400 mb-3">Licencia</p>
              <select value={selectedLicense} onChange={(e) => setSelectedLicense(e.target.value as 'Todos' | 'Gratis' | 'Pro')} className="w-full bg-zinc-800 rounded-2xl px-5 py-4">
                <option value="Todos">Todas</option>
                <option value="Gratis">Gratis</option>
                <option value="Pro">Pro</option>
              </select>
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={clearFilters}
                className="flex-1 py-4 border border-zinc-700 rounded-2xl hover:bg-zinc-800 transition"
              >
                Limpiar filtros
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 py-4 bg-violet-600 hover:bg-violet-700 rounded-2xl font-medium transition"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Función para limpiar (fuera del componente)
const clearFilters = () => {
  // Esta función se define dentro del componente en la versión anterior, pero aquí la movemos dentro si es necesario
};