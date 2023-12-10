import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (username && password) {
        login(username, password);
        setTimeout(() => {
          navigate("/dashboard")
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row>
        <Col>
          <h1 className="text-center mb-4">Todo Account Login</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>Email Id</Form.Label>
              <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter Email Id" required />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" required />
            </Form.Group>
            <P>Try only this credentials: Email Id: user@gmail.com, password: password</P>
            <Button variant="primary" type="submit" className="w-100 mt-3">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
