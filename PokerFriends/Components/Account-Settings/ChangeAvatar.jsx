import * as firebase from 'firebase'
import 'firebase/storage'

import React from "react";
import {
    StyleSheet,
    View,
    Button,
    Image,
    ActivityIndicator,
    Platform,
    SafeAreaView,
    Text,
} from "react-native";
import * as ImagePicker from 'react-native-image-picker';


var storage = firebase.storage();
var storageRef = storage.ref('Images/default_player_image.jpg')
var url =  storageRef.getDownloadURL();

console.log(url)
export default class ChangeAvatar extends React.Component {
    state = {
        defaultPic: url
    }
    render() {
        return (
            //<Text>Hello</Text>
             <Image source = {{uri: this.state.defaultPic}} />
        );
    }
 }