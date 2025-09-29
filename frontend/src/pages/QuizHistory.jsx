import React, { useEffect, useState } from "react";

function QuizHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("/api/quiz/history", { credentials: "include" })
      .then(res => res.json())
      .then(data => setHistory(data));
  }, []);

  return (
    <div>
      <h1>My Quiz History</h1>
      <ul>
        {history.map((quiz, i) => (
          <li key={i}>
            {quiz.createdAt} – Score: {quiz.score}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuizHistory;
