import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, 
  TouchableOpacity, Touchable, Alert, ActivityIndicator, Modal, FlatList } from 'react-native';
import Logo from './Logo';
import firebase from 'firebase'
import { set } from 'react-native-reanimated';
import * as ScreenOrientation from 'expo-screen-orientation';

export default class FriendsList extends Component {
  constructor(props){
    super(props)
    this.state = {
      ready: false,
      friends: this.props.userData.friends.slice(1),
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
    }
  }

  componentDidMount(){
    var uid
    var name
    var data = []
    this.state.friends.forEach((fullName, index) => { 
      uid = fullName.slice(fullName.indexOf('#')+1)
      name = fullName.slice(0, fullName.indexOf('#'))
      console.log(name)
      firebase.database().ref('/users/'+ uid + '/data').on('value', (snapshot) => {
        data.push({key: name, ...snapshot.val()})
      })
    });
    console.log("lazy", data)
    this.setState({friendData:data, ready: true})
   }

   componentWillUnmount(){
    //stops checking for updates on list
    firebase.database().ref('/users').off()
  }

  FindUser(){
    /*var currentlyFriend = friendData.filter(data => data.email == this.state.searchEmail) == 1
    if(currentlyFriend){
      console.log('Already friends with user')
    }
    else{*/
    firebase.database().ref('/users').orderByChild("/data/email").equalTo(this.state.searchEmail).limitToFirst(1).on('value', (snapshot) => {
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
        //alert
        console.log('Already friends with user')
        userAbleAdd = false
      }
      else if(foundUserRequest.friend_request.includes(this.props.userData.username)){
        //alert
        console.log('Friend Request already sent')
        userAbleAdd = false
      }
      this.setState({foundUser: true,
        foundUserData: foundUserData, 
        foundUserRequest: foundUserRequest,
        userAbleAdd: userAbleAdd,
        foundModalVisible: true
      })
    })
    //}
  }

  SendFriendRequest(){
    this.setState({userAbleAdd: false})
    this.state.foundUserRequest.friend_request.push(this.props.userData.username)
    var updates = {};

    const friendID = this.state.foundUserData.username.slice(this.state.foundUserData.username.indexOf('#')+1)
    updates['/users/'+ friendID +'/request/friend_request'] = 
      this.state.foundUserRequest.friend_request
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
            <Text style = {{padding: 0, fontWeight: 'bold'}}>{this.state.foundUserData.username}</Text>

            <View style = {{padding: 5}}></View>
            <TouchableOpacity
              disabled={!this.state.userAbleAdd}
              style={[styles.buttonStyle, (this.state.userAbleAdd)?{backgroundColor:"#D6A2E8"}:styles.disabled]}
              onPress={() => this.SendFriendRequest()}
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
      this.props.navigation.navigate('GameController')
      ScreenOrientation.lockAsync
      (ScreenOrientation.OrientationLock.LANDSCAPE_LEFT)
    })

  }
  
  DisplayFriendRequest(){
    var friendRequests = []
    this.props.userRequest.friend_request.slice(1).forEach((fullName, index) => {
      friendRequests.push({key:fullName})
    });
  
    return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={this.state.requestModalVisible}
    >
      <View style = {styles.centeredView}>
        <View style = {styles.modalView}>
          <Text>-------</Text>
          {friendRequests.length == 0? (
            <Text>No Friend Requests</Text>
          ):(
          <FlatList style={{width:'100%'}}
            data={friendRequests}
            keyExtractor={(item)=>item.key}
            renderItem={({item})=>{
              return(
                <View style={{flex:1}}>
                  <Text>{item.key}</Text>
                  
                  <TouchableOpacity
                    style={[styles.buttonStyle]}
                    onPress={() => { this.RespondFriendRequest(item.key, true)} }
                  >
                    <Text>Accept</Text>
                  </TouchableOpacity>

                   <TouchableOpacity
                    style={[styles.buttonStyle]}
                    onPress={() => { this.RespondFriendRequest(item.key, false)} }
                  >
                    <Text>Decline</Text>
                  </TouchableOpacity>
                  
                  <Text>-------</Text>
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

  setRequestModalVisible = () => {
    this.setState({ requestModalVisible: true });
  }

    render(){
      if(this.state.ready){
        return (
          <KeyboardAvoidingView 
            style={styles.container} 
            >
              {(this.state.foundModalVisible)? (this.DisplayFoundUser()):(<Text></Text>)}
              {(this.state.requestModalVisible)? (this.DisplayFriendRequest()):(<Text></Text>)}
              <Text style={styles.textStyle}>Find Friends</Text>

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
                onPress={() => this.FindUser()}
              >
                <Text style={styles.textStyle}>Find</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonContainer}
                onPress={() => this.setRequestModalVisible()}
              >
                <Text style={styles.textStyle}>Friend Requests: {this.props.userRequest.friend_request.length - 1}</Text>
              </TouchableOpacity>

              <View style={{flex:1, alignSelf:'center', justifyContent:'center', paddingBottom: 10}}>
                <Text style={styles.textStyle}>Friends:</Text>
                <Text style={styles.textStyle}>-------</Text>
                <FlatList style={{width:'100%'}}
                  data={this.state.friendData}
                  keyExtractor={(item)=>item.key}
                  renderItem={({item})=>{
                    return(
                      <View style={[{flex:1}, styles.friendListContainer]}>
                        <Text style={styles.textStyle}>{item.key}</Text>
                        <Text style={styles.textStyle}>Game: {item.in_game.slice(0, item.in_game.indexOf('-'))}</Text>
                        <TouchableOpacity style={styles.joinButton}
                        onPress={() => this.joinGame(item.in_game)}>
                          <Text style={styles.joinTextStyle}>Join Game</Text>
                        </TouchableOpacity>
                        <Text style={styles.textStyle}>-------</Text>
                      </View>)
                  }}
                />
              </View>

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
      marginBottom: 10,
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    buttonStyle: {
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
      borderRadius: 10,
      textAlign: 'center',
      justifyContent: 'center',
      padding: 10
    },
    joinButton:{
      backgroundColor: '#000000',
      borderRadius: 50,
      width:"95%",
      marginLeft: 5
    },
    joinTextStyle: {
      color: "white",
      textAlign: "center"
    },

})