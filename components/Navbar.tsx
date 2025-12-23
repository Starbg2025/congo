
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, User, ShieldCheck, Car as CarIcon } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface NavbarProps {
  session: any;
  isAdmin: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ session, isAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <CarIcon className="w-8 h-8 text-yellow-500 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold tracking-tighter text-white uppercase font-serif">
              CONGOCAR <span className="text-yellow-500">EXCLUSIVE</span>
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium hover:text-yellow-500 transition-colors uppercase tracking-widest">Accueil</Link>
            <Link to="/catalog" className="text-sm font-medium hover:text-yellow-500 transition-colors uppercase tracking-widest">Catalogue</Link>
            <Link to="/contact" className="text-sm font-medium hover:text-yellow-500 transition-colors uppercase tracking-widest">Contact</Link>
            
            {isAdmin && (
              <Link to="/admin" className="flex items-center space-x-1 text-yellow-500 text-sm font-bold uppercase tracking-widest border border-yellow-500/30 px-3 py-1 rounded-full hover:bg-yellow-500/10 transition-all">
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}

            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-xs text-gray-400">Bienvenue, {session.user.email.split('@')[0]}</span>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold px-6 py-2 rounded-full text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-yellow-600/20">
                Connexion
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 absolute w-full left-0 py-8 px-4 flex flex-col items-center space-y-6 animate-in slide-in-from-top duration-300">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-lg uppercase">Accueil</Link>
          <Link to="/catalog" onClick={() => setIsOpen(false)} className="text-lg uppercase">Catalogue</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="text-lg uppercase">Contact</Link>
          {isAdmin && <Link to="/admin" onClick={() => setIsOpen(false)} className="text-lg uppercase text-yellow-500">Admin Panel</Link>}
          {session ? (
            <button onClick={handleLogout} className="text-red-500 flex items-center space-x-2">
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          ) : (
            <Link to="/auth" onClick={() => setIsOpen(false)} className="bg-yellow-600 text-black px-8 py-3 rounded-full font-bold">Connexion</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
