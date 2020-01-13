/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { Text, View,PermissionsAndroid,Alert,StyleSheet, ListView,FlatList,TouchableWithoutFeedback,Button,TouchableOpacity,Image} from 'react-native';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import CallDetectorManager from 'react-native-call-detection';
import {Appbar,ActivityIndicator} from 'react-native-paper';
import CallLogs from 'react-native-call-log';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import { openDatabase } from 'react-native-sqlite-storage';
const audioPath = AudioUtils.MusicDirectoryPath;
import { withNavigation } from 'react-navigation';
var db = openDatabase({ name: 'UserDatabase.db' });
import NetInfo from "@react-native-community/netinfo";
type Props = {};
let filename='';
let name='';
class Caller extends Component<Props> {
  
  constructor() {
    super()
    this.getContacts=this.getContacts.bind(this);
    this.getRecord=this.getRecord.bind(this);
    this.createlist=this.createlist.bind(this);
    this.contactclick=this.contactclick.bind(this);
    this.call = this.call.bind(this);
    /*this.call = this.call.bind(this);
    this.getContacts=this.getContacts.bind(this);
    this.createlist=this.createlist.bind(this);
    this.contactclick=this.contactclick.bind(this);*/
    //this.setModalVisible = this.setModalVisible.bind(this);
    this.state = {
        text: '',
        permissionsGranted:false,
        call_duration:'',
        isLoading:true,
        id:'0',
        contact_id:'0',
        user_id:''
    }
    let that=this;
    db.transaction(function(txn) {
      
      txn.executeSql('SELECT * FROM table_user', [], (tx, results) => {
        if(results.rows.length>0)
        {
          var temp = [];
          that.setState({
            user_id:results.rows.item(0).web_user_id
          });
        }
    },(err)=>{
      console.log(err);
    });
    },function(err){
                console.log(err)
              },function(sus){
                console.log(sus)
              });
    }
    getContacts(){
      this.setState({
        isLoading:true
      });
      let that=this;
      db.transaction(function(txn) {
        txn.executeSql('SELECT id FROM table_contacts order by id desc limit 1', [], (tx, results) => {
          if(results.rows.length>0)
          {
            that.getRecord(results.rows.item(0).id);
          }
          else
          {
            that.getRecord("0");
          }
      },(err)=>{
      });
      },function(err){
                },function(sus){
                });
      
    }
    getRecord(lastid){
      //console.log("lastid="+lastid);
      let user_id=this.state.user_id;
      let that=this;
      let flag=true;
      NetInfo.fetch().then(state => {
        if(state.isConnected)
        {
        
        return fetch('http://quizsolver.com/radix/dth/index.php/DialerController/getrecord/'+lastid+"/"+user_id)
          .then((response) => response.json())
          .then((responseJson) => {
            db.transaction(function(tx) {
              responseJson.records.map((row)=>{
                flag=false;
                
                  tx.executeSql(
                    'INSERT INTO table_contacts (name,phone,id) VALUES (?,?,?)',
                    [row.name,row.phone,row.id],
                    (tx, results) => {
                    },
                    (err)=>{
                    }
                  );
              });
            },function(err){
              flag=true;
            },function(sus){
              flag=true;
              //that.createlist();
            });
              if(flag)
              {
                
                that.createlist();
              }
            
            //let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            
          })
          .catch((error) => {
            console.error(error);
          });
        }
      });
    }
    createlist(){
      let that=this;
      var temp = [];
      db.transaction(function(txn) {
        txn.executeSql('SELECT * FROM table_contacts', [], (tx, results) => {
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
                  
                },function(sus){
                  
                });
      
    }
  componentDidMount(){
      this.getContacts();   
  }
  contactclick(number,id,contact_id,name){
    /*this.setState({text:number,id:id,contact_id:contact_id},function(){
      this.call();
    });*/
    this.props.navigation.navigate('Details', {
                  mobile_no:number,
                  name:name
                });

  }
  call(){
    RNImmediatePhoneCall.immediatePhoneCall(this.state.text);
    this.setState({text:''});
  }
  callDetector = new CallDetectorManager((event)=> {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds();
    let that=this;
    
    console.log(filename);
    if(event==="Offhook")
          {
            //InCallManager.start({media: 'audio'});
            //InCallManager.start({media: 'audio'});
            //DeviceEventEmitter.addListener('Proximity', function (data) {
              
              name=date+''+month+''+year+''+hours+''+min+''+sec;
              filename=audioPath+"/"+name+".aac";
              AudioRecorder.prepareRecordingAtPath(filename, {
                SampleRate: 22050,
                Channels: 1,
                AudioQuality: "low",
                AudioEncoding: "aac"
              });   
              console.log(filename); 
              AudioRecorder.startRecording();
            
            //});           
          }
    
    if(event==="Disconnected")
    {
      AudioRecorder.stopRecording();
      setTimeout(() => {
        setTimeout(() => {
          CallLogs.load(1).then((c) => {
            console.log(c);
            if(c['0']['type']==="OUTGOING")
            {
                this.setState({text: '',call_duration:c['0']['duration']});
                this.props.navigation.navigate('Feedback', {
                  time: c['0']['duration'],
                  mobile_no:c['0']['phoneNumber'],
                  audio_file_name:filename,
                  file_name:name,
                  id:that.state.id,
                  contact_id:that.state.contact_id
                });
            }
          }
          );
        }, 30)
      }, 30)
      //CallLogs.load(1).then(c => console.log(c));
      
    }
  });
  changeText(newText) {
    if(newText==="back")
    this.setState({
      text: this.state.text.slice(0, -1)
    });
    else
    this.setState({
      text: this.state.text.concat(newText)
    });
  }
  trimStr(str) {
    if(!str) return str;
    return str.replace(/^\s+|\s+$/g, '');
  }
  rendomcolor(num){
    const ary=["#cf93f9","#7fc6c0","#f48fd1","#a3d7a6","#f38fb1"];
    let pos=num%5;
    let colors=ary[pos];
    const bgcolor = {
      backgroundColor:colors
    };
    return bgcolor;
  }
  startscroll(event) {
 console.log(event.nativeEvent.contentOffset.y);
}
  render() {
    
    if (this.state.isLoading) {
      //alert(this.state.dataSource)
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator animating={true} size={'large'} />
        </View>
      );
    }
    else
    return (

      <View>
          <FlatList
          onScroll={this.startscroll}
          data={this.state.dataSource}
          showsVerticalScrollIndicator={true}
          renderItem={({item}) =>
          <TouchableWithoutFeedback onPress={ () => this.contactclick(item.phone,item.id,item.contact_id,this.trimStr(item.name))}>
          <View style={styles.container_new}>
          <View style={[styles.circleText,this.rendomcolor(item.contact_id)]}>
          <Text style={styles.namelogo}>{this.trimStr(item.name).substring(0, 1)}</Text>
          </View>
          <View style={styles.container_text}>
            <Text style={styles.name}>{this.trimStr(item.name)}</Text>
            <Text style={styles.email}>{item.phone}</Text>
          </View>
          </View>
          </TouchableWithoutFeedback>
          }
          keyExtractor={item => "key"+item.id}
        />
        <TouchableOpacity
            style={{
                borderWidth:1,
                borderColor:'rgba(0,0,0,0.2)',
                alignItems:'center',
                justifyContent:'center',
                width:50,
                position: 'absolute',                                          
                bottom: 20,                                                    
                right: 10,
                height:50,
                backgroundColor:'#fff',
                borderRadius:100,
              }}
              onPress={this.getContacts}
          >
        <Image
          source={require('./images/sync.png')}
        />
  </TouchableOpacity>
        </View>
    );
  }
}
const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    container_new: {
      flex: 1,
      flexDirection: 'row',
      marginLeft:0,
      marginRight:0,
      marginTop: 0,
      marginBottom: 0,
      paddingLeft:13,
      paddingTop:7,
      paddingBottom:2,
      backgroundColor: '#FFF',
      
  },
  circleText:{
    height:40,
    width:40,
    borderRadius:20,
    flexDirection: 'column',
    justifyContent:'center',
    alignItems:'center'
  },
  namelogo:{
    fontSize:24,
    color:'#ffffff',
    textTransform: 'capitalize'
  },

    container_text: {
      flex: 1,
      flexDirection: 'column',
      marginLeft: 12,
      justifyContent: 'center',
      borderBottomWidth:1,
       borderColor: '#f7f7f7',
       paddingBottom:5
  },
    flatview: {
      width: '100%',
      justifyContent: 'center',
      borderRadius: 2,
    },
    name: {
      fontSize: 16,
        color: '#3d3d3d',
        textTransform: 'capitalize'
    },
    email: {
      color: '#999999',
        fontSize:14
    },   
       
      textStyle:{
        color: '#fff',
        fontSize:22
      }
  });
  export default withNavigation(Caller);
