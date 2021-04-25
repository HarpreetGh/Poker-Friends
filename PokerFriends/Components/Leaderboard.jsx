import React, { Component, useState } from 'react'
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, TouchableOpacity, ActivityIndicator, FlatList, List, ListItem, Touchable, Alert, SafeAreaView } from 'react-native';
import Logo from './Logo';
import firebase from 'firebase'
import * as ScreenOrientation from 'expo-screen-orientation';

export default class Leaderboard extends Component {
  constructor(props){
    super(props)
    this.state = {
      gameList: [],
      ready: false,
      lbStatistic: 'chips'
    }
  }

  componentDidMount(){
    firebase.database().ref('/users/').orderByChild(this.state.lbStatistic).on('value', (snapshot) => {
      var data =  []
      snapshot.forEach((child) => {
        data.push({
        key: child.val().username,
        chips: child.val().chips,
        chips_won: child.val().chips_won,
        chips_lost: child.val().chips_lost,
        wins: child.val().wins
      })
    })
    data.reverse()
    //this.checkHost(data)
    this.setState({gameList: data, ready: true})
    })
  }
  componentDidUpdate(){
    firebase.database().ref('/users/').orderByChild(this.state.lbStatistic).on('value', (snapshot) => {
      var data =  []
      snapshot.forEach((child) => {
        data.push({
        key: child.val().username,
        chips: child.val().chips,
        chips_won: child.val().chips_won,
        chips_lost: child.val().chips_lost,
        wins: child.val().wins
      })
    })
    data.reverse()
    //this.checkHost(data)
    this.state.gameList = data
    this.state.ready = true
    })
  }

   componentWillUnmount(){
    //stops checking for updates on list
    firebase.database().ref('/users/').off()
  }

  render(){
    if(this.state.ready){
      return (
          <KeyboardAvoidingView 
            style={styles.container}
          >
                
              <View style={styles.statButtonsContainer}>
                <TouchableOpacity style={styles.statButton}
                onPress={() => this.setState({lbStatistic: 'chips'})}>
                    <Text style={styles.statButtonText}>Total Chips</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.statButton}
                onPress={() => this.setState({lbStatistic: 'wins'})}>
                    <Text style={styles.statButtonText}>Total Wins</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.statButton}
                onPress={() => this.setState({lbStatistic: 'chips_won'})}>
                    <Text style={styles.statButtonText}>Total Chips Won</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.statButton}
                onPress={() => this.setState({lbStatistic: 'chips_lost'})}>
                    <Text style={styles.statButtonText}>Total Chips Lost</Text>
                </TouchableOpacity>
              </View>
              <View style={{flex:1, alignSelf:'center', justifyContent:'center', paddingBottom: 10}}>
                <FlatList style={{width:'100%'}}
                  data={this.state.gameList}
                  keyExtractor={(item)=>item.key}
                  renderItem={({item})=>{
                    return(
                      <View style={styles.gameDisplay}>
                        <Text style={styles.textStyle}>{item.key.slice(0, item.key.indexOf('#'))}</Text>
                        <Text style={styles.textStyle}>Chips: {item.chips} Wins: {item.wins} </Text>
                        <Text style={styles.textStyle}>ChipsWon: {item.chips_won} ChipsLost: {item.chips_lost}</Text>
                      </View>)
                  }}/>     
              </View>

              <TouchableOpacity style={styles.buttonContainer}
              onPress={() => this.props.navigation.navigate('LandingPage')}>
                  <Text style={styles.registerButtonText}>Go Back</Text>
              </TouchableOpacity>
          </KeyboardAvoidingView>
      );
    }
    else{
      return(
        <View style={[styles.readyContainer, styles.horizontal] }>
          <ActivityIndicator size='large' color="#FB6342"/>
        </View>
      )
    }
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
  readyContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameDisplay:{
    backgroundColor: '#27ae60',
    borderRadius: 50,
    width:"100%",
    padding: 20,
    marginBottom: 10,
  },
  joinButton:{
    backgroundColor: '#000000',
    borderRadius: 50,
    width:"95%",
    paddingTop: 5,
    marginLeft: 5
  },
  buttonContainer:{
    backgroundColor: '#27ae60',
    paddingVertical: 20,
    padding: 20,
    borderRadius: 50,
    width:"100%",
    marginBottom: 20
  },
  registerButtonText: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: '900'
  },
  statButtonText: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: '900'
  },
  statButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 20,
    padding: 5,
    borderRadius: 50,
  },
  input: {
    height:40,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginBottom: 20,
    color: '#FFF',
    paddingHorizontal: 20,
    paddingEnd: 10,
    borderRadius: 50,
    width:'100%'
  },
  statButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 100
  }
})