import React from 'react';
import { ArrowRight, Brain, Users, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="space-y-16 animate-fadeIn">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-16">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white">
          Welcome to <span className="text-emerald-600 dark:text-emerald-400">MindMosaic</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Your personalized mental wellness companion. Begin your journey to emotional well-being with AI-powered support and a caring community.
        </p>
        <Button 
          size="lg" 
          className="animate-bounce"
          onClick={() => navigate('/dashboard')}
        >
          Get Started <ArrowRight className="ml-2 h-5 w-5 inline" />
        </Button>
        
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
          <Brain className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">AI Assessment</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Get personalized insights about your mental well-being through our advanced AI analysis.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
          <MessageSquare className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">24/7 AI Support</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Chat with our empathetic AI assistant anytime, anywhere. We're here to listen and support.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
          <Users className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Community Support</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Connect with others on similar journeys. Share experiences and find strength in community.
          </p>
        </div>
      </section>

      {/* Background Image Section */}
      <section 
        className="relative h-96 rounded-2xl overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-emerald-900/40 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h2 className="text-4xl font-bold mb-4">Start Your Journey Today</h2>
            <p className="text-xl mb-8">Take the first step towards better mental health</p>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/dashboard')}
            >
              Begin Assessment
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}