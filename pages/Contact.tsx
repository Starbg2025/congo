
import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('messages').insert([formData]);
      if (error) throw error;
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      alert("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-black font-serif text-white uppercase tracking-tighter mb-4">Contactez-nous</h1>
          <p className="text-gray-500 max-w-2xl mx-auto font-light italic">
            Une question sur un modèle ? Un besoin spécifique ? Notre équipe exclusive est à votre écoute pour vous accompagner dans votre projet automobile.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info cards */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-md">
              <div className="inline-flex p-4 rounded-2xl bg-yellow-500/10 mb-6">
                <Mail className="w-8 h-8 text-yellow-500" />
              </div>
              <h4 className="text-lg font-bold text-white uppercase tracking-widest mb-2">Notre Email</h4>
              <p className="text-gray-400 font-light">mungu.massikini@hotmail.com</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-md">
              <div className="inline-flex p-4 rounded-2xl bg-yellow-500/10 mb-6">
                <MapPin className="w-8 h-8 text-yellow-500" />
              </div>
              <h4 className="text-lg font-bold text-white uppercase tracking-widest mb-2">Siège Social</h4>
              <p className="text-gray-400 font-light">Kinshasa, République Démocratique du Congo</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              {success && (
                <div className="absolute inset-0 bg-black/90 z-20 flex flex-col items-center justify-center text-center p-10 animate-in fade-in duration-500">
                  <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest">Message Envoyé !</h3>
                  <p className="text-gray-400 font-light">Votre message a bien été transmis à l'administration CONGOCAR EXCLUSIVE. Nous vous répondrons dans les plus brefs délais.</p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="mt-8 text-yellow-500 font-bold uppercase tracking-widest hover:underline"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nom Complet</label>
                    <input 
                      type="text" 
                      required 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-yellow-500 transition-all"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Adresse Email</label>
                    <input 
                      type="email" 
                      required 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-yellow-500 transition-all"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Votre Message</label>
                  <textarea 
                    required 
                    rows={6}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-yellow-500 transition-all resize-none"
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-black py-5 rounded-2xl uppercase tracking-[0.3em] transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-3 shadow-xl shadow-yellow-600/20"
                >
                  {loading ? (
                    <div className="animate-spin h-6 w-6 border-t-2 border-black rounded-full"></div>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Envoyer le message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
