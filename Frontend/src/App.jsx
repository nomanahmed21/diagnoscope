import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './components/Home'
import AuthForm from './components/AuthForm'
import { BrowserRouter, createBrowserRouter } from 'react-router-dom'



function App() {
  return (
    <Home/>
  )
}

export default App
