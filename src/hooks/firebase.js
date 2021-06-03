import firebase from 'firebase';
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

export const useDoc = (path) => {
    const { firestore } = useFirebase();
    const [data, setData] = useState(null);

    useEffect(() => {
        if (firestore) {
            firestore.doc(path).get().then(function(doc) {
                setData(doc.data())
            })
        }
    }, [firestore, path])

    const updateRecord = (data) => {
        return firestore.doc(path).set(
            { ...data }, { merge: true }
        )
    }

    const deleteRecord = (path) => {
        return firestore.doc(path).delete();
    }

    const readAgain = () => {
        firestore.doc(path).get().then(function(doc) {
            setData(doc.data())
        }).catch(function(error) {
            console.log("Error getting cached document:", error);
        });
    }

    return {data, updateRecord, deleteRecord, readAgain}
}

export const useCol = (path) => {

    const { firestore } = useFirebase();
    const [data, setData] = useState([]);

    useEffect(() => {
        if(firestore && path) {
            const unsubscribe = firestore.collection(path).onSnapshot((querySnapshot) => {
                setData(querySnapshot.docs.map((doc) => doc.data()))
            })

            return () => unsubscribe();
        }
    }, [firestore, path])

    const updateRecord = (id, data) => {
        console.log(id)
        if (firestore)
            return firestore.collection(path).doc(id).set(
                {
                    ...data
                },
                {
                    merge: true
                },
            )
        else
            return null
    }


    const createRecord = (id, data) => {
        if(id === '') {
            return firestore.collection(path).doc().set(
                {
                    ...data
                }
            )
        }
        return firestore.collection(path).doc(id).set(
            {
                ...data
            }
        )
    }

    const deleteRecord = (id) => {
        return firestore.collection(path).doc(id).delete();
    }


    return {data, updateRecord, deleteRecord, createRecord}
}