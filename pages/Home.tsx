
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, ShieldCheck, Zap, ArrowRight, Award, Sparkles } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Car } from '../types';

const Home: React.FC = () => {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('cars')
        .select('*')
        .eq('status', 'Disponible')
        .order('created_at', { ascending: false })
        .limit(3);
      if (data) setFeaturedCars(data);
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  return (
    <div className="relative overflow-hidden bg-black">
      {/* Hero Section Immersif */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black z-10"></div>
        
        {/* Effet de lumière 3D en arrière-plan */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>

        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full mb-8 animate-bounce">
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Édition Limitée 2025</span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black text-white mb-6 font-serif leading-none tracking-tighter italic">
            CONGOCAR <br />
            <span className="text-yellow-500 not-italic">EXCLUSIVE</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto font-light tracking-wide">
            L'excellence automobile à portée de clic. <br/>
            <span className="text-sm uppercase tracking-[0.4em] text-yellow-600/80 font-bold">Kinshasa • Lubumbashi • Goma</span>
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/catalog" 
              className="group relative bg-yellow-600 hover:bg-yellow-500 text-black px-12 py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] transition-all hover:scale-110 active:scale-95 shadow-[0_0_40px_rgba(202,138,4,0.3)]"
            >
              <span className="relative z-10 flex items-center">
                Explorer le stock <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>

        {/* Décoration 3D flottante */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-yellow-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </section>

      {/* Section Voitures avec effet de perspective */}
      <section className="py-32 bg-black relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
            <div className="perspective-1000">
              <h2 className="text-yellow-500 text-xs font-black uppercase tracking-[0.5em] mb-4">Showroom Privé</h2>
              <h3 className="text-5xl md:text-6xl font-bold font-serif text-white tracking-tighter">Nos Dernières <br/>Arrivées</h3>
            </div>
            {featuredCars.length > 0 && (
              <Link to="/catalog" className="group flex items-center space-x-3 text-gray-500 hover:text-white transition-all mt-8 md:mt-0">
                <span className="text-xs font-black uppercase tracking-[0.2em]">Tout le catalogue</span>
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-yellow-500 transition-colors">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {loading ? (
              <div className="col-span-full py-20 text-center">
                 <div className="animate-spin h-12 w-12 border-t-2 border-yellow-500 rounded-full mx-auto mb-4"></div>
                 <p className="text-gray-500 font-serif italic">Chargement du luxe...</p>
              </div>
            ) : featuredCars.length > 0 ? (
              featuredCars.map((car) => (
                <div 
                  key={car.id} 
                  className="group relative bg-zinc-900/30 border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-4 hover:rotate-1 hover:border-yellow-500/30"
                  style={{ perspective: '1000px' }}
                >
                  <div className="relative h-72 overflow-hidden">
                    <img 
                      src={car.image} 
                      alt={car.brand} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                    <div className="absolute bottom-6 left-6">
                      <div className="bg-yellow-600 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-2 inline-block">
                        {car.year}
                      </div>
                      <h4 className="text-2xl font-bold text-white tracking-tighter">{car.brand} {car.model}</h4>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                      <p className="text-3xl font-black text-white italic">
                        {car.price.toLocaleString()} <span className="text-sm font-light text-yellow-500">$</span>
                      </p>
                    </div>
                    <Link 
                      to={`/car/${car.id}`} 
                      className="w-full block text-center bg-white/5 hover:bg-yellow-600 text-white hover:text-black py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all border border-white/10 hover:border-yellow-600"
                    >
                      Détails Exclusifs
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              /* ÉTAT VIDE ÉLÉGANT */
              <div className="col-span-full">
                <div className="bg-zinc-900/20 border border-white/5 rounded-[3rem] p-20 text-center backdrop-blur-sm">
                  <div className="w-20 h-20 bg-yellow-600/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Sparkles className="w-10 h-10 text-yellow-500 animate-pulse" />
                  </div>
                  <h4 className="text-3xl font-serif text-white mb-4 italic">Collection en préparation</h4>
                  <p className="text-gray-500 max-w-md mx-auto font-light leading-relaxed">
                    Nos experts sélectionnent actuellement les meilleurs véhicules pour notre catalogue. Revenez très bientôt pour découvrir l'exceptionnel.
                  </p>
                  <div className="mt-10 inline-flex items-center space-x-2 text-yellow-600 text-xs font-black uppercase tracking-[0.3em]">
                    <span className="w-8 h-[1px] bg-yellow-600"></span>
                    <span>Exclusive Experience</span>
                    <span className="w-8 h-[1px] bg-yellow-600"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-yellow-600 transition-colors duration-500">
              <ShieldCheck className="w-8 h-8 text-yellow-500 group-hover:text-black" />
            </div>
            <h5 className="text-white font-black uppercase tracking-widest text-sm mb-4">Garantie Totale</h5>
            <p className="text-gray-500 text-sm font-light">Chaque véhicule est inspecté par nos ingénieurs certifiés avant toute mise en vente.</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-yellow-600 transition-colors duration-500">
              <Star className="w-8 h-8 text-yellow-500 group-hover:text-black" />
            </div>
            <h5 className="text-white font-black uppercase tracking-widest text-sm mb-4">Service VIP</h5>
            <p className="text-gray-500 text-sm font-light">Accompagnement personnalisé de la réservation jusqu'à la remise des clés.</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-yellow-600 transition-colors duration-500">
              <Zap className="w-8 h-8 text-yellow-500 group-hover:text-black" />
            </div>
            <h5 className="text-white font-black uppercase tracking-widest text-sm mb-4">Achat Express</h5>
            <p className="text-gray-500 text-sm font-light">Système de réservation en ligne sécurisé avec réponse administrative sous 24h.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
