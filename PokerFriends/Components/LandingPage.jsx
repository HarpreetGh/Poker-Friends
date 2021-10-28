import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, SafeAreaView, 
  Pressable, TouchableOpacity, Alert, StatusBar} from 'react-native';
import { StatusBar as StatusBarExpo, setStatusBarHidden } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';

import HelpButton from './HelpButton'
import Logo from './Logo'
import firebase from 'firebase'
import Balance from './Balance'
import Notification from './Notification'
import Logout from './Logout'


export default class LandingPage extends Component {

  LogOut = () => {
    if(this.props.userData.in_game == ''){
      firebase.auth().signOut()
      .then(() => {
      // Sign-out successful.
      }).catch((error) => {
        console.log(error)
        // An error happened.
      });
    }
    else{
      Alert.alert("Cannot Logout",
      "You are currently in a game! Please leave this game, to Logout."
      )
    }
  } 
  
  SignedIn = () => {
      return(
        <SafeAreaView style={styles.container}>
          <StatusBarExpo style="light"/>
          <View style={styles.topRow}>
            {this.AccountSettings()}

            <View style={{flexDirection:'row', }}>
              <Balance chips={this.props.userData.chips}/>
              <Notification userData={this.props.userData}/>
            </View> 
          </View>
          
          <Logo/>

          <View style={styles.SignedView}>
            {this.props.userData.in_game == ''? (
              <View style={{
                width: '100%',
                alignItems: 'center',
                alignContent: 'center'
              }}>
                <TouchableOpacity 
                  style={styles.button}
                  onPress = {() => {
                    this.props.navigation.navigate('JoinGame');
                  }}
                >
                  <Text style={styles.textStyle}>Join Game</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.button}
                  onPress = {() => {
                    this.props.navigation.navigate('CreateGame'); 
                  }}
                >
                  <Text style={styles.textStyle}>Create Game</Text>
                </TouchableOpacity>
              </View>
            ):(
              <TouchableOpacity 
                style={[styles.button, {backgroundColor:"#c80c0d"}]}
                onPress = {() => {
                  setStatusBarHidden(true, 'slide');
                  this.props.navigation.navigate('GameController'); ///// 'GameSetting'
                }}
              >
                <Text style={styles.textStyle}>Continue Game</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={styles.button}
              onPress = {() => {
                this.props.navigation.navigate('Leaderboard'); 
              }}
            >
              <Text style={styles.textStyle}>Leaderboard</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} 
              onPress = {() => this.LogOut()}
            >
              <Text style={styles.textStyle}>Log Out</Text>
            </TouchableOpacity>
            
          </View>

          <View style={styles.bottomRow}>

            <HelpButton/>

            {this.AccountStatistics()}

            {this.FriendsButton()}

          </View>
        </SafeAreaView>
      )
  }

  SignedOut = () => {
    return(
      <View style={styles.container}>
        <StatusBarExpo style="light"/>
        
        <Logo/>

        <View style={[styles.SignedView, {flex: 0.33}]}>

          <TouchableOpacity style={styles.button} 
            onPress = {() => this.props.navigation.navigate('Register')}>
                <Text style={styles.textStyle}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} 
            onPress = {() => this.props.navigation.navigate('Login')}>
                <Text style={styles.textStyle}>Login</Text>
          </TouchableOpacity>

        </View>
      </View>
    )
  }

  AccountSettings = () => {
    return(
    <View style={styles.SettingcornerView}>
      <TouchableOpacity style={styles.Settingbutton}
        onPress = {() => this.props.navigation.navigate('AccountSettings')}>
          <Text style={styles.SettingtextStyle}>Account Settings</Text>
      </TouchableOpacity>
    </View>
    )
  }

  AccountStatistics = () => {
    return(
    <View >
      <TouchableOpacity style = {styles.accountStatsButton} 
        onPress = {() => this.props.navigation.navigate('AccountStats')}>
          <Text style={styles.SettingtextStyle}>Account Stats</Text>
      </TouchableOpacity>
    </View>
    )
  }

  FriendsButton = () => {
    return(
    <TouchableOpacity style={styles.Settingbutton} 
      onPress = {() => this.props.navigation.navigate('FriendsList')}>
      <Text style={styles.textStyle}>Friends</Text>
    </TouchableOpacity>
    )
  }

    render(){    
      if (this.props.LoggedIn){
        return(this.SignedIn())
      }
      else {
        return(this.SignedOut())
      }
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2ecc71',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textStyle:{
    alignItems: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  button:{
    backgroundColor: '#27ae60',
    paddingVertical: 20,
    padding: 50,
    borderRadius: 50,
    width:"100%",
    marginBottom: 20
  },
  accountStatsButton: {
    borderRadius: 50,
    padding: 10,
    elevation: 2,
    backgroundColor: "#27ae60",
  },
  topRow:{
    flexDirection: "row",
    justifyContent: "space-between",
    width: '90%',
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight+5 : 0
  },
  bottomRow:{
    flexDirection: 'row',
    justifyContent: "space-between",
    width: '90%',
    marginVertical: 20
  },
  SettingcornerView: {
    justifyContent: "flex-start",
    alignSelf: 'flex-start'
  },
  Settingbutton: {
    borderRadius: 50,
    padding: 10,
    elevation: 2,
    backgroundColor: "#27ae60"
  },
  SettingtextStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  SignedView: {
    width: '60%',
    alignItems: 'center',
    alignContent: 'center'
  }
});