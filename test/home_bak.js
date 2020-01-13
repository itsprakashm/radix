import React, {Component} from 'react';
import { Text, View,PermissionsAndroid,StyleSheet,Button,AppState,Alert,ScrollView} from 'react-native';  
import Caller from './Caller'
import Dialer from './Dialer'
import Call_logs from './Call_Logs'
import Getcontacts from './Getcontact'
import CustomTabBar from './CustomTabBar'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { openDatabase } from 'react-native-sqlite-storage'
var db = openDatabase({ name: 'UserDatabase.db' });
import PushNotification from 'react-native-push-notification';
import PushController from './PushController.js';
import RNSimData from 'react-native-sim-data';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from './actions/';
class Home extends Component {
    constructor() {
        super()
        //this.setModalVisible = this.setModalVisible.bind(this);
        this.state = {
            isLoading:true,
            dataSource:[]
        }
        this.change=this.change.bind(this);
        this.sendNotification = this.sendNotification.bind(this);
      }
      
    change(obj){
        if(obj.i==3)
        {
            let that=this;
            var temp = [];
            db.transaction(function(txn) {
            txn.executeSql('SELECT * FROM table_call_logs', [], (tx, results) => {
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                temp.push(results.rows.item(i));
                }
                that.setState({
                    dataSource: temp,
                    isLoading:false
                },function(){
                });
                
            },(err)=>{
            console.log(err);
            });
            },function(err){
                        console.log("ok"+err)
                    },function(sus){
                        
                    });
        }
    }
    componentDidMount(){
      
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
          /*let simdata=RNSimData.getSimInfo();
          if(("simSerialNumber1" in simdata))
          {
            Alert.alert(
                'Call Settings',
                'You are using Dual Sim, Please select a sim for calling',
                [
                  {text: 'SIM 1', onPress: this.setsim('0')},
                  {
                    text: 'SIM 2',
                    onPress: this.setsim('1')
                  },
                ],
                {cancelable: false},
              );
          }*/
          //AppState.addEventListener('change', this.handleAppStateChange);
         
         /*DeviceInfo.getFirstInstallTime().then(firstInstallTime => {
              // Android: 1517681764528
              console.log(firstInstallTime);
            });*/
        //this.checkStatus();
        //this.backgroundjob();
          //this.getContacts();
    }
    setsim(simno){
      alert(simno);
    }
    
    
    
    sendNotification() {
      PushNotification.localNotification({
        message: 'You pushed the notification button!'
      });
    };
    
 render() {
    return(
      /*<View>
        <Button title='Press here for a notification'
          onPress={this.sendNotification} />
        <PushController />
      </View>*/
            <ScrollableTabView
            tabBarUnderlineColor="#fff"
            tabBarUnderlineStyle={{backgroundColor: "#fff"}}
            tabBarBackgroundColor ="#0366d6"
            tabBarActiveTextColor="#fff"
            tabBarInactiveTextColor="#88b0ac"
            onChangeTab={this.change}
            style={{marginTop: 20 }}
            initialPage={1}
            renderTabBar={() => <CustomTabBar />}
            >
            
            <Dialer tabLabel="Dial" />
            <Caller tabLabel="list" status={this.state.isLoading}/>
            <Getcontacts tabLabel="Contacts" status={this.state.isLoading}/>
            <Call_logs tabLabel="Logs"  records={this.state.dataSource} status={this.state.isLoading}/>
            </ScrollableTabView>
        )
    }
}
function mapStatetoProps(state)
{
  return{
    url:state.dataReducer
  }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}
export default connect(mapStatetoProps,mapDispatchToProps)(Home);
