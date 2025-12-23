
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search, ChevronRight, Sparkles } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Car } from '../types';

const Catalog: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('All');
  const [priceSort, setPriceSort] = useState('none');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('status', 'Disponible')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCars(data || []);
      setFilteredCars(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = cars;
    if (search) {
      result = result.filter(car => 
        car.brand.toLowerCase().includes(search.toLowerCase()) ||
        car.model.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (brandFilter !== 'All') {
      result = result.filter(car => car.brand === brandFilter);
    }
    if (priceSort === 'asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (priceSort === 'desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }
    setFilteredCars(result);
  }, [search, brandFilter, priceSort, cars]);

  const brands = ['All', ...Array.from(new Set(cars.map(c => c.brand)))];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-16">
          <div className="flex items-center space-x-4 mb-4">
             <div className="h-[1px] w-12 bg-yellow-600"></div>
             <span className="text-yellow-600 text-xs font-black uppercase tracking-[0.4em]">Le Stock Exclusive</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-serif text-white tracking-tighter italic">Notre Catalogue</h1>
        </header>

        {/* Filtres Premium */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-[2rem] p-8 mb-20 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-yellow-600 transition-all text-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Marque</label>
              <select 
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:border-yellow-600 text-white appearance-none cursor-pointer"
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
              >
                {brands.map(b => <option key={b} value={b} className="bg-zinc-900">{b}</option>)}
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Prix</label>
              <select 
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:border-yellow-600 text-white appearance-none cursor-pointer"
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value)}
              >
                <option value="none" className="bg-zinc-900">Par défaut</option>
                <option value="asc" className="bg-zinc-900">Prix croissant</option>
                <option value="desc" className="bg-zinc-900">Prix décroissant</option>
              </select>
            </div>

            <div className="text-right pt-4 md:pt-0">
              <p className="text-xs text-gray-500 uppercase tracking-widest">
                <span className="text-yellow-500 font-black text-lg">{filteredCars.length}</span> Véhicules
              </p>
            </div>
          </div>
        </div>

        {/* Grille de Résultats */}
        {loading ? (
          <div className="flex justify-center py-32">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-yellow-500"></div>
          </div>
        ) : filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredCars.map((car) => (
              <Link 
                key={car.id} 
                to={`/car/${car.id}`} 
                className="group relative bg-zinc-900/30 border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:border-yellow-500/30"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={car.image} alt={car.brand} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute top-6 right-6">
                     <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[10px] font-black text-white uppercase tracking-widest">
                       {car.year}
                     </div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-tighter">{car.brand} {car.model}</h3>
                  <div className="flex items-center space-x-2 text-yellow-500 mb-8">
                    <span className="text-3xl font-black italic">{car.price.toLocaleString()}</span>
                    <span className="text-xs font-light tracking-widest uppercase">$ USD</span>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Exclusivité Congocar</span>
                    <ChevronRight className="w-5 h-5 text-yellow-600 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-zinc-900/20 rounded-[3rem] border border-dashed border-white/5">
            <Sparkles className="w-16 h-16 text-gray-700 mx-auto mb-6" />
            <h3 className="text-2xl font-serif text-gray-400 italic mb-2">Aucun véhicule trouvé</h3>
            <p className="text-gray-600 font-light">Modifiez vos critères ou revenez plus tard.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
