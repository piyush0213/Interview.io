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
import "./Quiz.scss";
import { useStore } from "../store/store.js";
const API_URL = import.meta.env.VITE_API_URL;

const Quiz = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [quizID, setQuizID] = useState(useParams().id);
  const { user } = useStore();
  const userID = user._id;
  const [techstack, setTechstack] = useState("");
  const [qty, setQty] = useState(1);
  const [difficulty, setDifficulty] = useState("");
  const [questions, setQuestions] = useState("");
  const [qsRemaining, setQsRemaining] = useState(0);
  const [ogResponse, setOgResponse] = useState("");
  const [qs, setQs] = useState("");
  const [codeQs, setCodeQs] = useState("");
  const [options, setOptions] = useState([]);
  const [status, setStatus] = useState("");
  const [optionsCode, setOptionsCode] = useState(false);

  const [score, setScore] = useState(""); 
  const [qsNo, setQsNo] = useState(
    JSON.parse(localStorage.getItem("quizDetails") || {}).qsNo || 1
  );
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [resultsModal, setResultsModal] = useState(false);

  useEffect(() => {
    setOptionsCode(false);
    setCodeQs("");
    setOptions([]);
    setOptionsCode(false);
    setSelectedAnswer(null);
    setSelectedIndex(null);
    setOgResponse("");
    setQs("");
    setResultsModal(false);

    const fetchQuestions = async () => {
      setIsLoading(true);
        try {
          const { difficulty, qty, quizID, techstack, status } = JSON.parse(localStorage.getItem('quizDetails') || {});
            const response = await axios.post(`${API_URL}/api/v1/quiz/generate-quiz`, {
                techstack,
                difficulty,
                userID,
                quizID,
                qty,
                qsNo,

            });
            setQsRemaining(qty - qsNo);
            localStorage.setItem('quizDetails', JSON.stringify({difficulty, qty, quizID,qsNo, techstack, status, qsRemaining}));
            setTechstack(techstack);
            setQty(qty);
            setDifficulty(difficulty);
            setStatus(status);
            setQuizID(quizID);
            if(response.data.hasMoreQuestions === false){
              console.log("No more questions");
              handleEvaluate();
              setOptionsCode(false);
              setCodeQs("");
              setOptions([]);
              setOptionsCode(false);
              setSelectedAnswer(null);
              setOgResponse("");
              setQs("");
              setIsLoading(false);
              navigate(`/results/${quizID}`);
            }
            console.log(response.data.question);
            setOgResponse(response.data.question);
            console.log(response.data.question.question);
            setQs(response.data.question.question);
            if(response.data.question.code_snippet){
            console.log(response.data.question.code_snippet);
            setCodeQs(response.data.question.code_snippet);
            }
            else{
                setCodeQs('');
            }
            console.log(response.data.question.options);
            setOptions(response.data.question.options);
            if(response.data.question.options_code){
            setOptionsCode(true);
            console.log(response.data.question.options_code);
            setOptions(response.data.question.options_code);
            }
            setIsLoading(false);
            // setQuestions(content);
        } catch (error) {
            console.error('Error fetching questions:', error);
            setIsLoading(false);
        }
    };
    fetchQuestions();
    }, [qsNo]);


  const handleNext = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/v1/quiz/save-answer`,{selectedAnswer, selectedIndex, quizID});
      setOptionsCode(false);
      setCodeQs("");
      setOptions([]);
      setOptionsCode(false);
      setSelectedAnswer(null);
      setOgResponse("");
      setQs("");
      setQsNo(qsNo + 1);
      localStorage.setItem('quizDetails', JSON.stringify({difficulty, qty, quizID, techstack, status, qsRemaining}));
    } catch (error) {
      console.error("Error in handling next:", error);
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedAnswer(option);
    setSelectedIndex(options.indexOf(option));
    console.log("Selected Option:", selectedAnswer);
    console.log("Selected Answer:", selectedIndex);
    console.log("Correct Answer:", ogResponse.correctIndex);
    console.log(
      "Correct?:", 
      selectedIndex === ogResponse.correctIndex
    )

    // const updatedAnswers = [...userAnswers];
    // updatedAnswers[qsNo - 1] = option;
    // setUserAnswers(updatedAnswers);
    // localStorage.setItem("userAnswers", JSON.stringify(updatedAnswers));

    // if (qsNo < qty) {
    //   setQsNo(qsNo + 1);
    // } else {
    //   // Show "Evaluate Answers" button
    //   document.getElementById("evaluate-button").style.display = "block";
    // }
  };


  const handleEvaluate = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/quiz/evaluate-answer`, {
        userID,
        quizID
      });
      setScore(response.data.score);
      setResultsModal(true);
      // console.log('Your Score:', score);
      const quizDetails = JSON.parse(localStorage.getItem('quizDetails'));
      quizDetails.status = 'Completed';
      localStorage.setItem('quizDetails', JSON.stringify(quizDetails));
      // navigate(`/result/${quizID}`);
    } catch (error) {
      console.error("Error evaluating answers:", error);
    }
  };

  return (
    <div className="main-container">
      <Sidebar />
      
      <div className="main-content">
        <h1>Interview Quiz(AI-Based)</h1>

        <div className="quiz ml-4 mt-4">
        {isLoading ? <span className="loader-qs mt-20"></span> : (

          <form className="input-fields" onSubmit={handleNext}>
          <div className="questions font-semibold text-xl mb-2">

            <p>{qsNo}) {qs}</p>
            {codeQs && (
              <SyntaxHighlighter
                language={techstack}
                style={github}
                showLineNumbers={true}
              >
                {codeQs}
              </SyntaxHighlighter>
            )}
          </div>
          <div className="options-container ">
            {options.map((option, index) => {
              if (optionsCode) {
                return (
                  <div key={index} className="options flex items-center">
                    <input
                      type="radio"
                      id={index}
                      name="options"
                      value={option}
                      className="mb-1.5 mr-4"
                      onChange={() => handleOptionSelect(option)}
                      checked={selectedAnswer === option}
                    />
                    <label htmlFor={index}>
                      <SyntaxHighlighter
                        language={techstack}
                        style={github}
                      >
                        {option}
                      </SyntaxHighlighter>
                    </label>
                  </div>
                );
              } else {
                return (
                  <div key={index} className="options font-semibold text-base">
                    <input
                      type="radio"
                      id={index}
                      name="options"
                      value={option}
                      className="mr-2"
                      required
                      onChange={() => handleOptionSelect(option)}
                      checked={selectedAnswer === option}
                    />
                    <label htmlFor={index}>{option}</label>
                  </div>
                );
              }
            })}
          </div>
          <button
            id="next-button"
            className="next mt-4 p-8"
            type="submit"
          >
            Next
          </button>
            </form>
        )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
