import React, {Component} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native'



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
                <View>
                    <Text style = {styles.title}> {this.state.user.username}'s Stats</Text>
                </View>

                <View>
                    <Text style = {styles.StatHolder}>Wins : {this.state.user.wins}</Text>
                </View>

                <View>
                    <Text style = {styles.StatHolder}>Losses : {this.state.user.losses}</Text>
                </View>

                <View>
                    <Text style = {styles.StatHolder}>Win/Loss Ratio : {this.state.user.winRatio}%</Text>
                </View>

                <View>
                    <Text style = {styles.StatHolder}>Games Played : {this.state.user.games}</Text>
                </View>

                <View>
                    <Text style = {styles.StatHolder}>Current Chips :  {this.state.user.chips} </Text>
                </View>

                <View>
                    <Text style = {styles.StatHolder}>Life Time Earnings: {this.state.user.chips_won} </Text>
                </View>

                
                <View>
                    <Text style = {styles.StatHolder}>Life Time Losses: {this.state.user.chips_lost} </Text>
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
        justifyContent: 'center',
        
      },
      title:{
        bottom: '100%',
        fontSize: 25,
        fontWeight: 'bold'
       
      },
      StatHolder: {
        borderRadius: 50,
        margin: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: "#27ae60"
      }
})
