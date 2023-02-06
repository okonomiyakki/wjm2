import { useEffect } from 'react';
import React, { Component, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
const { kakao } = window;

export function Setloc() {
    let [주소창, 주소표시] = useState(['현재 위치 표시 박스']);

    useEffect(() => {

    })

        return (
            <div className='wrap'>
                <div className='header'>
                    <div>
                        <Link to="/">로그인창</Link>
                    </div>
                    <div>
                        <Link to="/mapcopy">지도</Link>
                    </div>
                </div>
                <div className='container'>
                    <div id = 'click_current_loc'> {주소창} </div>
                    <button onClick={() => { 주소표시(set_loc()) }}>
                        현재 위치 표시 버튼
                    </button>
                </div>
                <div className='footer'></div>
            </div>
            
        )
    }


export default Setloc;

function getAddr(lat, lng) {
    let content;
    let geocoder = new kakao.maps.services.Geocoder();

    let coord = new kakao.maps.LatLng(lat, lng);
    let callback = function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            console.log(result[0].address.address_name);                      //콘솔창에 현재위치
            content = '<div>' + result[0].address.address_name + '</div>';

            let addr = '현재위치 : ' + result[0].address.address_name;
            let resultDiv = document.getElementById('click_current_loc');
            resultDiv.innerHTML = addr;
        }
    }
    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
}

function set_loc() {
    if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                let current_lat = position.coords.latitude,
                    current_lon = position.coords.longitude;
                
                //console.log(current_lat, current_lon);
                // let current_loc = sumit_loc(current_lat, current_lon);
                // console.log(current_loc);

                getAddr(current_lat,current_lon);
            })
    }
}