// import { NULL } from 'node-sass';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import STA from './sta.json';
import SEOUL from './seoul.json';

const { kakao } = window

export function ClickAdd({ searchPlace, lat, lng, name }) {
    let [location, setLocation] = useState([]);       // 입력된 주소
    let [addLoc, setAddLoc] = useState([]);           // 추가된 주소
    let [latlng, setLatlng] = useState([]);           // 입력 좌표
    let [addLatlng, setAddLatlng] = useState([]);     // 추가 좌표
    let [Name, setName] = useState([]);               // 입력된 출발지 이름
    let [addName, setAddName] = useState([]);         // 추가된 출발지 이름
    let [hotPlace, setHotPlace] = useState([]);       // 추천 매장
    // let [index, setIndex] = useState([]);          // 현재 인덱스
    let mmm = [];           // 소요시간 전체
    let www = [];           // 가중치 추가된
    let ggg = [];           // 가중치 값
    let avgTime = [];       // 최소 소요시간
    let endStation = [];    // 도착역


    useEffect(() => {
        if (lat != null) {
            let container = document.getElementById('myMap'),
                mapOption = {
                    center: new kakao.maps.LatLng(37.566826004661, 126.978652258309),
                    level: 6
                };

            let map = new kakao.maps.Map(container, mapOption);

            let new_location = [...location];
            new_location.unshift(searchPlace); //검색한 주소를 새로운 배열에 선언
            setLocation(new_location);         // 검색 될 때 마다 값 바꿈

            let coords = new kakao.maps.LatLng(lat, lng);

            // console.log("새로 검색한 좌표", lat, lng);

            let new_latlng = [...latlng];
            new_latlng.unshift([Number(lat), Number(lng)]); //검색한 주소의 좌표
            setLatlng(new_latlng);

            let new_Name = [...Name];
            new_Name.unshift([name]);
            setName(new_Name);

            let searchMarker = new kakao.maps.Marker({
                map: map,
                position: coords
            });

            let infowindow = new kakao.maps.InfoWindow({
                content: `<div style="width:150px;text-align:center;padding:6px 0;">` + name + `</div>`,
                clickable: true
            });

            infowindow.open(map, searchMarker);

            map.setCenter(coords);
        }

    }, [searchPlace, lat, lng, name])

    const reload = () => {
        window.location.replace("/start");
    }

    const buttonAdd = (intext) => {
        if ((location.includes(intext) & !addLoc.includes(intext)) && intext != "") {
            let new_addLoc = [...addLoc];
            new_addLoc.unshift(intext);
            setAddLoc(new_addLoc);
            // console.log("추가한 주소명", new_addLoc);

            let new_addLatlng = [...addLatlng];
            new_addLatlng.unshift(latlng[0]);
            setAddLatlng(new_addLatlng);
            // console.log("추가한 좌표값", new_addLatlng);

            let new_addName = [...addName];
            new_addName.unshift(name);
            setAddName(new_addName);
            // console.log("추가한 장소명", new_addName);

            // let new_index = [...index];
            // new_index.unshift(new_addLoc.length - new_addLoc.indexOf(intext));
            // setIndex(new_index);
            // console.log("추가한 인덱스값", new_index);
        }
        else {
            alert('장소 클릭 후 눌러주세요.');
            return;
        }
    }

    const start = (addLatlng, addName) => {
        const WGS_points = [],   // 위경도 좌표계 리스트
            WTM_points = [],     // 직교 좌표계 리스트
            Title = [];          // 출발지 이름 리스트

        for (let m = 0; m < addLatlng.length; m++) {
            Title[m] = addName[m];
            WGS_points[m] = addLatlng[m];
        }
        console.log("추가된 출발 리스트", Title);
        console.log("추가된 좌표 리스트", WGS_points);

        if (WGS_points.length > 1) {

            mmm = []; // 소요시간 전체
            www = []; // 가중치 추가된
            ggg = []; // 가중치 값
            avgTime = [];
            endStation = [];

            // let map_wrap = document.querySelector('.map_wrap'),        // 검색창 사라지기
            //     menu_wrap2 = document.querySelector('#menu_wrap2');
            // map_wrap.removeChild(menu_wrap2);

            gtot(WGS_points, WTM_points);                // WGS좌표계 리스트를 WTM좌표계 리스트로 변환

            // console.log("직교 좌표계로 변환된 리스트", WTM_points);

            let split_l = splitList(WTM_points).ll,      // 중심선 기준 왼쪽, 오른쪽으로 리스트 나누기
                split_r = splitList(WTM_points).lr;

            var new_l = sort(split_l).asc,               // 리스트 정렬 
                new_r = sort(split_r).des;

            // console.log("기준선 왼쪽 리스트", new_l);
            // console.log("기준선 오른쪽 리스트", new_r);

            var poly_points = new_l.concat(new_r);        // 정렬된 두개 리스트 합침

            // console.log("정렬된 리스트", poly_points);

            if (WTM_points.length === 2) {                // 사용자 두명일 떄 무게중심 좌표 
                var center_x = getCentroid(poly_points).x2,
                    center_y = getCentroid(poly_points).y2;
            }
            else {                                        // 두명 이상일 떄 무게중심 좌표 
                var center_x = getCentroid(poly_points).x,
                    center_y = getCentroid(poly_points).y;
            }
        }
        else {
            alert('출발지를 최소 두 개 이상 입력한 다음 눌러주새요.');
            return;
        }

        console.log("무게중심 좌표(WTM)", center_x, center_y);

        let c_Lat = ttog(center_x, center_y).lat,         // 현재 WTM좌표계인 무게중심 좌표를 다시 WGS좌표계로 변환
            c_Lng = ttog(center_x, center_y).lng;

        let p_Lat = ttog(center_x, center_y).lat,
            p_Lng = ttog(center_x, center_y).lng;

        console.log("무게중심 좌표(WGS)", c_Lat, c_Lng);
        console.log("장소명", Title);

        let center = [];
        let head = [];
        let cnt = 0;

        do {
            for (let i = 0; i < WGS_points.length; i++) {                      // 처음 i = 0 일때는 무게중심점을 돌리는거임
                searchPubTransPathAJAX(WGS_points, Title, c_Lat, c_Lng, i);    // 환승횟수, 소요시간 기반 가중치 추가할 장소 찾기
            }

            // console.log("가중치 인덱스", www);
            // console.log("가중치 값 리스트 : ", ggg);

            if (ggg[0][0] != 1) {                                              // 가중치가 있으면 (평균 소요시간보다 큰 출발지가 있으면)
                var w = [];
                for (let i = 0; i < www[0].length; i++) {
                    w.push([Title[www[0][i]], ggg[0][www[0][i]]]);
                }
                var new_head = '';
                for (let i = 0; i < w.length; i++) {
                    new_head += w[i][0];
                    if ((i + 1) != w.length) {
                        new_head += ', '
                    }
                }
                head.push(new_head);
                console.log(cnt + 1 + " 번째 탐색 : 가중치 출발지 이름 리스트", w);
            }
            else if (ggg[0][0] == 1) {                                          //  가중치가 없으면
                console.log(cnt + 1 + " 번째 탐색 : 가중치 추가할 출발지 없음");
                new_head = '무게중심';
                head.push(new_head);
                head.push(new_head);
                center.push([p_Lat, p_Lng]);
                center.push([p_Lat, p_Lng]);
                break;
            }

            var weigtVec_x = getUnitvec(WTM_points, center_x, center_y, ggg).weigtVec_x,
                weigtVec_y = getUnitvec(WTM_points, center_x, center_y, ggg).weigtVec_y;
            var unitVec = getUnitvec(WTM_points, center_x, center_y, ggg).unitVec;

            console.log(cnt + 1 + " 번째 탐색 각 단위벡터 리스트", unitVec);
            console.log(cnt + 1 + " 번째 탐색 가중치 추가된 무게중심 단위벡터(가중치 없으면 0에 수렴)", weigtVec_x, weigtVec_y);

            var center_x2 = getNewcenter(weigtVec_x, center_x, weigtVec_y, center_y).center_x2,
                center_y2 = getNewcenter(weigtVec_x, center_x, weigtVec_y, center_y).center_y2;

            console.log(cnt + 1 + " 번째 탐색 : 중간지점(WTM)", center_x2, center_y2);

            c_Lat = ttog(center_x2, center_y2).lat;   // 현재 WTM좌표계인 무게중심 좌표를 다시 WGS좌표계로 변환
            c_Lng = ttog(center_x2, center_y2).lng;

            console.log(cnt + 1 + " 번째 탐색 : 중간지점(WGS)", c_Lat, c_Lng);

            console.log("< 새로운 중간지점은 처음 무게중심좌표와 같을 수 있음 >");

            center_x = new_gtot(c_Lat, c_Lng).x;
            center_y = new_gtot(c_Lat, c_Lng).y;

            mmm = []; // 소요시간 전체
            www = []; // 가중치 추가된
            ggg = []; // 가중치 값

            center.push([c_Lat, c_Lng])    // 새로운 중간지점을 새 배열에 추가

            if (cnt == 1) {
                center.pop();
                center.push([p_Lat, p_Lng])
                new_head = '무게중심';
                head.pop();
                head.push(new_head);
                break;
            }
            cnt++;
        }
        while (cnt < 4);

        // console.log("평균 최소 소요 시간 리스트 : ", avgTime);
        // console.log("도착역 리스트 : ", endStation);
        // console.log("최종 중간 좌표 리스트 : ", center);

        let center_name = [];
        let geocoder = new kakao.maps.services.Geocoder();

        let coord1 = new kakao.maps.LatLng(center[0][0], center[0][1]);
        let callback1 = function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
                center_name.push(result[0].address.region_2depth_name);
            }
            let coord2 = new kakao.maps.LatLng(center[1][0], center[1][1]);
            let callback2 = function (result, status) {
                if (status === kakao.maps.services.Status.OK) {
                    center_name.push(result[0].address.region_2depth_name);
                }
                // console.log("최종 중간 지역구 리스트 : ", center_name);

                if (center_name[0] == center_name[1]) {
                    center_name.pop();
                    center.pop();
                    selectArea2(WGS_points, Title, center, center_name, head);    // 지역구 선택 하기 및 인기역 & 추천매장 보여주기
                }
                else if (center_name[0] != center_name[1]) {
                    selectArea2(WGS_points, Title, center, center_name, head);    // 지역구 선택 하기 및 인기역 & 추천매장 보여주기
                }
            }
            geocoder.coord2Address(coord2.getLng(), coord2.getLat(), callback2);
        }
        geocoder.coord2Address(coord1.getLng(), coord1.getLat(), callback1);
    }

    function selectArea2(WGS_points, Title, center, center_name, head) {
        let sta_wrap = document.querySelector('#sta_wrap'),
            info = document.querySelector('#info');

        sta_wrap.style.display = "none";

        if (info) {
            while (sta_wrap.hasChildNodes()) {
                sta_wrap.removeChild(sta_wrap.lastChild);
            }
        }

        let data = (SEOUL)["features"];
        let coordinates = [];    //좌표 저장 배열
        let name = '';           //행정구 이름
        let polygons = [];

        var mapContainer = document.getElementById('myMap'),
            mapOption = {
                center: new kakao.maps.LatLng(center[0][0], center[0][1]),
                level: 8
            };

        var map = new kakao.maps.Map(mapContainer, mapOption),
            customOverlay = new kakao.maps.CustomOverlay({});

        let imageSrc_star = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

        for (let i = 0; i < WGS_points.length; i++) {    //출발지 마커
            let imageSize_star = new kakao.maps.Size(24, 35);
            let markerImage_star = new kakao.maps.MarkerImage(imageSrc_star, imageSize_star);
            var marker_star = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(WGS_points[i][0], WGS_points[i][1]),
                title: Title[i],
                image: markerImage_star,
                clickable: true
            });

            marker_star.setMap(map);

            var infowindow_star = new kakao.maps.InfoWindow({
                content: '<div style="width:150px;text-align:center;padding:6px 0;">' + Title[i] + '</br>소요시간 : ' + mmm[i][1] + '분</div>',
            });
            infowindow_star.open(map, marker_star);
        }

        const displayGu = (coordinates, name, WGS_points, Title, center, center_name, head) => {
            let path = [];
            let points = [];

            coordinates[0].forEach((coordinate) => {
                let point = {};
                point.x = coordinate[1];
                point.y = coordinate[0];
                points.push(point);
                path.push(new kakao.maps.LatLng(coordinate[1], coordinate[0]));
            });

            var polygon = new kakao.maps.Polygon({
                map: map,
                path: path,
                strokeWeight: 2,
                strokeColor: '#004c80',
                strokeOpacity: 0.0,
                fillColor: '#fff',
                fillOpacity: 0.0
            });

            polygons.push(polygon);

            for (let i = 0; i < center.length; i++) {
                if (name === center_name[i]) {
                    polygon.setOptions({
                        fillOpacity: 0.7,
                        strokeOpacity: 0.8
                    });

                    let color;
                    if (i == 0) {
                        color = '#DD1A0B';
                    }
                    else if (i == 1) {
                        color = '#09f';
                    }

                    kakao.maps.event.addListener(polygon, 'mouseover', function (mouseEvent) {
                        polygon.setOptions({ fillColor: color });

                        customOverlay.setContent('<div class="area">' + head[i] + '에 가중치 추가된 중간지점 지역구 : ' + center_name[i] + '</div>');
                        customOverlay.setPosition(mouseEvent.latLng);
                        customOverlay.setMap(map);
                    });

                    kakao.maps.event.addListener(polygon, 'mousemove', function (mouseEvent) {
                        customOverlay.setPosition(mouseEvent.latLng);
                    });

                    kakao.maps.event.addListener(polygon, 'mouseout', function () {
                        polygon.setOptions({ fillColor: '#fff' });
                        customOverlay.setMap(null);
                    });

                    kakao.maps.event.addListener(polygon, 'click', function () {
                        displayLocation(WGS_points, Title, i, center, center_name, head);    // 해당 지역구 클릭하면 추천 역 표시
                    });
                }

                var marker_blue = new kakao.maps.Marker({                                    // 중간지점 마커
                    position: new kakao.maps.LatLng(center[i][0], center[i][1]),
                    map: map,
                    clickable: true
                });

                if (i == 1) {
                    endStation.push(endStation[i - 1]);
                    avgTime.push(avgTime[i - 1]);
                }
                else if (center.length == 1) {
                    endStation.push(endStation[i]);
                    avgTime.push(avgTime[i]);
                }

                var infowindow_blue = new kakao.maps.InfoWindow({
                    content: '<div style="width:150px;text-align:center;padding:6px 0;">' + head[i] + '에</br>가중치 추가된 중간지점</br></br>목적지 : ' + endStation[i + 1] + '역</br>평균 소요시간 : ' + avgTime[i + 1] + ' 분</div>'
                });

                marker_blue.setMap(map);

                (function (marker_blue, infowindow_blue) {
                    kakao.maps.event.addListener(marker_blue, 'mouseover', function () {
                        infowindow_blue.open(map, marker_blue);
                    });
                    kakao.maps.event.addListener(marker_blue, 'mouseout', function () {
                        infowindow_blue.close();
                    });
                })(marker_blue, infowindow_blue);

            }
        }
        data.forEach((val) => {
            coordinates = val.geometry.coordinates;
            name = val.properties.SIG_KOR_NM;

            displayGu(coordinates, name, WGS_points, Title, center, center_name, head);
        });
    }

    function searchPubTransPathAJAX(WGS_points, Title, c_Lat, c_Lng, i) {
        var xhr = new XMLHttpRequest();
        var url = "https://api.odsay.com/v1/api/searchPubTransPathT?SX=" + WGS_points[i][1] + "&SY=" + WGS_points[i][0] + "&EX=" + c_Lng + "&EY=" + c_Lat + "&apiKey=6g%2BFZMSoP6lKIQicoZdy5Q";
        xhr.open("GET", url, false);
        // xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {

                if ((JSON.parse(xhr.responseText))["result"]?.["path"][0].info.firstStartStation == undefined) {
                    alert('대중교통 api 호출 오류입니다. \n중간 장소 찾기 버튼을 다시 눌러주세요! ');
                    return;
                }
                else {
                    console.log(">> ", Title[i], " 에서 출발 ", (JSON.parse(xhr.responseText))["result"]?.["path"][0].info.firstStartStation, "-->", (JSON.parse(xhr.responseText))["result"]?.["path"][0].info.lastEndStation);

                    let lastStation = (JSON.parse(xhr.responseText))["result"]?.["path"][0].info.lastEndStation;

                    let bus = 0,
                        subway = 0,
                        subwayBus = 0;

                    (JSON.parse(xhr.responseText))["result"]?.busCount == undefined ? bus = 0 : bus = (JSON.parse(xhr.responseText))["result"].busCount;
                    (JSON.parse(xhr.responseText))["result"]?.subwayCount == undefined ? subway = 0 : subway = (JSON.parse(xhr.responseText))["result"].subwayCount;
                    (JSON.parse(xhr.responseText))["result"]?.subwayBusCount == undefined ? subwayBus = 0 : subwayBus = (JSON.parse(xhr.responseText))["result"].subwayBusCount;

                    let totalwayCount = bus + subway + subwayBus;

                    let transArr = [],
                        min_trans = 0;

                    for (let t = 0; t < totalwayCount; t++) {
                        transArr[t] = (JSON.parse(xhr.responseText))["result"]["path"][t].info.busTransitCount + (JSON.parse(xhr.responseText))["result"]["path"][t].info.subwayTransitCount;
                    }

                    // console.log("  환승 횟수 리스트 >> ", transArr);

                    min_trans = Math.min(...transArr)

                    let transIndex = [];
                    for (let i = 0; i < totalwayCount; i++) {
                        if (transArr[i] == min_trans) {
                            transIndex.push(i)
                        }
                    }
                    // console.log("  최소환승 횟수 인덱스 리스트 >> ", transIndex);

                    let totalTimeArr = [],
                        timeArr = [],
                        min_time = 0;

                    for (let t = 0; t < totalwayCount; t++) {
                        totalTimeArr[t] = (JSON.parse(xhr.responseText))["result"]["path"][t].info.totalTime;
                    }

                    // console.log("  소요시간 리스트 >> ", totalTimeArr);

                    for (let t = 0; t < transIndex.length; t++) {
                        timeArr[t] = totalTimeArr[transIndex[t]]
                    }

                    // console.log("  최소 환승의 소요시간 리스트 >> ", timeArr);

                    min_time = Math.min(...timeArr)

                    console.log("   ", Title[i], " 에서  최소 소요시간 : ", min_time, " 분");

                    mmm.push([i, min_time]);

                    // console.log("[출발지 인덱스, 최소 소요시간]", mmm);

                    let sum = 0,
                        avg = 0;
                    for (let i = 0; i < mmm.length; i++) {
                        sum += mmm[i][1]
                    }

                    avg = sum / mmm.length      // 각 출발지의 최소 소요시간 평균

                    let rate_sum = 0,
                        rate_avg = 0;
                    for (let i = 0; i < mmm.length; i++) {
                        rate_sum += (mmm[i][1] / sum)
                    }

                    rate_avg = rate_sum / mmm.length

                    //----------------(비율 x 단위벡터)로 해봅시다-----------------

                    let needW = [],
                        getW = [];
                    let key = 0;
                    let needIndex = [];

                    if (mmm.length == WGS_points.length) {

                        for (let i = 0; i < mmm.length; i++) {
                            if ((mmm[i][1] / sum >= rate_avg * 1.5)) {    // 비율의 평균값보다 큰 출발지가 있으면
                                needW.push(mmm[i][0])             // 해당 출발지 인덱스 추가
                                key = 1;
                                needIndex.push(mmm[i][0])
                            }
                            else {
                                needIndex.push(100)  //인덱스 구분용 쓰레기값
                            }
                        }

                        // console.log("needW", needW);
                        // console.log("needIndex", needIndex);

                        if (key == 1) {                                 // 비율의 평균값보다 큰 출발지가 있으면 
                            for (let i = 0; i < mmm.length; i++) {
                                if (i == needIndex[i]) {                // 각 단위벡터에 소요시간 비율 만큼의 가중치 곱함
                                    getW.push((mmm[i][1] / sum) * 2)    // 비율의 평균값보다 크면 x 2
                                }
                                else {
                                    getW.push(mmm[i][1] / sum)          // 아니면 그냥 추가
                                }
                            }
                        }
                        else {                                          // 비율의 평균값보다 큰 출발지가 없으면
                            for (let i = 0; i < mmm.length; i++)
                                getW.push(1)                            // 가중치는 없음
                        }
                    }

                    //-----------------------------------------------------------

                    if (mmm.length == WGS_points.length) {
                        www.push(needW)
                        ggg.push(getW)
                        avgTime.push(Math.round(avg))
                        endStation.push(lastStation)
                        console.log("평균 소요시간 >> ", avg, " 분");
                    }
                }

            }
        };
        xhr.send(); //동기호출하기
    }

    function displayLocation(WGS_points, Title, i, center, center_name, head) {
        let geocoder = new kakao.maps.services.Geocoder();
        let coord = new kakao.maps.LatLng(center[i][0], center[i][1]);

        var p_latlng = [];
        var nth_gu = 0;

        let callback = function (result, status) {

            if (status === kakao.maps.services.Status.OK) {
                console.log("무게중심 지역구 >>", result[0].address.region_2depth_name);       //콘솔창에 현재 지역구 위치
                var select = result[0].address.region_2depth_name;

                // midAreaHot(result[0].address.region_2depth_name)     // *********
            }

            midAreaHot(select);     // *********

            for (let i = 0; i < (STA)["station"].length; i++) {
                if (select == (STA)["station"][i].region_name) {

                    var info_len = (STA)["station"][i]["info"].length;

                    for (let p = 0; p < info_len; p++) {
                        console.log((STA)["station"][i]["info"][p].PstationName);
                        let p_lat = (STA)["station"][i]["info"][p].y,
                            p_lng = (STA)["station"][i]["info"][p].x;

                        p_latlng[p] = [p_lat, p_lng];
                        nth_gu = i;
                    }
                }
            }
            console.log(p_latlng);

            let container = document.getElementById('myMap'),
                mapOption = {
                    center: new kakao.maps.LatLng(center[i][0], center[i][1]),
                    level: 8
                };
            let map = new kakao.maps.Map(container, mapOption);

            let imageSrc_star = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                imageSrc_red = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png';

            for (let i = 0; i < WGS_points.length; i++) {    //출발지 마커
                let imageSize_star = new kakao.maps.Size(24, 35);
                let markerImage_star = new kakao.maps.MarkerImage(imageSrc_star, imageSize_star);
                var marker_star = new kakao.maps.Marker({
                    map: map,
                    position: new kakao.maps.LatLng(WGS_points[i][0], WGS_points[i][1]),
                    title: Title[i],
                    image: markerImage_star,
                    clickable: true
                });

                marker_star.setMap(map);

                var infowindow_star = new kakao.maps.InfoWindow({
                    content: '<div style="width:150px;text-align:center;padding:6px 0;">' + Title[i] + '</div>',
                });
                infowindow_star.open(map, marker_star);
            }

            // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ매장정보 표시 추가하기ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

            // for (let i = 0; i < p_latlng.length; i++) {       //중간지점 지역구 지하철역 마커    << 포문 범위 매장 정보 길이로 바꾸기
            //     let imageSize_red = new kakao.maps.Size(35, 40);
            //     let markerImage_red = new kakao.maps.MarkerImage(imageSrc_red, imageSize_red);
            //     var marker_red = new kakao.maps.Marker({
            //         map: map,
            //         position: new kakao.maps.LatLng(p_latlng[i][0], p_latlng[i][1]),    // << 매장 좌표로 바꾸기
            //         title: (STA)["station"][nth_gu]["info"][i].PstationName,            // << 매장 이름으로 바꾸기
            //         image: markerImage_red,
            //         clickable: true
            //     });
            //     var infowindow_red = new kakao.maps.InfoWindow({
            //         content: '<a href="https://map.kakao.com/link/to/' + (STA)["station"][nth_gu]["info"][i].PstationName + ',' + p_latlng[i][0] + ',' + p_latlng[i][1] + '">' +
            //             '            <div style="width:150px;text-align:center;padding:6px 0;">' + (STA)["station"][nth_gu]["info"][i].PstationName + '</br>Kakao 지도 길찾기 ></div > ' +    // << 매장 이름으로 바꾸기, 길찾기 링크 추가
            //             '     </a>',
            //         removable: true
            //     });

            //     marker_red.setMap(map);

            //     (function (marker_red, infowindow_red) {
            //         kakao.maps.event.addListener(marker_red, 'click', function () {
            //             infowindow_red.open(map, marker_red);
            //         });
            //     })(marker_red, infowindow_red);
            // }

            var store = []
            axios.get("https://wjm.potados.com/api/restaurants", {
                params: { area: select }
            })
                .then((i) => {
                    for (let j in i.data) {
                        store.push(i.data[j])
                    }
                    console.log(store);

                    let geocoder2 = new kakao.maps.services.Geocoder();
                    let add = [];
                    let name2 = [];
                    for (let i = 0; i < store.length; i++) {
                        geocoder2.addressSearch(store[i].address, function (result, status) {

                            if (status === kakao.maps.services.Status.OK) {
                                add.push([result[0].y, result[0].x]);
                                name2.push(store[i].name)

                                console.log(result);
                                if (i == store.length - 1) {
                                    console.log(add);

                                    for (let k = 0; k < store.length; k++) {
                                        let imageSize_red = new kakao.maps.Size(35, 40);
                                        let markerImage_red = new kakao.maps.MarkerImage(imageSrc_red, imageSize_red);
                                        var marker_red = new kakao.maps.Marker({
                                            map: map,
                                            position: new kakao.maps.LatLng(add[k][0], add[k][1]),    // << 매장 좌표로 바꾸기
                                            title: name2[k],            // << 매장 이름으로 바꾸기
                                            image: markerImage_red,
                                            clickable: true
                                        });
                                        var infowindow_red = new kakao.maps.InfoWindow({
                                            content: '<a href="https://map.kakao.com/link/to/' + name2[k] + ',' + add[k][0] + ',' + add[k][1] + '">' +
                                                '            <div style="width:150px;text-align:center;padding:6px 0;">' + name2[k] + '</br>Kakao 지도 길찾기 ></div > ' +    // << 매장 이름으로 바꾸기, 길찾기 링크 추가
                                                '     </a>',
                                            removable: true
                                        });

                                        marker_red.setMap(map);

                                        (function (marker_red, infowindow_red) {
                                            kakao.maps.event.addListener(marker_red, 'click', function () {
                                                infowindow_red.open(map, marker_red);
                                            });
                                        })(marker_red, infowindow_red);
                                    }
                                }
                            }
                        })
                    }
                })
                .catch(() => {
                    console.log("실패")
                })

            // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ매장정보 표시 추가하기ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ            


            let sta_wrap = document.querySelector('#sta_wrap'),
                back = document.createElement('button'),
                info = document.createElement('div'),
                hr = document.createElement('hr');
            // hotPlace = document.querySelector('.hotPlace');

            sta_wrap.style.display = "flex";

            back.innerHTML = '지역구 다시 선택하기';
            back.id = "back_btn";
            back.className = 'addbtn'         // css 추가
            back.addEventListener("click", function () {
                selectArea2(WGS_points, Title, center, center_name, head);         // 지역구 다시 선택하기

                // if (back) {
                //     while (hotPlace.hasChildNodes()) {
                //         hotPlace.removeChild(hotPlace.lastChild);
                //     }
                // }
            })
            info.innerHTML = select + '인근 추천역 ' + info_len + '개';
            info.id = "info";
            hr.id = "hr";

            sta_wrap.appendChild(back);
            sta_wrap.appendChild(info);
            sta_wrap.appendChild(hr);

            for (let i = 0; i < p_latlng.length; i++) {
                let new_sta = document.createElement('a');
                new_sta.id = "new_sta";
                new_sta.innerHTML = '<div>' + (STA)["station"][nth_gu]["info"][i].PstationName + ' 길찾기 ></div>';
                new_sta.href = "https://map.kakao.com/link/to/" + (STA)["station"][nth_gu]["info"][i].PstationName + "," + p_latlng[i][0] + "," + p_latlng[i][1];
                sta_wrap.appendChild(new_sta);
            }


            // for (let p = 0; p < p_latlng.length; p++) {                         //나중에 시간있으면 추가
            //     for (let i = 0; i < WGS_points.length; i++) {
            //         searchPubTransPathAJAX(WGS_points, p_latlng[p][0], p_latlng[p][1], i);
            //     }
            // }

            // }
        }
        geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
    }

    function midAreaHot(midArea) {
        let seoulGu = ['도봉구', '강북구', '노원구', '성북구', '중랑구', '은평구', '서대문구', '종로구', '동대문구', '중구', '성동구', '광진구', '마포구', '용산구', '강서구', '양천구', '영등포구', '구로구', '금천구', '관악구', '동작구', '서초구', '강남구', '송파구', '강동구'];
        if (seoulGu.includes(midArea)) {
            axios.get("https://wjm.potados.com/api/restaurants", {
                params: { area: midArea }
            })
                .then((i) => {
                    let copy = []
                    for (let j in i.data) {
                        copy.push(i.data[j])
                    }
                    setHotPlace(copy)
                })
                .catch(() => {
                    console.log("실패")
                })
        }
    }

    return (
        <>
            <div id="myMap"
                style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', }}>
            </div>

            <div id="overlay">
                <div id="menu_wrap" className="bg_white">
                    <div className='start_bd'>
                        {/* <button type="button" onClick={() => reload()}>다시하기</button> */}
                        <button id="addbtn2" className='addbtn' onClick={() => start(addLatlng, addName)}>중간 장소 찾기</button>
                        <button className='addbtn' onClick={() => buttonAdd(searchPlace)}>출발지 추가</button>
                        <div>{addName.map((a, i) => (

                            <div key={i} className='submitAddress'>
                                <div>{a}</div>
                                <button className="deleteBtn" onClick={() => {
                                    let copy = [...addLoc];
                                    let copy2 = [...addLatlng];
                                    let copy3 = [...addName];
                                    copy.splice(i, 1)
                                    copy2.splice(i, 1)
                                    copy3.splice(i, 1)
                                    setAddLoc(copy);
                                    setAddLatlng(copy2)
                                    setAddName(copy3);
                                }}>X</button>
                            </div>))}
                        </div>
                    </div>
                    <hr></hr>
                </div>
                <div id="sta_wrap" className="bg_white">
                </div>
            </div>

            <div className='hotPlace'>
                {hotPlace.length > 0 ? <div className='hotPlaceTitle'>hot place list</div> : null}
                {
                    hotPlace.map((a, i) => (
                        //geocoder.addressSearch(a.address)
                        <div className='hotPlace1' key={i}>
                            {/* onClick={() => { window.location.href = `https://map.kakao.com/link/search/${a.address}` }} */}
                            <a className='hpName'>{a.name}</a>
                            <br />{a.address}
                            <br />리뷰 긍정도 : {a.keyword}%
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default ClickAdd;

function gtot(WGS_points, WTM_points) {     // WGS좌표계 리스트를 WTM좌표계 리스트로 변환
    for (let i = 0; i < WGS_points.length; i++) {
        let latlng = new kakao.maps.LatLng(WGS_points[i][0], WGS_points[i][1]),
            coords = latlng.toCoords();
        WTM_points[i] = [coords.getX() * 0.4, coords.getY() * 0.4];
    }
}

function new_gtot(c_Lat, c_Lng) {     // WGS좌표계 리스트를 WTM좌표계로 변환
    let latlng = new kakao.maps.LatLng(c_Lat, c_Lng),
        coords = latlng.toCoords();
    return {
        x: coords.getX() * 0.4,
        y: coords.getY() * 0.4
    };
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

    for (let i = 0; i < WTM_points.length; i++) {    // x좌표만 px에 담음
        let p = WTM_points[i];
        px[i] = p[0];
    }

    const result = px.sort(function (a, b) {   // px 오름차순 정렬
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
    if (y.length === 0) {
        return [];
    }
    let middle = y[0][1],
        middle_t = [y[0]],
        len = y.length,
        left = [],
        right = [];

    for (let i = 1; i < len; ++i) {
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

    for (let i = 0; i < poly_points.length; i++) {
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

function getUnitvec(WGS_points, center_x, center_y, ggg) {
    let unitVec = [];

    for (let i = 0; i < WGS_points.length; i++) {
        unitVec[i] = [WGS_points[i][0] - center_x, WGS_points[i][1] - center_y];
    }
    // console.log("각 출발지까지 단위벡터", unitVec);

    let addWeight = [],
        weigtVec = [];

    addWeight[0] = 0;
    addWeight[1] = 0;


    for (let i = 0; i < WGS_points.length; i++) {
        addWeight[0] += (unitVec[i][0] * ggg[0][i]);  // ggg는 가중치 값
        addWeight[1] += (unitVec[i][1] * ggg[0][i]);
    }

    weigtVec[0] = [addWeight[0] / unitVec.length, addWeight[1] / unitVec.length];

    return {
        unitVec: unitVec,
        addWeight: addWeight,
        weigtVec_x: weigtVec[0][0],
        weigtVec_y: weigtVec[0][1]
    }
}


function getNewcenter(weigtVec_x, center_x, weigtVec_y, center_y) {
    let new_center = [];
    new_center[0] = [weigtVec_x + center_x, weigtVec_y + center_y];

    return {
        center_x2: new_center[0][0],
        center_y2: new_center[0][1]
    }
}

    // function searchPubPOIRadius(c_Lat, c_Lng, WGS_points) {                                //반경 n미터 지하철역 찾기 시간나면 추가하기
    //     var xhr = new XMLHttpRequest();
    //     var url = "https://api.odsay.com/v1/api/pointSearch?x=" + c_Lng + "&y=" + c_Lat + "&radius=1500&stationClass=2&apiKey=6g%2BFZMSoP6lKIQicoZdy5Q";
    //     xhr.open("GET", url, true);
    //     xhr.send();
    //     xhr.onreadystatechange = function () {

    //         if (xhr.readyState == 4 && xhr.status == 200) {
    //             // console.log(JSON.parse(xhr.responseText));
    //             // console.log(xhr.responseText);

    //             var poiCount = (JSON.parse(xhr.responseText))["result"].count;
    //             console.log(JSON.parse(xhr.responseText)["result"].count);

    //             for (let c = 0; c < poiCount; c++) {
    //                 for (let i = 0; i < WGS_points.length; i++) {
    //                     let latt = (JSON.parse(xhr.responseText))["result"]["station"][c].y,
    //                         lngg = (JSON.parse(xhr.responseText))["result"]["station"][c].x;

    //                     searchPubTransPathAJAX(WGS_points, latt, lngg, i);

    //                 }
    //             }
    //         }
    //     }
    // }