import React, { Component } from 'react';


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

export default class Chat extends Component {
state = {
modalVisible: false
};

setModalVisible = (visible) => {
this.setState({ modalVisible: visible });
}

render() {
const { modalVisible } = this.state;
return (
  <View style={styles.cornerView}>
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        this.setModalVisible(!modalVisible);
      }}
    >
        <ScrollView >
      <View style = {styles.buttonTextView}>
        <View style={styles.modalView}>
          <Text style = {{fontWeight:'bold', marginTop:-35, fontSize: 30, marginBottom: 25}} >
            Chat room
          </Text>
         
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => this.setModalVisible(!modalVisible)}
          >
            <Text style={styles.textStyle}>EXIT</Text>
          </Pressable>
        </View>
      </View>
      </ScrollView>
    </Modal>
    <TouchableOpacity
      style={[styles.button, styles.buttonOpen]}
      onPress={() => this.setModalVisible(true)}
    >
      <Text style={styles.textStyle}>Chat</Text>
    </TouchableOpacity>
  </View>
);
}
}

const styles = StyleSheet.create({

cornerView: {
justifyContent: "flex-end",
alignSelf: 'flex-end',
right: 80,
bottom: 10
},
buttonTextView: {
flex: 1,
justifyContent: "center",
alignItems: "center",
marginTop: 22
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
button: {
borderRadius: 50,
padding: 10,
elevation: 2
},
buttonOpen: {
backgroundColor: "#27ae60",
},
buttonClose: {
backgroundColor: "#2196F3",
marginTop:20
},
textStyle: {
color: "white",
fontWeight: "bold",
textAlign: "center"
},
modalText: {
marginBottom: 35,
marginLeft: -50,
marginRight: -50,
textAlign: "left",
fontSize: 20
}
});


