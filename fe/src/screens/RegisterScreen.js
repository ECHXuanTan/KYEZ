import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { register } from '../actions/userActions'

function RegisterScreen() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()
    const location = useLocation()
    const redirect = location.search ? location.search.split('=')[1] : '/main'

    const userRegister = useSelector(state => state.userRegister)
    const { error, loading, userInfo } = userRegister
    const history = useNavigate()
    useEffect(() => {
        if (userInfo) {
            history(redirect)
        }
    }, [history, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setMessage('Passwords do not match')
        } else {
            dispatch(register(name, email, password))
        }

    }

    return (
        <FormContainer>
            <h1>Đăng ký</h1>
            {message && <Message variant='danger'>{message}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>

                <Form.Group controlId='name'>
                    <Form.Label>Tên khách hàng</Form.Label>
                    <Form.Control
                        required
                        type='name'
                        placeholder='Hãy nhập họ và tên'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='email'>
                    <Form.Label>Địa chỉ email</Form.Label>
                    <Form.Control
                        required
                        type='email'
                        placeholder='Hãy nhập email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='password'>
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control
                        required
                        type='password'
                        placeholder='Hãy nhập mật khẩu'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='passwordConfirm'>
                    <Form.Label>Xác nhận mật khẩu</Form.Label>
                    <Form.Control
                        required
                        type='password'
                        placeholder='Xác nhận mật khẩu'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary'>
                    Đăng ký
                </Button>

            </Form>

            <Row className='py-3'>
                <Col>
                    Bạn đã có tài khoản? <Link
                        to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                        Hãy đăng nhập
                        </Link>
                </Col>
            </Row>
        </FormContainer >
    )
}

export default RegisterScreen
