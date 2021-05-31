import firebase from "firebase";
import { useEffect, useState } from 'react';

const config = {
    apiKey: "AIzaSyD35nNuflkSpY9tNjuD5TOL0QZynetEN-c",
    authDomain: "weather-app-nest.firebaseapp.com",
    projectId: "weather-app-nest",
    storageBucket: "weather-app-nest.appspot.com",
    messagingSenderId: "861347883002",
    appId: "1:861347883002:web:e6b2d98e5399abe8182643",
    measurementId: "G-8L0SB8QBXM"
};

export const useFirebase = () => {
    const [state, setState] = useState({firebase});

    useEffect(() => {
        let app;
        if(!firebase.apps.length) {
            app = firebase.initializeApp(config);
        }
        const auth = firebase.auth(app);
        const firestore = firebase.firestore(app);

        setState({firebase, app, auth, firestore});
    }, [config])

    return state;
}