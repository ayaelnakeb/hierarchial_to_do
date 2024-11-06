import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NewTaskPage from './pages/NewTaskPage';
import Header from './components/Header';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './pages/SignUpPage';
import Login from './pages/LoginPage';
import NewListPage from './pages/NewListPage';
import './App.css';

const App = () => {
  return (
    <Router>
      <Container>
        <Header />
        <Routes>
          <Route path="/" exact element={<HomePage />} />
          <Route path="/new-task/:listId" element={<NewTaskPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/new-list" element={<NewListPage />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
