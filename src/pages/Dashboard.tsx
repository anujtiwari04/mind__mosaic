import React from 'react';
import { Brain, MessageSquare, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const features = [
    {
      icon: Brain,
      title: 'AI Assessment',
      description: 'Get a personalized mental health assessment using our advanced AI technology.',
      color: 'from-blue-500 to-cyan-400',
      link: '/assessment'
    },
    {
      icon: MessageSquare,
      title: 'AI Support Chat',
      description: 'Chat with our empathetic AI assistant for 24/7 emotional support.',
      color: 'from-emerald-500 to-teal-400',
      link: '/chat'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Connect with others, share experiences, and find support in our caring community.',
      color: 'from-purple-500 to-indigo-400',
      link: '/community'
    }
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 animate-fadeIn">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          How would you like to begin?
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Choose from our three main features to start your wellness journey
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full h-100 pb-10">
        {features.map((feature) => (
          <Link
            key={feature.title}
            to={feature.link}
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 px-8 py-8 h-80 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            
            <feature.icon className="w-12 h-12 mb-6 text-gray-800 dark:text-white" />
            
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              {feature.title}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {feature.description}
            </p>
            
            <div className="absolute bottom-5 left-8 right-8">
              <div className="bg-gray-100  dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-full text-center group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-teal-400 group-hover:text-white transition-all duration-300">
                Get Started
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}