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
      <GlassPanel className="flex flex-col hover:shadow-2xl p-0 h-full overflow-hidden transition-all hover:-translate-y-2 duration-500">
        
        {/* Card Header / Image Area */}
        <div className="relative h-56 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-indigo-500 via-blue-500 to-transparent opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-opacity duration-1000"></div>
          
          <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-gray-900/80 to-transparent p-6">
            <span className="mb-1 font-bold text-[10px] text-indigo-300 uppercase tracking-widest">
              {travel.destination?.name.split(' ')[0]}
            </span>
            <h3 className="font-syne font-bold text-white text-2xl leading-none">
              {travel.destination?.name}
            </h3>
          </div>
        </div>
        
        {/* Card Body */}
        <div className="flex flex-col flex-1 p-6">
          <div className="flex justify-between items-start mb-4 pb-4 border-gray-100 border-b">
            <span className="font-semibold text-gray-500 text-xs uppercase tracking-wider">
              {travel.company?.name}
            </span>
            <span className="font-bold text-indigo-600 text-lg">
              ${travel.price.toLocaleString()}
            </span>
          </div>
          
          <p className="flex-1 mb-6 text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {travel.description}
          </p>
          
          {/* Metadata */}
          <div className="space-y-4 mb-6 font-medium text-gray-600 text-xs">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-indigo-400"/>
              <span>Partida:</span> 
              <span className="text-gray-900">{new Date(travel.departure_time).toLocaleDateString()}</span>
            </div>
            
            <div className="flex justify-between items-center bg-gray-50 p-3 border border-gray-100 rounded-xl">
              <span>Capacidade: {travel.capacity}</span>
              <Badge variant={isAlmostFull ? 'danger' : 'success'}>
                {availableSeats} vagas
              </Badge>
            </div>
          </div>
          
          <Link 
            to={`/travel/${travel.id}`} 
            className="block bg-white hover:bg-gray-50 py-3 border border-gray-200 rounded-xl w-full font-semibold text-gray-800 hover:text-indigo-600 text-sm text-center transition-all duration-300"
          >
            Visualizar Detalhes
          </Link>
        </div>

      </GlassPanel>
    </motion.div>
  );
}
