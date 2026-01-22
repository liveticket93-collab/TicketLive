"use client";

import SimpleCoupons from "@/components/coupons/SimpleCoupons";

export default function CuponesPage() {
  return (
    <section className="min-h-screen px-4 md:px-6 py-16 bg-gradient-to-b from-zinc-900 via-zinc-900 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Cupones Disponibles
          </h1>
          <p className="text-lg text-gray-400">
            Aprovecha estos descuentos exclusivos en tus próximas compras
          </p>
        </div>

        {/* Componente de cupones */}
        <SimpleCoupons showApplyButton={true} />

        {/* Info adicional */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-800/50 rounded-xl p-6 border border-purple-500/20">
            <div className="text-3xl mb-2">🎟️</div>
            <h3 className="text-lg font-bold text-white mb-2">
              Cupones Activos
            </h3>
            <p className="text-sm text-gray-400">
              Todos los cupones mostrados están disponibles para usar ahora mismo
            </p>
          </div>

          <div className="bg-zinc-800/50 rounded-xl p-6 border border-purple-500/20">
            <div className="text-3xl mb-2">⏱️</div>
            <h3 className="text-lg font-bold text-white mb-2">
              Límite de Usos
            </h3>
            <p className="text-sm text-gray-400">
              Cada cupón tiene un límite de usos totales. ¡Úsalos antes que se agoten!
            </p>
          </div>

          <div className="bg-zinc-800/50 rounded-xl p-6 border border-purple-500/20">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="text-lg font-bold text-white mb-2">
              Descuentos Exclusivos
            </h3>
            <p className="text-sm text-gray-400">
              Ahorra en tus entradas con descuentos de hasta 100% en eventos seleccionados
            </p>
          </div>
        </div>

        {/* Cómo usar */}
        <div className="mt-12 bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6">
            ¿Cómo usar un cupón?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                1
              </div>
              <p className="text-sm text-gray-300">
                Copia el código del cupón
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                2
              </div>
              <p className="text-sm text-gray-300">
                Agrega eventos al carrito
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                3
              </div>
              <p className="text-sm text-gray-300">
                Pega el código en el checkout
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                4
              </div>
              <p className="text-sm text-gray-300">
                ¡Disfruta tu descuento!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
