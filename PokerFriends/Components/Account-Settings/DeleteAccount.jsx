import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, 
  TouchableOpacity, Touchable, Alert } from 'react-native';
import Logo from '../Logo';
import firebase from 'firebase'

export default class DeleteAccount extends Component {
  constructor(props){
    super(props)
    this.state = {
      email: ''
    }
  }

  Delete(){
    var user = firebase.auth().currentUser;

    user.delete()
      .then(() =>{
        Alert.alert("Account Delete")
        this.props.navigation.navigate('LandingPage')
      })
      .catch(function(error) {
        console.log(error)
      });
  }
    render(){
        return (
            <KeyboardAvoidingView 
              style={styles.container} 
              >
                <Logo />
                <Text style={styles.textStyle}>Are you sure you want to Delete your account?</Text>

                <TouchableOpacity style={styles.yesButtonContainer} onPress={() => this.Delete()}>
                    <Text style={styles.yesSendButtonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.noButtonContainer} onPress={() => this.props.navigation.navigate('AccountSettings')}>
                    <Text style={styles.noSendButtonText}>No</Text>
                </TouchableOpacity>

            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    textStyle: {
      marginBottom: 10,
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    container: {
      padding: 20,
      flex: 1,
      backgroundColor: '#2ecc71',
      alignItems: 'center',
      justifyContent: 'center'
    },
    noButtonContainer:{
      backgroundColor: '#27ae60',
      paddingVertical: 20,
      padding: 20,
      borderRadius: 50,
      width:"100%",
      marginBottom: 20
    },
    yesButtonContainer:{
      backgroundColor: '#FB6342',
      paddingVertical: 20,
      padding: 20,
      borderRadius: 50,
      width:"100%",
      marginBottom: 20
    },
    noSendButtonText: {
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#FFF',
      fontWeight: '900'
    },
    yesSendButtonText: {
      textAlign: 'center',
      color: '#FFF',
      fontWeight: '900'
    }
})