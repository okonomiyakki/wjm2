import React, { Component, useState } from 'react';
import Img from '../images/map_icon.png';

import { Navbar, Container, Nav } from 'react-bootstrap';

export function Nav_bar(props) {
    return (
        <>
            <Navbar bg="#FFFAE7" variant="light">
                <Container>
                    <Navbar.Brand href="/"><img src={Img} width="30px" /></Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                    </Nav>
                    {/* <Nav>
                    <Nav.Link href="/login">로그인</Nav.Link>
                    <Nav.Link eventKey={2} href="#memes">
                    회원가입
                    </Nav.Link>
                </Nav> */}
                </Container>
            </Navbar>
        </>
    )
}
export default Nav_bar;