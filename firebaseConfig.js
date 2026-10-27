// Configuración de Firebase.
//
// SOBRE LA apiKey: no es un secreto y no hay que esconderla. En Firebase web
// identifica al proyecto, viaja siempre en el paquete que descarga el
// navegador y Google la documenta como pública. Quien protege los datos son
// las reglas de seguridad: ver firestore.rules en la raíz del repositorio.
//
// Distinto es la llave de la API de Google Maps: esa sí se saca del código y
// se restringe por referente HTTP. Ver .env.example.

import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzoG183JQS9K2PliZQSe2NnteyVr4NQg8",
  authDomain: "mywedding-144c2.firebaseapp.com",
  projectId: "mywedding-144c2",
  storageBucket: "mywedding-144c2.appspot.com",
  messagingSenderId: "130439074303",
  appId: "1:130439074303:web:886d6e41e9585f0d2f57ca",
  measurementId: "G-G3VBM8S9EY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { app, db, auth };
