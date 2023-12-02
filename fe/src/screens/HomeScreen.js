import '../styles/HomeScreen.css'
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import bg from '../assets/bg.jpg'

export default function HomeScreen() {
  return(
    // <div className="home-screen" style={{ backgroundImage: `url(${bg})` }}>
    <Container fluid className="my-4">
      <Row className="align-items-center">
        <Col md={5}>
          <h1>KOUYV EZ</h1>
          <p className="lead">
            
          </p>
          <Link to='/register'>
          <Button variant="primary" size="lg">
            Bắt đầu ôn luyện ngay
          </Button>
          </Link>
          <span className="mr-2"></span> 
        </Col>
        
      </Row>
    </Container>
    // </div>
  );
}