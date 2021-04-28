import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, 
  TouchableOpacity, Touchable, Alert, ActivityIndicator, Modal } from 'react-native';
import Logo from './Logo';
import firebase from 'firebase'

export default class FriendsList extends Component {
  constructor(props){
    super(props)
    this.state = {
      ready: false,
      friends: this.props.userData.friends.splice(0,1),
      friendSize: this.props.userData.friends.length - 1,
      friendData: [],

      searchEmail: '',
      foundUser: false,
      foundUserData: {},
      foundUserRequest: [],
      ModalVisible: false,

      userAbleAdd: true,
    }
  }

  componentDidMount(){
    var uid
    this.state.friends.forEach(name => { 
      uid = name.slice(name.indexOf('#')+1)
      firebase.database().ref('/users/'+ uid + '/data').on('value', (snapshot) => {
        this.setState({friendData: this.state.friendData.push(snapshot.val())})
      })
    });
    
    //if(this.state.friendData.length == this.state.friendSize){
      this.setState({ready: true})
    //}
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
        ModalVisible: true
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
    //console.log(this.state.foundUserRequest.friend_request)
    firebase.database().ref().update(updates);
  }

  AcceptFriendRequest(friendName){
    updates = {}
    updates['/users/'+ user.uid +'/request/friend_request'] = 
      this.props.userRequest.friend_request.splice(this.props.userRequest.friend_request.indexOf(friendName),1)
    updates['/users/'+ user.uid +'/data/friends'] = 
      this.props.userData.friends.push(friendName)


    const friendID = friendName.slice(friendName.indexOf('#')+1)
    
    
    //FETCH FRIEND INFO AND PUSH IT 
    var friend_confirmed = firebase.database().ref('/users/'+ friendID + '/request/friend_confrimed').once('value').then((snapshot) => {
      return snapshot.val()
    })

    updates['/users/'+ friendID +'/request/friend_confirmed'] = friend_confirmed.push(this.props.userData.username)
    firebase.database().ref().update(updates);
  }

  DisplayFoundUser(){
      return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.ModalVisible}
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
              onPress={() => this.setState({ModalVisible: false })}
            >
              <Text>EXIT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      )
  }


    render(){
      if(this.state.ready){
        return (
            <KeyboardAvoidingView 
              style={styles.container} 
              >
                {(this.state.ModalVisible)? (this.DisplayFoundUser()):(<Text></Text>)}
                <Text style={styles.textStyle}>Friends</Text>

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

                {/*<View style={{flex:1, alignSelf:'center', justifyContent:'center', paddingBottom: 10}}>
                  <FlatList style={{width:'100%'}}
                    data={this.state.friendData}
                    keyExtractor={(item)=>item.key}
                    renderItem={({item})=>{
                      return(
                        <View style={styles.gameDisplay}>
                          <Text style={styles.textStyle}>{item.key.slice(item.key.indexOf('_')+1, item.key.indexOf('-'))}</Text>
                          <Text style={styles.textStyle}>Size: {item.size}                   Buy In: {item.buyIn}</Text>
                          <TouchableOpacity style={styles.joinButton}
                          onPress={() => this.joinGame(item.key)}>
                            <Text style={styles.textStyle}>Join Game</Text>
                          </TouchableOpacity>
                        </View>)
                    }}
                  />
                  </View>*/}

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

})