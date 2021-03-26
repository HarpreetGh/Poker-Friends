import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, Pressable, TouchableOpacity } from 'react-native';
import HelpButton from './HelpButton'
import Logo from './Logo'
import Login from './Login'
import Register from './Register'
import firebase from 'firebase'
import ForgotPassword from './Account-Settings/ForgotPassword'
import FriendsButton from './FriendsButton'
import SettingsButton from './AccountSettings'
import Balance from './Balance'
import * as ScreenOrientation from 'expo-screen-orientation';

const LogOut = () => {
  firebase.auth().signOut()
  .then(() => {
  // Sign-out successful.
  }).catch((error) => {
    console.log(error)
    // An error happened.
  });
}

export default class LandingPage extends Component {
    
  SignedIn = () =>{
    return(
      <View>
        <TouchableOpacity 
          style={styles.button}
          onPress = {() => {
            this.props.navigation.navigate('GameController'); ///// 'GameSetting'
            ScreenOrientation.lockAsync
            (ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
          }}
        >
          <Text style={styles.textStyle}>Play Game</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress = {() => {
            this.props.navigation.navigate('CreateGame'); 
          }}
        >
          <Text style={styles.textStyle}>Create Game</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} 
          onPress = {() => LogOut()}>
              <Text style={styles.textStyle}>Log Out</Text>
        </TouchableOpacity>

        
      </View>
    )
  }

  SignedOut = () => {
    return(
      <View>

        <TouchableOpacity style={styles.button} 
          onPress = {() => this.props.navigation.navigate('Register')}>
              <Text style={styles.textStyle}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} 
          onPress = {() => this.props.navigation.navigate('Login')}>
              <Text style={styles.textStyle}>Login</Text>
        </TouchableOpacity>

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
    render(){    
        return (
          <View style={styles.container}>

            <View style={styles.flexContainer}>
              {this.props.LoggedIn? (this.AccountSettings()):(<Text></Text>)}

              {/*<Balance/>*/}
            </View>
            
            <Logo/>

            {this.props.LoggedIn? (this.SignedIn()):(this.SignedOut())}

            {this.props.LoggedIn? (this.AccountStatistics()):(<Text>PLEASE LOG IN TO SEE STATS</Text>)}

            <View style={styles.flexContainer}>
              <HelpButton/>
              <FriendsButton navigation = {this.props.navigation}/>
            </View>

          </View>
        );
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2ecc71',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle:{
    alignItems: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold'
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
    top: '125%'
  },
  flexContainer:{
    flexDirection: 'row',
    margin: 20,
    width: 'auto',
    height: 'auto'
  },
  SettingcornerView: {
    justifyContent: "flex-start",
    alignSelf: 'flex-start',
    right: 80,
    top: 10
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
  }
});