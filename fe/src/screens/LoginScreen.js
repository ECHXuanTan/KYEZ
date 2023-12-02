import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { login } from '../actions/userActions'
import FormContainer from '../components/FormContainer'

function LoginScreen() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()
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

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email, password))
    }

    return (
        <FormContainer>
            <h1>Đăng nhập</h1>
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>

                <Form.Group controlId='email'>
                    <Form.Label>Địa chỉ Email</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>


                <Form.Group controlId='password'>
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary'>
                    Đăng nhập
                </Button>
            </Form>

            <Row className='py-3'>
                <Col>
                    Khách hàng mới? <Link
                        to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                        Hãy đăng ký ngay
                        </Link>
                </Col>
            </Row>

        </FormContainer>
    )
}

export default LoginScreen