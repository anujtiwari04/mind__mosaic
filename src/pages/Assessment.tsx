import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import { ArrowRight, Brain, Activity, Heart, Sun, Coffee, Star, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  {
    id: 3,
    text: 'How often do you feel overwhelmed by your daily responsibilities?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
  },
  {
    id: 4,
    text: 'How would you describe your social connections and support system?',
    options: ['Very strong', 'Strong', 'Moderate', 'Weak', 'Very weak'],
  },
  {
    id: 5,
    text: 'How often do you experience difficulty concentrating?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
  },
  {
    id: 6,
    text: 'How would you rate your overall stress level?',
    options: ['Very low', 'Low', 'Moderate', 'High', 'Very high'],
  },
  {
    id: 7,
    text: 'How often do you engage in activities you enjoy?',
    options: ['Daily', 'Several times a week', 'Weekly', 'Monthly', 'Rarely'],
  },
  {
    id: 8,
    text: 'How would you rate your ability to manage your emotions?',
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
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [randomQuote, setRandomQuote] = useState('');
  const navigate = useNavigate();

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
      handleSubmit();
    }
  };

  const generatePrompt = () => {
    let prompt = "Based on the following mental health questionnaire responses, provide 6 concise, one-line suggestions for improving mental well-being:\n\n";
    questions.forEach((q, index) => {
      prompt += `${q.text}: ${answers.find(a => a.questionId === q.id)?.answer}\n`;
    });
    prompt += "\nPlease provide 6 brief, actionable suggestions, one per line:";
    return prompt;
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const apiKey = import.meta.env.VITE_API_KEY;
    const apiUrl = import.meta.env.VITE_API_URL;



    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: generatePrompt()
            }
          ]
        }
      ]
    };

    try {
      const response = await fetch(`${apiUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      setResponse(generatedText);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      setResponse('Error fetching data');
    } finally {
      setIsLoading(false);
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
    const suggestions = response?.split('\n').filter(line => line.trim()) || [];

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
                  // variant="secondary"
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