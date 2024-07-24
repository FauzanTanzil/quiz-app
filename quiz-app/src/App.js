import React, { useState } from 'react';
import Login from './components/Login';
import Quiz from './components/Quiz';
import './App.css';

function App() {
    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <div className="App">
            {!loggedIn ? (
                <Login setLoggedIn={setLoggedIn} />
            ) : (
                <Quiz />
            )}
        </div>
    );
}

export default App;
