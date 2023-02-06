import React, { Component, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

export function Logincopy(props) {

    return (
        <div className='wrap'>

            <div className="header">
                <div><Link to="/setloc">위치입력</Link></div>
                <div className='header_text'>
                로그인
                </div>
                <div><Link to="/map">지도</Link></div>
            </div>
            <div className="container">
                <form action='/map' method="get" className="container_login_form">
                    <input name="username" type="text" placeholder="Email or phone number" />
                    <input name="password" type="password" placeholder="password" />
                    <input type="submit" value="Log In" />
                </form>
            </div>
            <div className="footer">
            </div>

        </div>
    )
}
export default Logincopy;