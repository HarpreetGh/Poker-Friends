import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, 
  TouchableOpacity, Touchable, Alert } from 'react-native';
import Logo from './Logo';
import firebase from 'firebase'

export default class FriendsList extends Component {
  constructor(props){
    super(props)
    var user = firebase.auth().currentUser;
    firebase.database().ref('/users/' + user.uid).once('value').then((snapshot) => {
        this.setState({chips: snapshot.val().friends})
    });
    this.state = {
      friends: '',
      friendsize: 0,
      newFriendname: ''
    }
  }
    render(){
        return (
            <KeyboardAvoidingView 
              style={styles.container} 
              >
                <Text style={styles.textStyle}>Friends</Text>
                <TouchableOpacity style={styles.buttonContainer}> 
                {/*onPress={() => this.Update()}>*/}
                    <Text style={styles.sendButtonText}>Frens</Text>
                </TouchableOpacity>

            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      padding: 20,
      flex: 1,
      backgroundColor: '#2ecc71',
      alignItems: 'center',
      justifyContent: 'center'
    },
    sendButtonText: {
      textAlign: 'center',
      color: '#FFF',
      fontWeight: '900'
    },
    textStyle: {
      marginBottom: 10,
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    buttonContainer:{
      backgroundColor: '#27ae60',
      paddingVertical: 20,
      padding: 20,
      borderRadius: 50,
      width:"100%",
      marginBottom: 20
    },
})