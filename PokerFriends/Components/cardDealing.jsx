import React, { Component } from 'react';
import {
     Image, 
     View, 
     StyleSheet, 
     Animated  
    } from 'react-native';

import Deck from './decks'

const myDeck = new Deck()
myDeck.shuffle()
const myCard = myDeck.cards.shift()
console.log(myCard);




export default class CardDealing extends Component {
    state = { 
        
        
     }
   
    render() {
        return (
            <View>
            <View>
                <Image style = {styles.cardImage} source = {require('../assets/deckOfCards/PNG/♠2.png')}/>
            </View>
            <View>
                <Image style = {styles.cardImage} source = {require('../assets/cardBack.png')}/>
            </View>
            </View>
            
        );
    }
}

const styles = StyleSheet.create({
    cardImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain'
    }

})