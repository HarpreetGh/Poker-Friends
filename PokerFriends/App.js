import "react-native-gesture-handler";
import React, { Component, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ActivityIndicator,
  LogBox,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Firebaseinit from "./firebase"; //Intializes Firebase
import firebase from "firebase";

import LandingPage from "./Components/LandingPage";
import Register from "../PokerFriends/Components/Register";
import Login from "./Components/Login";
import ForgotPassword from "./Components/Account-Settings/ForgotPassword";
import GameSetting from "./Components/Game/GameAnimation/GameSetting";
import GameController from "./Components/Game/GameController";
import AccountSettings from "./Components/AccountSettings";
import ChangeUsername from "./Components/Account-Settings/ChangeUsername";
import ChangeEmail from "./Components/Account-Settings/ChangeEmail";
import DeleteAccount from "./Components/Account-Settings/DeleteAccount";
import FriendsList from "./Components/FriendsList";
import CreateGame from "./Components/CreateGame";
import JoinGame from "./Components/JoinGame";
import AccountStats from "./Components/AccountStats";
import ChangeAvatar from "./Components/Account-Settings/ChangeAvatar";
import Leaderboard from "./Components/Leaderboard";

LogBox.ignoreLogs(["Setting a timer for a long period of time"]);
LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
LogBox.ignoreLogs(['Each child in a list should have a unique']);

const Stack = createStackNavigator();

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: {},
      userRequest: {},
      ready: false,
      LoggedIn: false,
    };

    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ LoggedIn: !!user });
      this.setState({ ready: false });
      this.getData();
    });
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    var user = firebase.auth().currentUser;
    if (user != null) {
      firebase
        .database()
        .ref("/users/" + user.uid)
        .on("value", (snapshot) => {
          if (snapshot.val() != null) {
            const data = snapshot.val().data;
            const request = snapshot.val().request;
            this.setState({
              userData: data,
              userRequest: request,
              LoggedIn: true,
              ready: true,
            });
            if (request.friend_confirmed.length > 1) {
              var updates = {};
              var newFriends = data.friends.concat(
                request.friend_confirmed.slice(1)
              );
              updates["/users/" + user.uid + "/request/friend_confirmed"] = [
                "",
              ];
              updates["/users/" + user.uid + "/data/friends"] = newFriends;
              firebase.database().ref().update(updates);
            }
          }
        });
    } else {
      this.setState({ userData: { chips: 999 }, ready: true });
    }
  }

  render() {
    if (this.state.ready) {
      return (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="LandingPage">
              {(props) => (
                <LandingPage
                  {...props}
                  userData={this.state.userData}
                  LoggedIn={this.state.LoggedIn}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />

            <Stack.Screen name="FriendsList">
              {(props) => (
                <FriendsList
                  {...props}
                  userData={this.state.userData}
                  userRequest={this.state.userRequest}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="GameController">
              {(props) => (
                <GameController {...props} userData={this.state.userData} />
              )}
            </Stack.Screen>

            <Stack.Screen name="CreateGame">
              {(props) => (
                <CreateGame {...props} userData={this.state.userData} />
              )}
            </Stack.Screen>

            <Stack.Screen name="JoinGame">
              {(props) => (
                <JoinGame {...props} userData={this.state.userData} />
              )}
            </Stack.Screen>

            <Stack.Screen name="AccountStats">
              {(props) => (
                <AccountStats {...props} userData={this.state.userData} />
              )}
            </Stack.Screen>

            <Stack.Screen name="Leaderboard" component={Leaderboard} />
            <Stack.Screen name="AccountSettings" component={AccountSettings} />
            <Stack.Screen name="ChangeUsername" component={ChangeUsername} />
            <Stack.Screen name="ChangeEmail" component={ChangeEmail} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="DeleteAccount" component={DeleteAccount} />
            <Stack.Screen name="ChangeAvatar" component={ChangeAvatar} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    } else {
      return (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#FB6342" />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
