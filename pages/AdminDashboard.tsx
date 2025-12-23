
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Car as CarIcon, Calendar, MessageSquare, Save, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Car, Reservation, UserMessage } from '../types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cars' | 'reservations' | 'messages'>('cars');
  const [cars, setCars] = useState<Car[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCar, setNewCar] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    description: '',
    image: '',
    status: 'Disponible' as const
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'cars') {
        const { data } = await supabase.from('cars').select('*').order('created_at', { ascending: false });
        setCars(data || []);
      } else if (activeTab === 'reservations') {
        const { data } = await supabase.from('reservations').select('*, car:cars(*)').order('created_at', { ascending: false });
        setReservations(data || []);
      } else if (activeTab === 'messages') {
        const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
        setMessages(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('cars').insert([newCar]);
      if (error) throw error;
      setShowAddModal(false);
      fetchData();
    } catch (err) {
      alert("Erreur lors de l'ajout.");
    }
  };

  const deleteCar = async (id: string) => {
    if (!confirm("Supprimer ce véhicule ?")) return;
    try {
      await supabase.from('cars').delete().eq('id', id);
      fetchData();
    } catch (err) {
      alert("Erreur suppression.");
    }
  };

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black font-serif text-white uppercase tracking-tighter mb-2">TABLEAU DE BORD</h1>
          <p className="text-gray-500 text-sm tracking-widest uppercase">Gestion centralisée CONGOCAR EXCLUSIVE</p>
        </div>
        
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
          <button 
            onClick={() => setActiveTab('cars')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'cars' ? 'bg-yellow-600 text-black shadow-lg shadow-yellow-600/20' : 'text-gray-400 hover:text-white'}`}
          >
            <CarIcon className="w-4 h-4" />
            <span>Voitures</span>
          </button>
          <button 
            onClick={() => setActiveTab('reservations')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'reservations' ? 'bg-yellow-600 text-black shadow-lg shadow-yellow-600/20' : 'text-gray-400 hover:text-white'}`}
          >
            <Calendar className="w-4 h-4" />
            <span>Réservations</span>
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'messages' ? 'bg-yellow-600 text-black shadow-lg shadow-yellow-600/20' : 'text-gray-400 hover:text-white'}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Messages</span>
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
        {loading ? (
          <div className="py-24 text-center">
            <div className="animate-spin h-10 w-10 border-t-2 border-yellow-500 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm uppercase tracking-widest">Synchronisation...</p>
          </div>
        ) : (
          <div className="p-8">
            {activeTab === 'cars' && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-black font-black px-6 py-3 rounded-xl uppercase text-xs tracking-[0.2em] flex items-center space-x-2 transition-all shadow-lg shadow-yellow-600/20"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Ajouter une voiture</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cars.map(car => (
                    <div key={car.id} className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden p-4 group">
                      <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                        <img src={car.image} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${car.status === 'Disponible' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                            {car.status}
                          </span>
                        </div>
                      </div>
                      <h4 className="text-white font-bold mb-1 uppercase tracking-wider">{car.brand} {car.model}</h4>
                      <p className="text-yellow-500 font-black mb-4">{car.price.toLocaleString()} $</p>
                      <div className="flex space-x-2">
                        <button className="flex-grow bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-1">
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Modifier</span>
                        </button>
                        <button 
                          onClick={() => deleteCar(car.id)}
                          className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-3 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reservations' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.2em] text-gray-500">
                      <th className="py-4 font-bold">Client</th>
                      <th className="py-4 font-bold">Véhicule</th>
                      <th className="py-4 font-bold">Contact</th>
                      <th className="py-4 font-bold">Date</th>
                      <th className="py-4 font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {reservations.map(res => (
                      <tr key={res.id} className="text-sm">
                        <td className="py-4 font-bold text-white uppercase">{res.name}</td>
                        <td className="py-4 text-gray-400">
                          {res.car ? `${res.car.brand} ${res.car.model}` : 'Véhicule supprimé'}
                        </td>
                        <td className="py-4">
                          <p className="text-white text-xs">{res.email}</p>
                          <p className="text-gray-500 text-xs">{res.phone}</p>
                        </td>
                        <td className="py-4 text-gray-500 text-xs">
                          {new Date(res.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                           <button className="text-yellow-500 hover:underline text-xs font-bold uppercase">Contacter</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className="bg-black/40 border border-white/5 rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-white font-bold uppercase tracking-wider">{msg.name}</h4>
                        <p className="text-yellow-500 text-xs">{msg.email}</p>
                      </div>
                      <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-400 font-light italic text-sm">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Car Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white uppercase tracking-widest">Nouveau Véhicule</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddCar} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Marque</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-yellow-500 outline-none"
                    value={newCar.brand}
                    onChange={e => setNewCar({...newCar, brand: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Modèle</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-yellow-500 outline-none"
                    value={newCar.model}
                    onChange={e => setNewCar({...newCar, model: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Année</label>
                  <input 
                    type="number" 
                    required 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-yellow-500 outline-none"
                    value={newCar.year}
                    onChange={e => setNewCar({...newCar, year: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Prix ($)</label>
                  <input 
                    type="number" 
                    required 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-yellow-500 outline-none"
                    value={newCar.price}
                    onChange={e => setNewCar({...newCar, price: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">URL Image</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    required 
                    placeholder="Lien de l'image (ex: https://...)"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-10 py-3 text-sm focus:border-yellow-500 outline-none"
                    value={newCar.image}
                    onChange={e => setNewCar({...newCar, image: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Description</label>
                <textarea 
                  required 
                  rows={4}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-yellow-500 outline-none"
                  value={newCar.description}
                  onChange={e => setNewCar({...newCar, description: e.target.value})}
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-black py-4 rounded-xl uppercase tracking-[0.3em] transition-all flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Publier le véhicule</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
