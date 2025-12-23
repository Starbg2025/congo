
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Car as CarIcon, Calendar, MessageSquare, Save, X, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Car, Reservation, UserMessage } from '../types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cars' | 'reservations' | 'messages'>('cars');
  const [cars, setCars] = useState<Car[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
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
      
      setPublishSuccess(true);
      setTimeout(() => {
        setPublishSuccess(false);
        setShowAddModal(false);
        fetchData();
      }, 2000);
      
      setNewCar({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: 0,
        description: '',
        image: '',
        status: 'Disponible'
      });
    } catch (err) {
      alert("Erreur lors de l'ajout.");
    }
  };

  const deleteCar = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce véhicule de la vente publique ?")) return;
    try {
      await supabase.from('cars').delete().eq('id', id);
      fetchData();
    } catch (err) {
      alert("Erreur suppression.");
    }
  };

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-black min-h-screen">
      <div className="mb-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black font-serif text-white italic tracking-tighter mb-2">ADMINISTRATION</h1>
          <p className="text-yellow-600 text-xs font-black tracking-[0.4em] uppercase">Contrôle Total • CONGOCAR EXCLUSIVE</p>
        </div>
        
        <div className="flex bg-zinc-900/50 p-2 rounded-[1.5rem] border border-white/5">
          <button 
            onClick={() => setActiveTab('cars')}
            className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'cars' ? 'bg-yellow-600 text-black shadow-lg shadow-yellow-600/20' : 'text-gray-500 hover:text-white'}`}
          >
            <CarIcon className="w-4 h-4" />
            <span>Showroom</span>
          </button>
          <button 
            onClick={() => setActiveTab('reservations')}
            className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'reservations' ? 'bg-yellow-600 text-black shadow-lg shadow-yellow-600/20' : 'text-gray-500 hover:text-white'}`}
          >
            <Calendar className="w-4 h-4" />
            <span>Ventes</span>
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'messages' ? 'bg-yellow-600 text-black shadow-lg shadow-yellow-600/20' : 'text-gray-500 hover:text-white'}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Clientèle</span>
          </button>
        </div>
      </div>

      <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl min-h-[500px]">
        {loading ? (
          <div className="py-40 text-center">
            <div className="animate-spin h-12 w-12 border-t-2 border-yellow-500 rounded-full mx-auto mb-6"></div>
            <p className="text-gray-500 text-xs font-black uppercase tracking-[0.3em]">Synchronisation Base de Données...</p>
          </div>
        ) : (
          <div className="p-10">
            {activeTab === 'cars' && (
              <div className="space-y-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white uppercase tracking-widest">Gestion du Parc Automobile</h2>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-yellow-600 hover:bg-yellow-500 text-black font-black px-8 py-4 rounded-2xl uppercase text-[10px] tracking-[0.2em] flex items-center space-x-2 transition-all shadow-xl shadow-yellow-600/10"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Nouvelle Publication</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {cars.map(car => (
                    <div key={car.id} className="bg-black/60 border border-white/5 rounded-[2rem] overflow-hidden p-6 group transition-all hover:border-yellow-600/30">
                      <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
                        <img src={car.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute top-4 right-4">
                          <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${car.status === 'Disponible' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                            {car.status}
                          </span>
                        </div>
                      </div>
                      <h4 className="text-white font-bold text-lg mb-1 uppercase tracking-tighter">{car.brand} {car.model}</h4>
                      <p className="text-yellow-500 font-black text-2xl mb-8 italic">{car.price.toLocaleString()} $</p>
                      <div className="flex space-x-3">
                        <button className="flex-grow bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 transition-colors">
                          <Edit3 className="w-4 h-4" />
                          <span>Editer</span>
                        </button>
                        <button 
                          onClick={() => deleteCar(car.id)}
                          className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {cars.length === 0 && (
                    <div className="col-span-full py-20 text-center border border-dashed border-white/5 rounded-[2rem]">
                       <p className="text-gray-500 font-light italic uppercase tracking-widest text-xs">Aucune voiture publiée pour le moment.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'reservations' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.3em] text-gray-500 font-black">
                      <th className="pb-6 px-4">Acheteur</th>
                      <th className="pb-6 px-4">Véhicule</th>
                      <th className="pb-6 px-4">Coordonnées</th>
                      <th className="pb-6 px-4">Date</th>
                      <th className="pb-6 px-4">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {reservations.map(res => (
                      <tr key={res.id} className="group hover:bg-white/5 transition-colors">
                        <td className="py-6 px-4">
                           <p className="text-white font-bold uppercase text-xs">{res.name}</p>
                        </td>
                        <td className="py-6 px-4">
                           <p className="text-gray-400 font-medium text-xs">
                             {res.car ? `${res.car.brand} ${res.car.model}` : <span className="text-red-900 italic">Supprimé</span>}
                           </p>
                        </td>
                        <td className="py-6 px-4">
                          <p className="text-yellow-600 text-[10px] font-black">{res.email}</p>
                          <p className="text-gray-500 text-[10px]">{res.phone}</p>
                        </td>
                        <td className="py-6 px-4 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                          {new Date(res.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-6 px-4">
                           <span className="text-green-500 text-[9px] font-black uppercase tracking-widest border border-green-500/30 px-2 py-1 rounded">Nouveau</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.map(msg => (
                  <div key={msg.id} className="bg-black/60 border border-white/5 rounded-[2rem] p-8 hover:border-yellow-600/30 transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="text-white font-bold uppercase tracking-wider text-sm">{msg.name}</h4>
                        <p className="text-yellow-600 text-[10px] font-black">{msg.email}</p>
                      </div>
                      <div className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] bg-white/5 px-3 py-1 rounded-full">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-gray-400 font-light italic text-sm leading-relaxed">{msg.message}</p>
                  </div>
                ))}
                {messages.length === 0 && (
                   <div className="col-span-full py-20 text-center text-gray-600 uppercase tracking-widest text-xs italic">
                     Aucun message reçu.
                   </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Ajout Voiture avec Feedback */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300 relative">
            
            {publishSuccess && (
              <div className="absolute inset-0 z-50 bg-zinc-900 flex flex-col items-center justify-center text-center p-10 animate-in fade-in duration-300">
                <CheckCircle className="w-20 h-20 text-green-500 mb-6 animate-bounce" />
                <h3 className="text-3xl font-bold text-white uppercase tracking-widest mb-2">Publié avec Succès !</h3>
                <p className="text-gray-400">Le véhicule est maintenant visible par tous les clients.</p>
              </div>
            )}

            <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
              <h3 className="text-2xl font-bold text-white uppercase tracking-tighter italic">Nouveau Bijou</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <form onSubmit={handleAddCar} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Marque</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="ex: Mercedes-Benz"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-yellow-600 outline-none text-white"
                    value={newCar.brand}
                    onChange={e => setNewCar({...newCar, brand: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Modèle</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="ex: G-Class 63"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-yellow-600 outline-none text-white"
                    value={newCar.model}
                    onChange={e => setNewCar({...newCar, model: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Année</label>
                  <input 
                    type="number" 
                    required 
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-yellow-600 outline-none text-white"
                    value={newCar.year}
                    onChange={e => setNewCar({...newCar, year: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Prix de Vente ($)</label>
                  <input 
                    type="number" 
                    required 
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-yellow-600 outline-none text-white font-black"
                    value={newCar.price}
                    onChange={e => setNewCar({...newCar, price: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">URL Image (Haute Qualité)</label>
                <div className="relative">
                  <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type="text" 
                    required 
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-14 py-4 text-sm focus:border-yellow-600 outline-none text-white"
                    value={newCar.image}
                    onChange={e => setNewCar({...newCar, image: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Description Exclusive</label>
                <textarea 
                  required 
                  rows={4}
                  placeholder="Décrivez les options, l'état et l'histoire du véhicule..."
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-yellow-600 outline-none text-white resize-none"
                  value={newCar.description}
                  onChange={e => setNewCar({...newCar, description: e.target.value})}
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-black py-5 rounded-[2rem] uppercase tracking-[0.3em] transition-all flex items-center justify-center space-x-3 shadow-2xl shadow-yellow-600/20 active:scale-95"
              >
                <Save className="w-6 h-6" />
                <span>Rendre Public Immédiatement</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
