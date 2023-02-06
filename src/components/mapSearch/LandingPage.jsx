import React, { useState, useEffect } from 'react'
import ClickAdd from './ClickAdd';
import searchBtn from '../../images/search.png'
import Target from '../../images/target.png'

const { kakao } = window;

export function LandingPage() {
  const [InputText, setInputText] = useState('')
  const [Place, setPlace] = useState('') //지도에 반영
  let [clickPlace, setClickPlace] = useState([]);
  let [name, setName] = useState([]);
  let [lat, setLat] = useState([]);
  let [lng, setLng] = useState([]);

  useEffect(() => {
    let sta_wrap = document.querySelector('#sta_wrap');
    sta_wrap.style.display = "none";

    let container = document.getElementById('myMap'),
      mapOption = {
        center: new kakao.maps.LatLng(37.566826004661, 126.978652258309),
        level: 9
      };

    // 지도를 생성합니다    
    let map = new kakao.maps.Map(container, mapOption);

    const ps = new kakao.maps.services.Places();

    searchPlaces()

    function searchPlaces() {
      if (Place != "") {
        if (!Place.replace(/^\s+|\s+$/g, '')) {
          alert('검색 결과 중 오류가 발생했습니다.');
          return false;
        }

        ps.keywordSearch(Place, placesSearchCB); // 키워드로 장소검색 요청
      }
    }

    // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        // 정상적으로 검색이 완료됐으면
        // 검색 목록을 표출합니다
        displayPlaces(data);

        displayPagination(pagination);

      }
      else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
        setInputText("");
        return;
      }
      else if (status === kakao.maps.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
        setInputText("");
        return;
      }

    }

    // 검색 결과 목록과 마커를 표출하는 함수입니다
    function displayPlaces(places) {
      var listEl = document.getElementById('placesList'),
        menuEl = document.getElementById('menu_wrap2'),
        fragment = document.createDocumentFragment(),
        listStr = '';

      // 검색 결과 목록에 추가된 항목들을 제거합니다
      removeAllChildNods(listEl);

      for (var i = 0; i < places.length; i++) {

        var itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

        (function (address_name, lat, lng, place_name) {
          itemEl.onclick = function () {
            setClickPlace(address_name);
            setLat(lat);
            setLng(lng);
            setName(place_name);

          }
        })(places[i].address_name, places[i].y, places[i].x, places[i].place_name);


        fragment.appendChild(itemEl);
      }

      // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
      listEl.appendChild(fragment);
      menuEl.scrollTop = 0;
    }

    // 검색결과 항목을 Element로 반환하는 함수입니다
    function getListItem(index, places) {

      var el = document.createElement('li'),
        itemStr = '<span class="markerbg marker_' + (index + 1) + '"></span>' +
          '<div class="info">' +
          '   <h5>' + places.place_name + '</h5>';

      itemStr += '    <span>' + places.address_name + '</span>';

      el.innerHTML = itemStr;
      el.className = 'item';

      return el;
    }

    // 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
    function displayPagination(pagination) {
      var paginationEl = document.getElementById('pagination'),
        fragment = document.createDocumentFragment(),
        i;

      // 기존에 추가된 페이지번호를 삭제합니다
      while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild(paginationEl.lastChild);
      }

      for (i = 1; i <= pagination.last; i++) {
        var el = document.createElement('a');
        el.href = "#";
        el.innerHTML = i;

        if (i === pagination.current) {
          el.className = 'on';
        } else {
          el.onclick = (function (i) {
            return function () {
              pagination.gotoPage(i);
            }
          })(i);
        }

        fragment.appendChild(el);
      }
      paginationEl.appendChild(fragment);
    }

    // 검색결과 목록의 자식 Element를 제거하는 함수입니다
    function removeAllChildNods(el) {
      while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
      }
    }
  }, [Place]);

  const onChange = (e) => {        //엔터누르면 현재위치로 검색안되게하기
    setInputText(e.target.value);
    let ser = document.querySelector('#ser');
    ser.type = "submit"
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setPlace(InputText);
  }

  function removeAllChildNods(el) {
    while (el.hasChildNodes()) {
      el.removeChild(el.lastChild);
    }
  }

  function getAddr(lat, lng) {    // 현재위치 찾는 함수
    let geocoder = new kakao.maps.services.Geocoder();

    let coord = new kakao.maps.LatLng(lat, lng);
    let callback = function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        console.log(result[0].address.address_name);       //콘솔창에 현재위치

        let addr = result[0].address.address_name;

        let geocoder = new kakao.maps.services.Geocoder();

        geocoder.addressSearch(addr, function (result, status) {

          if (status === kakao.maps.services.Status.OK) {

            var listEl = document.getElementById('placesList'),    // 기존에 출력된 장소 목록 지우기
              paginationEl = document.getElementById('pagination');
            removeAllChildNods(listEl);
            removeAllChildNods(paginationEl);

            let ser = document.querySelector('#ser');
            ser.type = "button"

            setInputText(addr);
            setClickPlace(addr);
            setLat(result[0].y);
            setLng(result[0].x);
            setName(addr);
          }
        })
      }
    }
    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
  }

  function set_loc() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        let current_lat = position.coords.latitude,
          current_lon = position.coords.longitude;

        getAddr(current_lat, current_lon);

      })
    }
  }

  function er() {    //검색창 지우개
    setInputText("");
  }

  return (
    <div className='start_b'>
      <hr style={{
        margin: '20px'
      }}></hr>
      <div className="map_wrap">
        <ClickAdd searchPlace={clickPlace} InputText={InputText} lat={lat} lng={lng} name={name} />
        <div id="menu_wrap2" className="bg_white">
          <div className="option">
            <div>
              <form id="form_2" onSubmit={handleSubmit}>
                <button className='searchBtn' type="button" onClick={() => { set_loc() }}
                  style={{
                    margin: '5px'
                  }}><img src={Target} width='25px'></img></button>
                <input type="text" placeholder=' 출발지를 입력해 주세요!' onChange={onChange} value={InputText} id="keyword" size="30"></input>
                <button className='searchBtn' type="button" onClick={() => { er() }}>지우기</button>
                <button className='searchBtn' type="submit" id="ser"><img src={searchBtn} width="18px"></img></button>
              </form>
            </div>
          </div>
          <hr></hr>
          <ul id="placesList"></ul>
          <div id="pagination"></div>
        </div>
      </div>
    </div >
  )
}

export default LandingPage
