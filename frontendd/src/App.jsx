import React from 'react'
import {useState, useEffect} from 'react';
import LoginForm from './components/LoginFrom';
import Home from './components/Home';
import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  const [isLogedIn, setIsLogedIn] = useState(false);
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     setIsLogedIn(true);
  //   }
  // }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={isLogedIn?<Navigate to="/home"/>:<Navigate to="/login"/>} />
        <Route path="/login" element={<LoginForm setIsLoggedIn={setIsLogedIn}/>} />
        <Route path="/home" element={<Home/>} />
      </Routes>
    </Router>
  )
}

export default App
