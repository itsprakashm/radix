/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,ScrollView,AsyncStorage,Dimensions,Image,AppState} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider as PaperProvider ,StatusBar,ActivityIndicator,Colors,Badge, Button,Appbar ,BottomNavigation,Avatar,Card,Title} from 'react-native-paper';
import { openDatabase } from 'react-native-sqlite-storage';
import * as firebase from "firebase";
import Login from './Login';
import Caller from './Caller';
import Home from './Home';
import Feedback from './Feedback';
import AutoStart from 'react-native-autostart';
import { Provider } from 'react-redux';
import store from './app/store'; //Import the store
type Props = {};
var db = openDatabase({ name: 'UserDatabase.db' });
let nm="";
const firebaseConfig = {
  apiKey: "AIzaSyCOiX5e1Lzzfeig_HLz6y5UnIFIx7EyoUY",
  authDomain: "sapient-origin-94916.firebaseapp.com",
  databaseURL: "",
  projectId: "sapient-origin-94916",
  storageBucket: "quizsolver",
  messagingSenderId: "116348190984"

    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
  }
  //console.log(firebase);
const AppNavigator = createStackNavigator( 
  {
    Home: { 
              screen: Home,
              navigationOptions: {
                header: null,
              }
           },
           Feedback: { 
                screen: Feedback, 
                navigationOptions: {
                  header: null,
                }  
              }
},
{
    initialRouteName: "Home"
} 
);  


const AppContainer = createAppContainer(AppNavigator);
 
export default class App extends Component<Props> {
  constructor() {
    super();
    this.state={
      active: 'first',
      islogin:"loading",
      userData:{
        full_name:''
      }
    }
    
    let that=this;
    /*db work*/
    db.transaction(function(txn) {
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, full_name VARCHAR(255), web_user_id INTEGER)",
        []
      );
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS table_location(location_id INTEGER PRIMARY KEY AUTOINCREMENT, lat VARCHAR(255),lng VARCHAR(255))",
        []
      );
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS table_contacts(contact_id INTEGER PRIMARY KEY AUTOINCREMENT,id INTEGER, name VARCHAR(100),phone VARCHAR(20))",
        []
      );
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS table_call_logs(call_logs_id INTEGER PRIMARY KEY AUTOINCREMENT, contact_id INTEGER,id INTEGER, call_log_date VARCHAR(20),mobile_no VARCHAR(20),call_duration VARCHAR(20),remarks VARCHAR(500), call_back_time VARCHAR(20),file_name VARCHAR(100),call_type INTEGER)",
        []
      );
      txn.executeSql('SELECT * FROM table_user', [], (tx, results) => {
        if(results.rows.length>0)
        {
          var temp = [];
          
          that.setState({
            islogin:true
          });
          nm=results.rows.item(0).full_name;
        }
        else{
          that.setState({
            islogin:false
          });
        }
    },(err)=>{
      //console.log(err);
    });
    },function(err){
                //console.log(err)
              },function(sus){
                //console.log(sus)
              });
    /* end of db work*/

    this.changestatus=this.changestatus.bind(this);
}
componentDidMount(){
  
  /*if(AutoStart.isCustomAndroid()) {
    
    console.log(AutoStart.startAutostartSettings());
  }*/
}
changestatus(status,full_name){
  this.setState({
    islogin:status,
    userData:{'full_name':full_name}
  });
  nm=full_name;
}
  render() {
    if(this.state.islogin==="loading")
    {
       return(
        <PaperProvider>
        <View style={ styles.loginForm }>
          <ActivityIndicator animating={true} size={'large'} />
        </View>
        </PaperProvider>
      )
    }
    else if(this.state.islogin){
      return (
        <PaperProvider>
        <AppContainer />
      </PaperProvider>
      )
    }
    else{

      return(
    <PaperProvider>
        <Login islogin={this.state.islogin} func={this.changestatus}/>
        </PaperProvider>
        )
      }

  }
    
}


var styles = StyleSheet.create({
  
  loginForm: {
    flex: 1,
      flexDirection: 'column',
      justifyContent: 'center'
  }
});