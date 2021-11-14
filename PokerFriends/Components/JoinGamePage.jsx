import React, { Component, useState } from 'react'
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, TouchableOpacity, FlatList, Switch } from 'react-native';
import firebase from 'firebase'
import {setStatusBarHidden } from 'expo-status-bar';
import { joinGame } from './Utils/JoinGame'

export default class JoinGamePage extends Component {
  constructor(props){
    super(props)
    this.state = {
      name: '',
      gameList: [],
      sortBy: 'size',

      reverse: false,
      upDown: ["Descending", "Ascending"]
    }
  }

  componentDidMount(){
    firebase.database().ref('/games/list/').orderByChild('size').endAt(3).on('value', (snapshot) => {
      var data =  []
      snapshot.forEach((child) => {
        data.push({
          key: child.key,
          buyIn:child.val().buyIn,
          size: child.val().size
        })
      })
      this.SortData(data)
    })
  }

  componentWillUnmount(){
    //stops checking for updates on list
    firebase.database().ref('/games/list/').off()
  }

  SortData(data){
    var sort = this.state.sortBy
    if(this.state.reverse){
      data.sort(function (a, b) {return a[sort] - b[sort]});
    }
    else{
      data.sort(function (a, b) {return b[sort] - a[sort]});
    }
    var data2 = data.filter(game => game.buyIn <= this.props.userData.chips) 

    this.setState({gameList: data2})
  }

  newSortData(sort){
    this.setState({sortBy: sort}, () => this.SortData(this.state.gameList))
  }

  ReverseData = () => {
    this.setState({
      reverse: !this.state.reverse,
      gameList: this.state.gameList.reverse()
    })
  }

  render(){
    return (
        <KeyboardAvoidingView 
          style={styles.container}
        >
          <View style={styles.balance}>
            <TouchableOpacity style={[styles.buttonContainer, {marginBottom: 0}]}
            disabled={true}>
                <Text style={styles.sortTextStyle}>Your Balance: {this.props.userData.chips}</Text>
            </TouchableOpacity> 
          </View>

          <View style={styles.sortContainer}>
            <TouchableOpacity style={styles.sortButton}
              onPress={() => this.newSortData('size')}
            >
              <Text style={styles.sortTextStyle}>Size</Text>
            </TouchableOpacity>

           <TouchableOpacity style={styles.sortButton}
              onPress={() => this.newSortData('buyIn')}
            >    
              <Text style={styles.sortTextStyle}>Buy In</Text>
            </TouchableOpacity>

            
            <View style={styles.switchContainer}>
              <Text style={[styles.sortTextStyle, {marginRight: 5}]}> {this.state.upDown[Number(this.state.reverse)]}</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={this.state.reverse ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={this.ReverseData}
                value={this.state.reverse}
              /> 
            </View>
          </View>

          <View style={{flex:1, alignSelf:'center', justifyContent:'center', paddingBottom: 10, width: '100%'}}>
            <FlatList
              horizontal={false}
              numColumns={2}
              data={this.state.gameList}
              keyExtractor={(item)=>item.key}
              renderItem={({item})=>{
                return(
                  <View style={styles.gameDisplay}>
                    <Text style={[styles.textStyle, {fontSize: 20}]}>{item.key.slice(item.key.indexOf('_')+1, item.key.indexOf('-'))}</Text>
                    <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                      <Text style={styles.textStyle}>Size: {item.size}</Text>
                      <Text style={styles.textStyle}> Buy In: {item.buyIn}</Text>
                    </View>
                    <TouchableOpacity style={styles.joinButton}
                    onPress={() => joinGame(item.key, this.props.userData.chips, this.props.navigation)}>
                      <Text style={styles.textStyle}>Join Game</Text>
                    </TouchableOpacity>
                  </View>)
              }}/>     
            </View>

            <TouchableOpacity style={[styles.buttonContainer, {width: '90%'}]}
            onPress={() => this.props.navigation.navigate('LandingPage')}>
                <Text style={styles.sortTextStyle}>Go Back</Text>
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
    flex: 1,
    backgroundColor: '#2ecc71',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gameDisplay:{
    backgroundColor: '#27ae60',
    borderRadius: 50,
    width:"45%",
    padding: 15,
    margin: 10
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
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignContent: 'center',
    width: '100%',
    marginBottom: 20
  },
  sortButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 50,
    width: '25%'
  },
  sortTextStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  switchContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#27ae60',
    padding: 10,
    borderRadius: 50,
  },
  registerButtonText: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: '900'
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
  balance: {
    marginTop: 20,
    padding: 20,
  },
})