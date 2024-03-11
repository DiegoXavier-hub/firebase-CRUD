import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBSui_Z3KPw2ldnFF3OFuJDKQTyDtAG8Pk",
    authDomain: "curso-7957a.firebaseapp.com",
    projectId: "curso-7957a",
    storageBucket: "curso-7957a.appspot.com",
    messagingSenderId: "858139373585",
    appId: "1:858139373585:web:e68e45c374cc35181a01b0",
    measurementId: "G-RWWX02MRSR"
};

const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)

export { db }