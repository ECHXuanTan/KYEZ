import React from 'react'
import '../styles/Header.css'
import { useDispatch, useSelector } from 'react-redux'
import { Navbar, Nav, Container, Row, NavDropdown, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { logout } from '../actions/userActions'

function Header() {

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const dispatch = useDispatch()

    const logoutHandler = () => {
        
        dispatch(logout())
    }

    return (
        <header>
            <Navbar bg="light" variant="light" expand="lg" collapseOnSelect>
                <Container>
                    <LinkContainer to='/'>
                        <Navbar.Brand>KYEZ</Navbar.Brand>
                    </LinkContainer>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">

                            {userInfo ? (
                                <NavDropdown title={userInfo.name} id='username'>
                                    <LinkContainer to='/profile'>
                                        <NavDropdown.Item>Tài khoản</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/result'>
                                        <NavDropdown.Item>Kết quả thi</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item onClick={logoutHandler}>Đăng xuất</NavDropdown.Item>

                                </NavDropdown>
                            ) : (
                                    <LinkContainer to='/login'>
                                         <Button variant="primary">Đăng nhập</Button>
                                    </LinkContainer>
                                )}
                           

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header
