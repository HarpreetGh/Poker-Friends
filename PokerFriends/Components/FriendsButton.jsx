import React, { Component } from "react";
import { Image, 
        Alert, 
        Modal, 
        StyleSheet, 
        Text, 
        Pressable, 
        View, 
        TouchableOpacity,
        ScrollView,
        Linking} from "react-native";

export default class FriendsButton extends Component {

  render() {
    return (
      <View style={styles.cornerView}>
        <TouchableOpacity style={styles.button} 
          onPress = {() => this.props.navigation.navigate('FriendsList')}>
          <Text style={styles.textStyle}>FRIENDS</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cornerView: {
    justifyContent: "flex-end",
    alignSelf: 'flex-end',
    left: 80,
    bottom: 10
  },
  button: {
    borderRadius: 50,
    padding: 10,
    elevation: 2,
    backgroundColor: "#27ae60"
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});

