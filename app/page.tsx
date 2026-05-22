'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar ya está en components/Navbar.tsx */}

      {/* HERO */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(at_center,#6366f120_0%,transparent_70%)]" />
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="mb-6 inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm tracking-[2px] border border-white/10">
            ARQUITECTURA DEL FUTURO
          </div>

          <h1 className="text-7xl md:text-[120px] font-bold tracking-[-6px] leading-none mb-6">
            DREMARS
          </h1>

          <p className="text-2xl md:text-4xl text-zinc-400 max-w-3xl mx-auto mb-12">
            La plataforma para crear mundos.<br />
            De la referencia a la realidad en minutos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/explore"
              className="px-10 py-5 bg-violet-600 hover:bg-violet-700 rounded-2xl text-lg font-medium transition-all"
            >
              Explorar Vault →
            </Link>
            <Link 
              href="/dashboard"
              className="px-10 py-5 border border-white/30 hover:bg-white/5 rounded-2xl text-lg font-medium transition-all"
            >
              Entrar al Lab
            </Link>
          </div>
        </div>
      </div>

      {/* CONTRIBUYE Y GANA */}
      <div className="py-20 border-t border-zinc-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Gana dinero fotografiando arquitectura</h2>
            <p className="text-xl text-zinc-400">Sube tus fotos y videos. La comunidad los usa. Tú cobras.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-zinc-900 rounded-3xl p-8">
              <div className="text-5xl mb-6">📸</div>
              <h3 className="text-2xl font-semibold mb-3">Sube tus fotos</h3>
              <p className="text-zinc-400">Fachadas, interiores, viajes… cada imagen cuenta.</p>
            </div>
            <div className="bg-zinc-900 rounded-3xl p-8">
              <div className="text-5xl mb-6">💰</div>
              <h3 className="text-2xl font-semibold mb-3">Gana por descarga</h3>
              <p className="text-zinc-400">Recibe pago cada vez que alguien use tu foto.</p>
            </div>
            <div className="bg-zinc-900 rounded-3xl p-8">
              <div className="text-5xl mb-6">🌍</div>
              <h3 className="text-2xl font-semibold mb-3">Construye tu marca</h3>
              <p className="text-zinc-400">Gana visibilidad y clientes como fotógrafo de arquitectura.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/upload" 
              className="inline-block px-12 py-5 bg-white text-black font-semibold rounded-2xl text-xl hover:bg-zinc-100 transition-all"
            >
              Subir mis fotografías ahora →
            </Link>
          </div>
        </div>
      </div>

      {/* LAB */}
      <div className="py-20 bg-zinc-900">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold leading-tight mb-6">
                LAB — Tu estudio de creación
              </h2>
              <p className="text-xl text-zinc-400 mb-8">
                Mezcla estilos, optimiza prompts y genera renders profesionales 
                con Grok o tu IA favorita.
              </p>
              <Link 
                href="/dashboard"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-medium hover:bg-zinc-100 transition"
              >
                Entrar al Lab →
              </Link>
            </div>
            <div className="space-y-6 text-zinc-400">
              <div className="flex gap-5">
                <div className="text-3xl">✦</div>
                <div><p className="font-medium text-white">Mixing Avanzado</p><p>Fusiona referencias en segundos</p></div>
              </div>
              <div className="flex gap-5">
                <div className="text-3xl">✦</div>
                <div><p className="font-medium text-white">Prompts Inteligentes</p><p>Optimizados para Grok, Midjourney, Flux</p></div>
              </div>
              <div className="flex gap-5">
                <div className="text-3xl">✦</div>
                <div><p className="font-medium text-white">De idea a imagen</p><p>En minutos</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VAULT */}
      <div className="py-20 border-t border-zinc-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Explorar Vault</h2>
            <p className="text-xl text-zinc-400">El banco de referencias arquitectónicas más grande y real del mundo</p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-3">Búsqueda poderosa</h3>
                <p className="text-zinc-400">Filtra por estilo, país, ciudad, época o tipo de espacio.</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3">Imágenes reales</h3>
                <p className="text-zinc-400">Fotografías auténticas aportadas por creadores, no generadas.</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3">Úsalas libremente</h3>
                <p className="text-zinc-400">En tu LAB, renders, presentaciones o redes sociales.</p>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-3xl p-10">
              <p className="text-emerald-400 font-medium mb-2">IMÁGENES GRATIS</p>
              <p className="text-3xl font-bold mb-8">Aportadas por la comunidad</p>
              <a href="/explore" className="block w-full py-4 text-center bg-white text-black rounded-2xl font-medium hover:bg-zinc-100">
                Explorar Vault ahora
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}