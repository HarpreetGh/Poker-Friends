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

export default class SettingsButton extends Component {

  render() {
    return (
      <View style={styles.cornerView}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.textStyle}>SETTINGS</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cornerView: {
    justifyContent: "flex-start",
    alignSelf: 'flex-start',
    right: 80,
    top: 10
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

