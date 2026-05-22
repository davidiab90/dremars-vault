'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/explore?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/explore');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <nav className="bg-black border-b border-zinc-800 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo + Explorar Vault */}
        <div className="flex items-center gap-10">
          <Link href="/" className="text-2xl font-bold tracking-tighter">
            DREMARS
          </Link>
          
          <Link 
            href="/explore" 
            className="text-sm hover:text-violet-400 transition hidden md:block"
          >
            Explorar Vault
          </Link>
        </div>

        {/* Barra de Búsqueda */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="¿Qué estilo, edificio o lugar quieres buscar?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-full py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-violet-500"
            />
            <div className="absolute left-5 top-3.5 text-zinc-500">🔍</div>
          </div>
        </form>

        {/* Botones Derecha */}
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard" 
            className="bg-violet-600 hover:bg-violet-700 px-6 py-2.5 rounded-2xl text-sm font-medium transition-all"
          >
            My Lab
          </Link>

          {!user ? (
            <>
              <Link href="/auth/login" className="hover:text-white transition px-4">Login</Link>
              <Link href="/auth/register" className="bg-white text-black px-6 py-2.5 rounded-2xl font-medium hover:bg-zinc-100 transition">
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-5 py-2.5 rounded-2xl text-sm transition"
            >
              Cerrar Sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}