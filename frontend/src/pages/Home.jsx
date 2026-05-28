import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { travelService } from '../services';
import { Search, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import TravelCard from '../components/TravelCard';
import GlassPanel from '../components/ui/GlassPanel';

export default function Home() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = searchParams.get('q') || '';
  const [localSearch, setLocalSearch] = useState(q);
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTravels = async () => {
      setLoading(true);
      try {
        const data = await travelService.getAllTravels({ search: q });
        setTravels(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTravels();
  }, [q]);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if(localSearch.trim()) navigate(`/?q=${encodeURIComponent(localSearch)}`);
    else navigate(`/`);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', bounce: 0.3 } }
  };

  return (
    <div className="relative space-y-24 pb-20">
      {!q && (
        <section className="relative flex flex-col justify-center items-center pt-24 pb-40 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.3 }}
            className="z-10 relative px-4 max-w-5xl"
          >
              <div className="inline-flex items-center gap-3 mb-10 px-5 py-2 rounded-full font-bold text-gray-800 text-sm uppercase tracking-widest transition-transform glass-panel">
                <span className="relative flex w-2 h-2">
                  <span className="inline-flex absolute bg-indigo-500 opacity-75 rounded-full w-full h-full animate-ping"></span>
                  <span className="inline-flex relative bg-indigo-500 rounded-full w-2 h-2"></span>
                </span>
                Exploração disponível.
              </div>
              <h1 className="mb-8 font-syne font-black text-gray-900 text-5xl md:text-7xl leading-none tracking-tighter">
                A exploração <br className="hidden md:block"/>
                <span className="bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 text-transparent">
                  não tem limites.
                </span>
              </h1>
              <p className="mx-auto mb-12 max-w-2xl font-medium text-gray-600 text-lg md:text-xl leading-relaxed">
                Descubra destinos cósmicos inesquecíveis. Nós levamos você para as fronteiras mais distantes do universo conhecido.
              </p>

              <form onSubmit={handleHeroSearch} className="group relative flex items-center mx-auto max-w-2xl transition-transform hover:-translate-y-1 duration-500">
                  <div className="left-6 z-10 absolute pointer-events-none">
                      <Search className="w-6 h-6 text-gray-400 group-focus-within:text-indigo-600 transition-colors"/>
                  </div>
                  <input 
                      type="text" 
                      placeholder="Qual vai ser o seu próximo destino?" 
                      className="pr-36 pl-16 border-gray-200 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 w-full h-16 font-medium text-gray-900 text-lg transition-all glass-panel placeholder-gray-400"
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                  />
                  <button type="submit" className="right-2 absolute bg-gray-900 hover:bg-black shadow-md px-6 rounded-2xl h-12 font-bold text-white tracking-wide transition-all duration-300">
                      Explorar
                  </button>
              </form>
          </motion.div>
        </section>
      )}

      <div className="z-10 relative">
        <div className="flex items-center gap-4 mb-12">
            <div className="bg-indigo-50 p-3 border border-indigo-100 rounded-xl">
              <Navigation className="w-6 h-6 text-indigo-600"/>
            </div>
            <h2 className="font-syne font-bold text-gray-900 text-3xl tracking-tight">
                {q ? `Buscando rotas para "${q}"` : 'Destinos em Destaque'}
            </h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-32">
             <div className="border-indigo-500 border-t-2 border-b-2 rounded-full w-12 h-12 animate-[spin_2s_linear_infinite]"></div>
          </div>
        ) : travels.length > 0 ? (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {travels.map((t) => (
              <TravelCard key={t.id} travel={t} variants={item} />
            ))}
          </motion.div>
        ) : (
          <GlassPanel className="py-32 text-gray-500 text-center">
              <p className="font-medium text-xl">Nenhuma rota encontrada para este destino.</p>
          </GlassPanel>
        )}
      </div>
    </div>
  );
}