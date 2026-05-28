import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import GlassPanel from './ui/GlassPanel';
import Badge from './ui/Badge';

export default function TravelCard({ travel, variants }) {
  const availableSeats = Math.max(0, travel.capacity - travel.tickets_sold);
  const isAlmostFull = availableSeats < 10;

  return (
    <motion.div variants={variants} className="group h-full">
      <GlassPanel className="h-full overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-0">
        
        {/* Card Header / Image Area */}
        <div className="h-56 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br from-indigo-500 via-blue-500 to-transparent group-hover:scale-110 duration-1000"></div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent flex flex-col justify-end p-6">
            <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-300 mb-1">
              {travel.destination?.name.split(' ')[0]}
            </span>
            <h3 className="text-2xl font-bold leading-none font-syne text-white">
              {travel.destination?.name}
            </h3>
          </div>
        </div>
        
        {/* Card Body */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
            <span className="text-xs font-semibold text-gray-500 tracking-wider uppercase">
              {travel.company?.name}
            </span>
            <span className="text-lg font-bold text-indigo-600">
              ${travel.price.toLocaleString()}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">
            {travel.description}
          </p>
          
          {/* Metadata */}
          <div className="space-y-4 mb-6 text-xs font-medium text-gray-600">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-indigo-400"/>
              <span>Partida:</span> 
              <span className="text-gray-900">{new Date(travel.departure_time).toLocaleDateString()}</span>
            </div>
            
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span>Capacidade: {travel.capacity}</span>
              <Badge variant={isAlmostFull ? 'danger' : 'success'}>
                {availableSeats} vagas
              </Badge>
            </div>
          </div>
          
          <Link 
            to={`/travel/${travel.id}`} 
            className="block w-full text-center bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 hover:text-indigo-600 font-semibold text-sm py-3 rounded-xl transition-all duration-300"
          >
            Visualizar Detalhes
          </Link>
        </div>

      </GlassPanel>
    </motion.div>
  );
}
