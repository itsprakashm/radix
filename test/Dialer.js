import React, {Component} from 'react';
import { Text, View,PermissionsAndroid,StyleSheet,TouchableWithoutFeedback,Image} from 'react-native';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import CallDetectorManager from 'react-native-call-detection';
import VirtualKeyboard from 'react-native-virtual-keyboard';
import CallLogs from 'react-native-call-log';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import { openDatabase } from 'react-native-sqlite-storage';
const audioPath = AudioUtils.MusicDirectoryPath;
import { withNavigation } from 'react-navigation';
import PushNotification from 'react-native-push-notification';
var db = openDatabase({ name: 'UserDatabase.db' });
type Props = {};
let filename='';
let name='';
class Dialer extends Component<Props> {
  
  constructor() {
    super()
    this.call = this.call.bind(this);
    //this.setModalVisible = this.setModalVisible.bind(this);
    this.state = {
        text: '',
        permissionsGranted:false,
        call_duration:'',
        isLoading:true
    }
  }
  componentDidMount(){
    let that=this;
      PushNotification.configure({
      onNotification: function(notification) {
        console.log('NOTIFICATION: ', notification);
        that.setState({text:notification.userInfo.ph_no});
      },
      popInitialNotification: true,
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
                    onGoBack: this.refresh,
                    itemId: 86,
                    time: c['0']['duration'],
                    mobile_no:c['0']['phoneNumber'],
                    audio_file_name:filename,
                    file_name:name
                  });
            }
          }
          );
        }, 20)
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
  render() {
    
    return (
      
      <View style = { styles.MainContainer }>
        <View style={ styles.bottomView}>
        <Text style={{fontSize:25}}>{this.state.text}</Text>
        <VirtualKeyboard color='black' pressMode='char' onPress={(val) => this.changeText(val)} />
        <TouchableWithoutFeedback onPress={this.call}>
          <Image
            style={styles.bottombutton}
            source={require('./images/Phone.png')}
          />
        </TouchableWithoutFeedback>
        </View>
        
      </View>    );
  }
}
const styles = StyleSheet.create(
  {
    MainContainer: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#F9F9F9',
      justifyContent: 'center',
    },  
      bottomView:{
   
        width: '100%', 
        height: 380, 
        backgroundColor: '#FCFCFC', 
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'absolute',
        bottom: 0
      },
      bottombutton:{
        marginTop:10,
        height:50,
        width:50,
        backgroundColor:'green',
        borderRadius:25,
        alignItems: 'center'
      }
      
  });
  export default withNavigation(Dialer);
