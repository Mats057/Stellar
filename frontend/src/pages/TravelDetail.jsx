import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { travelService, ticketService } from '../services';
import { Plane, CalendarDays, Clock, Users, Building, AlertTriangle, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TravelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [travel, setTravel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState('');
  
  const user = JSON.parse(localStorage.getItem('stellar_user'));

  useEffect(() => {
    const fetchTravel = async () => {
      try {
        const data = await travelService.getTravelById(id);
        setTravel(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTravel();
  }, [id]);

  const handleBuy = async () => {
    if (!user) {
        navigate('/login');
        return;
    }
    setBuying(true);
    setError('');
    try {
        await ticketService.buyTicket(user.id, travel.id, travel.price);
        navigate('/my-tickets');
    } catch(e) {
        setError(e.message);
    } finally {
        setBuying(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-32">
        <div className="border-blue-500 border-t-2 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
    </div>
  );
  
  if (!travel) return <div className="py-32 text-gray-400 text-center">Viagem não encontrada no manifesto.</div>;

  const remaining = Math.max(0, travel.capacity - travel.tickets_sold);
  const isSoldOut = remaining === 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: 'spring' }}
      className="z-20 relative mx-auto pb-20 max-w-7xl"
    >
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-8 font-bold text-indigo-600 hover:text-indigo-800 text-sm uppercase tracking-wider transition-colors hover:-translate-x-1 transform">
          <ChevronLeft className="w-5 h-5"/> Voltar para o mapa
      </button>

      <div className="gap-12 grid grid-cols-1 lg:grid-cols-3">
          
        <div className="space-y-8 lg:col-span-2">
            <div className="group relative shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100 rounded-[2.5rem] h-100 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,var(--tw-gradient-stops))] from-indigo-100/50 via-white to-gray-50"></div>
                <div className="absolute inset-0 bg-linear-to-t from-gray-900/60 via-transparent to-transparent"></div>
                <Plane className="-right-20 -bottom-20 absolute w-96 h-96 text-indigo-500/5 -rotate-12 group-hover:rotate-6 group-hover:scale-110 transition-transform duration-2000 transform" />
                
                <div className="bottom-0 left-0 absolute p-10">
                    <span className="inline-block bg-white/20 shadow-sm backdrop-blur-md mb-4 px-4 py-1.5 border border-white/50 rounded-full font-bold text-white text-xs tracking-[0.2em]">
                        {travel.destination?.distance_earth.toLocaleString()} KM DA TERRA
                    </span>
                    <h1 className="mb-2 font-syne font-black text-white text-5xl md:text-7xl leading-none tracking-tighter">{travel.destination?.name}</h1>
                </div>
            </div>

            <div className="space-y-6">
                <div className="p-8 glass-panel">
                    <h2 className="mb-4 font-syne font-bold text-gray-900 text-3xl tracking-tight">{travel.name}</h2>
                    <p className="font-medium text-gray-600 text-lg leading-relaxed">{travel.description}</p>
                </div>
                
                <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                    <div className="flex items-center gap-4 hover:shadow-lg p-6 transition-all duration-300 glass-panel">
                        <div className="bg-indigo-50 p-3 rounded-2xl">
                            <Building className="w-6 h-6 text-indigo-600"/>
                        </div>
                        <div>
                            <div className="mb-1 font-bold text-[10px] text-gray-400 uppercase tracking-widest">Dono da Nave</div>
                            <div className="font-bold text-gray-900 text-base">{travel.company?.name}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 hover:shadow-lg p-6 transition-all duration-300 glass-panel">
                        <div className="bg-rose-50 p-3 rounded-2xl">
                            <Users className="w-6 h-6 text-rose-500"/>
                        </div>
                        <div>
                            <div className="mb-1 font-bold text-[10px] text-gray-400 uppercase tracking-widest">Assentos Restantes</div>
                            <div className={`text-base font-bold ${remaining < 10 ? 'text-red-500' : 'text-green-600'}`}>
                                {remaining} de {travel.capacity} livres
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 hover:shadow-lg p-6 transition-all duration-300 glass-panel">
                        <div className="bg-blue-50 p-3 rounded-2xl">
                            <CalendarDays className="w-6 h-6 text-blue-500"/>
                        </div>
                        <div>
                            <div className="mb-1 font-bold text-[10px] text-gray-400 uppercase tracking-widest">Data da Partida</div>
                            <div className="font-bold text-gray-900 text-base">{new Date(travel.departure_time).toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 hover:shadow-lg p-6 transition-all duration-300 glass-panel">
                        <div className="bg-teal-50 p-3 rounded-2xl">
                            <Clock className="w-6 h-6 text-teal-600"/>
                        </div>
                        <div>
                            <div className="mb-1 font-bold text-[10px] text-gray-400 uppercase tracking-widest">Data da Chegada</div>
                            <div className="font-bold text-gray-900 text-base">{new Date(travel.arrival_time).toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>
                
                <div className="p-8 border-indigo-500 border-l-4 glass-panel">
                    <h3 className="mb-3 font-syne font-bold text-gray-900 text-2xl">A Atmosfera do Local</h3>
                    <p className="font-medium text-gray-600 text-base leading-relaxed">{travel.destination?.description}</p>
                </div>
            </div>
        </div>
          
        <div className="z-30 relative lg:col-span-1">
            <div className="top-32 sticky flex flex-col gap-8 p-8 glass-panel">
                <div className="pb-8 border-gray-100 border-b">
                    <div className="mb-3 font-bold text-gray-400 text-xs uppercase tracking-widest">Investimento</div>
                    <div className="font-syne font-black text-indigo-600 text-5xl truncate">
                        ${travel.price.toLocaleString()}
                    </div>
                    <p className="mt-4 font-medium text-gray-500 text-xs leading-relaxed">Inclui suporte de vida, limite de 50kg de material e suprimento cósmico padrão.</p>
                </div>
                
                {error && (
                    <div className="flex items-center gap-3 bg-red-50 p-4 border border-red-100 rounded-xl font-bold text-red-600 text-xs">
                        <AlertTriangle className="w-5 h-5 animate-pulse shrink-0"/>
                        {error}
                    </div>
                )}
                
                <button
                    onClick={handleBuy}
                    disabled={isSoldOut || buying}
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                        isSoldOut 
                        ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_4px_14px_rgba(79,70,229,0.4)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.6)] hover:-translate-y-1'
                    }`}
                >
                    {buying ? (
                        <span className="flex justify-center items-center gap-3">
                           <div className="border-white border-t-2 border-b-2 rounded-full w-5 h-5 animate-[spin_2s_linear_infinite]"></div>
                           Processando bilhete...
                        </span>
                    ) : (
                        isSoldOut ? 'Nave lotada' : (user ? 'QUERO EMBARCAR NESSA!' : 'Autentique-se primeiro')
                    )}
                </button>

                <div className="font-semibold text-[10px] text-gray-400 text-center uppercase tracking-widest">
                    Ao reservar, você abraça a aventura interplanetária.
                </div>
            </div>
        </div>

      </div>
    </motion.div>
  );
}