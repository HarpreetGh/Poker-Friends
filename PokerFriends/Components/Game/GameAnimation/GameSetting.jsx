import React, { Component} from 'react';
import { Text, StyleSheet, View, TouchableOpacity,
         StatusBar, Image, Modal, TextInput,
         BackHandler, Alert, Animated, Dimensions,
         ActivityIndicator
         } from 'react-native';
import Slider from '@react-native-community/slider';
import * as ScreenOrientation from 'expo-screen-orientation';

import Chat from '../../Chat'
import Deck from '../../decks'
import CardDealing from './cardDealing'


export default class GameSetting extends Component {
  constructor(props){
    super(props)
    this.state = {
      animationBB_4P: [
        new Animated.ValueXY({ x: 0, y: 0 }),
        new Animated.ValueXY({ x: 185, y: 0 }),
        new Animated.ValueXY({ x: 400, y: 80 }),
        new Animated.ValueXY({ x: -225, y: 75 }),
      ],
      animationSB_4P: [
        new Animated.ValueXY({ x: 0, y: 0 }),
        new Animated.ValueXY({ x: 225, y: -75 }),
        new Animated.ValueXY({ x: 415, y: -75 }),
        new Animated.ValueXY({ x: 625, y: 0 }),
      ],

      animationBB_3P: [
        new Animated.ValueXY({ x: 0, y: 0 }),
        new Animated.ValueXY({ x: 185, y: 0 }),
        new Animated.ValueXY({ x: -225, y: 75 }),
      ],
      animationSB_3P: [
        new Animated.ValueXY({ x: 0, y: 0 }),
        new Animated.ValueXY({ x: 225, y: -75 }),
        new Animated.ValueXY({ x: 415, y: -75 }),
      ],

      animationBB_2P: [
        new Animated.ValueXY({ x: 0, y: 0 }),
        new Animated.ValueXY({ x: -225, y: 75 }),
      ],
      animationSB_2P: [
        new Animated.ValueXY({ x: 0, y: 0 }),
        new Animated.ValueXY({ x: 225, y: -75 }),
      ],
      newValueBB_4P: [{ x: 185, y: 0 }, { x: 400, y: 80 }, { x: -225, y: 75 }, { x: 0, y: 0 }],
      newValueSB_4P: [{ x: 225, y: -75 }, { x: 415, y: -75 }, { x: 625, y: 0 },{ x: 0, y: 0 }],

      newValueBB_3P: [{ x: 185, y: 0 }, { x: -225, y: 75 }, { x: 0, y: 0 }],
      newValueSB_3P: [{ x: 225, y: -75 }, { x: 415, y: -75 },{ x: 0, y: 0 }],

      //newValueBB_3P: [{ x: 185, y: 0 }, { x: 400, y: 80 },{ x: -225, y: 75 }, { x: 0, y: 0 }],
      //newValueSB_3P: [{ x: 225, y: -75 },{ x: 185, y: 0 }, { x: 415, y: -75 },{ x: 0, y: 0 }],

      //newValueBB_3P: [{ x: 185, y: 0 }, { x: 400, y: 80 },{ x: -225, y: 75 }, { x: 0, y: 0 }],
      //newValueSB_3P: [{ x: 225, y: -75 },{ x: 185, y: 0 }, { x: 415, y: -75 },{ x: 0, y: 0 }],

      newValueBB_2P: [{ x: -225, y: 75 }, { x: 0, y: 0 }],
      newValueSB_2P: [{ x: 225, y: -75 }, { x: 0, y: 0 }],
      
      

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
        { x: -117, y: -150 },
        { x: -46, y: -150 },
        { x: 23, y: -150 },
        { x: 91, y: -150 },
        { x: 165, y: -150 },
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
      //fiveCardsFin: 0,

      valueFoldCard: new Animated.ValueXY({ x: 25, y: 25 }),
      fadeAnimation: [new Animated.Value(0), new Animated.Value(0),
                      new Animated.Value(0), new Animated.Value(0)], 

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
      if(this.props.game.size == 4){
        Animated.timing(this.state.animationBB_4P[player], {
          toValue: this.state.newValueBB_4P[player],
          duration: 1000,
          useNativeDriver: false
        }).start();
      }
      else if(this.props.game.size == 3) {
        Animated.timing(this.state.animationBB_3P[player], {
          toValue: this.state.newValueBB_3P[player],
          duration: 1000,
          useNativeDriver: false
        }).start();
      }
      else{
        Animated.timing(this.state.animationBB_2P[player], {
          toValue: this.state.newValueBB_2P[player],
          duration: 1000,
          useNativeDriver: false
        }).start();
        }
    }

    moveSB(player) {
      if(this.props.game.size == 4){
        Animated.timing(this.state.animationSB_4P[player], {
          toValue: this.state.newValueSB_4P[player],
          duration: 1000,
          useNativeDriver: false
        }).start();
      }
      else if(this.props.game.size == 3) {
        Animated.timing(this.state.animationSB_3P[player], {
          toValue: this.state.newValueSB_3P[player],
          duration: 1000,
          useNativeDriver: false
        }).start();
      }
      else{
        Animated.timing(this.state.animationSB_2P[player], {
          toValue: this.state.newValueSB_2P[player],
          duration: 1000,
          useNativeDriver: false
        }).start();
      }
    }
      
    fadeIn(num) {
      Animated.timing(this.state.fadeAnimation[num], {
        toValue: 1,
        duration: 4000,
        useNativeDriver: false,
      }).start(() => this.fadeOut());
    }

    fadeOut(num) {
      Animated.timing(this.state.fadeAnimation[num], {
        toValue: 0,
        duration: 3000,
        useNativeDriver: false,
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

     
      
      
      var fiveCardsFin = this.props.game.smallBlindLoc;
      console.log("FIVE CARD FIN IS ", fiveCardsFin);
      if (fiveCardsFin == 0) {
        return (
          <View>
            <Animated.View>
              <View
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: 25,
                  backgroundColor: "black",
                  justifyContent: "center",
                  top: "150%",
                  right: "1400%",
                }}
              >
                <Text style={{ textAlign: "center", color: "white" }}>BB</Text>
              </View>
            </Animated.View>
            <Animated.View>
              <View
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: 25,
                  backgroundColor: "white",
                  justifyContent: "center",
                  top: "350%",
                  right: "2300%",
                }}
              >
                <Text style={{ textAlign: "center" }}>SB</Text>
              </View>
            </Animated.View>
          </View>
        );
      } else if (fiveCardsFin < 5) {
        var index = fiveCardsFin - 1;
        var moveBigBlinds
        var moveSmallBlinds

        if(this.props.game.size == 4){
          moveBigBlinds = this.state.animationBB_4P[index].getLayout()
          moveSmallBlinds = this.state.animationSB_4P[index].getLayout()
        }
        else if(this.props.game.size == 3){
          moveBigBlinds = this.state.animationBB_3P[index].getLayout()
          moveSmallBlinds = this.state.animationSB_3P[index].getLayout()
        }
        else{
          moveBigBlinds = this.state.animationBB_2P[index].getLayout()
          moveSmallBlinds = this.state.animationSB_2P[index].getLayout()
        }
        console.log("MY INDEX IS ", index)

        return (
          <View>
            <Animated.View
              //  style = {moveBlinds}>
              style={moveBigBlinds}
            >
              <View
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: 25,
                  backgroundColor: "black",
                  justifyContent: "center",
                  top: "150%",
                  right: "1400%",
                }}
              >
                {this.moveBB(index)}
                <Text style={{ textAlign: "center", color: "white" }}>BB</Text>
              </View>
            </Animated.View>

            <Animated.View
              //  style = { this.state.animationSB_4P[index].getLayout()}>
              style={moveSmallBlinds}
            >
              <View
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: 25,
                  backgroundColor: "white",
                  justifyContent: "center",
                  top: "350%",
                  right: "2300%",
                }}
              >
                {this.moveSB(index)}
                <Text style={{ textAlign: "center" }}>SB</Text>
              </View>
            </Animated.View>
          </View>
        );
      }
    }

    flopTurnRiver(suit,value, i){
      return (
        <View style = {{right: 369, top: 310}}>
          <Animated.View style = {this.state.tableCardsStart[i].getLayout()}>
            <View style = {
              {position:'absolute',
                borderRadius: 2,
                alignItems: 'center',
                paddingVertical: 20,
                paddingHorizontal: 20,
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
      return (
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
                    this.props.userData,
                    this.props.newPlayer
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

    waitingView(){
      var isVisible = true
      return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
      >
        <View style = {styles.centeredView}>
          <View style = {styles.modalView}>
            <Text style = {{padding: 0, fontWeight: 'bold'}}>Waiting for more Players</Text>

             <ActivityIndicator size='large' color="#0062ff"/>
            
            <View style = {{padding: 5}}></View>
            <TouchableOpacity
              style={styles.buttonInExit}
              onPress={() => this.setModalVisible(true)}
            >
              <Text>EXIT</Text>
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
      else if (type === 'small blind'){
        game.move[this.props.playerNum] = type
        game.chipsIn[this.props.playerNum] += amount //what if you don't have enough chips Fix for Partial Calls
        game.raisedVal += amount 
        game.pot += amount 
        game.balance[this.props.playerNum] -= amount
        game.ready[this.props.playerNum] = false //CHECK ME
        keys = ['move', 'chipsIn', 'raisedVal', 'balance', 'pot', 'playerTurn', 'ready']
      }

      game.playerTurn++;
      //see if it's the last player's turn and change it to the first player's turn
      if(game.playerTurn >= game.size-game.newPlayer){
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
                minimumValue={this.props.game.blindAmount}
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
                    //this.fadeIn(this.props.playerNum);
                  }
                  else{
                    Alert.alert('Raise Value Invalid', 'Please Input Raise Value greater than 0')
                  }
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
      var myTurn = this.props.game.playerTurn == this.props.playerNum
      var callAmount = 0

      if(myTurn){
        if(this.props.game.move[this.props.playerNum] == 'fold'){ //if you fold
          myTurn = false
          callAmount = 0
          this.UpdateInitializer('fold')
        }

        var balance = this.props.game.balance[this.props.playerNum]
        var setupCall = true
        var callString = 'Call: '
        var callType = 'call'
        var callAmount = 0
        var raiseDisabled = false

        if(this.props.game.turn == 1) {
          
          if(balance == 0) { //if you run out of funds
            callAmount = 0
            this.UpdateInitializer('fold')
            //LEave game?
          }
          var smallBlindLoc = this.props.game.smallBlindLoc
          if( 
            this.props.game.smallBlindLoc == this.props.game.size)
          {
              smallBlindLoc = 0
          }

          var bigBlindLoc = smallBlindLoc + 1
          if(bigBlindLoc >= this.props.game.size){
            bigBlindLoc = 0
          }

          if(smallBlindLoc == this.props.playerNum && !this.props.game.ready.includes(true)){
            callString = "Small Blind: "
            callType = 'small blind'
            callAmount = Math.ceil(this.props.game.blindAmount * 0.5)
            callString += callAmount
            setupCall = false
          }
          else if(bigBlindLoc == this.props.playerNum && this.props.game.raisedVal == Math.ceil(this.props.game.blindAmount * 0.5)){
            callString = "Big Blind: "
            callType = 'call'
            callAmount = this.props.game.blindAmount
            callString += callAmount
            setupCall = false
          }
        }

        if(balance == 0) { //if you run out of funds
          callAmount = 0
          this.UpdateInitializer('check')
        }
        if(setupCall){
          callString = 'Call: '
          callType = 'call'
          callAmount = Math.max(...this.props.game.chipsIn) - this.props.game.chipsIn[this.props.playerNum]
          callString += callAmount

          if(callAmount >= balance){ //partial still not implemented at pay out
            callAmount = balance    //might also depricate later
            callString =  'All In'
            raiseDisabled = true
          }
        }
      }

      return (
        <View style={styles.bettingButtonsView}>
          {this.raiseView(callAmount, balance-callAmount)}

          <TouchableOpacity 
            style={[styles.bettingButtons, (myTurn)? styles.raiseButt:styles.disabled]}
            disabled={!myTurn || raiseDisabled} onPress={() => this.setRaiseVisible(true)}
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
              disabled={!myTurn} onPress={() => this.UpdateInitializer(callType, callAmount)}
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
      // else{
      //   const buyInAmount = this.props.game.buyIn * 0.1
      //   return(
      //     <View style={styles.bettingButtonsView}>
      //       <TouchableOpacity style={[styles.bettingButtons, (myTurn)?{backgroundColor:"#ffeb91"}:styles.disabled]}
      //         disabled={!myTurn} onPress={() => this.UpdateInitializer('buy in', buyInAmount)}
      //       >
      //         <Text>Buy In Big {buyInAmount}</Text>
      //       </TouchableOpacity>

      //       <TouchableOpacity style={[styles.bettingButtons, (myTurn)? styles.foldButt:styles.disabled]} 
      //         disabled={!myTurn} onPress = {() => {
      //           this.foldCard() 
      //           this.UpdateInitializer('fold')
      //         }}
      //       >
      //         <Text>Fold</Text>
      //       </TouchableOpacity>
      //     </View>
      //   )
      // }

    roundWinnerView(){
      return (
          <View>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.textStyle}> {this.props.roundWinnerIndex} is the round winner! </Text>
            </TouchableOpacity>
          </View>
      )
    }



    render() { 
      //console.log(this.props.game.deck)
      
      return (
        <View style={styles.container}>
          {/*<StatusBar hidden/>*/}

          {this.props.game.turn == 5 && this.props.roundWinnerFound ?(
           this.roundWinnerView()
           ):(<Text></Text>)}
          
          
          {this.quitView()}

          {this.props.game.size == 1 ? (
            this.waitingView()
          ) : (
            <View>
              <TouchableOpacity
                style={[styles.button, styles.buttonOpen]}
                onPress={() => this.setModalVisible(true)}
              >
                <Text style={styles.textStyle}>EXIT</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.player1View}>
              <View style = {{alignItems: 'center'}}>
                <Image 
                  source={{ uri: this.props.game.playerAvatar[0] }}
                  style={styles.avatarImage}/>
                <View style={styles.textBackground}>
                  <Text style={styles.playerNames}> {this.props.game.players[0]} </Text>
                </View>
            </View>
            <Animated.View
              style={[styles.pBet, { opacity: this.state.fadeAnimation[0] }]}
            >
              <Text>testing</Text>
            </Animated.View>
          </View>

          <View style={styles.player2View}>
              {this.props.game.size > 1 ? (
                <View style = {{alignItems: 'center'}}>
                  <Image
                    source={{ uri: this.props.game.playerAvatar[1] }}
                    style = {styles.avatarImage}/>
                    <View style={styles.textBackground}> 
                      <Text style={styles.playerNames}>
                        {this.props.game.players[1]}</Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.textStyle}>Empty</Text>
              )}
            

            <Animated.View
              style={[styles.pBet, { opacity: this.state.fadeAnimation[1] }]}
            >
              <Text>testing</Text>
            </Animated.View>
          </View>

          <Image
            style={styles.tableView}
            source={require("../../../assets/pokertable.png")}
          />

          <View style={styles.player3View}>
              {this.props.game.size > 2 ? (
                <View style = {{alignItems: 'center'}}> 
                  <Image 
                  source={{ uri: this.props.game.playerAvatar[2] }}
                  style = {styles.avatarImage}/>
                  <View style={styles.textBackground}>
                    <Text style={styles.playerNames}>
                      {this.props.game.players[2]}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.textStyle}>Empty</Text>
              )}
          
            <Animated.View
              style={[styles.pBet, { opacity: this.state.fadeAnimation[2] }]}
            >
              <Text>testing</Text>
            </Animated.View>
          </View>

          <View style={styles.potView}>
            <Image
              style={{
                width: 50,
                height: 50,
                resizeMode: "contain",
              }}
              source={require("../../../assets/table.png")}
            />

            <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
              Pot: {this.props.game.pot}
            </Text>
          </View>

          <View style={styles.player4View}>
              {this.props.game.size > 3 ? (
                <View style = {{alignItems: 'center'}}>
                  <Image 
                  source={{ uri: this.props.game.playerAvatar[3] }}
                  style = {styles.avatarImage}/>
                  <View style={styles.textBackground}>
                    <Text style={styles.playerNames}>
                      {this.props.game.players[3]}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.textStyle}>Empty</Text>
              )}
            

            <Animated.View
              style={[styles.pBet, { opacity: this.state.fadeAnimation[3] }]}
            >
              <Text>testing</Text>
            </Animated.View>
          </View>

          {this.actionsView()}

          <View style={styles.dealer}>
            <Image
              style={styles.dealer}
              source={require("../../../assets/cards.png")}
            />
          </View>

          <View style={styles.chat}>
            <Chat
              matchName={this.props.matchName}
              matchType={this.props.matchType}
            />
          </View>

          <View style={styles.chipView}>
            <Image
              style={{
                width: 40,
                height: 40,
                resizeMode: "contain",
              }}
              source={require("../../../assets/chipAmount.png")}
            />
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
              {this.props.game.balance[this.props.playerNum]}
            </Text>
          </View>

          {this.props.game.turn == 1 ? this.transitionBlinds() : <Text></Text>}

          {/* <View style = {styles.foldContainer}>
            <Animated.View style = {[styles.foldCard, this.state.valueFoldCard.getLayout()]}>
              <Image style = {styles.cardImage} source = {require("../../../assets/deckOfCards/PNG/♥J.png")}/>
            </Animated.View>
          </View> */}

          <View>
            {this.props.myCards.map((card, i) =>
              this.cardDeal(card.suit, card.value, i + this.props.playerNum * 2)
            )}
            {1 < this.props.game.turn && this.props.game.turn < 5 ? (
              this.props.game.board.map((card, i) =>
                this.flopTurnRiver(card.suit, card.value, i)
              )
            ) : (
              <Text></Text>
            )}
          </View>
          {/* {this.flop(this.props.game.deck.shift(),2,3)}
                              {this.turn(1)}
                              {this.river(1)} */}
        </View>
      );
    }
}
 

const styles = StyleSheet.create({
  avatarImage: {
    width: 80, 
    height: 80, 
    borderRadius: 100, 
    marginBottom: -10
  },
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
    bottom: '-5%',
    left: '35%',
    position: 'absolute'
  },
  textStyle:{
    color: '#FFFFFF',
    fontWeight: 'bold',
    justifyContent: "center",
    alignItems: "center",
  },
  playerNames:{
    color: 'white',
    fontSize: 18,
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
  textBackground:{
    backgroundColor:"#ff9f1a",
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 50
  },
  pBet: {
    bottom: "0%",
    left: "25%",
  },
  player1View: {
    position: 'absolute',
    borderRadius: 2,
    borderColor: 'black',
    top: "35%",
    left: "1%",
    alignContent: "center",
    paddingBottom: 15
  },
  player2View: {
    borderRadius: 2,
    borderColor: 'black',
    top: "0%",
    left:"30%",
  },
  player3View: {
    borderRadius: 2,
    borderColor: "black",
    right: '25%',
    bottom: '0%'
  },
  player4View: {
    position:'absolute',
    borderRadius: 2,
    borderColor: 'black',
    top: "35%",
    right: "5%",
    alignContent: "center"
  },
  potView:{
    position: 'absolute',
    top: "5%",
    right: "5%"
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
    right: "1%",
    bottom: "0%"
  },
  tableView: {
    width: 466,
    height: 400,
    resizeMode: 'contain',
    bottom: '0%',
    right: '0%',
    left: '0%',
    marginLeft: 5
  },
  chat:{
    position:'absolute',
    bottom: "0%",
    right: "13%"
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
