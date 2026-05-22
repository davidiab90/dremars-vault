'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert('¡Registro exitoso! Revisa tu correo electrónico para confirmar la cuenta.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Crear Cuenta</h1>
        
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 mb-4 bg-zinc-900 rounded-xl border border-zinc-700 focus:outline-none focus:border-white"
        />
        
        <input
          type="password"
          placeholder="Contraseña (mínimo 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 mb-6 bg-zinc-900 rounded-xl border border-zinc-700 focus:outline-none focus:border-white"
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-white text-black py-4 rounded-xl font-semibold hover:bg-zinc-200 transition mb-4"
        >
          {loading ? 'Creando cuenta...' : 'Registrarse'}
        </button>

        <p className="text-center text-zinc-400">
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login" className="text-white hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
