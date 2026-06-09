import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';

function Greeting() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [draftCount, setDraftCount] = useState(null);

  useEffect(() => {
    apiClient
      .get('/posts/?status=draft')
      .then((res) => setDraftCount(res.data.count))
      .catch(() => setDraftCount(0));
  }, []);

  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

  return (
    <div className="mb-12 p-7 sm:p-8 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 shadow-sm">
      <div className="flex-1">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight mb-1">
          Hey, <em className="text-amber-700 not-italic font-bold">{user.username}</em>{' '}
          <span className="inline-block">👋</span>
        </h2>
        <p className="text-sm sm:text-base text-amber-900/80">
          {draftCount === null ? (
            <>Good {timeOfDay}. Ready to write?</>
          ) : draftCount > 0 ? (
            <>
              Good {timeOfDay}. You have <strong>{draftCount} draft{draftCount === 1 ? '' : 's'}</strong> waiting for you.
            </>
          ) : (
            <>Good {timeOfDay}. The page is blank — what's on your mind?</>
          )}
        </p>
      </div>
      <button
        onClick={() => navigate('/posts/new')}
        className="bg-stone-900 hover:bg-stone-800 text-white font-medium py-3 px-6 rounded-full transition-all hover:-translate-y-0.5 shadow-sm flex items-center gap-2 whitespace-nowrap"
      >
        <span>✎</span>
        <span>Write something</span>
      </button>
    </div>
  );
}

export default Greeting;