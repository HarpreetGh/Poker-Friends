import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native'
import firebase from 'firebase'



export default class AccountStats extends Component {
    
    // constructor(props){
    //     super(props)
        
    //     this.state = {
    //       user: {}
    //     }
    //     var user = firebase.auth().currentUser;
    //     firebase.database().ref('/users/' + user.uid).once('value').then((snapshot) => {
    //     this.setState({user: snapshot.val()})
    // });
    //   }


    render() { 
        return ( 
        <View style = {styles.container}>
            <View>
                <Text style = {styles.title}> Stats</Text>
            </View>

            <View>
                <Text style = {styles.StatHolder}>Wins : 0</Text>
            </View>

            <View>
                <Text style = {styles.StatHolder}>Losses : 0</Text>
            </View>

            <View>
                <Text style = {styles.StatHolder}>Win/Loss Ratio : 50%</Text>
            </View>

            <View>
                <Text style = {styles.StatHolder}>Games Played : 0</Text>
            </View>

            <View>
                <Text style = {styles.StatHolder}>Chips : 0</Text>
            </View>

            <View>
                <Text style = {styles.StatHolder}>Life Time Earnings: 0 </Text>
            </View>
        </View> );
    }
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2ecc71',
        alignItems: 'center',
        justifyContent: 'center',
        
      },
      title:{
        bottom: '150%',
        fontSize: 25
      },
      StatHolder: {
        borderRadius: 50,
        margin: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: "#27ae60"
      }
})
