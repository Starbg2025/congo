
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, ShieldCheck, Car as CarIcon } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black/80 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <CarIcon className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold tracking-tighter text-white uppercase font-serif">
                CONGOCAR <span className="text-yellow-500">EXCLUSIVE</span>
              </span>
            </div>
            <p className="text-gray-400 max-w-sm mb-6 leading-relaxed">
              La destination ultime pour les passionnés d'automobile au Congo. Nous offrons une sélection exclusive de véhicules haut de gamme avec un service personnalisé.
            </p>
            <div className="flex items-center space-x-4">
              <div className="bg-white/5 p-3 rounded-full hover:bg-yellow-500/20 transition-colors cursor-pointer border border-white/10">
                 <span className="text-xs font-bold text-yellow-500">CG</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Navigation</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm">Accueil</Link></li>
              <li><Link to="/catalog" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm">Nos Voitures</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm">Contact</Link></li>
              <li><Link to="/auth" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm">Espace Client</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-yellow-500 shrink-0" />
                <span className="text-gray-400 text-sm">mungu.massikini@hotmail.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-yellow-500 shrink-0" />
                <span className="text-gray-400 text-sm">Kinshasa, République Démocratique du Congo</span>
              </li>
              <li className="flex items-start space-x-3 mt-4 pt-4 border-t border-white/5">
                <ShieldCheck className="w-5 h-5 text-yellow-500 shrink-0" />
                <span className="text-xs text-gray-500 italic">Plateforme officielle sécurisée. Tous droits réservés &copy; 2025</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 text-center">
          <p className="text-gray-600 text-[10px] uppercase tracking-widest">
            Design & Développement par CONGOCAR EXCLUSIVE Team | 2025
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
