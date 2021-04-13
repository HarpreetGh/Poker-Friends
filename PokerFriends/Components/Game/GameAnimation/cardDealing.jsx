import React, { Component } from 'react';
import {
     Image, 
     View, 
     StyleSheet, 
     Animated,  
     TouchableOpacity,
     Text
    } from 'react-native';

import Deck from '../../decks'

export default class CardDealing extends Component {    

    UNSAFE_componentWillMount() {
        this.animatedValue = new Animated.Value(0);
        this.value = 0;
        this.animatedValue.addListener(({value}) =>{
            this.value = value;
        })
        this.frontInterpolate = this.animatedValue.interpolate({
            inputRange: [0, 180],
            outputRange: ['0deg', '180deg'],
        })
        this.backInterpolate = this.animatedValue.interpolate({
            inputRange:[0,180],
            outputRange: ['180deg', '360deg']
        })
      }

      flipCard() {
          if(this.value >= 90){
             Animated.spring(this.animatedValue, {
                 toValue: 0,
                 friction: 8,
                 tension: 10,
                 useNativeDriver: true
             }).start();
          }
          else {
             Animated.spring(this.animatedValue, {
                 toValue: 180,
                 friction: 8,
                 tension: 10,
                 useNativeDriver: true
             }).start();
          }
      }
    
     
    render() {
         const frontAnimatedStyle = {
             transform: [
                 {rotateY: this.frontInterpolate}
             ]
         }
         const backAnimatedStyle = {
             transform: [
                 {rotateY: this.backInterpolate}
             ]
         }
         
        return (
            <View style = {styles.container}>
                <View>
                    <Animated.View style ={[styles.flipCard, backAnimatedStyle]}>
                        <Image style = {styles.cardImage} source = {require('../../../assets/cardBack.png')}/>
                    </Animated.View>
                    
                    <Animated.View style = {[styles.flipCard , frontAnimatedStyle,  styles.flipCardBack]}>
                        <View style = {{position: 'absolute',
                            flex: 1,
                            borderRadius: 2,
                            alignItems: 'center',
                            justifyContent:'center',
                            paddingVertical: 15,
                            paddingHorizontal: 15,
                            backgroundColor:"white",}}>

                            <Text>{this.props.suit}</Text>
                            <Text>{this.props.value}</Text>
                            
                        </View>
                    </Animated.View>
                </View>

            {/* We call this at the end of the round, because it flips all cards. */}
           {/* {this.flipCard()} */}
            
            </View>
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardImage: {
        width: 75,
        height: 75,
        resizeMode: 'contain'
    },
    flipCard: {
        alignItems: 'center',
        justifyContent: 'center',
        backfaceVisibility: 'hidden'
    },
    flipCardBack: {
        position: 'absolute',
        top: 0,
    },
    

})