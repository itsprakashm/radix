import React, {Component} from 'react';
import { Text, View,StyleSheet,Button,AppState,Alert,ScrollView} from 'react-native';  
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
import FacebookTabBar from './FacebookTabBar';
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
            /*<ScrollableTabView
            tabBarUnderlineColor="#fff"
            tabBarUnderlineStyle={{backgroundColor: "#fff"}}
            tabBarBackgroundColor ="#0366d6"
            tabBarActiveTextColor="#fff"
            tabBarInactiveTextColor="#88b0ac"
            onChangeTab={this.change}
            renderTabBar={() => <FacebookTabBar />}
            >
            
            <Dialer tabLabel="Dial" />
            <Caller tabLabel="list" status={this.state.isLoading}/>
            <Getcontacts tabLabel="Contacts" status={this.state.isLoading}/>
            <Call_logs tabLabel="Logs"  records={this.state.dataSource} status={this.state.isLoading}/>
            </ScrollableTabView>*/

            <ScrollableTabView
            tabBarUnderlineColor="#fff"
            tabBarUnderlineStyle={{backgroundColor: "#fff"}}
            tabBarBackgroundColor ="#0366d6"
            tabBarActiveTextColor="#fff"
            tabBarInactiveTextColor="#88b0ac"
            onChangeTab={this.change}
            renderTabBar={() => <FacebookTabBar />}
            >
            
            <Dialer tabLabel="ios-paper"  />
            <Caller tabLabel="ios-people" status={this.state.isLoading}/>
            <Getcontacts tabLabel="ios-chatboxes" status={this.state.isLoading}/>
            <Call_logs  tabLabel="ios-list" records={this.state.dataSource} status={this.state.isLoading}/>
            </ScrollableTabView>
        )
    }
}
const styles = StyleSheet.create({
  tabView: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  card: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 5,
    height: 150,
    padding: 15,
    shadowColor: '#ccc',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.5,
    shadowRadius: 3,
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
export default connect(mapStatetoProps,mapDispatchToProps)(Home);
