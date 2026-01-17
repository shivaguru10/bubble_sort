import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gamepad2, Route, Clock, Trophy } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: 'bubbles',
      title: 'Bubble Sort Game',
      description: 'Sort the bubbles in ascending order by clicking on them. Test your pattern recognition skills!',
      icon: Gamepad2,
      color: 'from-blue-600 to-cyan-600',
      borderColor: 'border-blue-500/30 hover:border-blue-400',
      difficulty: 'Medium',
      time: '5 min',
      path: '/bubble_sort/bubble/index.html',
      isExternal: true, // Original HTML game
    },
    {
      id: 'path',
      title: 'Path Flow Puzzle',
      description: 'Connect the path from IN to OUT by rotating and flipping tiles. Test your spatial reasoning skills!',
      icon: Route,
      color: 'from-purple-600 to-pink-600',
      borderColor: 'border-purple-500/30 hover:border-purple-400',
      difficulty: 'Hard',
      time: '4 min',
      path: '/game/path',
      isExternal: false,
    },
  ];

  const handleGameClick = (game: typeof games[0]) => {
    if (game.isExternal) {
      window.location.href = game.path;
    } else {
      navigate(game.path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-gray-800">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Accenture</h1>
            <p className="text-xs text-gray-400">Assessment Practice</p>
          </div>
        </div>
        <div className="w-24"></div> {/* Spacer */}
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Accenture Assessment Games</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Practice these cognitive games to prepare for Accenture's online assessment. 
            Each game tests different skills like pattern recognition and logical thinking.
          </p>
        </div>

        {/* Game Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map((game) => (
            <div
              key={game.id}
              onClick={() => handleGameClick(game)}
              className={`group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border ${game.borderColor} transition-all cursor-pointer hover:scale-105 hover:shadow-2xl`}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${game.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition`}>
                <game.icon className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-bold mb-3">{game.title}</h3>
              <p className="text-gray-400 mb-6">{game.description}</p>
              
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-yellow-400">
                  <Trophy className="w-4 h-4" />
                  {game.difficulty}
                </span>
                <span className="flex items-center gap-1 text-blue-400">
                  <Clock className="w-4 h-4" />
                  {game.time}
                </span>
              </div>

              <div className="absolute bottom-4 right-4 px-4 py-2 bg-white/10 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition">
                Play Now →
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full text-purple-300 text-sm">
            <Clock className="w-4 h-4" />
            Complete both games to unlock full practice report
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
