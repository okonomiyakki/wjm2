import React, { Component, useState } from 'react';
import Img from '../images/map_icon.png';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Routes, Route, Link } from 'react-router-dom'

export function Loginbody(props) {
    return (
        <div className='login_b'>
            <form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>ID</Form.Label>
                    <Form.Control type="email" placeholder="Enter ID" />
                    <Form.Text className="text-muted">
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <br/>
                <Button variant="primary" type="submit">
                    로그인
                </Button>
            </form>
        </div>
    )
}
export default Loginbody;