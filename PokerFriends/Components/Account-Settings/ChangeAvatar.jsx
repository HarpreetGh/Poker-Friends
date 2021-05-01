import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, SnapshotViewIOS } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase'
import { useNavigation } from '@react-navigation/native'

export default function ChangeAvatar() {
  const [image, setImage] = useState(null);
  const navigation = useNavigation()
  const UpdatePhoto = async () =>{
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function() {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', image, true);
      xhr.send(null);
    });


    let user = firebase.auth().currentUser;
    let storageRef = firebase.storage().ref()
    let fileRef = storageRef.child(user.uid)

    await fileRef.put(blob).then(() => {
      console.log('uploaded image')
    })
    .catch((error) => {
      console.log(error)
    })

    fileRef.getDownloadURL()
      .then((photoUrl) => {
        console.log(photoUrl)
        user.updateProfile({
          photoURL: "" + photoUrl
        })
        navigation.navigate('LandingPage')
      }).catch((error) => {
          console.log(error)
      })
  }

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    //console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2ecc71' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginTop: 20, borderRadius: 100 }} />}
    <View style = {{marginTop: 10}}>
      <Button title = 'Confirm Avatar' onPress = {UpdatePhoto}/>
    </View>

    </View>


  );
}