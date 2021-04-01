import React, {Component} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native'
import Logo from '../Components/Logo'


export default class AccountStats extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            user: {},
            ready: false
        }
    }

    componentDidMount(){
        var temp = {...this.props.userData}
        temp.username = temp.username.slice(0, temp.username.indexOf('#'))
        temp['losses'] = temp.games - temp.wins
        temp['winRatio'] = (temp.wins/temp.games) * 100
        this.setState({user: temp, ready: true})
    }

    render() { 
        if(this.state.ready){
            return ( 
            <View style = {styles.container}>
                <Logo/>
                <Text style = {styles.title}> {this.state.user.username}'s Stats</Text>
                <View style = {styles.textContainer}><Text style = {styles.Stats}>Wins: {this.state.user.wins}</Text></View>
                <View style = {styles.textContainer}><Text style = {styles.Stats}>Losses: {this.state.user.losses}</Text></View>
                <View style = {styles.textContainer}><Text style = {styles.Stats}>Win/Loss Ratio: {this.state.user.winRatio}%</Text></View>
                <View style = {styles.textContainer}><Text style = {styles.Stats}>Games Played: {this.state.user.games}</Text></View>
                <View style = {styles.textContainer}><Text style = {styles.Stats}>Current Chips:  {this.state.user.chips} </Text></View>
                <View style = {styles.textContainer}><Text style = {styles.Stats}>Life Time Earnings: {this.state.user.chips_won} </Text></View>
                <View style = {styles.textContainer}><Text style = {styles.Stats}>Life Time Losses: {this.state.user.chips_lost} </Text></View>
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
        bottom: '100%',
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'
    },
    Stats: {
        borderRadius: 50,
        margin: 10,
        elevation: 2,
        backgroundColor: "#7befb2",
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center'
    },  
    textContainer: {
        width: '65%'
    }
});
