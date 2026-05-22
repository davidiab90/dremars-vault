// app/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-16 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-black font-bold">D</div>
          <span className="text-3xl font-bold tracking-tighter">DREMARS</span>
        </div>
        
        <p className="text-zinc-500 mb-8">
          Reinventando cómo se diseña y construye el futuro
        </p>
        
        <p className="text-xs text-zinc-600">
          © 2026 DREMARS Vault — Arquitectura del Futuro
        </p>
      </div>
    </footer>
  );
}