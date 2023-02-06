import React, { Component, useState } from 'react';
import { Nav_bar } from '../components/Nav_bar';
import { Routes, Route, Link } from 'react-router-dom'
import LandgingPage from '../components/mapSearch/LandingPage';
export function Start(props) {
    return (
        <div className='home'>
            <Nav_bar/>
            <LandgingPage/>
        </div>
    )
}
export default Start;