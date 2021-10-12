//@refresh reset
import React, { useState, useEffect, useCallback } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
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
    KeyboardAvoidingView,
    SafeAreaView
    } from "react-native";

import firebase from 'firebase'
//import 'firebase/firestore'


//No more error about v
//LogBox.ignoreLogs(['Setting a timer for a long period of time'])
//LogBox.ignoreLogs(['VirtualizedLists should never be nested'])
var db = firebase.firestore()
//const chatRef = db.collection('chat')// + this.props.matchName

export default function Chat(matchInfo){
 const [modalVisible, setModalVisible] = useState(false)
 const chatRef = db.collection('gameChats/'+ matchInfo.matchType+ '/'+ matchInfo.matchName)// + this.props.matchName
 var user = firebase.auth().currentUser;
 var userName = user.displayName
 var userid = user.uid
 
 const [userInChat] = useState({ _id:userid, name:userName, avatar: user.photoURL})
 const [messages, setMessages] = useState([])
  const [newMessages, setNewMessages] = useState(0)

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
   setNewMessages(newMessages+2)
  const writes = messages.map(m => chatRef.add(m))
  await Promise.all(writes)
}


return (
  <View>
    <View>
      <Modal
        supportedOrientations={['landscape', 'portrait']}
        animationType="slide"
        transparent={false}
        visible={modalVisible}
      >     
          <Text style = {{fontWeight:'bold', paddingTop: 30, fontSize: 30, marginBottom: 25, textAlign:'center' }} >
            Chat room
          </Text> 
        
            <GiftedChat
              messages = {messages}
              renderUsernameOnMessage = {true}
              user = {userInChat}
              onSend = {handleSend}
              placeholder = {'Type'}
              //keyboardShouldPersistTaps = 'never'
              //bottomOffset={10}
            />
          
          <Pressable
            style={[styles.button, styles.buttonClose, {marginBottom: 20, width:'90%', marginLeft: 'auto', marginRight: 'auto'}]}
            onPress={() => {setModalVisible(false); ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)}}>
            <Text style={styles.exitTextStyle}>EXIT</Text>
          </Pressable>
        
      </Modal>
    </View>

    <TouchableOpacity
      style={[styles.button, styles.buttonOpen]}
      onPress={() => {setModalVisible(true); ScreenOrientation.unlockAsync()}}
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
    padding: 10
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
  },
  textStyle:{
    color: '#FFFFFF',
    fontWeight: 'bold',
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    alignContent: 'center'
    },
  exitTextStyle:{
    color: '#FFFFFF',
    fontWeight: 'bold',
  }
});


