import React, { Component} from 'react';
import { Text,
         StyleSheet,
         View,
         TouchableOpacity,
         StatusBar,
         Image,
         Modal,
         TextInput,
         BackHandler,
         Alert,
         Animated,
         } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

import Deck from '../../decks'
import CardDealing from './cardDealing'


// const mydeck = new Deck()
// mydeck.shuffle()
// console.log(mydeck.cards)


export default class GameSetting extends Component {


    state = { 
        value1: new Animated.Value(0),
        value2: new Animated.ValueXY({x:0, y:0}),
        value3: new Animated.ValueXY({x:185, y:0}),
        value4: new Animated.ValueXY({x: 225, y: -75}),
        value5: new Animated.ValueXY({x: 400, y: 80}),
        value6: new Animated.ValueXY({x:415, y:-75}),
        value7: new Animated.ValueXY({x: -225 , y: 75}),
        value8: new Animated.ValueXY({x:625, y:0}), 
        valueFoldCard: new Animated.ValueXY({x: 25, y: 25}),
        modalVisible: false,
        raiseVisible: false,
        fiveCardsFin: 0
      };

      foldCard() {
        Animated.timing(this.state.valueFoldCard, {
          toValue: {x: -515, y: 375},
          duration: 1000,
          useNativeDriver: false
        }).start();
      }
      
      moveBB() {
        Animated.timing(this.state.value1, {
          toValue: 185,
          duration: 1000,
          useNativeDriver: false
        }).start();
      }

       moveSB() {
         Animated.timing(this.state.value2, {
           toValue: {x: 225, y: -75},
           duration: 1000,
           useNativeDriver: false
         }).start();
       }

      moveBB2() {
        Animated.timing(this.state.value3, {
          toValue: {x: 400, y: 80},
          duration: 1000,
          useNativeDriver: false
        }).start();

      }

      moveSB2() {
        Animated.timing(this.state.value4, {
          toValue:{x:415, y:-75},
          duration: 1000,
          useNativeDriver: false
        }).start();

      }

      moveBB3() {
        Animated.timing(this.state.value5, {
          toValue: {x: -225 , y: 75},
          duration: 1000,
          useNativeDriver: false
        }).start();

      }

      moveSB3() {
        Animated.timing(this.state.value6, {
          toValue:{x:625, y:0},
          duration: 1000,
          useNativeDriver: false
        }).start();

      }

      moveBB4() {
        Animated.timing(this.state.value7, {
          toValue: {x: 0 , y: 0},
          duration: 1000,
          useNativeDriver: false
        }).start();

      }

      moveSB4() {
        Animated.timing(this.state.value8, {
          toValue:{x:0, y:0},
          duration: 1000,
          useNativeDriver: false
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
      }
    
      componentWillUnmount() {
        this.backHandler.remove();
      }

      transitionBlinds(){
        //This first if statement should only be done in the
        //beginning of each game(New Lobby)
        if(this.state.fiveCardsFin == 0) {
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

        else if(this.state.fiveCardsFin == 1) {
         return <View>
          <Animated.View
                style = {{
                  left: this.state.value1
                }}>
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
                   {this.moveBB()}
                  <Text 
                  style = {{ textAlign: 'center',color: 'white'}}>
                  BB</Text>
                </View>
                </Animated.View>

                <Animated.View 
                style = { this.state.value2.getLayout()}>

                <View
                 style = {{ 
                  width: 25, 
                  height: 25, 
                  borderRadius: 25,
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  top: '350%',
                  right: '2300%'}}>
                  {this.moveSB()}
                  <Text style = {{textAlign: 'center'}}>SB</Text>
    
                </View>
                </Animated.View>
               
                </View>
        

        }
        else if(this.state.fiveCardsFin == 2) {
          return <View>
          <Animated.View
                style = {this.state.value3.getLayout()}>
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
                   {this.moveBB2()}
                  <Text 
                  style = {{ textAlign: 'center',color: 'white'}}>
                  BB</Text>
                </View>
                </Animated.View>

                <Animated.View 
                style = {this.state.value4.getLayout()}>

                <View
                 style = {{ 
                  width: 25, 
                  height: 25, 
                  borderRadius: 25,
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  top: '350%',
                  right: '2300%'}}>
                  {this.moveSB2()}
                  <Text style = {{textAlign: 'center'}}>SB</Text>
    
                </View>
                </Animated.View>
               
                </View>

        }
        else if (this.state.fiveCardsFin == 3) {
          return <View>
          <Animated.View
                style = {this.state.value5.getLayout()}>
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
                   {this.moveBB3()}
                  <Text 
                  style = {{ textAlign: 'center',color: 'white'}}>
                  BB</Text>
                </View>
                </Animated.View>

                <Animated.View 
                style = {this.state.value6.getLayout()}>

                <View
                 style = {{ 
                  width: 25, 
                  height: 25, 
                  borderRadius: 25,
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  top: '350%',
                  right: '2300%'}}>
                  {this.moveSB3()}
                  <Text style = {{textAlign: 'center'}}>SB</Text>
    
                </View>
                </Animated.View>
               
                </View>
        }

        else if(this.state.fiveCardsFin == 4) {
          return <View>
          <Animated.View
                style = {this.state.value7.getLayout()}>
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
                   {this.moveBB4()}
                  <Text 
                  style = {{ textAlign: 'center',color: 'white'}}>
                  BB</Text>
                </View>
                </Animated.View>

                <Animated.View 
                style = {this.state.value8.getLayout()}>

                <View
                 style = {{ 
                  width: 25, 
                  height: 25, 
                  borderRadius: 25,
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  top: '350%',
                  right: '2300%'}}>
                  {this.moveSB4()}
                  <Text style = {{textAlign: 'center'}}>SB</Text>
    
                </View>
                </Animated.View>
               
                </View>

        }
      }

     
    
    render() { 
        
        const { modalVisible } = this.state;
        const {raiseVisible} = this.state;
        return (  
            <View style = {styles.container}>
                <StatusBar hidden/>

                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={modalVisible}
                      
                    >
                        <View style = {styles.centeredView}>
                            <View style = {styles.modalView}>
                              <Text style = {{padding: 5}}>Are you sure you want to leave</Text>
                                <TouchableOpacity
                                style={styles.buttonInExit}
                                onPress={() => {
                                  this.setModalVisible(!modalVisible)
                                }}
                                >
                                <Text style={ styles.exitStyle } >NO</Text>
                                </TouchableOpacity>
                                <View style = {{padding: 5}}></View>
                                <TouchableOpacity
                                  style={styles.buttonInExit}
                                  onPress={() => {
                                  this.props.navigation.navigate('LandingPage')
                                  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
                                  this.setModalVisible(!modalVisible);
                                  }}
                                >
                                    <Text style={ styles.exitStyle }>YES</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    <View>
                    <TouchableOpacity
                      style={[styles.button, styles.buttonOpen]}
                      onPress={() => this.setModalVisible(true)}
                    >
                      <Text style ={styles.textStyle} >EXIT</Text>
                    </TouchableOpacity>
                    </View>
               
                <View>
                  <View style={styles.webcam2}>
                      <Text>Webcam 2</Text> 
                  </View> 
                </View>

                <View style={styles.webcam1}>
                    <Text>Webcam 1</Text> 
                </View>
                
                
                <View style={styles.tableView}>
                  <Image  style = {styles.tableView}
                  source = {require('../../../assets/pokertable.png')}
                  />
               </View>

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
                      Pot: $420
                  </Text>
                </View>
                
                
                <View style={styles.webcam4}>
                  <View>
                      <Text>Webcam 4</Text> 
                  </View>
                </View>
                

                <View style={styles.bettingButtonsView}>
                <Modal
                      animationType="slide"
                      transparent={true}
                      visible={raiseVisible}
                      
                    >
                        <View style = {styles.centeredView}>
                            <View style = {styles.modalView}>
                              <Text style = {{padding: 0, fontWeight: 'bold'}}>RAISE</Text>
                              <TextInput style = 
                              {{fontSize: 20, padding: 10}} 
                              placeholder="0"
                              keyboardType = {'number-pad'}
                              disableFullscreenUI = {true}
                              >
                              </TextInput>

                                <TouchableOpacity
                                style={styles.buttonInExit}
                                onPress={() => {
                                  //this.raiseAnimation()
                                  this.setRaiseVisible(!raiseVisible);
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
                  <TouchableOpacity style={[styles.bettingButtons, styles.raiseButt]}
                  onPress={() => this.setRaiseVisible(true)}
                  >
                    <Text>Raise</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.bettingButtons, styles.callButt]}>
                    <Text>Call</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.bettingButtons, styles.foldButt]} onPress = {() => this.foldCard()}>
                    <Text>Fold</Text>
                  </TouchableOpacity>


                  <TouchableOpacity style={[styles.bettingButtons, {backgroundColor:"#D6A2E8"}]}>
                    <Text>Check</Text>
                  </TouchableOpacity>

                </View>


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
                    100
                  </Text> 
                </View>
                
                {this.transitionBlinds()}

               <CardDealing></CardDealing>

               <View style = {styles.foldContainer}>
                    <Animated.View style = {[styles.foldCard, this.state.valueFoldCard.getLayout()]}>
                      <Image style = {styles.cardImage} source = {require("../../../assets/deckOfCards/PNG/♥J.png")}/>
                    </Animated.View>
               </View>

            </View>

         );
    }
}
 

const styles = StyleSheet.create({
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
        left: "1%",
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
        right: "0%"
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
         bottom: '4%',
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