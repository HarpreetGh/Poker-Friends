import React, { Component } from 'react';
import { View } from 'react-native';
import ConnectyCube from 'react-native-connectycube'

const CREDENTIALS = {
    appId: 4676,
    authKey: 'Kf2EYgJ2a5R7OCC',
    autSecret: 'kcqSd88ekbfGGZY'
};
const CONFIG = {
    debug: { mode: 1 }, // enable DEBUG mode (mode 0 is logs off, mode 1 -> console.log())
};

ConnectyCube.init(CREDENTIALS, CONFIG);

//May not need
// const storedSession = localStorage.getItem("ConnectyCube:session");
// const session = JSON.parse(storedSession);

// ConnectyCube.setSession(session);

export default class groupLiveChat extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <View>

            </View>
         );
    }
}


 
