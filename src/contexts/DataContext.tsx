import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

export interface InboxItem {
  id: string;
  text: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  priority: number;
  category: string;
  status: 'pending' | 'completed';
  created_at: string;
  completed_at?: string;
}

interface DataContextType {
  inbox: InboxItem[];
  tasks: Task[];
  isLoading: boolean;
  addInboxItem: (text: string) => Promise<void>;
  removeInboxItem: (id: string) => Promise<void>;
  convertToTask: (id: string, priority: number, category: string) => Promise<void>;
  addTask: (title: string, priority: number, category: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getNextTask: () => Task | null;
}

const DataContext = createContext<DataContextType | null>(null);

const CATEGORIES = ['Personal', 'Work', 'Learning', 'Health', 'Finance', 'Other'];

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [inbox, setInbox] = useState<InboxItem[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from Supabase
  useEffect(() => {
    if (!user) {
      setInbox([]);
      setTasks([]);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch inbox items
        const { data: inboxData, error: inboxError } = await supabase
          .from('inbox')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (inboxError) throw inboxError;
        setInbox(inboxData || []);

        // Fetch tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (tasksError) throw tasksError;
        setTasks(tasksData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscriptions
    const inboxSubscription = supabase
      .channel('inbox_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'inbox',
        filter: `user_id=eq.${user.id}`,
      }, () => {
        // Refetch inbox on any change
        supabase
          .from('inbox')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .then(({ data }) => {
            if (data) setInbox(data);
          });
      })
      .subscribe();

    const tasksSubscription = supabase
      .channel('tasks_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${user.id}`,
      }, () => {
        // Refetch tasks on any change
        supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .then(({ data }) => {
            if (data) setTasks(data);
          });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(inboxSubscription);
      supabase.removeChannel(tasksSubscription);
    };
  }, [user]);

  const addInboxItem = async (text: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('inbox')
        .insert({ text, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      if (data) setInbox(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error adding inbox item:', error);
      throw error;
    }
  };

  const removeInboxItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('inbox')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setInbox(prev => prev.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error removing inbox item:', error);
      throw error;
    }
  };

  const convertToTask = async (id: string, priority: number, category: string) => {
    const item = inbox.find(i => i.id === id);
    if (!item) return;

    try {
      await addTask(item.text, priority, category);
      await removeInboxItem(id);
    } catch (error) {
      console.error('Error converting to task:', error);
      throw error;
    }
  };

  const addTask = async (title: string, priority: number, category: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title,
          priority,
          category,
          status: 'pending',
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      if (data) setTasks(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const completeTask = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setTasks(prev => prev.map(t => t.id === id ? data : t));
      }
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const getNextTask = () => {
    const pending = tasks.filter(t => t.status === 'pending').sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
    return pending[0] || null;
  };

  return (
    <DataContext.Provider value={{ inbox, tasks, isLoading, addInboxItem, removeInboxItem, convertToTask, addTask, completeTask, deleteTask, getNextTask }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

export { CATEGORIES };
