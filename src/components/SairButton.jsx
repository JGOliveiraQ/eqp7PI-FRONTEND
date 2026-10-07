import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function SairButton() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const sairDaConta = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <button
      type="button"
      onClick={sairDaConta}
      title="Sair da conta"
      aria-label="Sair da conta"
      className="inline-flex min-h-12 min-w-12 shrink-0 items-center justify-center gap-2 rounded-lg border border-white/40 bg-white/10 px-3 text-base font-semibold text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <LogOut size={20} aria-hidden="true" />
      <span>Sair</span>
    </button>
  );
}

export default SairButton;
