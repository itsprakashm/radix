import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from './actions/';
import Icon from 'react-native-vector-icons/Ionicons';
class Forms extends Component{
  render(){
    return(
        <View style={{
            padding: 10,
            flexDirection: "row",
            marginLeft: 10,
            marginRight: 5,
            marginBottom: 3,
            justifyContent: "flex-start",
            width: '95%',
        }} >
            <View style={{
                position: 'absolute',
                marginTop: 10
            }}>
              <Icon name={this.props.iconname} style={styles.iconCounter}/>
            </View>
            <View style={{ marginLeft: '10%' }}>
                {
                  (this.props.value == "Sign Out") ?
                
                <TouchableOpacity onPress={this.props.logout}>
                  <Text style={styles.values}>{this.props.value}</Text>
                </TouchableOpacity>
                :
                <View>
                <Text style={styles.title}>{this.props.label}</Text>
                <Text style={styles.values}>{this.props.value}</Text>
                </View>
                }
            </View>
        </View>
      )
      
  }
}

class Profile extends Component {
  constructor(props) {
    super(props);
    this.logout=this.logout.bind(this);
  }
  static navigationOptions = {
    title: "Profile",
    headerTintColor: '#fff',
    headerStyle: {
        backgroundColor: '#3f8be4',

      },
  };
  logout(){

    let dataState = { user_id: '0', loading:false };
    this.props.updateuser(dataState);
  }

  render() {
    console.log(this.props);
    return (
          <ScrollView>
            <Image style={styles.avatar} source={require('./images/profile_img.jpg')}/>
            <View style={styles.body}>
              <View style={styles.bodyContent}>
                <Text style={styles.name}>{this.props.url.full_name}</Text>
                <Text style={styles.info}>Calller ID-2135469</Text>
              </View>
              <Forms
              label="Username"
              value="Saroj@gmail.com"
              iconname="md-mail"
              />
              <Forms
              label="Name"
              value={this.props.url.full_name}
              iconname="ios-person"
              />
              <Forms
              label="Password"
              value="********"
              iconname="md-lock"
              />
              <Forms
              label="Phone number"
              value="8603195753"
              iconname=""
              />
              <Forms
              label="Organization"
              value="Saroj@gmail.com"
              iconname="ios-business"
              />
              <Forms
              label=""
              value="Sign Out"
              iconname="ios-log-out"
              logout={this.logout}
              />

              
            </View>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "#3f8be4",
    marginBottom:0,
    alignSelf:'center',
    position: 'absolute',
    marginTop:18
  },
  title:{
    fontSize:14
  },
  values:{
    fontSize:18
  },
  iconCounter:{
    fontSize:24,
    marginTop:10
  },
  name:{
    fontSize:22,
    color:"#000000",
    fontWeight:'600',
  },
  body:{
    marginTop:130,
  },
  
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding:30,
    marginBottom:20
  },
  info:{
    fontSize:16,
    marginTop:10
  },
 
});
function mapStatetoProps(state)
{
  return{
    url:state.dataReducer
  }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}
export default connect(mapStatetoProps,mapDispatchToProps)(Profile);