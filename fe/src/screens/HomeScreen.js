import '../styles/HomeScreen.css'
import React, {useEffect} from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import bg from '../assets/bg.jpg'
import { useDispatch, useSelector } from 'react-redux'


export default function HomeScreen() {
  const location = useLocation()
    const redirect = location.search ? location.search.split('=')[1] : '/main'

    const userLogin = useSelector(state => state.userLogin)
    const { error, loading, userInfo } = userLogin
    const history = useNavigate()
    useEffect(() => {
        if (userInfo) {
            history(redirect)
        }
    }, [history, userInfo, redirect])


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