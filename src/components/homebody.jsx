import React, { Component, useState } from 'react';
import { Stack, Button } from 'react-bootstrap';
import Main from '../images/main1.png';
import { Routes, Route, Link } from 'react-router-dom'

export function Homebody(props) {
    return (
        <div className='home_container'>
            <div className='intro'>
                <div className='intro2'>
                    <div className='title'>우리 지금 만나</div>
                    <p>어디서 만날지 고민될 때,</p>
                    <p>좋은 모임 장소를 추천받고 싶을 때</p>
                </div>
                {/* <img src={Main} max-width="500px" /> */}

                <div className='home-btn'>
                    <Link to="/start" className='home_d2'>
                        중간 지점과 추천 매장을 알려드릴게요.
                        <span>출발지 입력하러 가기 >></span>
                    </Link>
                </div>

            </div>
            <a href="http://www.freepik.com">Designed by stories / Freepik</a>

        </div>
    )
}
export default Homebody;