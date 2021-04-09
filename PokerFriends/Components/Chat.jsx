//@refresh reset
import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat } from 'react-native-gifted-chat'
import {
    Alert, 
    Modal, 
    StyleSheet, 
    Text, 
    Pressable, 
    View, 
    TouchableOpacity,
    LogBox,
    } from "react-native";

import * as firebase from 'firebase'
import 'firebase/firestore'


//No more error about v
LogBox.ignoreLogs(['Setting a timer for a long period of time'])
LogBox.ignoreLogs(['VirtualizedLists should never be nested'])

const db = firebase.firestore()
const chatRef = db.collection('chat')


export default function Chat (){
 const [modalVisible, setModalVisible] = useState(false)

 var user = firebase.auth().currentUser;
 var userName = user.displayName.slice(0, user.displayName.indexOf('#'))
 var userid = user.uid
 
 const [userInChat] = useState({ _id:userid, name:userName})
 const [messages, setMessages] = useState([])
   
    // this.state = {
    //   modalVisible: false,
    //   user: {userName},
    //   messages: []
    // }

  useEffect (()=> {
    const unsubscribe = chatRef.onSnapshot(querySnapshot =>{
      const messagesFirestore = querySnapshot.docChanges()
      .filter(({type}) => type === 'added')
      .map(({doc}) => {
        const message = doc.data()
        return {...message, createdAt: message.createdAt.toDate()}
      }).sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime())
      appendMessages(messagesFirestore)
    })
  
    return () => unsubscribe()
  },[])

const appendMessages = useCallback(
  (messages) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages,messages))
  },
  [messages]
)

 async function handleSend(messages){
  const writes = messages.map(m => chatRef.add(m))
  await Promise.all(writes)
}


return (
  <View >
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
        

        
          <Text style = {{fontWeight:'bold', marginTop:-10, fontSize: 30, marginBottom: 25, textAlign:'center' }} >
            Chat room
          </Text> 
        
            <GiftedChat
              messages = {messages}
              renderUsernameOnMessage = {true}
              user = {userInChat}
              onSend = {handleSend}
              placeholder = {'Type'}

            />
         
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.textStyle}>EXIT</Text>
          </Pressable>
      
      
    </Modal>
    <TouchableOpacity
      style={[styles.button, styles.buttonOpen]}
      onPress={() => setModalVisible(!modalVisible)}
    >
      <Text style={styles.textStyle}>CHAT</Text>
    </TouchableOpacity>
  </View>
);
}


const styles = StyleSheet.create({

buttonTextView: {
flex: 1,
justifyContent: "center",
alignItems: "center",
marginTop: 22
},
modalView: {
margin: 20,
backgroundColor: "white",
borderRadius: 20,
padding: 35,
alignItems: "center",
shadowColor: "#000",
shadowOffset: {
  width: 0,
  height: 2
},
shadowOpacity: 0.25,
shadowRadius: 4,
elevation: 5
},
button: {
borderRadius: 50,
padding: 10,
elevation: 2
},
buttonOpen: {
backgroundColor: "#27ae60",
},
buttonClose: {
backgroundColor: "#2196F3",
marginTop:20
},

modalText: {
marginBottom: 35,
marginLeft: -50,
marginRight: -50,
textAlign: "left",
fontSize: 20
}
});


