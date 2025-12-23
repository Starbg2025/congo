
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, ShieldCheck, Zap, ArrowRight, Award } from 'lucide-react';
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
        .limit(3);
      if (data) setFeaturedCars(data);
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black z-10"></div>
        
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full mb-8 animate-in fade-in slide-in-from-bottom duration-700">
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-white">L'excellence automobile au Congo</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-white mb-6 font-serif leading-tight animate-in fade-in slide-in-from-bottom duration-1000">
            CONGOCAR <br />
            <span className="text-yellow-500">EXCLUSIVE</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto font-light italic animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
            "L’excellence automobile à portée de clic"
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
            <Link 
              to="/catalog" 
              className="group bg-yellow-600 hover:bg-yellow-700 text-black px-10 py-4 rounded-full font-bold text-lg uppercase tracking-widest flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-yellow-600/30"
            >
              <span>Voir les voitures</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/contact" 
              className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-full font-bold text-lg uppercase tracking-widest transition-all hover:scale-105"
            >
              Réserver maintenant
            </Link>
          </div>
        </div>

        {/* Floating Background Effects */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-yellow-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-yellow-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-24 bg-black relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4">
            <div>
              <h2 className="text-yellow-500 text-sm font-bold uppercase tracking-[0.3em] mb-4">Notre Sélection</h2>
              <h3 className="text-4xl md:text-5xl font-bold font-serif text-white">Modèles Populaires</h3>
            </div>
            <Link to="/catalog" className="group flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
              <span className="text-sm font-bold uppercase tracking-widest">Voir tout le catalogue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {!loading && featuredCars.length > 0 ? featuredCars.map((car) => (
              <div key={car.id} className="group bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-yellow-500/50 transition-all duration-500 transform hover:-translate-y-2">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={car.image} 
                    alt={car.brand} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-yellow-600 text-black text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter">
                      {car.year}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-white mb-1">{car.brand} {car.model}</h4>
                  <p className="text-yellow-500 font-bold text-2xl mb-4">
                    {car.price.toLocaleString()} <span className="text-sm font-light">$</span>
                  </p>
                  <Link 
                    to={`/car/${car.id}`} 
                    className="block text-center border border-white/10 hover:border-yellow-500 hover:bg-yellow-500 hover:text-black py-3 rounded-lg font-bold text-sm uppercase tracking-widest transition-all"
                  >
                    Détails du véhicule
                  </Link>
                </div>
              </div>
            )) : loading ? (
              <div className="col-span-full py-20 text-center">
                 <div className="animate-spin h-8 w-8 border-t-2 border-yellow-500 rounded-full mx-auto mb-4"></div>
                 <p className="text-gray-500 text-sm italic">Recherche des exclusivités...</p>
              </div>
            ) : (
              <div className="col-span-full py-20 text-center text-gray-500 italic">
                Aucun véhicule n'est disponible pour le moment.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-zinc-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-yellow-500 text-sm font-bold uppercase tracking-[0.3em] mb-4">Pourquoi Nous ?</h2>
            <h3 className="text-4xl md:text-5xl font-bold font-serif text-white">L'Excellence CONGOCAR</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-8 bg-black/40 border border-white/5 rounded-3xl">
              <div className="inline-flex p-4 rounded-2xl bg-yellow-500/10 mb-6">
                <ShieldCheck className="w-10 h-10 text-yellow-500" />
              </div>
              <h4 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">Sécurité Garantie</h4>
              <p className="text-gray-400 font-light leading-relaxed">
                Toutes nos transactions sont sécurisées et chaque véhicule passe par une inspection rigoureuse.
              </p>
            </div>

            <div className="text-center p-8 bg-black/40 border border-white/5 rounded-3xl">
              <div className="inline-flex p-4 rounded-2xl bg-yellow-500/10 mb-6">
                <Star className="w-10 h-10 text-yellow-500" />
              </div>
              <h4 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">Haut de Gamme</h4>
              <p className="text-gray-400 font-light leading-relaxed">
                Une collection triée sur le volet des meilleures marques mondiales : Mercedes, BMW, Toyota, Lexus.
              </p>
            </div>

            <div className="text-center p-8 bg-black/40 border border-white/5 rounded-3xl">
              <div className="inline-flex p-4 rounded-2xl bg-yellow-500/10 mb-6">
                <Zap className="w-10 h-10 text-yellow-500" />
              </div>
              <h4 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">Réservation Instantanée</h4>
              <p className="text-gray-400 font-light leading-relaxed">
                Un processus de réservation fluide et rapide directement en ligne depuis votre domicile.
              </p>
            </div>
          </div>
        </div>
        
        {/* Subtle Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-px h-64 bg-yellow-500"></div>
          <div className="absolute top-1/2 left-1/2 w-px h-32 bg-yellow-500"></div>
          <div className="absolute top-1/2 right-1/4 w-px h-64 bg-yellow-500"></div>
        </div>
      </section>
    </div>
  );
};

export default Home;
