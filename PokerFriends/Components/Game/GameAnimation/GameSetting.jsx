import React, {Component} from 'react';
import { Text, StyleSheet, View, TouchableOpacity,
         StatusBar, Image, Modal, TextInput,
         BackHandler, Alert, Animated, Dimensions,
         ActivityIndicator
         } from 'react-native';
import Slider from '@react-native-community/slider';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar as StatusBarExpo, setStatusBarHidden } from 'expo-status-bar';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
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
        new Animated.ValueXY({ x: 450, y: 80 }),
        new Animated.ValueXY({ x: -225, y: 75 }),
      ],
      animationSB_4P: [
        new Animated.ValueXY({ x: 0, y: 0 }),
        new Animated.ValueXY({ x: 225, y: -95 }),
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
        new Animated.ValueXY({ x: 225, y: -95 }),
        new Animated.ValueXY({ x: 415, y: -75 }),
      ],
      animationBB_2P: [
        new Animated.ValueXY({ x: 0, y: 0 }),
        new Animated.ValueXY({ x: -225, y: 75 }),
      ],
      animationSB_2P: [
        new Animated.ValueXY({ x: 0, y: 0 }),
        new Animated.ValueXY({ x: 230, y: -75 }),
      ],
      newValueBB_4P: [{ x: 375, y: 0 }, { x: 430, y: 115 }, { x: -190, y: 110 }, { x: 0, y: 0 }],
      newValueSB_4P: [{ x: 180, y: -98 }, { x: 550, y: -95 }, { x: 580, y: -10 },{ x: 0, y: 0 }],

      newValueBB_3P: [{ x: 325, y: 0 }, { x: -180, y: 95 }, { x: 0, y: 0 }],
      newValueSB_3P: [{ x: 180, y: -98 }, { x: 450, y: -95 },{ x: 0, y: 0 }],

      newValueBB_2P: [{ x: -170, y: 100 }, { x: 0, y: 0 }],
      newValueSB_2P: [{ x: 130, y: -90 }, { x: 0, y: 0 }],

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
        { x: -157, y: -140 },
        { x: -87, y: -140 },
        { x: -18, y: -140 },
        { x: 50, y: -140 },
        { x: 125, y: -140 },
      ],

      playerNewValues: [
        { x: -350, y: -10 },
        { x: -300, y: -10 },
        { x: -320, y: -240 },
        { x: -270, y: -240 },
        { x: 100, y: -240 },
        { x: 50, y: -240 },
        { x: 280, y: -10 },
        { x: 330, y: -10 },
      ],

      quitVisible: false,
      raiseVisible: false,
      //winnerVisible: false,
      //fiveCardsFin: 0,

      valueFoldCard: new Animated.ValueXY({ x: 25, y: 25 }),
      fadeAnimation: [new Animated.Value(0), new Animated.Value(0),
                      new Animated.Value(0), new Animated.Value(0)], 

      playerCardsGiven: 1,
      gamePot: 0,
      raiseAmount: 10,

      player1Loc: null,
      player2Loc: null,
      player3Loc: null,
      player4Loc: null
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
      this.setState({ quitVisible: visible });
    }
    setRaiseVisible = (visible) => {
      this.setState({ raiseVisible: visible });
    }
    // setModalWinnerVisible = (visible) => {
    //   this.setState({ winnerVisible: visible});
    // }

    backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to go back?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => {
        setStatusBarHidden(false, 'slide');
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
                  top: "350%",
                  right: "1700%",
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
                  right: "2500%",
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
                  top: "100%",
                  right: "2100%",
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
                  top: "500%",
                  right: "2800%",
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
        <View style = {{right: 328, top: 310}}>
          <Animated.View style = {this.state.tableCardsStart[i].getLayout()}>
            <View style = {
              {position:'absolute',
                borderRadius: 2,
                alignItems: 'center',
                paddingVertical: 20,
                paddingHorizontal: 20,
                backgroundColor:"white",}}
            >
              <Text style={{color: suit == '♥' || 
                suit == '♦'? 'red': 'black'}}
              >{suit}</Text>
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
      //const { quitVisible } = this.state;
      return (
        <Modal
          supportedOrientations={['landscape']}
          animationType="slide"
          transparent={true}
          visible={this.state.quitVisible} 
        >
          <View style = {styles.centeredView}>
            <View style = {styles.modalView}>
              
              <Text style = {{padding: 5}}>Are you sure you want to leave?</Text>
              
              <TouchableOpacity
                style={styles.buttonInExit}
                onPress={() => {
                  this.setModalVisible(!this.state.quitVisible)
                }}
                >
                  <Text style={ styles.exitStyle }>NO</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.buttonInExit}
                onPress={() => {
                  this.setModalVisible(!(this.state.quitVisible))
                  setStatusBarHidden(false, 'slide');
                  this.props.navigation.navigate('LandingPage')
                  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
                  
                }}
              >
                <Text style={ styles.exitStyle }>Go to Main Menu</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonInExit}
                onPress={() => {
                  this.setModalVisible(!this.state.quitVisible)
                  this.leaveGame()
                }}
              >
                <Text style={ styles.exitStyle }>Quit Game</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )
    }

    leaveGame(){
      setStatusBarHidden(false, 'slide');
      this.props.navigation.navigate('LandingPage')
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      
      this.props.leaveGame(this.props.game,
        this.props.playerNum,
        this.props.matchType,
        this.props.matchType+'_'+this.props.matchName,
        this.props.userData,
        this.props.newPlayer
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
      else if (type === 'all in'){
        game.move[this.props.playerNum] = type
        game.ready[this.props.playerNum] = true
        keys = ['move', 'playerTurn', 'ready']

        if(amount > 0){
          game.chipsIn[this.props.playerNum] += amount //what if you don't have enough chips Fix for Partial Calls
          game.pot += amount 
          game.balance[this.props.playerNum] -= amount
          keys.push('chipsIn', 'balance', 'pot')
        }
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
        supportedOrientations={['landscape']}
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
                    if(Number(this.state.raiseAmount) == this.props.game.balance[this.props.playerNum]){
                      this.UpdateInitializer('all in', Number(this.state.raiseAmount)+callAmount)
                    }
                    else{
                      this.UpdateInitializer('raise', Number(this.state.raiseAmount)+callAmount)
                    }
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
      var balance = this.props.game.balance[this.props.playerNum]

      if(this.props.game.turn == 0 && balance < this.props.game.blindAmount) { //if you run out of funds
        callAmount = 0
        myTurn = false
        this.leaveGame()
      }

      if(myTurn){
        if(this.props.game.move[this.props.playerNum] === 'fold'|| 
        this.props.game.move[this.props.playerNum] === 'all in' ){ //if you fold
          myTurn = false
          callAmount = 0
          this.UpdateInitializer(this.props.game.move[this.props.playerNum], callAmount)
        }

        
        var lowestPlayerBalance = Math.min(...this.props.game.balance)
        var setupCall = true
        var callString = 'Call: '
        var callType = 'call'
        var callAmount = 0
        var raiseDisabled = false

        if(this.props.game.turn == 1) {
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
            callString =  'All In!'
            callType = 'all in'
            raiseDisabled = true
          }
          if(callAmount >= lowestPlayerBalance){
            raiseDisabled = true
          }
        }
      }

      return (
        <View style={styles.bettingButtonsView}>
          {this.raiseView(callAmount, lowestPlayerBalance-callAmount)}

          <TouchableOpacity 
            style={[styles.bettingButtons, (myTurn && !raiseDisabled)? styles.raiseButt:styles.disabled]}
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

    roundWinnerView(){
      var isVisible = !this.props.game.ready[this.props.playerNum]
      return (
        <Modal
          supportedOrientations={['landscape']}
          animationType="slide"
          transparent={true}
          visible={isVisible}
        >
          <View style = {styles.centeredView}>
            <View style = {styles.modalView}>
              <Text style = {{padding: 0, fontWeight: 'bold'}}>
                {this.props.game.roundWinner} won with a {this.props.game.roundWinnerRank}!
                </Text>
              <ActivityIndicator size='large' color="#0062ff"/>
              <View style = {{padding: 5}}></View>
              <TouchableOpacity
                style={styles.buttonInExit}
                onPress={() => {
                  isVisible = false
                  if(this.props.game.size-this.props.game.newPlayer > this.props.playerNum){
                    this.UpdateInitializer('check')
                  }
                }}
              >
                <Text>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )
    }

    timerView(){
      var myTurn = this.props.game.playerTurn == this.props.playerNum
      var isPlaying = 0 < this.props.game.turn && this.props.game.turn < 5
      return(
      <View style={styles.timer}>
        <CountdownCircleTimer
          key={this.props.game.playerTurn}
          isPlaying={isPlaying}
          size={60}
          strokeWidth = {8}
          duration={45}
          onComplete={() => (myTurn)? this.timedOut():([false])}
          colors={[
            ['#004777', 0.4],
            ['#F7B801', 0.4],
            ['#A30000', 0.2],
          ]}
        >
          {({ remainingTime, animatedColor }) => (
            <Animated.Text style={{ color: animatedColor, fontSize: 20 }}>
              {remainingTime}
            </Animated.Text>
          )}
        </CountdownCircleTimer>
        
        <View style={[styles.timerTextBackground]}>
          {0 == this.props.game.turn || this.props.game.turn == 5?(
            <Text style={[styles.playerNames, {marginLeft: 20}]}
            >Waiting For Other Players</Text>
            ):(
            <Text style={styles.playerNames}>
              {this.props.game.players[this.props.game.playerTurn]}'s Turn 
            </Text>
            )
          }
        </View>
      </View>
      )
    }
    
    timedOut(){
      this.foldCard() 
      this.UpdateInitializer('fold')
    }

    defaultEmptyAvatar() {
      return (
        <View style = {{alignItems: 'center'}}>
          <Image 
            source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/pokerfriends-843ef.appspot.com/o/transparent.png?alt=media&token=30b3c6ed-592b-4802-a2ee-d9c846ab3a05' }}
            style = {styles.avatarImage}/>
          <View style={styles.textBackground}>
            <Text style={styles.playerNames}>
              Empty
            </Text>
          </View>
        </View>)
    }

    render() { 
      //console.log(this.props.game.deck)
      
      return (
        
        <View style={styles.container}>
          {this.props.game.turn == 5 && this.props.game.roundWinner != -1? (
           this.roundWinnerView()
           ):(<Text></Text>)}
          
          {this.quitView()}
          
          <View style={{
            left: '4%',
            top: '1%'
          }}> 
            <TouchableOpacity
              style={[styles.button, styles.buttonOpen]}
              onPress={() => this.setModalVisible(true)}
            >
              <Text style={styles.textStyle}>EXIT</Text>
            </TouchableOpacity>
          </View>

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
                this.defaultEmptyAvatar()
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
                this.defaultEmptyAvatar()
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
                this.defaultEmptyAvatar()
              )}
            

            <Animated.View
              style={[styles.pBet, { opacity: this.state.fadeAnimation[3] }]}
            >
              <Text>testing</Text>
            </Animated.View>
          </View>

          {this.props.game.turn < 5 ?(
            this.actionsView()):
            (<Text>
            </Text>)
          }

          <View>
            {!(0 == this.props.game.turn || this.props.game.turn == 5) &&
              this.props.myCards.map((card, i) =>
                this.cardDeal(card.suit, card.value, i + this.props.playerNum * 2))}

            {1 < this.props.game.turn && this.props.game.turn < 5 ? (
              this.props.game.board.map((card, i) =>
                this.flopTurnRiver(card.suit, card.value, i))
            ) : (
              <Text></Text>
            )}
          </View>

          {this.timerView()}

          <View style={styles.chat}>
            <Chat
              matchName={this.props.matchName}
              matchType={this.props.matchType}
            />
          </View>

          <View style={styles.chipView}>
            <View style={{flexDirection: 'row' , justifyContent: 'center'}}>
              <Image
                style={{
                  width: 40,
                  height: 40,
                  resizeMode: "contain",
                }}
                source={require("../../../assets/chipAmount.png")}
              />
            </View>
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
  container: {
    flex: 1,
    //paddingTop: 10,
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
    marginVertical: 5
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
  timer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    resizeMode: 'contain',
    top: '83%',
    //top: Platform.OS === "android" ? '83%' : '81%',
    right: '37%',
    width: '25%',
    position: 'absolute'
  },
   timerTextBackground:{
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor:"#ff9f1a",
    borderRadius: 50,
    marginLeft: 5,
    maxHeight: 50,
    width: '80%',
    marginTop: 10
  },
  textStyle:{
    color: '#FFFFFF',
    fontWeight: 'bold',
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    alignContent: 'center'
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
    top: "37%",
    left: "6%",
    alignContent: "center",
    paddingBottom: 15
  },
  player2View: {
    borderRadius: 2,
    borderColor: 'black',
    top: "1.5%",
    left:"40%",
  },
  player3View: {
    borderRadius: 2,
    borderColor: "black",
    top: "1.5%",
    right: '20%',
  },
  player4View: {
    position:'absolute',
    borderRadius: 2,
    borderColor: 'black',
    top: "37%",
    right: "5%",
    alignContent: "center"
  },
  potView:{
    position: 'absolute',
    top: "4%",
    right: "2%"
  },
  pot:{
    borderRadius: 2,
    borderColor: "black",
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
  chipAmount: {
    top: '500%',
    left: '50%'
  },
  chipView:{
    position: 'absolute',
    width: 50,
    right: "2%",
    bottom: "2%",
    alignContent: 'center',
    alignItems: 'center'
  },
  tableView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    width: 466,
    height: 400,
    resizeMode: 'contain',
    top: '1%',
    marginLeft: '7%'
  },
  chat:{
    position:'absolute',
    bottom: "2%",
    right: "13%"
  },
  bettingButtonsView:{
    position: 'absolute',
    bottom: "2%",
    left: "2%",
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
