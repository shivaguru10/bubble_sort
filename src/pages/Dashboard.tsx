import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gamepad2, Route, Clock, Trophy } from 'lucide-react';
import { AccentureLogo } from '../components/AccentureLogo';

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
      window.open(game.path, '_self');
    } else {
      navigate(game.path);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-black text-white relative overflow-hidden font-sans">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/3 -translate-y-1/4 pointer-events-none blur-3xl">
        <AccentureLogo className="w-[800px] h-[800px] text-purple-600" />
      </div>
      <div className="absolute bottom-0 left-0 opacity-10 transform -translate-x-1/3 translate-y-1/4 pointer-events-none blur-3xl">
        <div className="w-[600px] h-[600px] bg-blue-600 rounded-full" />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-black/20">
        <button 
          onClick={() => navigate('/')}
          className="group flex items-center gap-1 sm:gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <div className="p-1.5 sm:p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="font-medium text-sm sm:text-base hidden sm:inline">Back to Home</span>
        </button>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <AccentureLogo className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-bold tracking-tight">Accenture</h1>
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider hidden sm:block">Assessment Practice</p>
            </div>
          </div>
        </div>
        <div className="w-10 sm:w-40"></div> {/* Spacer */}
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-12 relative z-10">
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">Accenture Assessment Games</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base px-2">
            Practice these cognitive games to prepare for Accenture's online assessment. 
            Each game tests different skills like pattern recognition and logical thinking.
          </p>
        </div>

        {/* Game Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {games.map((game) => (
            <div
              key={game.id}
              onClick={() => handleGameClick(game)}
              className={`group relative bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-1 border border-white/10 transition-all duration-300 cursor-pointer hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="relative h-full p-4 sm:p-8 rounded-[14px] sm:rounded-[22px] bg-slate-950/50 flex flex-col">
                <div className="flex justify-between items-start mb-3 sm:mb-6">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${game.color} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    <game.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-white/5 border border-white/10 ${game.difficulty === 'Hard' ? 'text-orange-400' : 'text-blue-400'}`}>
                    {game.difficulty}
                  </div>
                </div>
                
                <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-3 group-hover:text-purple-400 transition-colors">{game.title}</h3>
                <p className="text-gray-400 mb-4 sm:mb-8 leading-relaxed line-clamp-2 text-sm sm:text-base">{game.description}</p>
                
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400 text-xs sm:text-sm">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{game.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-black rounded-lg font-semibold text-xs sm:text-sm sm:opacity-0 sm:transform sm:translate-x-4 sm:group-hover:opacity-100 sm:group-hover:translate-x-0 transition-all duration-300">
                    Play Now
                    <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 rotate-180" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-8 sm:mt-16 text-center px-2">
          <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full text-purple-200 text-xs sm:text-sm backdrop-blur-sm shadow-lg shadow-purple-900/20">
             <div className="w-4 h-4 sm:w-5 sm:h-5 bg-purple-500 rounded-full flex items-center justify-center animate-pulse flex-shrink-0">
                <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
             </div>
            <span>Complete both games to unlock full practice report</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
