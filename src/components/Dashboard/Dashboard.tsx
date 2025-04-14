import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenLine, LogOut, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Poem {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPoems();
  }, []);

  const fetchPoems = async () => {
    try {
      const { data: poems, error } = await supabase
        .from('poems')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPoems(poems || []);
    } catch (error) {
      console.error('Error fetching poems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <PenLine className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">PoetVerse</span>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">My Poems</h1>
            <button
              onClick={() => navigate('/new-poem')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Poem
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : poems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">You haven't written any poems yet.</p>
              <p className="text-gray-500">Click the "New Poem" button to get started!</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {poems.map((poem) => (
                <div
                  key={poem.id}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {poem.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                      {poem.content}
                    </p>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:px-6">
                    <div className="text-sm text-gray-500">
                      {new Date(poem.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}