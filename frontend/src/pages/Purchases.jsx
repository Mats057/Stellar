import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketService } from '../services';
import { Ticket } from 'lucide-react';
import { motion } from 'framer-motion';
import QRCodeModule from 'react-qr-code';

const QRCode = QRCodeModule.default || QRCodeModule;

export default function Purchases() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('stellar_user'));

  useEffect(() => {
    if (!user) {
        navigate('/login');
        return;
    }
    const fetchTickets = async () => {
      try {
        const data = await ticketService.getUserTickets(user.id);
        setTickets(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [user, navigate]);

  if (loading) return (
    <div className="flex justify-center items-center py-32">
        <div className="border-blue-500 border-t-2 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
    </div>
  );

  return (
    <div className="z-20 relative space-y-16 mx-auto pb-20 max-w-6xl">
      <div className="flex items-center gap-6 mb-16 pb-8 border-gray-200/50 border-b">
          <div className="bg-indigo-50 p-4 border border-indigo-100 rounded-2xl">
              <Ticket className="w-10 h-10 text-indigo-600" />
          </div>
          <div>
              <h2 className="font-syne font-black text-gray-900 text-4xl md:text-5xl uppercase tracking-tighter">Meus Portais Abertos</h2>
              <p className="mt-2 font-bold text-gray-500 text-sm uppercase tracking-widest">Suas chaves para a aventura cósmica</p>
          </div>
      </div>
      
      {tickets.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring' }}
            className="py-32 rounded-4xl text-center glass-panel"
          >
              <Ticket className="mx-auto mb-8 w-24 h-24 text-gray-300" />
              <p className="mb-4 font-syne font-black text-gray-900 text-3xl uppercase tracking-tight">Nenhum salto programado</p>
              <p className="mx-auto mb-10 max-w-lg font-medium text-gray-500 text-lg">Você ainda não reservou nenhum salto pela galáxia. A viagem começa na sua próxima decisão.</p>
              <button 
                onClick={() => navigate('/')}
                className="bg-gray-900 hover:bg-black shadow-md px-10 py-4 rounded-2xl font-bold text-white uppercase tracking-wider transition-all hover:-translate-y-1 duration-300"
              >
                  Explorar Destinos
              </button>
          </motion.div>
      ) : (
          <div className="space-y-10">
              {tickets.map((ticket, i) => {
                  const qrPayload = JSON.stringify({
                      passenger: user?.name,
                      seat: `A-${ticket.id.slice(0, 4).toUpperCase()}`,
                      destination: ticket.travel?.destination?.name,
                      departure: new Date(ticket.travel?.departure_time).toLocaleString(),
                      arrival: new Date(ticket.travel?.arrival_time).toLocaleString()
                  });

                  return (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, type: 'spring' }}
                    key={ticket.id} 
                    className="group relative flex md:flex-row flex-col hover:shadow-xl border border-gray-100 overflow-hidden transition-all hover:-translate-y-1 duration-500 glass-panel"
                  >
                      <div className="relative flex md:flex-col justify-center items-center bg-linear-to-br from-indigo-500 to-blue-500 p-8 w-full md:w-56">
                          <div className="z-10 relative bg-white p-2 rounded-xl">
                              <QRCode value={qrPayload} size={100} level="M" />
                          </div>
                          <div className="z-10 relative mt-4 text-center">
                              <span className="block mb-1 font-bold text-[10px] text-indigo-200 uppercase tracking-[0.2em]">Assento</span>
                              <span className="block font-mono font-bold text-white text-lg tracking-widest">
                                  A-{ticket.id.slice(0, 4).toUpperCase()}
                              </span>
                          </div>
                      </div>
                      
                      <div className="flex flex-col flex-1 justify-between p-8">
                          <div className="flex justify-between items-start mb-8">
                              <div>
                                  <div className="mb-2 font-bold text-gray-400 text-xs uppercase tracking-[0.2em]">{ticket.travel?.company?.name}</div>
                                  <h3 className="mb-2 font-syne font-black text-gray-900 text-4xl leading-none tracking-tighter">{ticket.travel?.destination?.name}</h3>
                                  <div className="font-semibold text-gray-500 text-base uppercase tracking-wider">{ticket.travel?.name}</div>
                              </div>
                              <div className="mt-1">
                                  <div className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider ${ticket.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                      {ticket.status === 'CONFIRMED' ? 'CONFIRMADO' : ticket.status}
                                  </div>
                              </div>
                          </div>
                          
                          <div className="gap-6 grid grid-cols-2 lg:grid-cols-4 pt-6 border-gray-100 border-t">
                              <div>
                                  <div className="mb-1 font-bold text-[10px] text-gray-400 uppercase tracking-widest">PASSAGEIRO</div>
                                  <div className="font-bold text-gray-900 text-lg truncate">{user?.name}</div>
                              </div>
                              <div>
                                  <div className="mb-1 font-bold text-[10px] text-gray-400 uppercase tracking-widest">PARTIDA</div>
                                  <div className="font-bold text-gray-900 text-lg">{new Date(ticket.travel?.departure_time).toLocaleDateString()}</div>
                              </div>
                              <div>
                                  <div className="mb-1 font-bold text-[10px] text-gray-400 uppercase tracking-widest">CHEGADA</div>
                                  <div className="font-bold text-gray-900 text-lg">{new Date(ticket.travel?.arrival_time).toLocaleDateString()}</div>
                              </div>
                              <div>
                                  <div className="mb-1 font-bold text-[10px] text-gray-400 uppercase tracking-widest">VALOR PAGO</div>
                                  <div className="font-bold text-indigo-600 text-xl">${ticket.price_paid.toLocaleString()}</div>
                              </div>
                          </div>
                      </div>
                      
                      {/* Stylistic Ticket Notches */}
                      <div className="hidden md:block top-1/2 -left-6 absolute bg-slate-50 border-gray-100 border-r rounded-full w-12 h-12 -translate-y-1/2 transform"></div>
                      <div className="hidden md:block top-1/2 -right-6 absolute bg-slate-50 border-gray-100 border-l rounded-full w-12 h-12 -translate-y-1/2 transform"></div>
                  </motion.div>
              )})}
          </div>
      )}
    </div>
  );
}