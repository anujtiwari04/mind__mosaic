import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import { ArrowRight, Brain, Activity, Heart, Sun, Coffee, Star, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGoogleGenAI } from '../Hooks/useGoogleGenAI';

interface Question {
  id: number;
  text: string;
  options: string[];
}

interface Answer {
  questionId: number;
  answer: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: 'How often do you engage in physical activities?',
    options: [
      'Daily',
      '4-6 times a week',
      '2-3 times a week',
      'Once a week',
      'Rarely',
    ],
  },
  {
    id: 2,
    text: 'How would you rate your sleep quality in the past week?',
    options: ['Excellent', 'Good', 'Fair', 'Poor', 'Very poor'],
  },
];

const quotes = [
  "A peaceful mind leads to a healthy body and a harmonious life. — Sadhguru",
  "You must be the change you wish to see in the world. — Mahatma Gandhi",
  "The mind is everything. What you think, you become. — Buddha",
  "Good health is not just about being disease-free. It is a state of complete physical, mental, and social well-being. — Dr. Harsh Vardhan",
  "A calm mind brings inner strength and self-confidence, so that's very important for good health. — Dalai Lama",
  "The greatest wealth is health. — Mahatma Gandhi",
  "To achieve great things, two things are needed: a plan and not quite enough time. — Dr. A.P.J. Abdul Kalam",
  "You have to dream before your dreams can come true. — Dr. A.P.J. Abdul Kalam"
];

const suggestionIcons = [Brain, Activity, Heart, Sun, Coffee, Star];

export default function Assessment() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [randomQuote, setRandomQuote] = useState('');
  const navigate = useNavigate();

  // Use the improved hook
  const { generateContent, isLoading, error } = useGoogleGenAI();

  useEffect(() => {
    if (isLoading) {
      setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }
  }, [isLoading]);

  const handleSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [
      ...answers,
      {
        questionId: questions[currentQuestionIndex].id,
        answer: selectedAnswer,
      },
    ];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setIsCompleted(true);
      handleSubmit(newAnswers);
    }
  };

  const generatePrompt = (submittedAnswers: Answer[]) => {
    let prompt = "You are a mental health expert. Based on the following questionnaire responses, generate EXACTLY 6 actionable suggestions for improving mental well-being.\n\n";
    
    prompt += "Questionnaire responses:\n";
    questions.forEach((q) => {
      const answer = submittedAnswers.find(a => a.questionId === q.id)?.answer;
      prompt += `- ${q.text}: ${answer}\n`;
    });
    
    prompt += "\nIMPORTANT INSTRUCTIONS:\n";
    prompt += "- Provide EXACTLY 6 suggestions, no more, no less\n";
    prompt += "- Each suggestion should be a complete, actionable sentence\n";
    prompt += "- Start each suggestion directly with the number (1., 2., 3., etc.)\n";
    prompt += "- Do NOT include any introductory text, headers, or concluding remarks\n";
    prompt += "- Do NOT include phrases like 'Here are suggestions' or 'Based on your responses'\n";
    prompt += "- Each suggestion should be brief but clear (aim for 10-20 words)\n";
    prompt += "- Do NOT include line numbers (e.g. '1.', '2.', etc.)\n";
    prompt += "- Focus on practical, implementable actions\n\n";
    prompt += "Format example:\n";
    prompt += "Establish a consistent sleep schedule every day, even on weekends.\n";
    prompt += "Create a relaxing bedtime routine to help your mind wind down.\n\n";
    prompt += "Now provide your 6 suggestions:";
    
    console.log("submited prompt:", prompt);
    return prompt;
  };

  const handleSubmit = async (submittedAnswers: Answer[]) => {
    try {
      const prompt = generatePrompt(submittedAnswers);
      const generatedText = await generateContent({ prompt });
      setResponse(generatedText);
    } catch (err) {
      console.error('Error generating suggestions:', err);
      setResponse('Error generating suggestions. Please try again.');
    }
  };

  const handleRetake = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setIsCompleted(false);
    setResponse(null);
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (isCompleted) {
    // Parse suggestions and filter to only include numbered lines
    const suggestions = response
      ?.split('\n')
      .map(line => line.trim())
      .filter(line => /^\d+\./.test(line)) // Only keep lines starting with a number and period
      .slice(0, 6) // Ensure max 6 suggestions
      || [];

    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 space-y-8 animate-fadeIn">
        <div className="max-w-6xl w-full text-center space-y-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Your Personalized Well-being Suggestions
          </h2>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
              <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <Quote className="w-8 h-8 text-emerald-500 mb-4 mx-auto" />
                <p className="text-lg text-gray-700 dark:text-gray-300 italic">
                  {randomQuote}
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto p-6 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <Button onClick={handleRetake} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {suggestions.map((suggestion, index) => {
                  const Icon = suggestionIcons[index % suggestionIcons.length];
                  return (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

                      <Icon className="w-12 h-12 mb-6 text-emerald-600 dark:text-emerald-400" />

                      <p className="text-lg text-gray-800 dark:text-white font-medium">
                        {suggestion}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center space-x-4 mt-8">
                <Button
                  onClick={handleRetake}
                  size="lg"
                  className="font-semibold"
                >
                  Retake Assessment
                </Button>
                <Button
                  onClick={() => navigate('/dashboard')}
                  size="lg"
                  className="font-semibold"
                >
                  Back to Dashboard
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8 animate-fadeIn">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-emerald-600 dark:bg-emerald-500 h-2.5 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>

        {/* Question Counter */}
        <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>

        {/* Question */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-8">
            {currentQuestion.text}
          </h2>

          {/* Options */}
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(option)}
                className={`w-full text-left p-4 rounded-xl
                         transition-all duration-200
                         hover:shadow-md hover:translate-x-1
                         ${selectedAnswer === option
                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-100'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                  }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className={`flex items-center space-x-2 ${selectedAnswer === null
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:translate-x-1'
                }`}
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}