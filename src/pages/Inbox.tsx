import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowRight, Trash2, Sparkles } from 'lucide-react';
import StarRating from '@/components/StarRating';
import { CATEGORIES } from '@/contexts/DataContext';
import AnimatedButton from '@/components/AnimatedButton';

export default function InboxPage() {
  const { inbox, addInboxItem, removeInboxItem, convertToTask, isLoading } = useData();
  const [newText, setNewText] = useState('');
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [priority, setPriority] = useState(3);
  const [category, setCategory] = useState('Personal');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    try {
      await addInboxItem(newText.trim());
      setNewText('');
    } catch (error) {
      console.error('Failed to add inbox item:', error);
    }
  };

  const handleConvert = async (id: string) => {
    try {
      await convertToTask(id, priority, category);
      setConvertingId(null);
      setPriority(3);
      setCategory('Personal');
    } catch (error) {
      console.error('Failed to convert to task:', error);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-foreground">Inbox</h1>
        <p className="text-muted-foreground">Capture thoughts before they disappear. Structure comes later.</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleAdd}
        className="glass-panel rounded-2xl p-4 flex gap-3"
      >
        <div className="flex-1 relative">
          <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
        </div>
        <AnimatedButton
          type="submit"
          className="px-5 py-3 rounded-xl gradient-ocean text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity flex items-center gap-2 glow-primary"
        >
          <Plus className="w-4 h-4" />
          Capture
        </AnimatedButton>
      </motion.form>

      <div className="space-y-3">
        {isLoading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your thoughts...</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {inbox.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel-hover rounded-xl p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-foreground font-medium">{item.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <AnimatedButton
                    onClick={() => setConvertingId(convertingId === item.id ? null : item.id)}
                    className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                    title="Convert to task"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={async () => {
                      try {
                        await removeInboxItem(item.id);
                      } catch (error) {
                        console.error('Failed to remove inbox item:', error);
                      }
                    }}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </AnimatedButton>
                </div>
              </div>

              <AnimatePresence>
                {convertingId === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 mt-4 border-t border-border flex flex-wrap items-center gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Priority</label>
                        <StarRating rating={priority} onChange={setPriority} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="px-3 py-1.5 rounded-lg bg-secondary/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <AnimatedButton
                        onClick={() => handleConvert(item.id)}
                        className="px-4 py-2 rounded-lg gradient-ocean text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                      >
                        Create Task
                      </AnimatedButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            ))}
          </AnimatePresence>
        )}

        {!isLoading && inbox.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Your mind is clear. Nothing to capture right now.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
