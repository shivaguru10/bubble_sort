import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Users } from 'lucide-react';
import { AccentureLogo } from '../components/AccentureLogo';
import { CognizantLogo } from '../components/CognizantLogo';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
        
        <nav className="relative z-10 flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold hidden sm:block">Mock Test Hub</span>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="#companies" 
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition"
            >
              Get Started
            </a>
          </div>
        </nav>

        <div className="relative z-10 flex flex-col items-center justify-center py-20 sm:py-32 px-6 sm:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
            Practice Mock Tests
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mb-6 sm:mb-8 leading-relaxed">
            Prepare for your dream company's assessment with our interactive practice games. 
            Master pattern recognition, logical thinking, and problem-solving skills.
          </p>
          <div className="flex gap-4">
            <a 
              href="#companies"
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:opacity-90 transition flex items-center gap-2 text-sm sm:text-base"
            >
              Explore Companies <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* Companies Section */}
      <section id="companies" className="py-20 px-8">
        <h2 className="text-4xl font-bold text-center mb-12">Choose Your Company</h2>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Accenture Card */}
          <div 
            onClick={() => navigate('/dashboard/accenture')}
            className="group relative bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-8 border border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden"
          >
            {/* Background Logo Decoration */}
            <div className="absolute -right-8 -bottom-8 opacity-10 transform rotate-[-10deg] group-hover:scale-110 transition-transform duration-500">
               <AccentureLogo className="w-48 h-48" />
            </div>

            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition relative z-10">
              <AccentureLogo className="w-10 h-10" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Accenture</h3>
              <p className="text-gray-300 mb-4">Practice cognitive ability assessment games used in Accenture hiring.</p>
              <div className="flex items-center text-purple-400 font-semibold">
                Start Practice <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition" />
              </div>
            </div>
            <div className="absolute top-4 right-4 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full z-10">
              2 Games
            </div>
          </div>

          {/* TCS Card (Coming Soon) */}
          <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/30 opacity-60">
            <div className="w-16 h-16 bg-gray-700 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-2">TCS</h3>
            <p className="text-gray-500 mb-4">TCS NQT practice tests coming soon.</p>
            <div className="absolute top-4 right-4 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
              Coming Soon
            </div>
          </div>

          {/* Cognizant Card (Coming Soon) */}
          <div className="relative bg-gradient-to-br from-blue-900/50 to-slate-900/50 rounded-2xl p-8 border border-blue-800/30 opacity-60">
            <div className="w-16 h-16 bg-blue-900/50 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20">
              <CognizantLogo className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-blue-100">Cognizant</h3>
            <p className="text-blue-200/60 mb-4">Cognizant assessment practice coming soon.</p>
            <div className="absolute top-4 right-4 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
              Coming Soon
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-8 text-center text-gray-500">
        <p>© 2024 Mock Test Hub. Practice makes perfect.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
