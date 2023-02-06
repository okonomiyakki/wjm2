import React, { Component, useState } from 'react';
import { Nav_bar } from '../components/Nav_bar';
import {Loginbody} from '../components/loginbody';
import { Routes, Route, Link } from 'react-router-dom'

export function Login(props) {
    return (
        <div className='home'>
            <Nav_bar/>
            <Loginbody/>
        </div>
    )
}
export default Login;