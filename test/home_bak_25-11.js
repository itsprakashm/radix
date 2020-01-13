import React, {Component} from 'react';
import { Text, View,StyleSheet,StatusBar,DeviceEventEmitter} from 'react-native';  
import Caller from './Caller'
import Dialer from './Dialer'
import Call_logs from './Call_Logs'
import Getcontacts from './Getcontact'
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
import Icon from 'react-native-vector-icons/Ionicons';
import { Paragraph, Menu, Divider } from 'react-native-paper';
import { withNavigation } from 'react-navigation';
import PushNotificationAndroid from 'react-native-push-notification';
class Home extends Component {
 constructor() {
        super()
        //this.setModalVisible = this.setModalVisible.bind(this);
        this.state = {
            isLoading:true,
            dataSource:[],
            visible: false,
            visible_header:true
        }
        this.change=this.change.bind(this);
        this._openMenu=this._openMenu.bind(this);
        this.sendNotification = this.sendNotification.bind(this);
        this.goToProfile = this.goToProfile.bind(this);
        this.hideheader = this.hideheader.bind(this);
      }
      hideheader(){
        
      }
      _openMenu(){
        //alert("call");
        this.setState({ visible: true });
      }
       //_openMenu = () => this.setState({ visible: true });
      

      _closeMenu = () => this.setState({ visible: false });
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
    componentWillMount(){
      DeviceEventEmitter.addListener('notificationActionReceived', function(action){
        console.log ('Notification action received: ' + action);
        alert(action);
        // const info = JSON.parse(action.dataJSON);
        // if (info.action == 'Accept') {
        //   // Do work pertaining to Accept action here
        // } else if (info.action == 'Reject') {
        //   // Do work pertaining to Reject action here
        // }
        // // Add all the required actions handlers
      });
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
      PushNotification.localNotificationSchedule({
        title: "My Notification",
        ticker: "My Notification Ticker",
        autoCancel: true,
        color: "red",
        date: new Date(Date.now() + 60 * 1000),
        message: 'You pushed the notification!'
      });
    };
    goToProfile(){
      let that=this;
      this.setState({visible:false},function(){
        this.props.navigation.navigate('Profile');
      })
      
    }
 render() {
 return (
 <View style={styles.mainContainer}>
    <StatusBar backgroundColor="#2a89f7" barStyle="light-content" />
  <View style={styles.headerContainer}>
   <View style={styles.leftHeaderContainer}>
     <Text style={styles.logoText}>QDialer</Text>
   </View>
   <View style={styles.rightHeaderContainer}>
     <Icon name="ios-search" color='#fff' size={26} style={{padding:8}} />
     
      <View
          style={{
            padding: 0,
            flexDirection: 'row',
            justifyContent: 'center'
          }}>
          <Menu
            visible={this.state.visible}
            onDismiss={this._closeMenu}
            anchor={
              <Icon name="md-more" onPress={this._openMenu} color='#fff' size={24} style={{padding:8}}/>
            }
          >
            <Menu.Item onPress={this.goToProfile} title="Profile" />
            <Menu.Item onPress={this.sendNotification} title="Item 2" />
            <Divider />
            <Menu.Item onPress={() => {}} title="Item 3" />
          </Menu>
        </View>
   </View>
  </View>
  <View style={styles.contentContainer}>
    <ScrollableTabView
      tabBarUnderlineColor="#fff"
      tabBarUnderlineStyle={{backgroundColor: "#fff"}}
      tabBarBackgroundColor ="#3f8be4"
      tabBarActiveTextColor="#fff"
      tabBarInactiveTextColor="#DCDCDC"
      >
      <Dialer tabLabel="Dialer"  />
      <Caller tabLabel="List" status={this.state.isLoading}/>
      <Getcontacts tabLabel="Contacts" status={this.state.isLoading}/>
      <Call_logs  tabLabel="Logs" records={this.state.dataSource} status={this.state.isLoading}/>
      </ScrollableTabView>
  </View>
 </View>
 );
 }
}
const styles = StyleSheet.create({
 mainContainer: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    height: 15
 },
 headerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#3f8be4",
    alignItems:"center",
    paddingRight: 5
 },
 leftHeaderContainer: {
    alignItems: "flex-start",
    flexDirection: "row"
 },
 rightHeaderContainer: {
    alignItems: "flex-end",
    flexDirection: "row"
 },
 contentContainer: {
    flex: 10,
 },
 logoText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 24,
    alignItems: "flex-start",
    marginLeft: 10
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