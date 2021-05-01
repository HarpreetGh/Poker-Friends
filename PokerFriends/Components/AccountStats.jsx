import React, {Component} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, Image} from 'react-native'
import Logo from '../Components/Logo'
import firebase from 'firebase'

export default class AccountStats extends Component {
    constructor(props){
        super(props)
        this.state = {
            user: {},
            userPhoto: null,
            ready: false
        }
    }

    componentDidMount(){
        var user = firebase.auth().currentUser;
        var temp = {...this.props.userData}
        temp.username = user.displayName
        temp['losses'] = temp.games - temp.wins
        temp['winRatio'] = (temp.wins/temp.games) * 100
        this.setState({
            userPhoto: user.photoURL, 
            user: temp, ready: true})
    }

    render() { 
        if(this.state.ready){
            return ( 
            <View style = {styles.container}>
                <Logo/>
                <View style = {styles.bubble}> 
                    {/* <Image source ={{ uri: this.state.userPhoto }} style={{ width: 200, height: 200 }} /> */}
                    <Text style = {styles.title}> {this.state.user.username}'s Stats</Text>
                    <View style = {styles.textContainer}><Text style = {styles.Stats}>Wins: {this.state.user.wins}</Text></View>
                    <View style = {styles.textContainer}><Text style = {styles.Stats}>Losses: {this.state.user.losses}</Text></View>
                    <View style = {styles.textContainer}><Text style = {styles.Stats}>Win/Loss Ratio: {this.state.user.winRatio}%</Text></View>
                    <View style = {styles.textContainer}><Text style = {styles.Stats}>Games Played: {this.state.user.games}</Text></View>
                    <View style = {styles.textContainer}><Text style = {styles.Stats}>Current Chips:  {this.state.user.chips} </Text></View>
                    <View style = {styles.textContainer}><Text style = {styles.Stats}>Life Time Earnings: {this.state.user.chips_won} </Text></View>
                    <View style = {styles.textContainer}><Text style = {styles.Stats}>Life Time Losses: {this.state.user.chips_lost} </Text></View>
                </View>
            </View> 
            );
        }
        else{
        return(
          <View style={[styles.container, styles.horizontal] }>
            <ActivityIndicator size='large' color="#FB6342"/>
          </View>
        )
      }
    }
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2ecc71',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
    },
    Stats: {
        borderRadius: 50,
        margin: 10,
        elevation: 2,
        backgroundColor: "#7befb2",
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10
    },  
    textContainer: {
        width: '100%'
    },
    bubble: {
        backgroundColor: '#27ae60',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 50,
        width: '80%',
        marginBottom: 30,
        textAlign: 'center',
        justifyContent: 'center',
        alignContent: 'center'
    }
});
