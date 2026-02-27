import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import OceanBackground from '@/components/OceanBackground';
import { Brain, Lock, Mail } from 'lucide-react';
import AnimatedButton from '@/components/AnimatedButton';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (!success) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - behind everything, darker in dark mode */}
      <img 
        src="/bg.jpg" 
        alt="Background" 
        className="fixed inset-0 w-full h-full object-cover pointer-events-none dark:opacity-20 opacity-30"
        style={{ zIndex: -2 }}
      />
      {/* Simple Ocean Background - above bg.jpg, below content */}
      <div style={{ zIndex: -1 }}>
        <OceanBackground />
      </div>
      {/* Strong overlay to make UI clear - especially in dark mode */}
      <div className="fixed inset-0 bg-gradient-to-br from-background/80 via-background/85 to-background/80 dark:from-background/90 dark:via-background/92 dark:to-background/90 z-0 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-panel rounded-2xl p-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center space-y-3"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-ocean glow-primary"
            >
              <Brain className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Life<span className="text-gradient-ocean">OS</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Capture first. Organize later. Execute without thinking.
            </p>
            <p className="text-foreground/80 text-xs font-medium mt-2">
              Every second counts. You're on a mission.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <AnimatedButton
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl gradient-ocean text-primary-foreground font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50 glow-primary"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Enter LifeOS'
              )}
            </AnimatedButton>
          </motion.form>

          <p className="text-center text-xs text-muted-foreground">
            Private system • Single user access
          </p>
        </div>
      </motion.div>
    </div>
  );
}
