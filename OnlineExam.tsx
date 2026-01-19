import React, { useState, useEffect } from "react";

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

export default function OnlineExam() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // API call simulation
    setQuestions([
      {
        id: 1,
        question: "React ka latest version kya hai?",
        options: ["17", "18", "16", "15"],
        answer: "18",
      },
      {
        id: 2,
        question: "TypeScript ka full form kya hai?",
        options: [
          "Typed Script",
          "Technical Script",
          "Type Safe Script",
          "TypeScript",
        ],
        answer: "TypeScript",
      },
    ]);
  }, []);

  const handleAnswer = (option: string) => {
    if (option === questions[current].answer) setScore(score + 1);
    setCurrent(current + 1);
  };

  if (current >= questions.length)
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold">Exam Completed!</h2>
        <p className="mt-2">Your Score: {score}/{questions.length}</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">
        Q{current + 1}: {questions[current]?.question}
      </h2>
      <ul>
        {questions[current]?.options.map((opt) => (
          <li key={opt}>
            <button
              onClick={() => handleAnswer(opt)}
              className="w-full text-left p-3 m-1 border rounded hover:bg-blue-100"
            >
              {opt}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}