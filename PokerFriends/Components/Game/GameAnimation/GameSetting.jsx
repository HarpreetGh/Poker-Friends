import React, {Component} from 'react';
import { Text, StyleSheet, View, TouchableOpacity,
         StatusBar, Image, Modal, TextInput,
         BackHandler, Alert, Animated, Dimensions,
         ActivityIndicator, SafeAreaView
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
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
      
    var dimensions = Dimensions.get('screen')
    if(dimensions.height > dimensions.width){
      var temp = dimensions.height
      dimensions.height = dimensions.width
      dimensions.width = temp
    }

    this.state = {
      animationBB: [
        new Animated.ValueXY({ x: 0, y: 0 }),
        new Animated.ValueXY({ x: 185, y: 0 }),
        new Animated.ValueXY({ x: 450, y: 80 }),
        new Animated.ValueXY({ x: -225, y: 75 }),
      ],
      animationSB: [
        new Animated.ValueXY({ x: 0, y: 0 }),
        new Animated.ValueXY({ x: 225, y: -95 }),
        new Animated.ValueXY({ x: 415, y: -75 }),
        new Animated.ValueXY({ x: 625, y: 0 }),
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

      quitVisible: false,
      raiseVisible: false,

      valueFoldCard: new Animated.ValueXY({ x: 25, y: 25 }),
      fadeAnimation: [new Animated.Value(0), new Animated.Value(0),
                      new Animated.Value(0), new Animated.Value(0)], 

      raiseAmount: 10,
      screen: dimensions
    };
  }
  
    componentDidMount() {
      this.backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        this.backAction
      );
    }
  
    componentWillUnmount() {
      this.backHandler.remove();
    }

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

    setModalVisible = (visible) => {
      this.setState({ quitVisible: visible });
    }
    setRaiseVisible = (visible) => {
      this.setState({ raiseVisible: visible });
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
      var screen = this.state.screen
      var xOS = Platform.OS === "android" ? (StatusBar.currentHeight) : (screen.width*0.035)

      var newValueBB = [
        { x: (screen.width*parseFloat(styles.player1View.left) / 100.0)+130+xOS, 
          y: screen.height*(parseFloat(styles.player1View.top) / 100.0)},
        { x:(screen.width*parseFloat(styles.player2View.left) / 100.0)+20+xOS, 
          y: (screen.height*parseFloat(styles.player2View.top) / 100.0)},
        { x: (screen.width*(1-parseFloat(styles.player3View.right) / 100.0))-20 -xOS, 
          y: screen.height*(parseFloat(styles.player3View.top) / 100.0)},
        { x: (screen.width*(1-parseFloat(styles.player4View.right) / 100.0))-20-xOS, 
          y: screen.height*(parseFloat(styles.player4View.top) / 100.0)}]

      Animated.timing(this.state.animationBB[player], {
          toValue: newValueBB[player],
          duration: 1000,
          useNativeDriver: false
        }).start();
    }

    moveSB(player) {
      var screen = this.state.screen
      var xOS = Platform.OS === "android" ? (StatusBar.currentHeight) : (screen.width*0.035)

      var newValueSB = [
        { x: (screen.width*parseFloat(styles.player1View.left) / 100.0)+120+xOS, 
          y: screen.height*(parseFloat(styles.player1View.top) / 100.0)},
        { x:(screen.width*parseFloat(styles.player2View.left) / 100.0)+xOS, 
          y: (screen.height*parseFloat(styles.player2View.top) / 100.0)}, 
        { x: (screen.width*(1-parseFloat(styles.player3View.right) / 100.0))-20-xOS, 
          y: screen.height*(parseFloat(styles.player3View.top) / 100.0)},
        { x: (screen.width*(1-parseFloat(styles.player4View.right) / 100.0))-20-xOS, 
          y: screen.height*(parseFloat(styles.player4View.top) / 100.0)}]

      Animated.timing(this.state.animationSB[player], {
          toValue: newValueSB[player],
          duration: 1000,
          useNativeDriver: false
        }).start();
    }
      
    fadeIn(num) {
      Animated.timing(this.state.fadeAnimation[num], {
        toValue: 1,
        duration: 4000,
        useNativeDriver: false,
      }).start();
    }

    fadeOut(num) {
      Animated.timing(this.state.fadeAnimation[num], {
        toValue: 0,
        duration: 3000,
        useNativeDriver: false,
      }).start();
    }

    transitionBlinds(){
      var indexSB = this.props.game.smallBlindLoc;
      var indexBB = indexSB+1 

      if(indexBB == this.props.game.size){
        indexBB = 0
      }
      var moveBigBlinds = this.state.animationBB[indexBB].getLayout()
      var moveSmallBlinds = this.state.animationSB[indexSB].getLayout()
      //console.log("MY INDEXES ARE ", indexSB, indexBB)

      return (
        <View>
          <Animated.View
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
                opacity: this.props.game.turn == 1? 1:0
              }}
            >
              {this.moveBB(indexBB)}
              <Text style={{ textAlign: "center", color: "white" }}>BB</Text>
            </View>
          </Animated.View>

          <Animated.View
            style={moveSmallBlinds}
          >
            <View
              style={{
                width: 25,
                height: 25,
                borderRadius: 25,
                backgroundColor: "white",
                justifyContent: "center",
                top: "100%",
                right: "2100%",
                opacity: this.props.game.turn == 1? 1:0
              }}
            >
              {this.moveSB(indexSB)}
              <Text style={{ textAlign: "center" }}>SB</Text>
            </View>
          </Animated.View>
        </View>
      );
    }

    flopTurnRiver(suit,value, i){
      var screen = this.state.screen
      return (
        <View style={{left: 0, right:0}}>
          <Animated.View style = {this.state.tableCardsStart[i].getLayout()}>
            <View style = {
              {position:'absolute',
                borderRadius: 2,
                justifyContent: 'center',
                alignItems: 'center',
                width: screen.width * 0.08,
                height: screen.height * 0.25,
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
      var screen = this.state.screen
      var xOS = (Platform.OS === "android" ? (0.016*(1+(screen.scale/2)/10)) : 
      (screen.width*0.034/1000))
      var xBase = (Platform.OS === "android" ? (-screen.width*0.3 + screen.width*0.6*0.2):
        (-screen.width*0.3 + screen.width*0.6*0.103)+(screen.width*0.035*1.45))
      var yBase = screen.height/2.5
      var xMod = (screen.width * 0.08) + (screen.width*0.6*xOS)
      
      
      var tableCardsMove= [
        { x: 0+xBase, y: yBase},
        { x: (1*xMod)+xBase, y: yBase},
        { x: (2*xMod)+xBase, y: yBase},
        { x: (3*xMod)+xBase, y: yBase},
        { x: (4*xMod)+xBase, y: yBase},
      ]

      Animated.timing(this.state.tableCardsStart[card], {
        toValue: tableCardsMove[card],
        duration: 1000,
        useNativeDriver: false
      }).start();
    }

    cardDeal(suit,value,i) {
      return (<View>
        <Animated.View style = {this.state.playerCardAnimations[i].getLayout()}>
          <CardDealing suit={suit} value={value}>{this.movePlayerCards(i)}</CardDealing>
        </Animated.View>
      </View>
      )
    }

    movePlayerCards(card) {
      var screen = this.state.screen

      var playerNewValues= [
        { x: -(screen.width/2)*(0.75-parseFloat(styles.player1View.left) / 100.0), 
          y: screen.height*(1.09-parseFloat(styles.player1View.top) / 100.0)},
        { x: -(screen.width/2)*(0.75-parseFloat(styles.player1View.left) / 100.0) +50,  
          y: screen.height*(1.09-parseFloat(styles.player1View.top) / 100.0)},

        { x: -(screen.width/2)*(parseFloat(styles.player2View.left) / 100.0), 
          y: screen.height*(parseFloat(styles.player2View.top) / 10.0)},
        { x: -(screen.width/2)*(parseFloat(styles.player2View.left) / 100.0) + 50,  
          y: screen.height*(parseFloat(styles.player2View.top) / 10.0)},

        { x: -(screen.width/2)*((1-parseFloat(styles.player3View.right)) / 100.0), 
          y: screen.height*(parseFloat(styles.player3View.top) / 10.0)},
        { x: -(screen.width/2)*((1-parseFloat(styles.player3View.right)) / 100.0) + 50,  
          y: screen.height*(parseFloat(styles.player2View.top) / 10.0)},

        { x: (screen.width/2)*(0.85-parseFloat(styles.player4View.right) / 100.0), 
          y: screen.height*(1.09-parseFloat(styles.player4View.top) / 100.0)},
        { x: (screen.width/2)*(0.85-parseFloat(styles.player4View.right) / 100.0) +50,  
          y: screen.height*(1.09-parseFloat(styles.player4View.top) / 100.0)}]

      Animated.timing(this.state.playerCardAnimations[card], {
        toValue: playerNewValues[card],
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
                style={[styles.buttonInExit, {backgroundColor: "#c80c0d"}]}
                onPress={() => {
                  this.setModalVisible(!this.state.quitVisible)
                  this.leaveGame()
                }}
              >
                <Text style={styles.textStyle}>Quit Game</Text>
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
      this.props.updateGame(type, amount, 
        this.props.game,
        this.props.playerNum,
        this.props.matchType,
        this.props.matchName
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
            this.props.game.smallBlindLoc == this.props.game.size-this.props.game.newPlayer)
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
            callType = 'big blind'
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
                  else{
                    isVisible = false
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

    playerMoveView(num){
      var opac = false
      if(this.props.game.move[num] === 'fold' ||
         this.props.game.move[num] === 'all in' ||
         this.props.game.move[num] === 'small blind')
      {
        opac = true
      }
      return(
        <Animated.View
          style={[{opacity: opac||this.props.game.ready[num]?(this.fadeIn(num)):(0),
          backgroundColor: "#27ae60", padding: 2, borderRadius: 20}]}
        >
          <Text style={styles.textStyle}>
            {this.props.game.move[num] == 'raise' || this.props.game.move[num] == 'call'? (
              this.props.game.move[num] + ' ' + this.props.game.raisedVal
            ):(
              this.props.game.move[num]
            )}
          </Text>
        </Animated.View>
      )
    }

    playerAvatarView(num){
      return(
        this.props.game.size > num ? (
        <View style = {{alignItems: 'center'}}>
          <Image
            source={{ uri: this.props.game.playerAvatar[num] }}
            style = {styles.avatarImage}/>
            <View style={styles.textBackground}> 
              <Text style={styles.playerNames}>
                {this.props.game.players[num]}</Text>
            </View>
            {this.playerMoveView(num)}
        </View>
        ) : (
          this.defaultEmptyAvatar()
        )
      )
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
          
          <View style={{left: '2%', top: '2.5%', position: 'absolute'}}> 
            <TouchableOpacity
              style={styles.exitButton}
              onPress={() => this.setModalVisible(true)}
            >
              <Text style={styles.textStyle}>EXIT</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tableView}>
            <Image
              style={styles.tableImage}
              source={require("../../../assets/pokertable.png")}
            />
            
          </View>

          {1 < this.props.game.turn && this.props.game.turn < 5 &&
              this.props.game.board.map((card, i) =>
                this.flopTurnRiver(card.suit, card.value, i))}

          <View style={styles.player1View}>
            {this.playerAvatarView(0)}
          </View>

          <View style={styles.player2View}>
            {this.playerAvatarView(1)}
          </View>
          
          <View style={styles.player3View}>
            {this.playerAvatarView(2)}
          </View>

          <View style={styles.player4View}>
            {this.playerAvatarView(3)}
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

          {0 < this.props.game.turn && this.props.game.turn < 5 && this.actionsView()}

          <View>
            {0 < this.props.game.turn && this.props.game.turn < 5 &&
              this.props.myCards.map((card, i) =>
                this.cardDeal(card.suit, card.value, i + this.props.playerNum * 2))}
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

          {this.props.game.turn == 1 && this.transitionBlinds()}

          {this.props.game.turn == 5 && this.props.game.roundWinner != -1 &&
           this.roundWinnerView()}
          
          {this.quitView()}
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
    backgroundColor: '#2ecc71',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'nowrap'
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
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: '80%',
    backgroundColor: "#cccccc",
    marginTop: 5,
    alignItems: 'center',
  },
  exitButton:{
    borderRadius: 50,
    padding: 10,
    elevation: 2,
    backgroundColor: "#27ae60",
  },
  timer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    resizeMode: 'contain',
    top: Platform.OS === "android" ? '83%' : '81%',
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
    elevation: 5,
    width: '35%'
  },
  textBackground:{
    backgroundColor:"#ff9f1a",
    paddingBottom: 4,
    paddingHorizontal: 5,
    borderRadius: 50
  },
  player1View: {
    position: 'absolute',
    borderRadius: 2,
    borderColor: 'black',
    width: 110,
    top: "35%",
    left: "6%",
    alignContent: "center",
    paddingBottom: 15
  },
  player2View: {
    borderRadius: 2,
    borderColor: 'black',
    position: 'absolute',
    width: 110,
    left: "20%",
    top: "1%",
  },
  player3View: {
    borderRadius: 2,
    borderColor: 'black',
    position: 'absolute',
    width: 110,
    right: "20%",
    top: "1%",
  },
  player4View: {
    position:'absolute',
    borderRadius: 2,
    borderColor: 'black',
    width: 110,
    top: "35%",
    right: "6%",
    alignContent: "center"
  },
  potView:{
    position: 'absolute',
    top: "0%",
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
    position: 'absolute',
    top: '5%',
    //left: 0, 
    //right: 0,
    bottom: 0,
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableImage: {
    width: '100%',  
    resizeMode: 'contain',
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
