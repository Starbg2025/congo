
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Zap, ArrowRight, Award, Sparkles, PlusCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Car } from '../types';

const Home: React.FC = () => {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        setIsAdmin(profile?.role === 'admin');
      }
    };

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

    checkUser();
    fetchFeatured();
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section Immersif */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-black/60 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full mb-8 animate-in fade-in slide-in-from-bottom duration-700">
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">CONGOCAR EXCLUSIVE • 2025</span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black text-white mb-6 font-serif leading-none tracking-tighter drop-shadow-2xl">
            L'EXCELLENCE <br />
            <span className="text-yellow-500">AUTOMOBILE</span>
          </h1>
          
          <p className="text-xl md:text-3xl text-white mb-12 max-w-2xl mx-auto font-light italic tracking-wide drop-shadow-lg">
            "Le prestige à portée de clic"
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
            <Link 
              to="/catalog" 
              className="group bg-yellow-600 hover:bg-yellow-500 text-black px-12 py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] transition-all hover:scale-110 shadow-[0_0_40px_rgba(202,138,4,0.4)]"
            >
              Voir le catalogue
            </Link>
            <Link 
              to="/contact" 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-12 py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] transition-all"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      {/* Section Voitures */}
      <section className="py-32 bg-black/95 relative z-20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
            <div>
              <h2 className="text-yellow-500 text-xs font-black uppercase tracking-[0.5em] mb-4">Stock Réel</h2>
              <h3 className="text-5xl md:text-6xl font-bold font-serif text-white tracking-tighter italic">Nouveautés</h3>
            </div>
            {featuredCars.length > 0 && (
              <Link to="/catalog" className="group flex items-center space-x-3 text-gray-500 hover:text-white transition-all mt-8 md:mt-0">
                <span className="text-xs font-black uppercase tracking-[0.2em]">Parcourir tout</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {loading ? (
              <div className="col-span-full py-20 text-center">
                 <div className="animate-spin h-12 w-12 border-t-2 border-yellow-500 rounded-full mx-auto mb-4"></div>
              </div>
            ) : featuredCars.length > 0 ? (
              featuredCars.map((car) => (
                <div key={car.id} className="group bg-zinc-900/50 border border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-4 hover:border-yellow-500/30">
                  <div className="relative h-72 overflow-hidden">
                    <img src={car.image} alt={car.brand} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6">
                      <div className="bg-yellow-600 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase mb-2 inline-block">
                        {car.year}
                      </div>
                      <h4 className="text-2xl font-bold text-white uppercase">{car.brand} {car.model}</h4>
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="text-3xl font-black text-white italic mb-8">
                      {car.price.toLocaleString()} <span className="text-sm font-light text-yellow-500">$</span>
                    </p>
                    <Link 
                      to={`/car/${car.id}`} 
                      className="w-full block text-center bg-white/5 hover:bg-yellow-600 text-white hover:text-black py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all border border-white/10 hover:border-yellow-600"
                    >
                      Détails du véhicule
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full">
                <div className="bg-zinc-900/40 border border-dashed border-white/10 rounded-[3rem] p-20 text-center">
                  <Sparkles className="w-16 h-16 text-yellow-500/50 mx-auto mb-6" />
                  <h4 className="text-3xl font-serif text-white mb-4 italic">Bienvenue sur votre plateforme</h4>
                  <p className="text-gray-400 max-w-md mx-auto font-light leading-relaxed mb-10">
                    Le catalogue est actuellement vide car nous n'affichons que les voitures que vous publiez officiellement.
                  </p>
                  
                  {isAdmin ? (
                    <Link 
                      to="/admin" 
                      className="inline-flex items-center space-x-3 bg-yellow-600 text-black px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all"
                    >
                      <PlusCircle className="w-5 h-5" />
                      <span>Publier ma première voiture</span>
                    </Link>
                  ) : (
                    <div className="inline-block text-yellow-600 text-xs font-black uppercase tracking-[0.3em]">
                      Arrivages imminents • Restez connectés
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-32 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8 text-yellow-500" />
            </div>
            <h5 className="text-white font-black uppercase tracking-widest text-sm mb-4">Qualité Certifiée</h5>
            <p className="text-gray-500 text-xs font-light">Chaque véhicule est vérifié rigoureusement avant d'être mis en ligne.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
            <h5 className="text-white font-black uppercase tracking-widest text-sm mb-4">Réponse Rapide</h5>
            <p className="text-gray-500 text-xs font-light">Notre équipe administrative vous contacte dans les 24h après votre réservation.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
            <h5 className="text-white font-black uppercase tracking-widest text-sm mb-4">Service Premium</h5>
            <p className="text-gray-500 text-xs font-light">Une expérience de vente centralisée et officielle pour une sécurité totale.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
