
import { useState, useEffect, useRef, useContext } from "react";
import { getMessaging, getToken, onMessage, isSupported } from "@react-native-firebase/messaging";
import { db, m_app } from "./firebase";
import { getFirestore, doc, collection, setDoc, updateDoc, getDoc } from '@react-native-firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "@react-native-firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useAuthContext } from '../context/AuthContext'

const UseFirebase = () => {

    const [messaging, setMessaging] = useState()
    const [fcmToken, setFcmToken] = useState();
    const [chatListRef, setChatListRef] = useState()
    const [chatInboxRef, setChatInboxRef] = useState()
    const [storage, setStorage] = useState()

    // const { userProfile } = useAuthContext()

    useEffect(() => {
        try {

            if (messaging) return
            const init = async () => {
                const supported = await isSupported()
                if (supported) {
                    const messaging = getMessaging(m_app);
                    setMessaging(messaging)
                    const token = await requestForToken(messaging)
                    setFcmToken(token)
                }
            }
            init()
        } catch (err) {
            console.log(err, 'messaging');
        }
    }, [messaging])

    useEffect(() => {
        try {
            const chatList = doc(db, 'chat', 'chat_list');
            const chatInbox = doc(db, 'chat', 'inbox');
            setChatListRef(chatList)
            setChatInboxRef(chatInbox)
        } catch (err) {
            console.log(err, 'o');
        }
    }, [])

    useEffect(() => {
        const storage = getStorage();
        setStorage(storage)
    }, [])

    const addChatToInbox = async (recId, senderObj, receiverObj, text) => {
        let userProfile = JSON.parse(await AsyncStorage.getItem("userData"))
        const userId = userProfile._id;

        const senderRef = doc(collection(db, 'chat', 'inbox', `${userId}`), recId);
        await setDoc(senderRef, senderObj);

        //receiver  
        const receiverRef = doc(collection(db, 'chat', 'inbox', `${recId}`), userId);
        await setDoc(receiverRef, receiverObj);

        //Update receiver unread count
        const receiverDoc = await getDoc(receiverRef);

        if (receiverDoc.exists()) {
            const receiverData = receiverDoc.data();

            const updatedReceiverData = {
                ...receiverObj,
                last_message: text ?? '',
                unread: receiverData?.unread ? receiverData.unread + 1 : 1,
            };
            console.log("Document data:", receiverData, updatedReceiverData);
            await updateDoc(receiverRef, updatedReceiverData);
        } else {
            console.log("No such document!");
        }

        console.log(senderObj, "ADD TO INBOX", receiverDoc);
    };

    const markRead = async (recId) => {
        let userProfile = JSON.parse(await AsyncStorage.getItem("userData"))

        const userId = userProfile._id
        const receiverRef = doc(collection(db, 'chat', 'inbox', `${userId}`), recId);
        const receiverDoc = await getDoc(receiverRef);
        if (receiverDoc.exists()) {
            const receiverData = receiverDoc.data();
            const updatedReceiverData = {
                ...receiverData,
                unread: 0
            };
            await updateDoc(receiverRef, updatedReceiverData);
        }

    }

    const addMessageToChat = async (recId, obj) => {
        let userProfile = JSON.parse(await AsyncStorage.getItem("userData"))

        const timestamp = new Date().getTime();
        const userId = userProfile._id

        const senderRef = doc(collection(db, 'chat', 'chat_list', `${userId}_${recId}`), timestamp.toString());
        await setDoc(senderRef, obj);


        const receiverRef = doc(collection(db, 'chat', 'chat_list', `${recId}_${userId}`), timestamp.toString());
        await setDoc(receiverRef, obj);

    }

    const requestForToken = (messaging) => {
        if (!messaging) return ''
        return new Promise((resolve, reject) => {
            getToken(messaging, { vapidKey: `BHkmT91oF8SKY2DrNdtZQSsfQIdTAUVPJFZiD1SgzXqE7ImBJZj0z7f7DryHczCoxJ8zJsbTk38DLLQQuetIOzU` })
                .then((currentToken) => {
                    if (currentToken) {
                        console.log('current token for client: ', currentToken);
                        resolve(currentToken)
                    } else {
                        requestPermission()
                        console.log('No registration token available. Request permission to generate one.');
                    }
                })
                .catch((err) => {
                    requestPermission()
                    console.log('An error occurred while retrieving token. ', err);
                });
        })
    }

    function requestPermission() {
        console.log('Requesting permission...');
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                requestForToken()
            } else {
                console.log('Permission for notifications has been denied');
            }
        });
    }

    return {
        fcmToken,
        addChatToInbox,
        addMessageToChat,
        markRead,
        chatInboxRef,
        chatListRef,
        db
    }
}

export default UseFirebase