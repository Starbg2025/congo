
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search, Grid, List, SlidersHorizontal, ChevronRight } from 'lucide-react';
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
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">Catalogue Exclusif</h1>
          <p className="text-gray-400 font-light">Découvrez notre sélection de véhicules prestigieux disponibles immédiatement.</p>
        </header>

        {/* Filters */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-12 backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Rechercher marque ou modèle..." 
                className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-yellow-500 transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Brand Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Marque:</span>
              <select 
                className="flex-grow bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-yellow-500"
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
              >
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            {/* Price Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Prix:</span>
              <select 
                className="flex-grow bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-yellow-500"
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value)}
              >
                <option value="none">Par défaut</option>
                <option value="asc">Prix croissant</option>
                <option value="desc">Prix décroissant</option>
              </select>
            </div>

            {/* Total count */}
            <div className="text-right">
              <span className="text-sm text-gray-400">
                <span className="text-yellow-500 font-bold">{filteredCars.length}</span> véhicules trouvés
              </span>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-500"></div>
          </div>
        ) : filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <Link 
                key={car.id} 
                to={`/car/${car.id}`} 
                className="group bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-yellow-500/30 transition-all transform hover:-translate-y-1"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={car.image} alt={car.brand} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-4 right-4">
                     <div className="bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">
                       {car.year}
                     </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">{car.brand} {car.model}</h3>
                  </div>
                  <div className="flex items-center space-x-2 text-yellow-500 mb-6">
                    <span className="text-2xl font-black">{car.price.toLocaleString()}</span>
                    <span className="text-xs font-light tracking-widest">$</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    <div className="bg-white/5 rounded p-2 text-[10px] uppercase text-gray-500 font-bold text-center">
                      Auto
                    </div>
                    <div className="bg-white/5 rounded p-2 text-[10px] uppercase text-gray-500 font-bold text-center">
                      Essence
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-yellow-500 font-bold text-sm uppercase tracking-widest group-hover:underline">
                    <span>Voir Détails</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white/5 border border-dashed border-white/10 rounded-3xl">
            <Filter className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">Aucun véhicule ne correspond</h3>
            <p className="text-gray-500">Essayez de modifier vos filtres ou effectuez une nouvelle recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
