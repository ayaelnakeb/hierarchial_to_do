import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const goToNewList = () => {
    navigate('/new-list');
  };

  return (
    <Navbar bg="light" expand="lg" className="Header-brand" style={{ padding: '10px 20px' }}>
      <Container>
        <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '1.5rem', color: '#8B4513' }}>
          To Do Lists
        </Navbar.Brand>
        {isLoggedIn && (
          <Nav className="ml-auto">
            {/* Removed the Home button */}
            <Button variant="outline-success" onClick={goToNewList} className="me-2">New List</Button>
            <Button variant="outline-danger" onClick={logout}>Logout</Button>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
}
