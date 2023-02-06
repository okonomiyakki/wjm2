// import { useEffect } from "react";
import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ClickAdd } from './ClickAdd';
const { kakao } = window;

export function Mapcopy({ title, latlng }) {
    useEffect(() => {
        const WGS_points = []; // 위경도 좌표계 리스트
        const Title = []; // 해당좌표 주소 리스트
        for (let m = 0; m < latlng.length; m++){
            Title[m] = title[m];
            WGS_points[m] = latlng[m];
        }
        console.log("추가된 주소 리스트",Title);
        console.log("추가된 좌표 리스트",WGS_points);

        const WTM_points = [];  // 직교 좌표계 리스트
        if (WGS_points.length > 1) {
            gtot(WGS_points, WTM_points);   // WGS좌표계 리스트를 WTM좌표계 리스트로 변환

            console.log("직교 좌표계로 변환된 리스트", WTM_points);

            let split_l = splitList(WTM_points).ll,     // 중심선 기준 왼쪽, 오른쪽으로 리스트 나누고 할당
                split_r = splitList(WTM_points).lr;

            let new_l = sort(split_l).asc,    // 리스트 정렬 후 할당
                new_r = sort(split_r).des;

            console.log("기준선 왼쪽 리스트", new_l);
            console.log("기준선 오른쪽 리스트", new_r);

            let poly_points = new_l.concat(new_r);  // 정렬된 두개 리스트 합친 후 할당

            console.log("정렬된 리스트", poly_points);

            if (WTM_points.length === 2) {      // 사용자 두명일 떄 무게중심 좌표 할당
                var center_x = getCentroid(poly_points).x2,
                    center_y = getCentroid(poly_points).y2;
            }
            else {                              // 두명 이상일 떄 무게중심 좌표 할당
                var center_x = getCentroid(poly_points).x,
                    center_y = getCentroid(poly_points).y;
            }

            console.log("무게중심 좌표", center_x, center_y);

        }
            const c_Lat = ttog(center_x, center_y).lat,   // 현재 WTM좌표계인 무게중심 좌표를 다시 WGS좌표계로 변환 후 할당
                c_Lng = ttog(center_x, center_y).lng;
        
        
            let mapContainer = document.getElementById('map');  // 지도를 표시할 div 
            var mapOption = {
                center: new kakao.maps.LatLng(c_Lat, c_Lng),
                level: 9
            };
            var map = new kakao.maps.Map(mapContainer, mapOption);
            
            let imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

            for (let i = 0; i < Title.length; i++) {
        
                // 마커 이미지의 이미지 크기 
                let imageSize = new kakao.maps.Size(24, 35);
                
                // 마커 이미지를 생성 
                let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
                
                // 마커를 생성
                var marker = new kakao.maps.Marker({
                    map: map,   // 마커를 표시할 지도
                    position: new kakao.maps.LatLng(WGS_points[i][0],WGS_points[i][1]),  // 마커를 표시할 위치
                    title: Title[i],   // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됨
                    image: markerImage  // 마커 이미지 
                });
            }

            var marker = new kakao.maps.Marker({    // 무게중심 좌표에 마커 생성
                position: new kakao.maps.LatLng(c_Lat, c_Lng)
            });
            marker.setMap(map);
        // }
    })
    return (
        <div>
            {/* <Link to="/">로그인창</Link> */}
            <span>-----------------------------------------------------</span>
            {/* <Link to="/setloc">위치입력</Link> */}
            <div id="map" className="map">
            </div>
            <button >중간 장소 보기</button>
        </div>
    )
}
export default Mapcopy;

        function gtot(WGS_points, WTM_points) {     // WGS좌표계 리스트를 WTM좌표계 리스트로 변환
                for (let i = 0; i < WGS_points.length; i++){    
                let latlng = new kakao.maps.LatLng(WGS_points[i][0],WGS_points[i][1]), 
                    coords = latlng.toCoords(); 
                WTM_points[i] = [coords.getX() * 0.4, coords.getY() * 0.4];
            }
        }

        function ttog(center_x, center_y) {     // WTM좌표계인 무게중심 좌표를 WGS좌표계로 변환
            let coords = new kakao.maps.Coords(center_x * 2.5, center_y * 2.5),     
                latlng = coords.toLatLng();
            return {
                lat: latlng.getLat(),
                lng: latlng.getLng()
            };
        }

        function splitList(WTM_points) {    // 리스트 나누기
            let px = [],  // x좌표들 중심 찾기위해서 x좌표만 뽑은 리스트
                listl = [],   // 중심 선 기준 왼쪽 리스트
                listr = [];   // 중심 선 기준 오른쪽 리스트

            for (let i = 0; i < WTM_points.length; i++){    // x좌표만 px에 담음
                let p = WTM_points[i];
                px[i] = p[0];
            }

            const result = px.sort(function(a,b){   // px 오름차순 정렬
                return a - b;
            });

            let mid = (result[0] + result[WTM_points.length - 1]) / 2   // x 중심좌표

            let l = 0,
                r = 0;
            for (let i = 0; i < WTM_points.length; i++) {   // 중심 선 기준 리스트 나누기
                let a = WTM_points[i];
                if (a[0] < mid) {
                    listl[l] = a;
                    l++;
                }
                else if (a[0] >= mid) {
                    listr[r] = a;
                    r++;
                }
            }
            return {
                ll: listl,
                lr: listr
            };
        }

        function sort(y) {  // y 좌표 정렬
            if(y.length === 0 ) {
                return [];
            }
            let middle = y[0][1],
                middle_t = [y[0]],
                len = y.length,
                left = [],
                right = [];

            for(let i = 1; i < len; ++i) {
                if (y[i][1] < middle)
                    left.push(y[i]);

                else
                    right.push(y[i]);
            }
            let lmr = left.concat(middle_t, right),
                rml = right.concat(middle_t, left);
            return {
                asc: lmr,
                des: rml
            };
        }

        function getCentroid(poly_points) {  // 사용자 둘 or 둘 이상일 때 무게중심 찾기
            let area = 0,
                cx = 0,
                cy = 0,
                cx2 = 0,
                cy2 = 0;

            for(let i = 0; i < poly_points.length; i++){
                let j = (i + 1) % poly_points.length;

                let pt1 = poly_points[i],
                    pt2 = poly_points[j];

                let x1 = pt1[0],
                    x2 = pt2[0],
                    y1 = pt1[1],
                    y2 = pt2[1];

                area += x1 * y2;
                area -= y1 * x2;

                cx += ((x1 + x2) * ((x1 * y2) - (x2 * y1)));
                cy += ((y1 + y2) * ((x1 * y2) - (x2 * y1)));

                cx2 = (x1 + x2) / 2;
                cy2 = (y1 + y2) / 2;
            }

            area /= 2;
            area = Math.abs(area);

            cx = cx / (6.0 * area);
            cy = cy / (6.0 * area);
                
            return {
                x: Math.abs(cx),
                y: Math.abs(cy),
                x2: Math.abs(cx2),
                y2: Math.abs(cy2)
            };
        }
