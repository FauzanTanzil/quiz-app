import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Question from './Question';

function Quiz() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(300); // 5 menit
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        axios.get('https://opentdb.com/api.php?amount=10')
            .then(res => {
                const fetchedQuestions = res.data.results.map(q => ({
                    question: q.question,
                    options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
                    correct: q.correct_answer
                }));
                setQuestions(fetchedQuestions);
            });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev > 0) return prev - 1;
                setFinished(true);
                clearInterval(interval);
                return 0;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleAnswer = (answer) => {
        if (answer === questions[currentQuestionIndex].correct) {
            setScore(prev => prev + 1);
        }
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setFinished(true);
        }
    };

    useEffect(() => {
        const saveState = () => {
            const state = {
                currentQuestionIndex,
                score,
                timer,
                finished,
                questions
            };
            localStorage.setItem('quizState', JSON.stringify(state));
        };
        window.addEventListener('beforeunload', saveState);
        return () => {
            window.removeEventListener('beforeunload', saveState);
        };
    }, [currentQuestionIndex, score, timer, finished, questions]);

    useEffect(() => {
        const savedState = localStorage.getItem('quizState');
        if (savedState) {
            const state = JSON.parse(savedState);
            setCurrentQuestionIndex(state.currentQuestionIndex);
            setScore(state.score);
            setTimer(state.timer);
            setFinished(state.finished);
            setQuestions(state.questions);
        }
    }, []);

    if (finished) {
        return (
            <div>
                <h1>Quiz Finished</h1>
                <p>Your Score: {score}/{questions.length}</p>
            </div>
        );
    }

    if (questions.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Quiz</h1>
            <p>Time Remaining: {timer} seconds</p>
            <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
            <Question 
                question={questions[currentQuestionIndex].question} 
                options={questions[currentQuestionIndex].options} 
                onAnswer={handleAnswer} 
            />
        </div>
    );
}

export default Quiz;
