
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Info, Calendar, DollarSign, Fuel, Gauge, PenTool, CheckCircle, Mail, Phone, Send } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Car } from '../types';

interface CarDetailsProps {
  session: any;
}

const CarDetails: React.FC<CarDetailsProps> = ({ session }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [showResForm, setShowResForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (id) fetchCar();
  }, [id]);

  useEffect(() => {
    if (session && !formData.email) {
      setFormData(prev => ({ ...prev, email: session.user.email }));
    }
  }, [session]);

  const fetchCar = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      setCar(data);
    } catch (err) {
      console.error(err);
      navigate('/catalog');
    } finally {
      setLoading(false);
    }
  };

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !car) return;
    setReserving(true);

    try {
      // 1. Save to database
      const { error } = await supabase.from('reservations').insert([{
        car_id: id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      }]);

      if (error) throw error;

      // 2. Trigger Notification (Simulated/API Call)
      await fetch('/.netlify/functions/sendReservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          car: `${car.brand} ${car.model} (${car.year})`,
          message: formData.message
        })
      }).catch(err => console.log('Email function simulated or errored but db updated.'));

      setSuccess(true);
      setTimeout(() => navigate('/catalog'), 4000);
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue lors de la réservation.");
    } finally {
      setReserving(false);
    }
  };

  if (loading) return <div className="pt-32 text-center text-white">Recherche du joyau...</div>;
  if (!car) return null;

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/catalog" className="inline-flex items-center text-gray-500 hover:text-white transition-colors mb-8 group">
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Retour au catalogue</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div className="space-y-6">
            <div className="aspect-[16/10] bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img src={car.image} alt={car.brand} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="aspect-square bg-zinc-900 rounded-xl overflow-hidden border border-white/5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                    <img src={`https://picsum.photos/400/300?random=${i}`} className="w-full h-full object-cover" />
                 </div>
               ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <span className="bg-yellow-600 text-black text-xs font-black px-3 py-1 rounded uppercase tracking-widest">{car.year}</span>
                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${car.status === 'Disponible' ? 'text-green-500' : 'text-red-500'}`}>
                  {car.status}
                </span>
              </div>
              <h1 className="text-5xl font-black font-serif text-white mb-2 uppercase">{car.brand}</h1>
              <h2 className="text-3xl font-light text-gray-400 mb-6">{car.model}</h2>
              <div className="text-4xl font-black text-yellow-500">
                {car.price.toLocaleString()} <span className="text-xl font-light">$</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
              <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                 <Calendar className="w-5 h-5 text-yellow-500" />
                 <div>
                    <p className="text-[10px] uppercase text-gray-500 font-bold">Année</p>
                    <p className="text-white font-bold">{car.year}</p>
                 </div>
              </div>
              <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                 <Fuel className="w-5 h-5 text-yellow-500" />
                 <div>
                    <p className="text-[10px] uppercase text-gray-500 font-bold">Carburant</p>
                    <p className="text-white font-bold">Essence</p>
                 </div>
              </div>
              <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                 <Gauge className="w-5 h-5 text-yellow-500" />
                 <div>
                    <p className="text-[10px] uppercase text-gray-500 font-bold">Transmission</p>
                    <p className="text-white font-bold">Automatique</p>
                 </div>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-500 mb-4 flex items-center">
                <Info className="w-4 h-4 mr-2" /> Description du véhicule
              </h3>
              <p className="text-gray-300 leading-relaxed font-light italic text-lg">
                {car.description}
              </p>
            </div>

            {success ? (
              <div className="bg-green-500/10 border border-green-500/50 p-6 rounded-2xl flex items-center space-x-4 animate-in zoom-in duration-300">
                <CheckCircle className="w-10 h-10 text-green-500" />
                <div>
                  <h4 className="text-lg font-bold text-white">Réservation réussie !</h4>
                  <p className="text-green-200 text-sm">Un email de confirmation a été envoyé à {formData.email}. L'admin vous contactera sous peu.</p>
                </div>
              </div>
            ) : showResForm ? (
              <form onSubmit={handleReservation} className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-4 animate-in slide-in-from-bottom duration-500">
                <h4 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">Formulaire de Réservation</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Nom complet" 
                    required 
                    className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-yellow-500 outline-none"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                  <input 
                    type="email" 
                    placeholder="Email" 
                    required 
                    className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-yellow-500 outline-none"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <input 
                  type="tel" 
                  placeholder="Téléphone" 
                  required 
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-yellow-500 outline-none"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
                <textarea 
                  placeholder="Message (optionnel)" 
                  rows={3} 
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-yellow-500 outline-none"
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                />
                <div className="flex space-x-4 pt-4">
                  <button 
                    type="submit" 
                    disabled={reserving}
                    className="flex-grow bg-yellow-600 hover:bg-yellow-700 text-black font-black py-4 rounded-xl uppercase tracking-[0.2em] transition-all disabled:opacity-50"
                  >
                    {reserving ? 'Envoi en cours...' : 'Confirmer la réservation'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowResForm(false)}
                    className="px-6 border border-white/10 text-gray-500 hover:text-white rounded-xl font-bold transition-all"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                 <button 
                  onClick={() => setShowResForm(true)}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-black py-5 rounded-2xl text-xl uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-yellow-600/20"
                >
                  Réserver cette voiture
                </button>
                {!session && (
                  <p className="text-center text-xs text-gray-500">
                    Connectez-vous pour une expérience plus rapide. <Link to="/auth" className="text-yellow-500 hover:underline">Connexion</Link>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
