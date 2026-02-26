import { useState } from 'react';
import { useData, CATEGORIES } from '@/contexts/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, Filter } from 'lucide-react';
import StarRating from '@/components/StarRating';
import AnimatedButton from '@/components/AnimatedButton';

export default function PriorityPage() {
  const { tasks, addTask, completeTask, deleteTask, isLoading } = useData();
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState(3);
  const [category, setCategory] = useState('Personal');
  const [filterCat, setFilterCat] = useState('All');

  const pendingTasks = tasks
    .filter(t => t.status === 'pending')
    .filter(t => filterCat === 'All' || t.category === filterCat)
    .sort((a, b) => b.priority - a.priority);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await addTask(title.trim(), priority, category);
      setTitle('');
      setPriority(3);
      setShowAdd(false);
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-bold text-foreground">Priority Board</h1>
          <p className="text-muted-foreground">Your tasks ranked by importance.</p>
        </div>
        <AnimatedButton
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2.5 rounded-xl gradient-ocean text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity flex items-center gap-2 glow-primary"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </AnimatedButton>
      </motion.div>

      <AnimatePresence>
        {showAdd && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleAdd}
            className="glass-panel rounded-2xl p-5 space-y-4 overflow-hidden"
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title..."
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
            <div className="flex flex-wrap items-center gap-6">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Priority</label>
                <StarRating rating={priority} onChange={setPriority} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="px-3 py-1.5 rounded-lg bg-secondary/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <AnimatedButton type="submit" className="px-5 py-2 rounded-lg gradient-ocean text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity ml-auto">
                Create
              </AnimatedButton>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        {['All', ...CATEGORIES].map(cat => (
          <AnimatedButton
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              filterCat === cat
                ? 'gradient-ocean text-primary-foreground'
                : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat}
          </AnimatedButton>
        ))}
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {isLoading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading tasks...</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {pendingTasks.map((task, i) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.03 }}
              className="glass-panel-hover rounded-xl p-4 flex items-center gap-4"
            >
              <AnimatedButton
                onClick={async () => {
                  try {
                    await completeTask(task.id);
                  } catch (error) {
                    console.error('Failed to complete task:', error);
                  }
                }}
                className="p-1 rounded-full text-muted-foreground hover:text-success transition-colors flex-shrink-0"
              >
                <CheckCircle2 className="w-5 h-5" />
              </AnimatedButton>

              <div className="flex-1 min-w-0">
                <p className="text-foreground font-medium truncate">{task.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-md bg-secondary/50 text-muted-foreground">{task.category}</span>
                  <StarRating rating={task.priority} size={12} readonly />
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

        {!isLoading && pendingTasks.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <CheckCircle2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No tasks here. Add one or check inbox.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
