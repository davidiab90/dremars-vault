'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';

interface Reference {
  id: string;
  url: string;
  name: string;
}

interface SubScene {
  id: string;
  title: string;
  description: string;
  shotType: string;
  prompt?: string;
  promptHistory?: string[];
  savedPrompts?: string[];
  references?: Reference[];
  cameraStyle?: string;
  movement?: string;
  filters?: string;
}

interface Scene {
  id: string;
  order: number;
  title: string;
  description: string;
  shotType: string;
  subScenes: SubScene[];
}

export default function LinearProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [deletedScenes, setDeletedScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);

  const [isReorderMode, setIsReorderMode] = useState(false);
  const [tempScenes, setTempScenes] = useState<Scene[]>([]);

  // Modal
  const [selectedShot, setSelectedShot] = useState<{ sceneId: string; subId: string } | null>(null);

  // Asistente general
  const [messages, setMessages] = useState([{ role: 'assistant' as const, content: 'Hola, soy tu asistente de storyboard. ¿En qué te puedo ayudar hoy?' }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!id) {
      router.push('/dashboard');
      return;
    }

    const loadData = async () => {
      const { data: proj } = await supabase.from('projects').select('*').eq('id', id).single();
      setProject(proj);

      const initialScenes: Scene[] = [
        { id: '1', order: 1, title: 'Vista Exterior Día', description: 'Fachada principal con luz dorada', shotType: 'Wide Shot', subScenes: [] },
        { 
          id: '2', 
          order: 2, 
          title: 'Entrada Principal', 
          description: 'Detalle de acceso y materiales', 
          shotType: 'Medium Shot', 
          subScenes: [
            { 
              id: 'sub1', 
              title: 'Puerta principal', 
              description: 'Detalle de madera y herrajes', 
              shotType: 'Close Shot', 
              prompt: 'Una puerta antigua de roble con detalles en bronce, luz dorada dramática',
              promptHistory: ['Versión con más niebla', 'Versión con luz fría'],
              savedPrompts: ['Prompt favorito 1'],
              references: [],
              cameraStyle: 'Eye Level',
              movement: 'Static',
              filters: 'Cinematic'
            },
          ] 
        },
      ];
      setScenes(initialScenes);
      setTempScenes(initialScenes);
      setLoading(false);
    };

    loadData();
  }, [id, router]);

  const updateScene = (sceneId: string, field: 'title' | 'description' | 'shotType', value: string) => {
    const updater = (list: Scene[]) => list.map(s => s.id === sceneId ? { ...s, [field]: value } : s);
    setScenes(updater);
    if (isReorderMode) setTempScenes(updater);
  };

  const addNewScene = () => {
    const newScene: Scene = {
      id: Date.now().toString(),
      order: scenes.length + 1,
      title: `Escena ${scenes.length + 1}`,
      description: '',
      shotType: 'Wide Shot',
      subScenes: []
    };
    setScenes(prev => [...prev, newScene]);
    setTempScenes(prev => [...prev, newScene]);
  };

  const addSubScene = (sceneId: string) => {
    const newSub: SubScene = { 
      id: Date.now().toString(), 
      title: 'Nuevo detalle', 
      description: '', 
      shotType: 'Close Shot',
      prompt: '',
      promptHistory: [],
      savedPrompts: [],
      references: [],
      cameraStyle: 'Eye Level',
      movement: 'Static',
      filters: 'Cinematic'
    };
    const updater = (list: Scene[]) => list.map(scene =>
      scene.id === sceneId ? { ...scene, subScenes: [...scene.subScenes, newSub] } : scene
    );
    setScenes(updater);
    setTempScenes(updater);
  };

  const updateSubScene = (sceneId: string, subId: string, field: keyof SubScene, value: string) => {
    const updater = (list: Scene[]) => list.map(scene => scene.id === sceneId ? {
      ...scene,
      subScenes: scene.subScenes.map(sub => sub.id === subId ? { ...sub, [field]: value } : sub)
    } : scene);
    setScenes(updater);
    setTempScenes(updater);
  };

  const deleteScene = (sceneId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta escena? Se moverá a la Papelera.')) return;
    const sceneToDelete = scenes.find(s => s.id === sceneId);
    if (!sceneToDelete) return;

    setDeletedScenes(prev => [...prev, sceneToDelete]);
    setScenes(prev => prev.filter(s => s.id !== sceneId));
    setTempScenes(prev => prev.filter(s => s.id !== sceneId));
  };

  const restoreScene = (sceneId: string) => {
    const sceneToRestore = deletedScenes.find(s => s.id === sceneId);
    if (!sceneToRestore) return;
    setScenes(prev => [...prev, sceneToRestore]);
    setDeletedScenes(prev => prev.filter(s => s.id !== sceneId));
    setTempScenes(prev => [...prev, sceneToRestore]);
  };

  const enterReorderMode = () => {
    setTempScenes([...scenes]);
    setIsReorderMode(true);
  };

  const moveScene = (index: number, direction: 'up' | 'down') => {
    const newTemp = [...tempScenes];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newTemp.length) return;
    [newTemp[index], newTemp[target]] = [newTemp[target], newTemp[index]];
    setTempScenes(newTemp);
  };

  const applyReorder = () => {
    setScenes(tempScenes.map((scene, idx) => ({ ...scene, order: idx + 1 })));
    setIsReorderMode(false);
  };

  const cancelReorder = () => {
    setTempScenes([...scenes]);
    setIsReorderMode(false);
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: inputMessage }]);
    const msg = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: `Entendido: "${msg}". ¿Cómo te ayudo?` }]);
      setIsTyping(false);
    }, 700);
  };

  const closeModal = () => setSelectedShot(null);

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Cargando...</div>;

  const displayScenes = isReorderMode ? tempScenes : scenes;

  const currentShot = selectedShot 
    ? scenes.flatMap(s => s.subScenes).find(sub => sub.id === selectedShot.subId)
    : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Timeline Principal */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-bold">{project?.name}</h1>
              <p className="text-emerald-400 text-xl mt-1">Modo Lineal • Storyboard</p>
            </div>
            <button onClick={() => router.push('/dashboard')} className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition">
              ← Volver al Dashboard
            </button>
          </div>

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold">Timeline de Escenas</h2>
            <div className="flex gap-3">
              {!isReorderMode ? (
                <button onClick={enterReorderMode} className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-2xl font-medium flex items-center gap-2">↕ Ordenar</button>
              ) : (
                <>
                  <button onClick={cancelReorder} className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-2xl">Cancelar</button>
                  <button onClick={applyReorder} className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-2xl">Aplicar Cambios</button>
                </>
              )}
              <button onClick={addNewScene} className="bg-violet-600 hover:bg-violet-700 px-6 py-3 rounded-2xl font-medium">+ Nueva Escena</button>
            </div>
          </div>

          <div className="space-y-8">
            {displayScenes.map((scene, index) => (
              <div key={scene.id} className={`bg-zinc-900 rounded-3xl p-6 relative ${isReorderMode ? 'ring-1 ring-violet-500/30' : ''}`}>
                <div className="flex gap-6 mb-8">
                  <div className="flex flex-col items-center gap-1 w-12 flex-shrink-0">
                    <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-2xl">{index + 1}</div>
                    {isReorderMode && (
                      <div className="flex flex-col gap-1 mt-2">
                        <button onClick={() => moveScene(index, 'up')} disabled={index === 0} className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-xl disabled:opacity-40">↑</button>
                        <button onClick={() => moveScene(index, 'down')} disabled={index === displayScenes.length - 1} className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-xl disabled:opacity-40">↓</button>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <input value={scene.title} onChange={(e) => updateScene(scene.id, 'title', e.target.value)} className="bg-transparent text-xl font-semibold w-full focus:outline-none" placeholder="Título de la escena" />
                    <textarea value={scene.description} onChange={(e) => updateScene(scene.id, 'description', e.target.value)} className="bg-transparent text-zinc-400 w-full mt-2 focus:outline-none resize-none h-20" placeholder="Descripción de la escena..." />
                  </div>

                  <div className="w-44 flex flex-col gap-2">
                    <select value={scene.shotType} onChange={(e) => updateScene(scene.id, 'shotType', e.target.value)} className="bg-zinc-800 rounded-xl px-4 py-2 text-sm">
                      <option>Wide Shot</option>
                      <option>Medium Shot</option>
                      <option>Close Shot</option>
                    </select>
                    <button className="text-xs bg-zinc-800 hover:bg-zinc-700 py-2 rounded-xl transition">Añadir Referencia</button>
                  </div>
                </div>

                <div className="pl-16">
                  <p className="text-zinc-500 text-sm mb-3">Detalles / Shots adicionales</p>
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {scene.subScenes.map((sub, i) => (
                      <div 
                        key={sub.id} 
                        onClick={() => setSelectedShot({ sceneId: scene.id, subId: sub.id })}
                        className="bg-zinc-950 border border-zinc-800 hover:border-violet-500 rounded-2xl p-5 w-80 flex-shrink-0 cursor-pointer transition-all hover:scale-105"
                      >
                        <div className="text-xs text-zinc-500 mb-2">{index + 1}.{i + 1}</div>
                        <div className="font-medium">{sub.title}</div>
                        <p className="text-zinc-400 text-sm line-clamp-2 mt-1">{sub.description}</p>
                      </div>
                    ))}
                    <button onClick={() => addSubScene(scene.id)} className="w-80 h-[218px] flex-shrink-0 border border-dashed border-zinc-700 hover:border-violet-500 rounded-2xl flex flex-col items-center justify-center text-zinc-400 hover:text-violet-400 transition-all">
                      <div className="text-4xl mb-1">+</div>
                      <span className="text-sm">Añadir shot</span>
                    </button>
                  </div>
                </div>

                <button onClick={() => deleteScene(scene.id)} className="absolute bottom-6 right-6 w-8 h-8 bg-zinc-800 hover:bg-red-600/80 text-zinc-400 hover:text-white rounded-xl flex items-center justify-center transition text-xl">✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Barra Lateral Derecha Fija */}
      <div className="w-96 bg-zinc-900 border-l border-zinc-800 flex flex-col h-screen sticky top-0 overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h3 className="text-xl font-semibold flex items-center gap-2">🤖 Asistente</h3>
          <p className="text-zinc-500 text-sm mt-1">Ayuda inteligente para tu storyboard</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-100'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && <div className="text-zinc-400">Escribiendo...</div>}
        </div>

        <div className="p-6 border-t border-zinc-800">
          <div className="flex gap-3">
            <input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Escribe tu mensaje..." className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 focus:outline-none focus:border-violet-500" />
            <button onClick={sendMessage} className="bg-violet-600 hover:bg-violet-700 px-6 rounded-2xl transition">↑</button>
          </div>
        </div>

        <div className="border-t border-zinc-800 p-6">
          <h4 className="font-semibold mb-4 text-lg">Configuraciones</h4>
          <div className="space-y-6">
            <div>
              <label className="text-sm text-zinc-400 block mb-2">Luz</label>
              <select className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm">
                <option>Luz Dorada (Golden Hour)</option>
                <option>Luz Dramática</option>
                <option>Luz Natural Suave</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-zinc-400 block mb-2">Filtro / Estilo</label>
              <select className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm">
                <option>Realista Cinematográfico</option>
                <option>Anime</option>
                <option>Dark Noir</option>
              </select>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 p-6 flex-shrink-0">
          <h4 className="font-semibold mb-3 flex items-center gap-2">🗑️ Papelera ({deletedScenes.length})</h4>
          <div className="max-h-64 overflow-y-auto space-y-3 text-sm">
            {deletedScenes.length === 0 ? (
              <p className="text-zinc-500 italic">La papelera está vacía</p>
            ) : (
              deletedScenes.map(scene => (
                <div key={scene.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-3 flex justify-between items-center">
                  <div className="truncate pr-2">
                    <p className="font-medium">{scene.title}</p>
                    <p className="text-zinc-500 text-xs line-clamp-1">{scene.description}</p>
                  </div>
                  <button onClick={() => restoreScene(scene.id)} className="text-emerald-400 hover:text-emerald-500 text-xs font-medium px-3 py-1 border border-emerald-500/30 rounded-xl hover:bg-emerald-900/30 transition">Restaurar</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ===================== MODAL COMPLETO ===================== */}
      {selectedShot && currentShot && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-8" onClick={closeModal}>
          <div className="bg-zinc-900 rounded-3xl w-full max-w-7xl max-h-[95vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex h-[95vh]">
              {/* Columna Izquierda */}
              <div className="w-72 border-r border-zinc-800 p-6 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Variaciones</h3>
                <div className="space-y-3 mb-8">
                  {[1,2,3].map(v => <div key={v} className="bg-zinc-800 rounded-2xl p-4 hover:bg-zinc-700 cursor-pointer">Variación {v}</div>)}
                </div>

                <h3 className="text-lg font-semibold mb-4">Prompts Guardados</h3>
                <div className="space-y-3 mb-8">
                  {currentShot.savedPrompts?.length ? currentShot.savedPrompts.map((p,i) => (
                    <div key={i} className="bg-zinc-800 p-3 rounded-2xl text-sm">{p}</div>
                  )) : <p className="text-zinc-500 text-sm">No hay prompts guardados</p>}
                </div>

                <h3 className="text-lg font-semibold mb-4">Historial de Prompts</h3>
                <div className="space-y-3">
                  {currentShot.promptHistory?.length ? currentShot.promptHistory.map((p,i) => (
                    <div key={i} className="bg-zinc-900 p-4 rounded-2xl text-sm border-l-4 border-violet-500">{p}</div>
                  )) : <p className="text-zinc-500 text-sm">Sin historial</p>}
                </div>
              </div>

              {/* Centro */}
              <div className="flex-1 flex flex-col">
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">{currentShot.title}</h2>
                  <button onClick={closeModal} className="text-4xl text-zinc-400 hover:text-white">×</button>
                </div>

                <div className="flex-1 bg-black flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-6 opacity-40">🎥</div>
                    <p className="text-zinc-500">Vista previa del shot</p>
                  </div>
                </div>

                <div className="p-6 border-t border-zinc-800">
                  <label className="block text-sm text-zinc-400 mb-2">Prompt Actual</label>
                  <textarea
                    value={currentShot.prompt || ''}
                    onChange={(e) => updateSubScene(selectedShot.sceneId, selectedShot.subId, 'prompt', e.target.value)}
                    className="w-full h-40 bg-zinc-800 rounded-2xl p-5 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Describe el shot..."
                  />
                </div>
              </div>

              {/* Nueva Columna Derecha */}
              <div className="w-80 border-l border-zinc-800 p-6 overflow-y-auto bg-zinc-950">
                <h3 className="font-semibold text-lg mb-5">Configuración del Shot</h3>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm text-zinc-400 block mb-2">Filtros</label>
                    <select value={currentShot.filters || ''} onChange={(e) => updateSubScene(selectedShot.sceneId, selectedShot.subId, 'filters', e.target.value)} className="w-full bg-zinc-800 rounded-2xl p-3 text-sm">
                      <option value="">Ninguno</option>
                      <option value="Cinematic">Cinematic</option>
                      <option value="Vintage">Vintage</option>
                      <option value="HDR">HDR</option>
                      <option value="Moody">Moody</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-zinc-400 block mb-2">Estilo de Cámara</label>
                    <select value={currentShot.cameraStyle || ''} onChange={(e) => updateSubScene(selectedShot.sceneId, selectedShot.subId, 'cameraStyle', e.target.value)} className="w-full bg-zinc-800 rounded-2xl p-3 text-sm">
                      <option value="Eye Level">Eye Level</option>
                      <option value="Low Angle">Low Angle</option>
                      <option value="High Angle">High Angle</option>
                      <option value="Dutch Angle">Dutch Angle</option>
                      <option value="Over the Shoulder">Over the Shoulder</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-zinc-400 block mb-2">Movimiento</label>
                    <select value={currentShot.movement || ''} onChange={(e) => updateSubScene(selectedShot.sceneId, selectedShot.subId, 'movement', e.target.value)} className="w-full bg-zinc-800 rounded-2xl p-3 text-sm">
                      <option value="Static">Static</option>
                      <option value="Slow Pan">Slow Pan</option>
                      <option value="Dolly In">Dolly In</option>
                      <option value="Tracking Shot">Tracking Shot</option>
                      <option value="Handheld">Handheld</option>
                    </select>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">🤖 Asistente de esta escena</h4>
                    <div className="bg-zinc-900 rounded-2xl p-4 text-sm text-zinc-400">
                      ¿Quieres ayuda con el prompt, iluminación o composición?
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Referencias</h4>
                    <div className="space-y-3 mb-4">
                      {currentShot.references?.length ? currentShot.references.map(ref => (
                        <div key={ref.id} className="bg-zinc-900 rounded-xl p-3 text-sm flex justify-between items-center">
                          <span>{ref.name}</span>
                          <span className="text-xs text-emerald-400">✓</span>
                        </div>
                      )) : <p className="text-zinc-500 text-sm italic">No hay referencias aún</p>}
                    </div>

                    <button className="w-full py-3 bg-zinc-800 hover:bg-violet-600/20 border border-dashed border-zinc-700 hover:border-violet-500 rounded-2xl transition flex items-center justify-center gap-2">
                      <span className="text-xl">+</span> Añadir Referencia
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}