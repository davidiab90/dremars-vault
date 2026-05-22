'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Plan {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}

const plans: Plan[] = [
  {
    name: "Free",
    price: 0,
    period: "/mes",
    description: "Para explorar y probar",
    features: [
      "1 proyecto en LAB",
      "Acceso básico a Vault",
      "Hasta 10 referencias guardadas",
      "Imágenes de baja resolución",
    ],
    cta: "Comenzar Gratis",
    popular: false,
  },
  {
    name: "Simple",
    price: 9,
    period: "/mes",
    description: "Ideal para arquitectos y diseñadores",
    features: [
      "Hasta 10 proyectos en LAB",
      "Referencias ilimitadas",
      "Imágenes en alta resolución",
      "Mixing con Grok (10/mes)",
      "Soporte por email",
    ],
    cta: "Elegir Simple",
    popular: true,
  },
  {
    name: "Full",
    price: 29,
    period: "/mes",
    description: "Para estudios y profesionales avanzados",
    features: [
      "Proyectos ilimitados",
      "Fotos + Videos de alta calidad",
      "Mixing ilimitado con Grok",
      "Exportación en múltiples formatos",
      "Soporte prioritario",
      "Acceso temprano a nuevas funciones",
    ],
    cta: "Elegir Full",
    popular: false,
  },
];

export default function Subscription() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubscribe = (plan: Plan) => {
    if (plan.price === 0) {
      alert("✅ Has activado el plan Free. Redirigiendo al Dashboard...");
      router.push('/dashboard');
      return;
    }
    setSelectedPlan(plan);
    setPaymentSuccess(false);
  };

  const simulatePayment = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      setTimeout(() => {
        alert(`🎉 ¡Pago exitoso! Has suscrito al plan ${selectedPlan?.name}`);
        setSelectedPlan(null);
        setPaymentSuccess(false);
        router.push('/dashboard');
      }, 1800);
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-12">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Botón Regresar - Más grande y visible */}
        <div className="mb-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-3 text-lg font-medium text-zinc-300 hover:text-white transition group"
          >
            <span className="text-2xl group-hover:-translate-x-1 transition">←</span>
            Regresar
          </button>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Elige tu plan</h1>
          <p className="text-xl text-zinc-400">Accede a todo el poder de DREMARS</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-zinc-900 rounded-3xl p-8 flex flex-col h-full transition-all hover:scale-[1.02] ${
                plan.popular ? 'ring-2 ring-violet-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-violet-600 px-6 py-1 rounded-full text-xs font-medium">
                  MÁS POPULAR
                </div>
              )}

              <h2 className="text-3xl font-semibold mb-1">{plan.name}</h2>
              <p className="text-zinc-400 text-sm mb-6">{plan.description}</p>

              <div className="mb-10">
                <span className="text-6xl font-bold">
                  {plan.price === 0 ? 'Gratis' : `$${plan.price}`}
                </span>
                <span className="text-zinc-400">{plan.period}</span>
              </div>

              <ul className="space-y-4 mb-12 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span className="text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan)}
                className={`w-full py-4 rounded-2xl font-medium transition-all ${
                  plan.popular
                    ? 'bg-violet-600 hover:bg-violet-700'
                    : 'bg-zinc-700 hover:bg-zinc-600'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-16 text-zinc-500 text-sm">
          Todas las suscripciones se renuevan automáticamente. Puedes cancelar en cualquier momento desde tu cuenta.
        </div>
      </div>

      {/* ==================== MODAL DE PAGO SIMULADO ==================== */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6">
          <div className="bg-zinc-900 rounded-3xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute top-6 right-6 text-zinc-400 hover:text-white text-xl"
            >
              ✕
            </button>

            {!paymentSuccess ? (
              <>
                <h3 className="text-2xl font-semibold mb-2">Completar pago</h3>
                <p className="text-zinc-400 mb-8">
                  Plan {selectedPlan.name} — ${selectedPlan.price}/mes
                </p>

                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-zinc-400 mb-2">Número de tarjeta</p>
                    <input type="text" defaultValue="4242 4242 4242 4242" className="w-full bg-zinc-800 rounded-2xl px-5 py-4" disabled />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-zinc-400 mb-2">Fecha de expiración</p>
                      <input type="text" defaultValue="12/28" className="w-full bg-zinc-800 rounded-2xl px-5 py-4" disabled />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-400 mb-2">CVC</p>
                      <input type="text" defaultValue="424" className="w-full bg-zinc-800 rounded-2xl px-5 py-4" disabled />
                    </div>
                  </div>
                </div>

                <button
                  onClick={simulatePayment}
                  disabled={isProcessing}
                  className="mt-10 w-full bg-white text-black py-4 rounded-2xl font-semibold hover:bg-zinc-200 disabled:opacity-70 transition"
                >
                  {isProcessing ? "Procesando pago..." : `Pagar $${selectedPlan.price}`}
                </button>

                <p className="text-center text-xs text-zinc-500 mt-6">
                  Esta es una simulación. No se cobrará nada.
                </p>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-6">🎉</div>
                <h3 className="text-3xl font-bold mb-3">¡Pago exitoso!</h3>
                <p className="text-zinc-400">Bienvenido al plan {selectedPlan.name}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}