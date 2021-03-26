import React, { Component } from "react";
import { Image, 
        Alert, 
        Modal, 
        StyleSheet, 
        Text, 
        Pressable, 
        View, 
        TouchableOpacity,
        ScrollView,
        Linking} from "react-native";
import firebase from 'firebase'


//TODO: Pass in balance value from account to text render
export default class Balance extends Component {
  constructor(props){
    super(props)
    this.state = {
      chips: 0
    }
  }

  render() {
    var user = firebase.auth().currentUser;
    if(user){
      firebase.database().ref('/users/' + user.uid).once('value').then((snapshot) => {
        this.setState({chips: snapshot.val().chips})
      });
    return (
        <View style={styles.cornerView}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.textStyle}>{this.state.chips +" Chips"}</Text>
          </TouchableOpacity>
        </View>
        )
    }
    else{
      return (
        <View style={styles.cornerView}>
          <TouchableOpacity style={styles.button}>
          
            <Text style={styles.textStyle}>{this.state.chips + " Chips"}</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  cornerView: {
    justifyContent: "flex-start",
    alignSelf: 'flex-start',
    left: 80,
    top: 10
  },
  button: {
    borderRadius: 50,
    padding: 10,
    elevation: 2,
    backgroundColor: "#27ae60"
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});

