import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Mountain, LogIn } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError('Credenziali non valide. Riprova.');
    } else {
      navigate('/admin');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-sm mx-auto p-8">
        <div className="text-center mb-8">
          <Mountain className="h-10 w-10 text-primary mx-auto mb-3" />
          <h1 className="heading-section">Area riservata</h1>
          <p className="text-sm text-muted-foreground mt-1">Accedi per moderare gli annunci</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2.5 bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="admin@esempio.it"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2.5 bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
            <LogIn className="h-4 w-4" />
            {loading ? 'Accesso...' : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
