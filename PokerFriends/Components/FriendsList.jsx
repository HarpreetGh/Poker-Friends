import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, 
  TouchableOpacity, Touchable, Alert, ActivityIndicator, Modal, FlatList } from 'react-native';
import firebase from 'firebase'
import AccountStats from "./AccountStats";
import { set } from 'react-native-reanimated';
import * as ScreenOrientation from 'expo-screen-orientation';
import {setStatusBarHidden } from 'expo-status-bar';

export default class FriendsList extends Component {
  constructor(props){
    super(props)
    this.state = {
      ready: false,
      friends: null,//this.props.userData.friends.slice(1),
      friendSize: this.props.userData.friends.length - 1,
      friendData: [],

      searchEmail: '',
      foundUser: false,
      foundUserData: {},
      foundUserRequest: [],
      foundModalVisible: false,
      userAbleAdd: true,

      requestModalVisible: false,
      confirmFriend:'',

      mangageFriendsVisible: false,
      removeFriendsOn: false
    }
  }

  componentDidMount(){
    var user = firebase.auth().currentUser;
    firebase.database().ref("/users/"+ user.uid + "/data/friends").on("value", (snapshot) => {
      var data = null
      data = snapshot.val().slice(1);
      console.log("Friends updated", data); 
      this.setState({ready: false, friends: data}, () => this.GetData());
    });
      //this.GetData()
   }

   componentWillUnmount(){
    //stops checking for updates on list
    firebase.database().ref('/users').off()
  }

  GetData(){
    var data = []
    if(this.state.friends.length > 0){
      this.state.friends.forEach(async (fullName) => { 
        var uid = fullName.slice(fullName.indexOf('#')+1)
        var name = fullName.slice(0, fullName.indexOf('#'))
        console.log(name)
        firebase.database().ref('/users/'+ uid + '/data').once('value', (snapshot) => {
          data.push({key: name, ...snapshot.val()})
          if(data.length == this.state.friends.length)
          {
            this.setState({friendData:data, ready: true})    
          }
        })
      });
    }
    else{
      this.setState({ready: true, friendData: []})
    }
  }

  FindUser(){
    /*var currentlyFriend = friendData.filter(data => data.email == this.state.searchEmail) == 1
    if(currentlyFriend){
      console.log('Already friends with user')
    }
    else{*/
    var searchEmail = this.state.searchEmail.trim()
    this.setState({searchEmail: ''})

    firebase.database().ref('/users').orderByChild("/data/email").equalTo(searchEmail).limitToFirst(1).once('value', (snapshot) => {
      if(snapshot.val() == null){
        this.setState({foundUser: false})
        return
      }

      var id = Object.keys(snapshot.val())[0]
      var foundUserData = snapshot.val()[id].data
      var foundUserRequest = snapshot.val()[id].request
      var userAbleAdd = true

      console.log(foundUserData, foundUserRequest)

      if(foundUserData.friends.includes(this.props.userData.username)){
        Alert.alert('Already friends with user')
        console.log('Already friends with user')
        userAbleAdd = false
      }
      else if(foundUserRequest.friend_request.includes(this.props.userData.username)){
        Alert.alert('Friend Request already sent')
        console.log('Friend Request already sent')
        userAbleAdd = false
      }
      else if(foundUserData.username === this.props.userData.username){
        Alert.alert('You cannot add yourself!')
        console.log('You cannot add yourself!')
        userAbleAdd = false
      }
      else{
        this.setState({foundUser: true,
          foundUserData: foundUserData, 
          foundUserRequest: foundUserRequest,
          userAbleAdd: userAbleAdd,
          foundModalVisible: true
        })
      }
    })
    //}
  }

  SendFriendRequest(){
    this.setState({userAbleAdd: false})
    this.state.foundUserRequest.friend_request.push({username: this.props.userData.username, photoURL: this.props.userData.photoURL})
    var updates = {};

    const friendID = this.state.foundUserData.username.slice(this.state.foundUserData.username.indexOf('#')+1)
    updates['/users/'+ friendID +'/request/friend_request'] = 
      this.state.foundUserRequest.friend_request
    updates['/users/'+ friendID +'/request/friend_request_alert'] = true
    firebase.database().ref().update(updates);
  }

  async RespondFriendRequest(friendName, accept){
    var user = firebase.auth().currentUser;

    var updates = {}
    var newFriendRequest = this.props.userRequest.friend_request
    newFriendRequest.splice(this.props.userRequest.friend_request.indexOf(friendName), 1)
    updates['/users/'+ user.uid +'/request/friend_request'] = newFriendRequest
    
    if(accept){
      var newFriends = this.props.userData.friends
      newFriends.push(friendName)
      updates['/users/'+ user.uid +'/data/friends'] = newFriends

      const friendID = friendName.slice(friendName.indexOf('#')+1)
      
      //FETCH FRIEND INFO AND PUSH IT 
      var friend_confirmed = await firebase.database().ref('/users/'+ friendID + '/request/friend_confirmed').once('value').then((snapshot) => {  
        return snapshot.val()
      })
      friend_confirmed.push(this.props.userData.username)
      updates['/users/'+ friendID +'/request/friend_confirmed'] = friend_confirmed
    }

    firebase.database().ref().update(updates);
  }

  DisplayFoundUser(){
      return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.foundModalVisible}
      >
        <View style = {styles.centeredView}>
          <View style = {styles.modalView}>
            <View style={{flexDirection: 'row' , justifyContent: 'center'}}>
              <Image source={{ uri: this.state.foundUserData.photoURL }} style = {styles.avatarImage}/>
            </View>

            <Text style = {{padding: 0, fontWeight: 'bold'}}>
              {this.state.foundUserData.username.slice(0, this.state.foundUserData.username.indexOf('#'))}
            </Text>

            <View style = {{padding: 5}}></View>
            <TouchableOpacity
              disabled={!this.state.userAbleAdd}
              style={[styles.buttonStyle, (this.state.userAbleAdd)?{backgroundColor:"#D6A2E8"}:styles.disabled]}
              onPress={() => {this.SendFriendRequest(); this.setState({foundModalVisible: false })}}
            >
              <Text>ADD</Text>
            </TouchableOpacity>
            
            <View style = {{padding: 5}}></View>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => this.setState({foundModalVisible: false })}
            >
              <Text>EXIT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      )
  }

  async joinGame(matchName){
    console.log(matchName)
    var user = firebase.auth().currentUser;
    const username = user.displayName
    var matchPath
    if (matchName.search('private') == -1) {
      matchPath =  '/games/public/' + matchName 
    }
    else {
      matchPath =  '/games/private/' + matchName 
    }

    firebase.database().ref(matchPath).once('value', (snapshot) => {
      console.log('game data recieved')
      var data = snapshot.val()
      data.balance.push(data.buyIn)
      data.players.push(username)
      data.playerAvatar.push(user.photoURL)
      data.newPlayer +=1
      data.size += 1

      this.props.userData.chips -= data.buyIn
      
      var updates = {};
      
      updates['/users/'+ user.uid +'/data/in_game'] = matchName
      updates['/users/'+ user.uid +'/data/chips'] = this.props.userData.chips

      updates[matchPath + '/balance'] = data.balance
      updates[matchPath + '/players'] = data.players
      updates[matchPath + '/playerAvatar'] = data.playerAvatar
      updates[matchPath + '/newPlayer'] = data.newPlayer
      updates[matchPath + '/size'] = data.size

      
      updates['/games/list/' + matchName + '/size'] = data.size

      firebase.database().ref().update(updates);
      setStatusBarHidden(true, 'slide');
      this.props.navigation.navigate('GameController')
    })

  }
  
  DisplayFriendRequest(){
    var friendRequests = this.props.userRequest.friend_request.slice(1)
  
    return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={this.state.requestModalVisible}
    >
      <View style = {styles.centeredView}>
        <View style = {styles.modalView}>
          {friendRequests.length == 0? (
            <Text>No Friend Requests</Text>
          ):(
          <FlatList style={{width:'100%'}}
            data={friendRequests}
            keyExtractor={(item)=>item.username}
            renderItem={({item})=>{
              return(
                <View style={{padding: 10}}>
                  <View style={{flexDirection: 'row' , justifyContent: 'center'}}>
                    <Image source={{ uri: item.photoURL}} style = {styles.avatarImage}/>
                  </View>

                  <Text style={styles.textStyleDark}> {item.username.slice(0, item.username.indexOf('#'))}</Text>
                  
                  <View style={{flexDirection: "row", justifyContent: "space-evenly"}}>
                    <TouchableOpacity
                      style={styles.buttonAccept}
                      onPress={() => { this.RespondFriendRequest(item.username, true)} }
                    >
                      <Text>Accept</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.buttonDecline]}
                      onPress={() => { this.RespondFriendRequest(item.username, false)} }
                    >
                      <Text>Decline</Text>
                    </TouchableOpacity>
                  </View>
                </View>)
            }}
            />
          )}
          
          
          <View style = {{padding: 5}}></View>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => this.setState({requestModalVisible: false })}
          >
            <Text>EXIT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    )
  }

  //do the remove on other end
  async RemoveFriend(username){
    var user = firebase.auth().currentUser;

    var friendID = username.slice(username.indexOf('#')+1)
    var newFriendsList = this.props.userData.friends
    newFriendsList.splice(this.props.userData.friends.indexOf(username), 1)

    var updates = {}
    updates['/users/'+ user.uid +'/data/friends'] = newFriendsList
    updates['/users/'+ friendID +'/request/friend_delete'] =  [this.props.userData.username]

    firebase.database().ref().update(updates);
  }

  RemoveFriendButton(friendName, fullFriendName){
    return(
      <TouchableOpacity 
        style={styles.removeFriendButton} 
        onPress={() => this.RemoveFriend(fullFriendName)}
      >
          <Text style={styles.textStyle}>Remove {friendName}</Text>
      </TouchableOpacity>
    )
  }

  setRequestModalVisible = () => {
    this.setState({ requestModalVisible: true });
  }

    render(){
      if(this.state.ready){
        return (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={styles.container} 
            >
              {(this.state.foundModalVisible)? (this.DisplayFoundUser()):(<Text></Text>)}
              {(this.state.requestModalVisible)? (this.DisplayFriendRequest()):(<Text></Text>)}
              <TouchableOpacity style={styles.buttonContainer}
                  onPress={() => this.setState({mangageFriendsVisible: !this.state.mangageFriendsVisible})}
                >
                  <Text style={styles.titleButtonStyle}>Manage Friends</Text>
              </TouchableOpacity>
              
              {!this.state.mangageFriendsVisible? (
                <View></View>
              ):( 
                <View style={{width: '100%'}}>
                  <TextInput
                    style={styles.input} 
                    placeholder="Find Friend via Email"
                    placeholderTextColor="rgba(255, 255, 255, 0.75)"
                    returnKeyType="next"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={text => this.setState({searchEmail: text})}
                    value={this.state.searchEmail}
                  />
                    
                  <TouchableOpacity style={styles.buttonContainer}
                    disabled = {this.state.searchEmail.length < 1}
                    onPress={() => this.FindUser()}
                  >
                    <Text style={styles.textStyle}>Find</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.buttonContainer}
                    onPress={() => this.setRequestModalVisible()}
                  >
                    <Text style={styles.textStyle}>Friend Requests: {this.props.userRequest.friend_request.length - 1}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.buttonContainer, (this.state.removeFriendsOn)?{backgroundColor: '#c80c0d'}:{}]}
                    onPress={() => this.setState({removeFriendsOn: !this.state.removeFriendsOn})}
                  >
                    <Text style={styles.textStyle}>Remove Friend</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={{flex:1, alignContent:'center', justifyContent:'center', paddingBottom: 10, width: '100%'}}>
                <Text style={styles.titleTextStyle}>Friends:</Text>
                <FlatList
                  horizontal={false}
                  numColumns={2}
                  data={this.state.friendData}
                  keyExtractor={(item)=>item.key}
                  renderItem={({item})=>{
                    var gameName = item.in_game.slice(0, item.in_game.indexOf('-'))
                    var inGame = gameName.length > 0
                    return(
                      <View style={styles.friendListContainer}>
                        <View style={{flexDirection: 'row' , justifyContent: 'center'}}>
                          <Image
                            source={{ uri: item.photoURL }}
                            style = {styles.avatarImage}/>
                        </View>
                        
                        {this.state.removeFriendsOn? (
                          this.RemoveFriendButton(item.key, item.username)
                          ):(
                          <Text style={styles.titleTextStyle}>{item.key}</Text>
                        )}

                        {inGame? (<View>
                          <Text style={[styles.textStyle, {marginBottom: 5}]}>Game: {gameName}</Text> 
                          <TouchableOpacity style={styles.joinButton}
                          onPress={() => this.joinGame(item.in_game)}>
                            <Text style={styles.joinTextStyle}>Join Game</Text>
                          </TouchableOpacity>
                        </View>
                        ):(<Text style={styles.textStyle}>Not in a game.</Text>)}
                      </View>
                    )
                  }}
                />
              </View>

              <TouchableOpacity style={styles.buttonContainer}
              onPress={() => this.props.navigation.navigate('LandingPage')}>
                  <Text style={styles.textStyle}>Go Back</Text>
              </TouchableOpacity>

          </KeyboardAvoidingView>
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
      padding: 20,
      flex: 1,
      backgroundColor: '#2ecc71',
      alignItems: 'center',
      justifyContent: 'center'
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    input: {
      height:40,
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      marginBottom: 20,
      color: '#FFF',
      paddingHorizontal: 20,
      paddingEnd: 10,
      borderRadius: 50,
      width:'100%'
    },
    sendButtonText: {
      textAlign: 'center',
      color: '#FFF',
      fontWeight: '900'
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    textStyleDark: {
      color: "black",
      fontWeight: "bold",
      textAlign: "center"
    },
    titleTextStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 20,
      marginBottom: 10
    },
    titleButtonStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 20
    },
    buttonStyle: {
      borderRadius: 2,
      padding: 10,
      elevation: 2,
      backgroundColor: "#b2bec3",
      marginTop: 5
    },
    buttonAccept: {
      borderRadius: 2,
      padding: 10,
      elevation: 2,
      backgroundColor: "#D6A2E8",
      marginTop: 5
    },
    buttonDecline: {
      borderRadius: 2,
      padding: 10,
      elevation: 2,
      backgroundColor: "#b2bec3",
      marginTop: 5
    },
    buttonContainer:{
      backgroundColor: '#27ae60',
      paddingVertical: 20,
      padding: 20,
      borderRadius: 50,
      width:"100%",
      marginBottom: 20
    },
    disabled:{
      backgroundColor: "#cccccc"
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    friendListContainer: {
      backgroundColor: '#27ae60',
      borderRadius: 30,
      textAlign: 'center',
      justifyContent: 'center',
      alignContent: 'center',
      width: "45%",
      padding: 10,
      margin: 10
    },
    joinButton:{
      backgroundColor: '#000000',
      borderRadius: 50,
      width:"95%",
      marginLeft: 5
    },
    joinTextStyle: {
      padding: 5,
      color: "white",
      textAlign: "center"
    },
    avatarImage: {
      width: 80, 
      height: 80, 
      borderRadius: 100,
      marginBottom: 10,
      justifyContent: 'center',
    },
    removeFriendButton:{
      backgroundColor: '#c80c0d',
      paddingVertical: 20,
      padding: 20,
      borderRadius: 50,
      width:"100%",
      marginBottom: 20
    },
})