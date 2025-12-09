import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, TrendingUp, Calendar } from 'lucide-react';

const BeginJourneySection = () => {
  const navigate = useNavigate();

  const handleBecomeMember = () => {
    navigate('/upgrade');
  };

  const stats = [
    {
      icon: Users,
      label: "Over 1 million subscribers",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: Calendar,
      label: "since 2020",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      label: "growth in all areas",
      color: "from-pink-500 to-orange-500"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6 max-w-6xl">

        {/* Main Content */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Begin your journey today
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-10 leading-relaxed">
            Unlock your fullest potential in any field with only 20-minutes a day of invaluable coaching from the world's best
          </p>

          {/* Become a Member Button */}
          <button
            onClick={handleBecomeMember}
            className="inline-flex items-center justify-center gap-3 h-16 px-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg transition-all shadow-lg hover:shadow-2xl hover:scale-105 group"
          >
            Become a Member
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center">
                <div className={`flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${stat.color} mb-4 shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Programs Description */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
            100+ of the world's top programs for personal growth and transformation
          </h3>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Forge lasting transformations in your mind, body, soul, love and career with 20-minute micro-coaching sessions each day led by top-tier teachers worldwide.
          </p>

          {/* Founder/CEO Mention */}
          <div className="pt-8 border-t border-gray-200 mt-8">
            <p className="text-gray-500 italic">
              — Vishen
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default BeginJourneySection;
