import React from 'react';
import {Alert, TextInput, Image, ImageBackground, Dimensions, TouchableHighlight, Text, View, AsyncStorage, ActivityIndicator, StatusBar} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import LoginButton from '../components/LoginButton';
import FBLoginButton from '../components/FBLoginButton'
import { onSignIn, storeUserID } from '../auth/fakeAuth';
import { Permissions, Notifications } from 'expo';

const ANDROID_CLIENT_ID = '197432669439-5p52pkenhoc55j57h1p59sr664io7bd9.apps.googleusercontent.com';
const IOS_CLIENT_ID = '197432669439-n45mkfg71nala1pu0vv0se9vrls5vst8.apps.googleusercontent.com';


const FBSDK = require('react-native-fbsdk');
const {LoginManager} = FBSDK;

let {width,height} = Dimensions.get('window');

export default class LoginScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      successfulAuth: false,
      screenLoading: false,
      username:'',
      password:'',
      Authkey: '',
    };
    this.signIn = this.signIn.bind(this);
  }

   signIn = (json) => {
    console.log("Response from DB: ");
    var str = JSON.stringify(json);
    console.log(str);
    onSignIn(str);
  }

  signInRegular = async () => {
    this.setState({
        screenLoading: true,
    })
    console.log("loading screen...");
    let signInData = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'username' : this.state.username,
        'password' : this.state.password
      }),
    }
    try{
      fetch('http://eventry-dev.us-west-2.elasticbeanstalk.com/rest-auth/login/', signInData).then(response => response.json()).  // Promise
      then(res => {this.checkResp(res)});
    }
    catch(err){
      console.log("err: " + err);
    }
  }

  async _registerForPushNotificationsAsync() {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
    
      // only ask if permissions have not already been determined, because
      // iOS won't necessarily prompt the user a second time.
      if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
    
      // Stop here if the user did not grant permissions
      if (finalStatus !== 'granted') {
        return;
      }
    
      // Get the token that uniquely identifies this device
      let token = await Notifications.getExpoPushTokenAsync();
      console.log("The auth key here " + this.state.Authkey);
      // POST the token to your backend server from where you can retrieve it to send push notifications.
      return fetch('http://eventry-dev.us-west-2.elasticbeanstalk.com/users/update_expo_token', {
        method: 'POST',
        headers: {
          'Authorization': "Token " + this.state.Authkey,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expo_push_token: token,
        })
      }).then((response) => response.json())
      .then((responseJson) => {
        
          console.log(responseJson);

      }).then(() => {

      }).catch((error) =>{
        console.error(error);
      });
    }

  checkResp = (json) => {
    console.log("Resp:" + JSON.stringify(json) );
    if(json.hasOwnProperty('key')){
      this.setState({Authkey: json.key});
      onSignIn(json.key);
      console.log("auth successful");
      //this._registerForPushNotificationsAsync();
      this.props.navigation.navigate("SignedIn");
    }
    else{
      Alert.alert(
      "Login Failed",
      JSON.stringify(json),
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        { cancelable: false }
      );
    }

  }

  signInWithGoogleAsync = async () => {
          this.setState({
              screenLoading: true,
          })
          console.log("loading screen...");
          try {
            const result = await Expo.Google.logInAsync({
              androidClientId:ANDROID_CLIENT_ID,
              iosClientId:IOS_CLIENT_ID,
              scopes: ["profile", "email"]
            });
            if (result.type === "success") {
              const { idToken, accessToken } = result;
              console.log("id: " + idToken);
              console.log("access: " + accessToken);

              let data = {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  'access_token': accessToken
                }),
              }

              fetch('http://eventry-dev.us-west-2.elasticbeanstalk.com/rest-auth/google/', data).then(response => response.json()).  // Promise
              then(res => {this.checkResp(res)}).then(this.setState({successfulAuth: true}));

            } else {
              return { cancelled: true };
            }
          } catch (err) {
            console.log("err:", err);
          }
        }



  render() {
    if (this.state.screenLoading) {
      return (
        <View>
          <ActivityIndicator />
          <StatusBar barStyle = "default" />
        </View>
      );
    }

    return (
      <ImageBackground source = {require('../img/login2.jpg')} style = {{ width: '100%', height: '100%'}}>
      <View style = {{ flex: 1 }} >
        <View style = {{flexDirection: 'row', justifyContent: 'center', height: 60, alignItems: 'center', marginTop: height / 7 }} >
          <Image source = {require('../img/e.jpg')} style={{width: 70, height: 70}}/>
          <Text style = {{ color: '#ffffff', fontSize: 50, /* fontWeight: '100', fontFamily: 'lucida grande'*/ }} >
            Eventry
          </Text>
        </View>

        <View style = {{flexDirection: 'column', alignItems: 'center', marginTop: height/20}} >
          <TextInput
            style={{
              height: 40,
              color: 'white',
              borderColor: 'white',
              borderBottomWidth: 1,
              width: width*7/10,
              fontSize: 15,
            }}
            onChangeText={(username) => this.setState({username})}
            value={this.state.username}
            placeholder='Username'
            placeholderTextColor='#fff'
          />
          <TextInput
            style={{
              height: 40,
              marginTop: 10,
              color: 'white',
              borderColor: 'white',
              borderBottomWidth: 1,
              width: width*7/10,
              fontSize: 15,
            }}
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
            placeholder='Password'
            secureTextEntry={true}
            placeholderTextColor='#fff'
          />
          <TouchableHighlight
            style = {{
              backgroundColor: "rgba(255, 255, 255, 0.51)",
              width: width * (7 / 10),
              padding: 10,
              marginTop: 20,
              borderRadius: 15,
            }}
            onPress = {
               () => {
                this.signInRegular().then(() => {
                  if (this.state.successfulAuth === true) {
                    console.log("auth successful");
                    //this._registerForPushNotificationsAsync();
                    this.props.navigation.navigate("SignedIn");
                  } else {
                    console.log("failed auth");
                    this.setState({ screenLoading: false, });
                  }
                });
              }
            }
            underlayColor = "rgba(115, 115, 115, 0.63)" >
            <Text style={{textAlign: 'center', color: '#425187', fontSize: 15, fontWeight: 'bold'}}> LOGIN </Text>
          </TouchableHighlight >
          <TouchableHighlight
            style = {{
              backgroundColor: "rgba(255, 255, 255, 0.51)",
              width: width * (7 / 10),
              padding: 10,
              marginTop: 20,
              borderRadius: 15,
            }}
            onPress = {
              () => {
                  this.props.navigation.navigate("SignUp");
                  this.setState({
                    screenLoading: false,
                  });
              }
            }
            underlayColor = "rgba(115, 115, 115, 0.63)" >
            <Text style={{textAlign: 'center', color: '#425187', fontSize: 15, fontWeight: 'bold'}}> SIGNUP </Text>
          </TouchableHighlight>
        </View>

        <Text style={{marginTop: 40, textAlign: 'center', color: '#fff', fontSize: 11, fontWeight: 'bold'}}>
           OR CONNECT WITH
        </Text>

        <View style = {{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 15,
        }}>
          <TouchableHighlight style = {{
            backgroundColor: "#719ac6",
            width: width*0.33,
            margin: width*0.02,
            padding: 5,
            borderRadius: 17,
            }}
            onPress = {
              () => {
                this.signInWithGoogleAsync().then(() => {
                  if (this.state.successfulAuth === true) {
                    console.log("auth successful");
                    //this._registerForPushNotificationsAsync();
                    this.props.navigation.navigate("SignedIn");
                  } else {
                    console.log("failed auth");
                    this.setState({ screenLoading: false, });
                  }
                });
              }
            }
            underlayColor = "#529ae4" >
            <LoginButton icon = {"logo-google" } loginText = {'GOOGLE'}/>
          </TouchableHighlight >
        </View>
      </View >
      </ImageBackground>
    );
  }
}
