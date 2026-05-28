import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { RocketIcon, LogOut, Ticket, Search } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleStorage = () => {
        const u = localStorage.getItem('stellar_user');
        if (u) setUser(JSON.parse(u));
        else setUser(null);
    };
    handleStorage();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('auth_change', handleStorage);
    return () => {
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener('auth_change', handleStorage);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('stellar_user');
    window.dispatchEvent(new Event('auth_change'));
    navigate('/');
  };

  const handleSearch = (e) => {
      e.preventDefault();
      if(search.trim()) {
          navigate(`/?q=${encodeURIComponent(search)}`);
      } else {
          navigate(`/`);
      }
  };

  return (
    <header className={cn(
      "top-6 left-1/2 z-50 fixed rounded-full transition-all -translate-x-1/2 duration-700",
      scrolled 
        ? "bg-white/80 backdrop-blur-2xl border border-gray-200/50 shadow-[0_8px_30px_rgba(0,0,0,0.06)] w-[95%] max-w-5xl py-2" 
        : "bg-transparent border-transparent w-[98%] max-w-6xl py-4"
    )}>
      <div className="flex justify-between items-center gap-8 px-6 h-16">
        <Link to="/" className="group flex items-center gap-3 font-syne font-black text-gray-900 text-2xl tracking-tighter hover:scale-105 transition-transform duration-500">
          <div className="bg-linear-to-tr from-blue-500 to-indigo-500 p-2 rounded-xl group-hover:rotate-6 transition-all duration-300">
            <RocketIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-gray-900">
            Stellar.
          </span>
        </Link>

        {location.pathname !== '/' && (
          <form onSubmit={handleSearch} className="group hidden relative md:flex flex-1 mx-auto max-w-lg">
              <div className="left-0 absolute inset-y-0 flex items-center pl-4 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input 
                  type="text" 
                  placeholder="Pra que dimensão vamos?" 
                  className="bg-gray-100/50 backdrop-blur-md py-3 pr-4 pl-12 border border-gray-200/50 focus:border-transparent rounded-4xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 w-full text-gray-900 text-sm transition-all placeholder-gray-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
              />
          </form>
        )}

        <nav className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-6">
              <Link to="/my-tickets" className="flex items-center gap-2 font-bold text-gray-600 hover:text-indigo-600 text-sm transition-colors">
                <Ticket className="w-5 h-5" />
                <span className="hidden sm:inline">Meus Portais</span>
              </Link>
              <div className="hidden sm:block bg-linear-to-b from-transparent via-gray-300 to-transparent w-px h-8"></div>
              <div className="flex items-center gap-3">
                <div className="flex justify-center items-center bg-indigo-50 shadow-sm border border-indigo-100 rounded-xl w-10 h-10 font-bold text-indigo-600 text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline font-bold text-gray-800 text-sm tracking-wide">{user.name}</span>
                <button onClick={handleLogout} className="ml-2 text-gray-400 hover:text-red-500 hover:scale-110 transition-colors" title="Desconectar">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="font-bold text-gray-600 hover:text-gray-900 text-sm tracking-wide transition-colors">
                Entrar
              </Link>
              <Link to="/login" className="bg-gray-900 hover:bg-black shadow-md hover:shadow-lg px-6 py-2.5 rounded-full font-bold text-white text-sm tracking-wide transition-all hover:-translate-y-0.5 duration-300">
                Criar Conta
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}