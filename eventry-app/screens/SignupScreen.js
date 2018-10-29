import React from "react";
import {ScrollView, TextInput, Image, ImageBackground, Dimensions, TouchableHighlight, Text, View, AsyncStorage, ActivityIndicator, StatusBar} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { onSignIn, storeUserID } from "../auth/fakeAuth";
import Styles from "../styles/Styles"

import {Permissions, Notifications} from "expo";

let {width,height} = Dimensions.get("window");

export default class SignupScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      successfulAuth: false,
      screenLoading: false,
      username:"",
      firstName:"",
      lastName:"",
      email: "",
      password:"",
      password2: "",
    };
  }

  render() {
    if (this.state.screenLoading) {
      return ( <View >  <StatusBar barStyle = "default" />  </View> );
    }

    return (
      <ImageBackground source = {require("../img/login2.jpg")} style = {{ width: "100%", height: "100%"}} >
      <ScrollView style = {{ flex: 1 }} >
        <View style = {{flexDirection: "row", justifyContent: "center", height: 60, alignItems: "center", marginTop: height / 7 }} >
          <Image source = {require("../img/e.jpg")} style={{width: 70, height: 70}}/>
          <Text style = {{ color: "#ffffff", fontSize: 50}} >  Eventry  </Text>
        </View >

        <View style = {{flexDirection: "column", alignItems: "center", marginTop: height/20}} >
          <TextInput
            style={Styles.textInput}
            placeholderTextColor="#fff"
            onChangeText={(username) => this.setState({username})}
            placeholder="Username"
            value={this.state.username}
          />
          <TextInput
            style={Styles.textInput}
            onChangeText={(firstName) => this.setState({firstName})}
            value={this.state.firstName}
            placeholder="First Name"
            placeholderTextColor="#fff"
          />
          <TextInput
            style={Styles.textInput}
            onChangeText={(lastName) => this.setState({lastName})}
            value={this.state.lastName}
            placeholder="Last Name"
            placeholderTextColor="#fff"
          />
          <TextInput
            style={Styles.textInput}
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
            placeholder="Email"
            placeholderTextColor="#fff"
          />
          <TextInput
            style={Styles.textInput}
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
            placeholderTextColor="#fff"
            placeholder="Password"
            secureTextEntry={true}
          />
          <TextInput
            style={Styles.textInput}
            onChangeText={(password2) => this.setState({password2})}
            value={this.state.password2}
            placeholder="Re-enter Password"
            secureTextEntry={true}
            placeholderTextColor="#fff"
          />
          <TouchableHighlight
            style = {{
              backgroundColor: "rgba(255, 255, 255, 0.51)",
              width: width * (7 / 10),
              padding: 10,
              marginTop: 20,
              borderRadius: 15,
            }}
            underlayColor = "rgba(115, 115, 115, 0.63)"
            onPress = {
              () => {
                onSignIn().then(() => {
                  this.props.navigation.navigate("LoginScreen");
                  this.setState({screenLoading: false,});
                });
              }
            }
            >
            <Text style={{textAlign: "center", color: "#425187", fontSize: 15, fontWeight: "bold"}}>
              SIGNUP
            </Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
      </ImageBackground>
    );
  }
}
