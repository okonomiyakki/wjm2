import React, { Component, useState } from 'react';
import { Nav_bar } from '../components/Nav_bar';
import { Homebody } from '../components/homebody';
import { Routes, Route, Link } from 'react-router-dom'
import Login from './login';

export function Home(props) {
    return (
        <div className='home'>
            <Nav_bar/>
            <Homebody/>
        </div>
    )
}
export default Home;