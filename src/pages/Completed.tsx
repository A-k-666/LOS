import { useData } from '@/contexts/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Calendar, Trash2 } from 'lucide-react';
import StarRating from '@/components/StarRating';
import AnimatedButton from '@/components/AnimatedButton';

export default function CompletedPage() {
  const { tasks, deleteTask, isLoading } = useData();
  const completed = tasks
    .filter(t => t.status === 'completed')
    .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime());

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-foreground">Completed</h1>
        <p className="text-muted-foreground">Your achievement memory. Everything you've accomplished.</p>
      </motion.div>

      {completed.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel rounded-xl p-4 flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-10 h-10 rounded-xl gradient-sunset flex items-center justify-center"
          >
            <Trophy className="w-5 h-5 text-accent-foreground" />
          </motion.div>
          <div>
            <p className="text-2xl font-display font-bold text-foreground">{completed.length}</p>
            <p className="text-xs text-muted-foreground">Tasks Completed</p>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {isLoading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading achievements...</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {completed.map((task, i) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.03 }}
              className="glass-panel-hover rounded-xl p-4 flex items-center gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-4 h-4 text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground font-medium truncate line-through opacity-75">{task.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-md bg-secondary/50 text-muted-foreground">{task.category}</span>
                  <StarRating rating={task.priority} size={12} readonly />
                  {task.completed_at && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(task.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
              <AnimatedButton
                onClick={async () => {
                  try {
                    await deleteTask(task.id);
                  } catch (error) {
                    console.error('Failed to delete task:', error);
                  }
                }}
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </AnimatedButton>
            </motion.div>
            ))}
          </AnimatePresence>
        )}

        {!isLoading && completed.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No completed tasks yet. Get started!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
