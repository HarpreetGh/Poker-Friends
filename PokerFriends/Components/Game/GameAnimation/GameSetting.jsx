import React, { Component} from 'react';
import { Text, StyleSheet, View, TouchableOpacity,
         StatusBar, Image, Modal, TextInput,
         BackHandler, Alert, Animated, Dimensions
         } from 'react-native';
import Slider from '@react-native-community/slider';
import * as ScreenOrientation from 'expo-screen-orientation';

import Deck from '../../decks'
import CardDealing from './cardDealing'


export default class GameSetting extends Component {
  constructor(props){
    super(props)
    this.state = {
      animationBB: [
        new Animated.Value(0),
        new Animated.ValueXY({ x: 185, y: 0 }),
        new Animated.ValueXY({ x: 400, y: 80 }),
        new Animated.ValueXY({ x: -225, y: 75 }),
      ],
      animationSB: [
        new Animated.ValueXY({ x: 0, y: 0 }),
        new Animated.ValueXY({ x: 225, y: -75 }),
        new Animated.ValueXY({ x: 415, y: -75 }),
        new Animated.ValueXY({ x: 625, y: 0 }),
      ],
      newValueBB: [185, { x: 400, y: 80 }, { x: -225, y: 75 }, { x: 0, y: 0 }],
      newValueSB: [
        { x: 225, y: -75 },
        { x: 415, y: -75 },
        { x: 625, y: 0 },
        { x: 0, y: 0 },
      ],

      playerCardAnimations: [
        new Animated.ValueXY({ x: 0, y: 0 }),
        new Animated.ValueXY({ x: 0, y: 0 }),
        new Animated.ValueXY({ x: 0, y: 0 }),
        new Animated.ValueXY({ x: 0, y: 0 }),
        new Animated.ValueXY({ x: 0, y: 0 }),
        new Animated.ValueXY({ x: 0, y: 0 }),
        new Animated.ValueXY({ x: 0, y: 0 }),
        new Animated.ValueXY({ x: 0, y: 0 }),
      ],

      tableCardsStart: [
        new Animated.ValueXY({ x: 0, y: 0 }),
        new Animated.ValueXY({ x: 0, y: 0 }),
        new Animated.ValueXY({ x: 0, y: 0 }),
        new Animated.ValueXY({ x: 0, y: 0 }),
        new Animated.ValueXY({ x: 0, y: 0 }),
      ],
      tableCardsMove: [
        { x: -145, y: -150 },
        { x: -95, y: -150 },
        { x: -45, y: -150 },
        { x: 5, y: -150 },
        { x: 55, y: -150 },
      ],

      playerNewValues: [
        { x: -350, y: -45 },
        { x: -320, y: -45 },
        { x: -290, y: -270 },
        { x: -260, y: -270 },
        { x: 150, y: -270 },
        { x: 120, y: -270 },
        { x: 320, y: -35 },
        { x: 290, y: -35 },
      ],

      modalVisible: false,
      raiseVisible: false,
      fiveCardsFin: 4,

      valueFoldCard: new Animated.ValueXY({ x: 25, y: 25 }),
      fadeAnimation: new Animated.Value(0), 

      playerCardsGiven: 1,
      gamePot: 0,
      raiseAmount: 10,

      // USE THIS STUFF
      // this.props.matchName,
      // this.props.matchType,
      // this.props.game,
      // this.props.myCards,

      example_matchName: "public/match",
      example_game: {
        balance: [0, 0, 0, 0],
        board: ["♣2", "♦5", "♥10"],
        deck: ["♠A", "♣J"],
        move: ["raise", "call", "fold", "call"],
        players: ["Abe#45", "Bob#89", "Alice#90", "Janet#02"],
        pot: 40,
        ready: [true, false, true, false],
        size: 4,
        player_cards: [
          { rank: 9, card: ["♠7", "♥9"] },
          { rank: 2, card: ["♣3", "♦3"] },
          { rank: 7, card: ["♥2", "♦8"] },
          { rank: 5, card: ["♠6", "♦5"] },
        ],
        pause: false,
        turn: 3,
        round: 2,
      },
      example_myCards: [],
    };
  }
  //Use state variable called round 1 = flop 2 = turn 3 = river
      
    foldCard() {
      Animated.timing(this.state.valueFoldCard, {
        toValue: {x: -515, y: 375},
        duration: 1000,
        useNativeDriver: false
      }).start();
    }
    
    moveBB(player) {
      Animated.timing(this.state.animationBB[player], {
        toValue: this.state.newValueBB[player],
        duration: 1000,
        useNativeDriver: false
      }).start();
    }

    moveSB(player) {
      Animated.timing(this.state.animationSB[player], {
        toValue: this.state.newValueSB[player],
        duration: 1000,
        useNativeDriver: false
      }).start();
    }
      
    fadeIn() {
      Animated.timing(this.state.fadeAnimation, {
        toValue: 1,
        duration: 4000
      }).start(() => this.fadeOut());
    }

    fadeOut() {
      Animated.timing(this.state.fadeAnimation, {
        toValue: 0,
        duration: 3000,
      }).start();
      
    }

    
  
    setModalVisible = (visible) => {
      this.setState({ modalVisible: visible });
    }
    setRaiseVisible = (visible) => {
      this.setState({ raiseVisible: visible });
    }

    backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to go back?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => {
        this.props.navigation.navigate('LandingPage'),  
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP); } }
      ]);
      return true;
    };
  
    componentDidMount() {
      this.backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        this.backAction
      );
      //this.setState({width: Dimensions.get('window').width})
    }
  
    componentWillUnmount() {
      this.backHandler.remove();
    }

    transitionBlinds(){
      //This first if statement should only be done in the
      //beginning of each game(New Lobby)
      if(this.state.fiveCardsFin == 0){
        return <View>
          <Animated.View>
            <View 
              style = {{ 
              width: 25, 
              height: 25, 
              borderRadius: 25,
              backgroundColor: 'black',
              justifyContent: 'center',
              top: '150%',
              right: '1400%'
              }}>
              <Text 
                style = {{ textAlign: 'center',color: 'white'}}>
                BB
              </Text>
            </View>
          </Animated.View>
          <Animated.View>
          <View
              style = {{ 
              width: 25, 
              height: 25, 
              borderRadius: 25,
              backgroundColor: 'white',
              justifyContent: 'center',
              top: '350%',
              right: '2300%'}}>
              <Text style = {{textAlign: 'center'}}>SB</Text>
            </View>
          </Animated.View>
        </View>
      }
      else if(this.state.fiveCardsFin < 5){
        index = this.state.fiveCardsFin - 1
        
        if(index == 0){
          bb = (
            <Animated.View
              style = {{left: this.state.animationBB[index]}}>
            <View 
              style = {{ 
              width: 25, 
              height: 25, 
              borderRadius: 25,
              backgroundColor: 'black',
              justifyContent: 'center',
              top: '150%',
              right: '1400%'
              }}>
                {this.moveBB(index)}
              <Text 
              style = {{ textAlign: 'center',color: 'white'}}>
              BB</Text>
            </View>
          </Animated.View>
          )
        }
        else{
          bb = (
          <Animated.View
            style = {this.state.animationBB[index].getLayout()}>
            <View 
              style = {{ 
              width: 25, 
              height: 25, 
              borderRadius: 25,
              backgroundColor: 'black',
              justifyContent: 'center',
              top: '150%',
              right: '1400%'
              }}>
                {this.moveBB(index)}
              <Text 
              style = {{ textAlign: 'center',color: 'white'}}>
              BB</Text>
            </View>
          </Animated.View>
          )
        }

        return (
        <View>
          {bb}
          <Animated.View 
          style = { this.state.animationSB[index].getLayout()}>

            <View
              style = {{ 
              width: 25, 
              height: 25, 
              borderRadius: 25,
              backgroundColor: 'white',
              justifyContent: 'center',
              top: '350%',
              right: '2300%'}}>
              {this.moveSB(index)}
              <Text style = {{textAlign: 'center'}}>SB</Text>

            </View>
          </Animated.View>
        </View>
        )
      }
    }

    flopTurnRiver(suit,value, i){
      return (
        <View style = {{right: '390%', top: '75%'}}>
          <Animated.View style = {this.state.tableCardsStart[i].getLayout()}>
            <View style = {
              {position: 'absolute',
                flex: 1,
                borderRadius: 2,
                alignItems: 'center',
                justifyContent:'center',
                paddingVertical: 15,
                paddingHorizontal: 15,
                backgroundColor:"white",}}
            >
              <Text>{suit}</Text>
              <Text>{value}</Text>
              {this.moveTableCards(i)}
            </View>
          </Animated.View>
        </View>
      )
    }

    moveTableCards(card){
      Animated.timing(this.state.tableCardsStart[card], {
        toValue: this.state.tableCardsMove[card],
        duration: 1000,
        useNativeDriver: false
      }).start();
    }

    cardDeal(suit,value,i) {
      return (<View style = {{right: '390%', top: '75%'}}>
        <Animated.View style = {this.state.playerCardAnimations[i].getLayout()}>
          <CardDealing suit={suit} value={value}>{this.movePlayerCards(i)}</CardDealing>
        </Animated.View>
      </View>
      )
    }

    movePlayerCards(card) {
      Animated.timing(this.state.playerCardAnimations[card], {
        toValue: this.state.playerNewValues[card],
        duration: 1000,
        useNativeDriver: false
      }).start();
    }

    quitView(){
      const { modalVisible } = this.state;
      return(
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible} 
      >
        <View style = {styles.centeredView}>
          <View style = {styles.modalView}>
            
            <Text style = {{padding: 5}}>Are you sure you want to leave?</Text>
            
            <TouchableOpacity
              style={styles.buttonInExit}
              onPress={() => {
                this.setModalVisible(!modalVisible)
              }}
              >
                <Text style={ styles.exitStyle }>NO</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.buttonInExit}
              onPress={() => {
                this.props.navigation.navigate('LandingPage')
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
                this.setModalVisible(!modalVisible)
              }}
            >
              <Text style={ styles.exitStyle }>Go to Main Menu</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonInExit}
              onPress={() => {
                this.props.navigation.navigate('LandingPage')
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
                this.setModalVisible(!modalVisible)
                this.props.leaveGame(this.props.game,
                  this.props.playerNum,
                  this.props.matchType,
                  this.props.matchType+'_'+this.props.matchName,
                  this.props.userData
                  )
              }}
            >
              <Text style={ styles.exitStyle }>Quit Game</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

    UpdateInitializer(type, amount){
      var game = {...this.props.game}
      var keys = []
      if(type === 'check'){
        game.move[this.props.playerNum] = type
        game.ready[this.props.playerNum] = true
        keys = ['move', 'playerTurn', 'ready']
      }
      else if(type === 'call'){
        game.move[this.props.playerNum] = type
        game.chipsIn[this.props.playerNum] += amount //what if you don't have enough chips Fix for Partial Calls
        game.pot += amount 
        game.balance[this.props.playerNum] -= amount
        game.ready[this.props.playerNum] = true
        keys = ['move', 'chipsIn', 'balance', 'pot', 'playerTurn', 'ready']
      }
      else if (type === 'fold'){
        game.move[this.props.playerNum] = type
        game.ready[this.props.playerNum] = true
        keys = ['move', 'playerTurn', 'ready']
      }
      else if (type === 'raise'){
        game.move[this.props.playerNum] = type
        game.chipsIn[this.props.playerNum] += amount
        game.raisedVal += amount 
        game.pot += amount 
        game.balance[this.props.playerNum] -= amount

        game.ready.fill(false) 
        game.ready[this.props.playerNum] = true
        keys = ['move', 'chipsIn', 'raisedVal', 'balance', 'pot', 'playerTurn', 'ready']

        this.setState({raiseAmount: 10})
      }

      game.playerTurn++;
      //see if it's the last player's turn and change it to the first player's turn
      if(game.playerTurn == game.size){
        game.playerTurn = 0;
      }

      this.props.updateGame(keys,//{...this.props.game}, 
        game,
        this.props.matchType,
        this.props.matchType+'_'+this.props.matchName
      )
    }

    raiseView(callAmount, maxChips){
      const {raiseVisible} = this.state;
      return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={raiseVisible}
      >
        <View style = {styles.centeredView}>
            <View style = {styles.modalView}>
              {callAmount == 0? (
                <Text style = {{padding: 0, fontWeight: 'bold'}}>Raise {this.state.raiseAmount} Chips</Text>
              ):(
                <Text style = {{padding: 0, fontWeight: 'bold'}}>Call: {callAmount} + New Re-Raise {this.state.raiseAmount} = 
                  {callAmount+this.state.raiseAmount} Chips</Text>
              )}
              
              <Slider 
                style={{width: 200, height: 40}}
                minimumValue={10+callAmount}
                maximumValue={maxChips}
                step={10}
                onValueChange={(raiseAmount) => { 
                  this.setState({raiseAmount});
                }}
                value={this.state.raiseAmount}
                minimumTrackTintColor="#2ecc71"
                maximumTrackTintColor="#000000"
              />
              {/* //https://github.com/callstack/react-native-slider */}

              <TouchableOpacity
                style={styles.buttonInExit}
                onPress={() => {
                  //this.raiseAnimation()
                  this.setRaiseVisible(!raiseVisible);
                  //this.raisePot();
                  if(this.state.raiseAmount > 0){
                    this.UpdateInitializer('raise', Number(this.state.raiseAmount)+callAmount)
                  }
                  else{
                    Alert.alert('Raise Value Invalid', 'Please Input Raise Value greater than 0')
                  }
                  this.fadeIn();
                }}
              >
                <Text style = {{fontWeight: 'bold'}}>APPLY</Text>
              </TouchableOpacity>
              
              <View style = {{padding: 5}}></View>
              <TouchableOpacity
                style={styles.buttonInExit}
                onPress={() => {
                  this.setRaiseVisible(!raiseVisible);
                }}
              >
                <Text style={ styles.exitStyle }>CANCEL</Text>
              </TouchableOpacity>
            </View>
        </View>
      </Modal>
      )
    }

    actionsView(){
      var myTurn, callAmount
      var callString = 'Call '
      if(this.props.game.move[this.props.playerNum] == 'fold'){
        myTurn = false
        callAmount = 0
        this.UpdateInitializer('fold')
      }
      else{
        var balance = this.props.game.balance[this.props.playerNum]

        if(balance == 0){ //if you run out of funds
          callAmount = 0
          this.UpdateInitializer('check')
        }
        else{
          callAmount = Math.max(...this.props.game.chipsIn) - this.props.game.chipsIn[this.props.playerNum]

          if(callAmount > balance){ //partial still not implemented at pay out
            callAmount = balance    //might also depricate later
            callString += '(partial) '
          }
          callString += callAmount

          myTurn = this.props.game.playerTurn == this.props.playerNum
        }
        //console.log(this.props.game.playerTurn, this.props.playerNum)
      }

      return (
        <View style={styles.bettingButtonsView}>
            
            {this.raiseView(callAmount, balance)}

            <TouchableOpacity 
              style={[styles.bettingButtons, (myTurn)? styles.raiseButt:styles.disabled]}
              disabled={!myTurn} onPress={() => this.setRaiseVisible(true)}
            >
              {this.props.game.raisedVal == 0? (<Text>Raise</Text>):(<Text>Re-Raise</Text>)}
            </TouchableOpacity>

            {callAmount == 0? (
              <TouchableOpacity style={[styles.bettingButtons, (myTurn)?{backgroundColor:"#D6A2E8"}:styles.disabled]}
                disabled={!myTurn} onPress={() => this.UpdateInitializer('check')}
              >
                <Text>Check</Text>
              </TouchableOpacity>
            ):( 
              <TouchableOpacity style={[styles.bettingButtons, (myTurn)? styles.callButt:styles.disabled]}
                disabled={!myTurn} onPress={() => this.UpdateInitializer('call', callAmount)}
              >
                <Text>{callString}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={[styles.bettingButtons, (myTurn)? styles.foldButt:styles.disabled]} 
              disabled={!myTurn} onPress = {() => {
                this.foldCard() 
                this.UpdateInitializer('fold')
              }}
            >
              <Text>Fold</Text>
            </TouchableOpacity>

          </View>
      )
    }
    
    render() { 
      //console.log(this.props.game.deck)
      
      return (  
        <View style = {styles.container}>
          {/*<StatusBar hidden/>*/}

          {this.quitView()}

          <View>
            <TouchableOpacity
              style={[styles.button, styles.buttonOpen]}
              onPress={() => this.setModalVisible(true)}
            >
              <Text style ={styles.textStyle}>EXIT</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.webcam1}>
              <Text>Webcam 1</Text>
              {/* {<Text>{this.props.game.players[0]}</Text>} */}
          </View>

          <View>
            <View style={styles.webcam2}>
                <Text>Webcam 2</Text>
            </View>
          </View>
          

          <Image  style = {styles.tableView}
            source = {require('../../../assets/pokertable.png')}
          />

          <View>
            <View style={styles.webcam3}>
                <Text>Webcam 3</Text> 
            </View>
          </View> 

          <View style={styles.potView}>
            <Image style = {{   
              width: 50, 
              height:50,
              resizeMode: 'contain',
              }}
              source={require('../../../assets/table.png')}
            />
              
            <Text style = {{ fontSize: 20 ,fontWeight: 'bold',color: 'white'}}>
              Pot: {this.props.game.pot}
            </Text>
          </View>
          
          <View style={styles.webcam4}>
            <View>
              <Text>Webcam 4</Text> 
            </View>

            <Animated.View
              style={[
                {opacity: this.state.fadeAnimation}
              ]}
            >
              <Text>testing</Text>
            </Animated.View>
          </View>

          {this.actionsView()}

          <View style = {styles.dealer}>
            <Image style = {styles.dealer}
            source = {require('../../../assets/cards.png')}
            />
          </View>
          
          <View style={styles.chat}>
            <View>
              <Text>Chat</Text> 
            </View>
          </View>    
          
          <View style={styles.chipView}>
            <Image
              style = {{
              width: 40, 
              height:40,
              resizeMode: 'contain',
              }}
              source={require('../../../assets/chipAmount.png')}
            /> 
            <Text style = {{ fontSize: 20, fontWeight: 'bold' }}>
              {this.props.game.balance[this.props.playerNum]}
            </Text> 
          </View>
              
          {this.transitionBlinds()}
          
          
          <View style = {styles.foldContainer}>
            <Animated.View style = {[styles.foldCard, this.state.valueFoldCard.getLayout()]}>
              <Image style = {styles.cardImage} source = {require("../../../assets/deckOfCards/PNG/♥J.png")}/>
            </Animated.View>
          </View>

        
          <View>
            {this.props.myCards.map((card,i)=> this.cardDeal(card.suit, card.value, i))}
            
            {this.props.game.turn > 1? (this.props.game.board.map((card,i)=> this.flopTurnRiver(card.suit, card.value, i+this.props.playerNum*2))):(<Text></Text>)}
          </View>
                {/* {this.flop(this.props.game.deck.shift(),2,3)}
                              {this.turn(1)}
                              {this.river(1)} */}
        </View>
      );
    }
}
 

const styles = StyleSheet.create({
  exitButton2: {
    alignSelf:'center',
    flex: 1
    //width: 'auto',
  },
  container: {
    flex: 1,
    backgroundColor: '#2ecc71',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  exitStyle: {
    fontWeight: 'bold',
    justifyContent: "center",
    alignItems: "center",
  },
  buttonInExit: {
    borderRadius: 2,
    padding: 10,
    elevation: 2,
    backgroundColor: "#b2bec3",
    marginTop: 5
  },
  button: {
    borderRadius: 2,
    padding: 10,
    elevation: 2,
    backgroundColor: "#b2bec3",
    top: "3%",
    left: "20%"
  },
  exitStyle: {
    fontWeight: 'bold',
    justifyContent: "center",
    alignItems: "center",
  },
  buttonInExit: {
    borderRadius: 2,
    padding: 10,
    elevation: 2,
    backgroundColor: "#b2bec3",
  },
  button: {
    borderRadius: 2,
    padding: 10,
    elevation: 2,
    backgroundColor: "#b2bec3",
    top: "3%",
    left: "20%"
  },
  buttonOpen: {
    backgroundColor: "#778899",
  },
  exitButton:{
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  dealer: {
    width: 125, 
    height:125,
    resizeMode: 'contain',
    bottom: '0%',
    left: '35%',
    position: 'absolute'
  },
  textStyle:{
    color: '#FFFFFF',
    fontWeight: 'bold',
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  
  webcam1:{
    position: 'absolute',
    borderRadius: 2,
    borderColor: 'black',
    paddingVertical: 30,
    paddingHorizontal: 10,
    backgroundColor:"#778899",
    top: "35%",
    left: "1%"
  },
  webcam2:{
    borderRadius: 2,
    borderColor: "black",
    paddingVertical: 30,
    paddingHorizontal: 10,
    backgroundColor: "#778899",
    left:"150%",
  },
  webcam3:{
    borderRadius: 2,
    borderColor: "black",
    paddingVertical: 30,
    paddingHorizontal: 10,
    backgroundColor: "#778899",
    right: '200%',
    bottom: '0%'
  },
  webcam4:{
    position:'absolute',
    borderRadius: 2,
    borderColor: 'black',
    paddingVertical: 30,
    paddingHorizontal: 10,
    backgroundColor:"#778899",
    bottom: "45%",
    right: "0%",
    alignContent: "center"
  },
  potView:{
    position: 'absolute',
    top: "0%",
    right: "0%"
  },
  pot:{
    borderRadius: 2,
    borderColor: "black",
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 0,
    right: '300%'
  },
  chipAmount: {
    top: '500%',
    left: '50%'
  },
  chipView:{
    position: 'absolute',
    right: "0%",
    bottom: "0%"
  },
  tableView: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
    bottom: '5%',
    right: '4%',
  },
  chat:{
    position:'absolute',
    borderRadius: 2,
    borderColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor:"#778899",
    bottom: "0%",
    right: "20%"
  },
  bettingButtonsView:{
    position: 'absolute',
    bottom: "0%",
    left: "0%",
    flexDirection: 'row',
  },
  bettingButtons:{
    borderRadius: 50,
    padding: 10,
    elevation: 2,
    marginHorizontal: 5,
  },
  raiseButt:{
    backgroundColor: "#add8e6"
  },
  callButt:{
    backgroundColor: "#fed8b1"
  },
  foldButt:{
    backgroundColor: "#ffcccb"
  },
  disabled:{
    backgroundColor: "#cccccc"
  },
  cardImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain'
  },
  foldCard: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  foldContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
