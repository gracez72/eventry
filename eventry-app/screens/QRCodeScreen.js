import React, {Component} from 'react';
import { ImageBackground, Tile, TouchableOpacity, Title, Subtitle, Divider, Row, Overlay, Caption, Heading, Button, Icon} from '@shoutem/ui'
import {Header, Left, Right, Container, Body} from 'native-base'
import {View as SView, Text as SText, Image as SImage} from '@shoutem/ui'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  TouchableHighlight,
  View,
  ListView,
  RefreshControl,
  ActivityIndicator,
  FlatList
} from 'react-native';
import QRCode from 'react-native-qrcode';

const width = Dimensions.get('window').width;

export default class QRCodeScreen extends React.Component {
    constructor(props){
      super(props);
      this.state ={ isLoading: true};
    }

    static navigationOptions = {
      header: null,
    };


  _onRefresh() {
    this.setState({refreshing: true});
    fetch('http://eventry-dev.us-west-2.elasticbeanstalk.com/events', {method: 'GET'})
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          EventJson: responseJson,
        }, function(){
          console.log('REFRESHIN');
        });

      }).then(() => {
        this.setState({refreshing: false});
      });
    }

  componentDidMount(){
    return fetch('http://eventry-dev.us-west-2.elasticbeanstalk.com/events', {method: 'GET'})
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          EventJson: responseJson,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }
    return (
      <View style={styles.container}>
          <Header style={{backgroundColor: 'white'}}>
          <Left>
            <Icon name="sidebar" onPress={()=>this.props.navigation.openDrawer()}/>
          </Left>
          <Body>
          <Title>EVENTRY</Title>
          <Subtitle>My Events</Subtitle>
          </Body>
          <Right></Right>
          </Header>
          <SView style={{flexDirection: 'row', flex: 1, justifyContent: 'center',}}>
              <QRCode
                value={this.props.navigation.state.params.value.event_name}
                size={width*0.8}
                bgColor='grey'
                fgColor='white'
              />
          </SView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
      },
});
