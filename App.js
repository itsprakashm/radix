/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 use this.props.counterIncrement for calling an action
 use this.props.count for store action
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,ScrollView,AsyncStorage,Dimensions,Image,AppState,PermissionsAndroid} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider as PaperProvider ,StatusBar,ActivityIndicator,Colors,Badge, Button,Appbar ,BottomNavigation,Avatar,Card,Title} from 'react-native-paper';
import { openDatabase } from 'react-native-sqlite-storage';
import * as firebase from "firebase";
import Login from './Login';
import Caller from './Caller';
import Home from './Home';
import Feedback from './Feedback';
import Details from './Details';
import Profile from './Profile';
import AutoStart from 'react-native-autostart';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from './actions/';
import SplashScreen from 'react-native-splash-screen';
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
            title: 'Feedback',
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            navigationOptions:  {
              title: 'Feedback',
              headerLeft: null
          }
          },
           Details: { 
                screen: Details,
                title: 'Details',
                headerStyle: {
                  backgroundColor: '#f4511e',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              },
           Profile: { 
                screen: Profile,
                title: 'Profile',
                headerStyle: {
                  backgroundColor: '#f4511e',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },  
              }
},
{
    initialRouteName: "Home"
} 
);  


const AppContainer = createAppContainer(AppNavigator);
 
class App extends Component<Props> {
  constructor(props) {
    super(props);
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
        "CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, full_name VARCHAR(255), web_user_id INTEGER, sim_card INTEGER)",
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
        "CREATE TABLE IF NOT EXISTS table_call_logs(call_logs_id INTEGER PRIMARY KEY AUTOINCREMENT, contact_id INTEGER,id INTEGER, call_log_date VARCHAR(20),mobile_no VARCHAR(20),call_duration VARCHAR(20),remarks VARCHAR(500), call_back_time VARCHAR(20),file_name VARCHAR(100),call_type INTEGER,datetime TEXT)",
        []
      );
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS table_background_call_logs(call_logs_id INTEGER PRIMARY KEY AUTOINCREMENT,  call_log_date VARCHAR(20),mobile_no VARCHAR(20),call_duration VARCHAR(20),call_type INTEGER)",
        []
      );
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS tbl_notification(notification_id INTEGER PRIMARY KEY AUTOINCREMENT,  notification_title VARCHAR(100),mobile_no VARCHAR(20),notification_description VARCHAR(200),server_id INTEGER,is_clicked INTEGER)",
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
          let dataState = { user_id: results.rows.item(0).web_user_id, loading:true,full_name:results.rows.item(0).full_name };
          that.props.updateuser(dataState);
        }
        else{
          /*that.setState({
            islogin:false
          });*/
          let dataState = { user_id: '', loading:false };
          that.props.updateuser(dataState);
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
  
  SplashScreen.hide();
  /*if(AutoStart.isCustomAndroid()) {
    
    console.log(AutoStart.startAutostartSettings());
  }*/
  PermissionsAndroid.requestMultiple(
          [PermissionsAndroid.PERMISSIONS.READ_CALL_LOG, 
          PermissionsAndroid.PERMISSIONS.CALL_PHONE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,

        ]
          ).then((result) => {
            if (result['android.permission.READ_CALL_LOG']
            && result['android.permission.CALL_PHONE'] && result['android.permission.RECORD_AUDIO'] === 'granted') {
              this.setState({
                permissionsGranted: true
              });
            } else if (result['android.permission.READ_CALL_LOG']
            || result['android.permission.CALL_PHONE']  || result['android.permission.RECORD_AUDIO'] === 'never_ask_again') {
              console.log("error");
            }
          });
}
changestatus(status,full_name){
  this.setState({
    islogin:status,
    userData:{'full_name':full_name}
  });
  nm=full_name;
}
  render() {
    if(this.props.url.loading==="loading")
    {
       return(
        <PaperProvider>
        <View style={ styles.loginForm }>
          <ActivityIndicator animating={true} size={'large'} />
        </View>
        </PaperProvider>
      )
    }
    else if(this.props.url.loading){
      return (
        <PaperProvider>
        <AppContainer />
      </PaperProvider>
      )
    }
    else{

      return(
    <PaperProvider>
        <Login/>
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
function mapStatetoProps(state)
{
  return{
    url:state.dataReducer
  }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}
export default connect(mapStatetoProps,mapDispatchToProps)(App);