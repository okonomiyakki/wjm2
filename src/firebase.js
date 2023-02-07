//firebase.js
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore'
import "firebase/firestore";

const firebaseConfig = {
    // firebase 설정과 관련된 개인 정보
    apiKey: "AIzaSyCbkgo4GiIa1z6sS-86xM1cZhvGH6gXH_M",
    authDomain: "wjm2-8a11c.firebaseapp.com",
    projectId: "wjm2-8a11c",
    storageBucket: "wjm2-8a11c.appspot.com",
    messagingSenderId: "1092144207101",
    appId: "1:1092144207101:web:d0b2d3a6f4619aa62c9a94"
};

// // firebaseConfig 정보로 firebase 시작
// firebase.initializeApp(firebaseConfig);

// // firebase의 firestore 인스턴스를 변수에 저장
// const firestore = firebase.firestore();

//         console.log(firestore);
// // 필요한 곳에서 사용할 수 있도록 내보내기
// export { firestore };
firebase.initializeApp(firebaseConfig);
export default firebase;