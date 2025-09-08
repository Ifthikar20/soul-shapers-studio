// src/components/VideoModal/tabs/PracticeTab.tsx
import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PracticeQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface PracticeTabProps {
  questions: PracticeQuestion[];
}

export const PracticeTab = ({ questions }: PracticeTabProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [showResults, setShowResults] = useState(false);

  // Default questions if none provided from API
  const defaultQuestions: PracticeQuestion[] = [
    {
      id: 1,
      question: "What is the primary benefit of mindfulness practice?",
      options: ["Increased productivity", "Better sleep", "Present moment awareness", "Weight loss"],
      correctAnswer: 2
    },
    {
      id: 2,
      question: "How often should you practice wellness techniques for best results?",
      options: ["Once a week", "Daily", "Only when stressed", "Monthly"],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Which strategy is most effective for building emotional resilience?",
      options: ["Avoiding difficult emotions", "Regular self-reflection", "Working longer hours", "Ignoring stress"],
      correctAnswer: 1
    }
  ];

  const questionsToRender = questions.length > 0 ? questions : defaultQuestions;

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleQuizReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
        <h3 className="text-xl font-bold text-white mb-4">Test Your Knowledge</h3>
        <p className="text-zinc-400 mb-6">Answer these questions to reinforce your learning</p>
        
        {questionsToRender.map((q, index) => (
          <div key={q.id} className="mb-8 pb-8 border-b border-zinc-800 last:border-0">
            <h4 className="text-white font-semibold mb-4">
              Question {index + 1}: {q.question}
            </h4>
            <div className="space-y-3">
              {q.options.map((option, optionIndex) => (
                <label
                  key={optionIndex}
                  className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedAnswers[q.id] === optionIndex
                      ? 'bg-purple-900/30 border-purple-500'
                      : 'bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    className="mr-3"
                    checked={selectedAnswers[q.id] === optionIndex}
                    onChange={() => handleAnswerSelect(q.id, optionIndex)}
                  />
                  <span className="text-white">{option}</span>
                  {showResults && q.correctAnswer === optionIndex && (
                    <Check className="w-5 h-5 text-green-500 ml-auto" />
                  )}
                  {showResults && selectedAnswers[q.id] === optionIndex && q.correctAnswer !== optionIndex && (
                    <X className="w-5 h-5 text-red-500 ml-auto" />
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}
        
        <div className="flex gap-4">
          <Button 
            onClick={() => setShowResults(!showResults)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {showResults ? 'Hide Results' : 'Check Answers'}
          </Button>
          {showResults && (
            <Button 
              onClick={handleQuizReset}
              variant="outline"
              className="border-zinc-700 text-white hover:bg-zinc-800"
            >
              Reset Quiz
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};