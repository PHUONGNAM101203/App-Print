// src/App.js
import React from 'react';
import './App.css';
import AppNavbar from './components/Navbar';
import AppBody from './components/Body';
import AppFooter from './components/Footer';

function App() {
    return (
        <div className="app">
            <AppNavbar />
            <AppBody />
            <AppFooter />
        </div>  
    );
}

export default App;
