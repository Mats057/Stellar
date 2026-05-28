import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services';
import { RocketIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import GlassPanel from '../components/ui/GlassPanel';

export default function LoginSignup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const isLogin = mode !== 'signup';
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let user;
      if (isLogin) {
        user = await authService.login(formData.email, formData.password);
      } else {
        user = await authService.register(formData.name, formData.email, formData.password);
      }
      localStorage.setItem('stellar_user', JSON.stringify(user));
      window.dispatchEvent(new Event('auth_change'));
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="z-20 relative flex justify-center items-center px-4 sm:px-6 lg:px-8 py-12 min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="w-full max-w-md"
      >
        <GlassPanel className="group relative shadow-xl p-10 rounded-4xl overflow-hidden">
          
          <div className="flex justify-center mb-8">
             <div className="flex justify-center items-center bg-indigo-50 shadow-sm border border-indigo-100 rounded-2xl w-16 h-16 hover:rotate-6 transition-transform duration-500">
                <RocketIcon className="w-8 h-8 text-indigo-600" />
             </div>
          </div>
          
          <h2 className="mb-8 font-syne font-black text-gray-900 text-3xl text-center uppercase tracking-tighter">
            {isLogin ? 'Bem-vindo de volta' : 'Iniciar Jornada'}
          </h2>
          
          <AnimatePresence mode="wait">
              {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-red-50 mb-6 p-4 border border-red-100 rounded-xl font-bold text-red-600 text-sm text-center uppercase tracking-widest"
                  >
                      {error}
                  </motion.div>
              )}
          </AnimatePresence>
          
          <form onSubmit={handleSubmit} className="z-10 relative space-y-5">
            <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                      initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                      animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  >
                    <label className="block mb-2 ml-1 font-bold text-[10px] text-gray-500 uppercase tracking-[0.2em]">Identidade Cósmica</label>
                    <Input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="Como te chamam?"
                    />
                  </motion.div>
                )}
            </AnimatePresence>
            
            <div>
              <label className="block mb-2 ml-1 font-bold text-[10px] text-gray-500 uppercase tracking-[0.2em]">E-mail</label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="sinal@espaço.com"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-bold text-[10px] text-gray-500 uppercase tracking-[0.2em]">Código Secreto</label>
              <Input
                type="password"
                required
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                placeholder="***"
              />
            </div>
            
            <Button 
              type="submit" 
              loading={loading}
              className="mt-10 rounded-2xl w-full h-16 text-sm"
            >
              {isLogin ? 'Desbloquear Acesso' : 'Gerar Passaporte'}
            </Button>
          </form>
          
          <div className="mt-10 font-bold text-gray-500 text-sm text-center tracking-wider">
            {isLogin ? "Novo(a) na galáxia? " : "Já tem registro intergalático? "}
            <button 
               type="button" 
               onClick={() => {
                   setError('');
                   navigate(isLogin ? '/login?mode=signup' : '/login');
               }}
               className="ml-2 focus:outline-none text-indigo-600 hover:text-indigo-800 decoration-2 underline underline-offset-4 transition-colors"
            >
              {isLogin ? 'Criar Identidade' : 'Efetuar Login'}
            </button>
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  );
}