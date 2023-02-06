// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDbF1CKZ3ZKzXcF5UVj6iLz01L9HkSI2FY',
  authDomain: 'v3f9-7f948.firebaseapp.com',
  databaseURL:
    'https://v3f9-7f948-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'v3f9-7f948',
  storageBucket: 'v3f9-7f948.appspot.com',
  messagingSenderId: '425460535534',
  appId: '1:425460535534:web:1d50dc84efa2e9cc29e3ff'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// 로그인
const auth = getAuth(app)

export { auth }
