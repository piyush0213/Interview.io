import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { github } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { base16AteliersulphurpoolLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import Sidebar from "../components/Sidebar.jsx";
import "./Results.scss";
import { useStore } from "../store/store.js";
const API_URL = import.meta.env.VITE_API_URL;

const Results = () => {
  const navigate = useNavigate();
  const [quizID, setQuizID] = useState(useParams().id);
  const { user } = useStore();
  const userID = user._id;
  const [techstack, setTechstack] = useState("");
  const [qty, setQty] = useState(1);
  const [difficulty, setDifficulty] = useState("");

  const [qs, setQs] = useState("");
  const [codeQs, setCodeQs] = useState("");
  const [options, setOptions] = useState([]);
  const [status, setStatus] = useState("");
  const [optionsCode, setOptionsCode] = useState(false);

  const [answer, setAnswer] = useState(""); 
  const [qsNo, setQsNo] = useState(1);
  const [score , setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [correctAnswers , setCorrectAnswers] = useState([]);
  const [chosenAnswers , setChosenAnswers] = useState([]);

  useEffect(() => {
    setOptionsCode(false);
    setCodeQs("");
    setOptions([]);
    setOptionsCode(false);
    setQsNo(1);

    const fetchResults = async () => {
        try {
          const { difficulty, qty, quizID, techstack, status } = JSON.parse(localStorage.getItem('quizDetails') || {});
          // const handleEvaluate = async () => {
          //   try {
          //     const response = await axios.post(`${API_URL}/api/v1/quiz/evaluate-answer`, {
          //       userID,
          //       quizID
          //     });
          //     setScore(response.data.score);
          //     // console.log('Your Score:', score);
          //     const quizDetails = JSON.parse(localStorage.getItem('quizDetails'));
          //     quizDetails.status = 'Completed';
          //     localStorage.setItem('quizDetails', JSON.stringify(quizDetails));
          //     // navigate(`/result/${quizID}`);
          //   } catch (error) {
          //     console.error("Error evaluating answers:", error);
          //   }
          // };
            const response = await axios.post(`${API_URL}/api/v1/quiz/evaluate-answer`, {
              userID,
              quizID
            });
            console.log(response.data.quiz);
            setScore(response.data.quiz.score);
            console.log(response.data.quiz.questions);
            setQuestions(response.data.quiz.questions);
            setQty(response.data.quiz.qty)
            console.log(response.data.quiz.correct_answers);
            setCorrectAnswers(response.data.quiz.correct_answers);
            console.log(response.data.quiz.chosen_answers);
            setChosenAnswers(response.data.quiz.chosen_answers);
            console.log(response.data.quiz.questions[0]);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };
    fetchResults();
    }, []);


  return (
    <div className="main-container">
      <Sidebar />
      <div className="main-content">
        <h1>Interview Quiz(AI-Based)</h1>
        <h2 className="justify-self-end text-3xl font-bold">Score: {score} / {qty}</h2>
        <h3 className="text-3xl font-bold">Your Responses:</h3>
        <div className="results ml-4 mt-4">
          {questions.map((question, index) => {
            return (<>
            <div key={index} className="questions font-semibold text-xl mb-2">
              <p>{index+1}) {question.question}</p>
              {question.code_snippet && (
                <SyntaxHighlighter
                  language={techstack}
                  style={github}
                  showLineNumbers={true}
                >
                  {question.code_snippet}
                </SyntaxHighlighter>
              )}
            </div>
            <div className="options-container">
              {question.options_code ? 
                   (<>
                    <div key={index+"-Correct"} className="options flex items-center">
                      <div
                        className="mb-1.5 mr-4"
                        /><strong className="text-lg">Correct Answer: </strong>
                        <SyntaxHighlighter
                          language={techstack}
                          style={github}
                          >
                          {correctAnswers[index]}
                        </SyntaxHighlighter>
                      
                    </div>
                    <div key={index+"-User"} className="options flex items-center">
                      <div
                        className="mb-1.5 mr-4"
                        /><strong className="text-lg">Your Answer: </strong>
                        <SyntaxHighlighter
                          language={techstack}
                          style={github}
                          >
                          {chosenAnswers[index] || "No Answer Chosen/Skipped"}
                        </SyntaxHighlighter>
                    </div>
                    </>


                  )
                 : (
                <>
                  <div key={index+"-Correct"} className="options flex items-center">
                    <div
                      className="mb-1.5 mr-4"
                      />
                      <p className="text-lg"><strong>Correct Answer: </strong> {correctAnswers[index]}</p>
                    
                  </div>
                  <div key={index+"-User"} className="options flex items-center">
                    <div
                      className="mb-1.5 mr-4"
                      />
                      <p className="text-lg"><strong>Your Answer: </strong> {chosenAnswers[index] || "No Answer Chosen/Skipped"}</p>
                  </div>
                  </>
                 )}
              </div>
            </>
          )})}
          </div>
      </div>
    </div>
  );
};

export default Results;
