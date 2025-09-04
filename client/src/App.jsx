import { useState } from 'react';
import Register from './pages/Register.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddDoc from './pages/AddDoc.jsx';
import EditDoc from './pages/EditDocs.jsx';
import SearchPage from './pages/SearchPage.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
   <BrowserRouter>
   <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-doc" element={<AddDoc />} />
        <Route path="/edit/:id" element={<EditDoc />} />
        <Route path='/search' element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
