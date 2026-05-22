'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    else alert('¡Inicio de sesión exitoso!');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Iniciar Sesión</h1>
        
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 mb-4 bg-zinc-900 rounded-xl border border-zinc-700"
        />
        
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 mb-6 bg-zinc-900 rounded-xl border border-zinc-700"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-white text-black py-4 rounded-xl font-semibold hover:bg-zinc-200 transition"
        >
          {loading ? 'Cargando...' : 'Entrar'}
        </button>
      </div>
    </div>
  );
}