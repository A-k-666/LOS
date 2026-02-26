import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import { Crosshair, CheckCircle2, Zap, Clock } from 'lucide-react';
import StarRating from '@/components/StarRating';
import AnimatedButton from '@/components/AnimatedButton';

export default function TodayFocus() {
  const { getNextTask, completeTask, tasks, isLoading } = useData();
  const nextTask = getNextTask();
  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const completedToday = tasks.filter(t => {
    if (t.status !== 'completed' || !t.completed_at) return false;
    const today = new Date();
    const completed = new Date(t.completed_at);
    return completed.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-foreground">Today Focus</h1>
        <p className="text-muted-foreground">Your next best action. No thinking required.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="glass-panel rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-foreground">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
        </div>
        <div className="glass-panel rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-foreground">{completedToday}</p>
            <p className="text-xs text-muted-foreground">Done Today</p>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Finding your focus...</p>
        </motion.div>
      ) : nextTask ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="glass-panel rounded-2xl p-8 text-center space-y-6 glow-primary"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-ocean"
          >
            <Crosshair className="w-8 h-8 text-primary-foreground" />
          </motion.div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Focus on this now</p>
            <h2 className="text-2xl font-display font-bold text-foreground">{nextTask.title}</h2>
            <div className="flex items-center justify-center gap-4">
              <span className="text-sm px-3 py-1 rounded-lg bg-secondary/50 text-muted-foreground">{nextTask.category}</span>
              <StarRating rating={nextTask.priority} size={18} readonly />
            </div>
          </div>

          <AnimatedButton
            onClick={async () => {
              try {
                await completeTask(nextTask.id);
              } catch (error) {
                console.error('Failed to complete task:', error);
              }
            }}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl gradient-ocean text-primary-foreground font-semibold hover:opacity-90 transition-opacity glow-primary"
          >
            <CheckCircle2 className="w-5 h-5" />
            Mark Complete
          </AnimatedButton>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel rounded-2xl p-12 text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-success/10">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-xl font-display font-bold text-foreground">All Clear!</h2>
          <p className="text-muted-foreground">No pending tasks. Enjoy the moment.</p>
        </motion.div>
      )}

      {nextTask && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Up Next</h3>
          {tasks
            .filter(t => t.status === 'pending' && t.id !== nextTask.id)
            .sort((a, b) => b.priority - a.priority)
            .slice(0, 3)
            .map(task => (
              <div key={task.id} className="glass-panel rounded-xl p-3 flex items-center gap-3">
                <StarRating rating={task.priority} size={12} readonly />
                <span className="text-sm text-foreground truncate">{task.title}</span>
                <span className="text-xs text-muted-foreground ml-auto">{task.category}</span>
              </div>
            ))}
        </motion.div>
      )}
    </div>
  );
}
