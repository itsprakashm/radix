import React, {Component} from 'react';
import { View,Text,TouchableWithoutFeedback,TouchableOpacity,BackHandler,StyleSheet,TextInput} from 'react-native';
import { RadioButton,Provider as PaperProvider,Button,Appbar } from 'react-native-paper';
import DateTimePicker from "react-native-modal-datetime-picker";
import PushNotification from 'react-native-push-notification';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import * as firebase from "firebase";
import NetInfo from "@react-native-community/netinfo";
import Icon from 'react-native-vector-icons/Ionicons';
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
    console.log(firebase);
    function convert(str) {
        if(str=='')
        {
            return '';
        }
        else{
            var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2),
            hours=("0" + date.getHours()).slice(-2),
            minutes=("0" + date.getMinutes()).slice(-2),
            seconds=("0" + date.getSeconds()).slice(-2);
            var newdate= [date.getFullYear(), mnth, day].join("-");
            var time=[hours, minutes, seconds].join(":");
            return newdate+" "+time;
        }
        
      }
      class FloatingLabelInput extends Component {
        constructor() {
              super()
              this.state = {
          isFocused: false,
        };
        this.handleFocus=this.handleFocus.bind(this);
        this.handleBlur=this.handleBlur.bind(this);
        }

        handleFocus(){
        this.setState({ isFocused: true });
          if(this.props.iconname=="md-calendar" && this.props.datepickerstatus==false)
          {
            this.props.opendatepicker();
          }
        } 
        handleBlur (){
          if(this.props.value=="")
            this.setState({ isFocused: false });
          
        }

    render() {
      const { label, ...props } = this.props;
      const { isFocused } = this.state;
      const labelStyle = {
        position: 'absolute',
        /*left: 0,*/
        top: !isFocused ? 20 : 0,
        //fontSize: !isFocused ? 18 : 14,
        color: !isFocused ? '#000000' : '#000000',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft:10,
        marginRight:10
      };
      return (
        <View style={{ paddingTop: 18 }}>
          
          <View style={labelStyle}>
            <View style={styles.leftContainer}>
              <Text style={[styles.text, {textAlign: 'left'}]}>
              {label}
              </Text>
            </View>
            <View style={styles.rightContainer}>
              <Text><Icon name={this.props.iconname} style={styles.iconCounter}/></Text>
            </View>
          </View>
          <TouchableOpacity>
            <TextInput
              {...props}
              style={styles.input}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              blurOnSubmit
            />
          </TouchableOpacity>
        </View>
      );
    }
}
      
export default class Feedback extends Component {
    constructor(props){
        super(props);
        this.state = {checked:'0',
        remarks:'',
        isDateTimePickerVisible: false,
        datepicked:'',
        timeformat:false,
        user_id:'',
        value:'',
        issave:false,
        notification_id:'0'
        };
        this._onPressButton = this._onPressButton.bind(this);
        this.saveRecord = this.saveRecord.bind(this);
        this.handleBackButton=this.handleBackButton.bind(this);
        let that=this;
    
    }
    static navigationOptions = {
      title: 'Details',
      headerTintColor: '#fff',
      headerStyle: {
          backgroundColor: '#3f8be4',
  
        },
    };
    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
      };
    
      hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
      };
    
      handleDatePicked = date => {  
        const { navigation } = this.props;
        const mobile_no = navigation.getParam('mobile_no', '0');
        console.log("A date has been picked: ", date);
        var currentdate = new Date(); 
        console.log(date>currentdate);
        PushNotification.localNotificationSchedule({
          date: date, // in 30 secs
          foreground:true,
          userInteraction:true,

          /* Android Only Properties */
          ticker: "My Notification Ticker", // (optional)
          autoCancel: true, // (optional) default: true
          largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
          smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
          bigText: "Please Call on "+mobile_no+" Now", // (optional) default: "message" prop
          subText: "Call Number", // (optional) default: none
          vibrate: true, // (optional) default: true
          vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
          tag: 'some_tag', // (optional) add tag to message
          group: "group", // (optional) add group to message
          ongoing: false, // (optional) set whether this is an "ongoing" notification
          /* iOS only properties */
          alertAction: 'view', // (optional) default: view
          category: null, // (optional) default: null
          userInfo: {ph_no:mobile_no,}, // (optional) default: null (object containing additional notification data)

          /* iOS and Android properties */
          title: "Important Call", // (optional)
          message: "Call on this "+mobile_no+" Now", // (required)
          playSound: true, // (optional) default: true
          soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
        });
        this.setState({datepicked:date.toString()});
        this.hideDateTimePicker();
      };
    _onPressButton(status){
    }
    componentDidMount() {
      
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
       db.transaction(function(tx) {
            tx.executeSql(
              'select notification_id from tbl_notification order by notification_id desc limit 1',[],
              (tx, results) => {
                if (results.rows.length > 0) {
                  let last_id=results.rows.item(0).notification_id;
                  this.setState({
                    notification_id:last_id
                  });
                } else {
                }
              },
              (err)=>{
                console.log(err);
              }
            );
          },function(err){
            console.log(err)
          },function(sus){
            console.log(sus)
          });
    }
    handleBackButton(){
      if(this.state.issave){
        this.props.navigation.goBack(null);
      }else{
        alert("Please enter feedback and save");
        return true;
      }
    }
    
    saveRecord = async () =>
    {
      NetInfo.fetch().then(state => {
        if(state.isConnected)
        {
          const { navigation } = this.props;
          const duration = navigation.getParam('time', '0');
          const mobile_no = navigation.getParam('mobile_no', '0');
          const filename = navigation.getParam('file_name', 'no_file');
          const audio_file_name = navigation.getParam('audio_file_name', 'no_file');
          const contact_id=navigation.getParam('contact_id', '0');
          const id=navigation.getParam('id', '0');
          let remarks=this.state.remarks;
          let call_back_time=convert(this.state.datepicked);
          let call_type=this.state.value;
          let user_id=this.state.user_id;
          var date = new Date().getDate(); //Current Date
          var month = new Date().getMonth() + 1; //Current Month
          var year = new Date().getFullYear(); //Current Year
          var hours = new Date().getHours(); //Current Hours
          var min = new Date().getMinutes(); //Current Minutes
          var sec = new Date().getSeconds();
          let currentdate=date + '-' + month + '-' + year + ' - ' + hours + ':' + min + ':' + sec;
          let that=this;
          /*contact_id,id,call_log_date,mobile_no,call_duration,remarks,call_back_time*/
          
          var data = {
              "call_status": this.state.value,
              "duration": duration,
              "mobile_no":mobile_no,
              "remarks":this.state.remarks,
              "call_back_time":call_back_time,
              "user_id":user_id
          }
          db.transaction(function(tx) {
            tx.executeSql(
              'INSERT INTO table_call_logs (contact_id,id,call_log_date,mobile_no,call_duration,remarks,call_back_time,file_name,call_type) VALUES (?,?,?,?,?,?,?,?,?)',
              [contact_id,id,currentdate,mobile_no,duration,remarks,call_back_time,filename,call_type],
              (tx, results) => {
                let id=that.state.notification_id+1;
                that.state.setState('notification_id':id);
              },
              (err)=>{
                console.log(err);
              }
            );
          },function(err){
            console.log(err)
          },function(sus){
            console.log(sus)
          });
          //http://quizsolver.com/radix/dth/index.php/DialerController/saveMobile
          fetch("http://quizsolver.com/radix/dth/index.php/DialerController/saveMobile", {
              method: "POST",
              body:  JSON.stringify(data)
          }).then((response) => response.json())
          .then((responseJson) => {
              console.log(responseJson);
            if(responseJson.status=="1")
            {
                this.props.navigation.goBack(null);
            }
          })
              .catch((error) => {
              console.error(error);
          });
          /*const formdata = new FormData();
          formdata.append('call_status', "a");
          formdata.append('duration', "b");
          formdata.append('mobile_no', "c");
          formdata.append('remarks', "d");
          formdata.append('call_back_time',"e");
          formdata.append('user_id', "f");
          formdata.append('file', {
          uri: "file://"+audio_file_name,
          type: 'audio/aac', // or photo.type
          name: audio_file_name+".aac"
          });
          fetch("http://quizsolver.com/radix/dth/index.php/DialerController/saveMobile", {
          method: 'POST',
          headers: {
          'Content-Type': 'multipart/form-data',
          },
          body: formdata
          })
          .then(response => response.json())
          .then(response => {
            console.log("upload succes", response);
            alert("Upload success!");
            //this.setState({ photo: null });
          })
          .catch(error => {
            console.log("upload error", error);
            alert("Upload failed!");
          });
          /*



          const image = "file://"+audio_file_name;

      const Blob = RNFetchBlob.polyfill.Blob
      const fs = RNFetchBlob.fs
      window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
      window.Blob = Blob

    
      let uploadBlob = null
      const imageRef = firebase.storage().ref('quizsolver').child(filename+".aac")
      let mime = "application/octet-stream"
      fs.readFile(image, 'base64')
        .then((data) => {
          return Blob.build(data, { type: `${mime};base64` })
      })
      .then((blob) => {
          uploadBlob = blob
          return imageRef.put(blob, { contentType: mime })
        })
        .then(() => {
          uploadBlob.close()
          return imageRef.getDownloadURL()
        })
        .then((url) => {
          // URL of the image uploaded on Firebase storage
          console.log(url);
          
        })
        .catch((error) => {
          console.log(error);

        }) */
        this.setState({
          issave:true
        })
      }
      else{
        alert("Please Enable Your Internet Connection");
      }
    });

    }
    componentDidMount(){
      this.setState({
        issave:false
      })
    }
    render() {
        const { checked } = this.state;
        const { navigation } = this.props;
        const itemId = navigation.getParam('itemId', 'NO-ID');
        const duration = navigation.getParam('time', '0');
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        //const otherParam = navigation.getParam('otherParam', 'some default value');
        if(duration==0){
        return (
            
            <View style={styles.container}>
                  <TouchableOpacity style={ styles.storyCounters } onPress={() => this.setState({value: '0'})}>
                    <Icon name={this.state.value=='0'?"ios-checkmark-circle":"ios-radio-button-off"} style={styles.iconCounter}/>
                    <Text style={styles.iconCounterText}>engage</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={ styles.storyCounters } onPress={() => this.setState({value: '1'})}>
                    <Icon name={this.state.value=='1'?"ios-checkmark-circle":"ios-radio-button-off"} style={styles.iconCounter}/>
                    <Text style={styles.iconCounterText}>not pic up</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={ styles.storyCounters } onPress={() => this.setState({value: '2'})}>
                    <Icon name={this.state.value=='2'?"ios-checkmark-circle":"ios-radio-button-off"} style={styles.iconCounter}/>
                    <Text style={styles.iconCounterText}>Disconnect By User</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={ styles.storyCounters } onPress={() => this.setState({value: '3'})}>
                    <Icon name={this.state.value=='3'?"ios-checkmark-circle":"ios-radio-button-off"} style={styles.iconCounter}/>
                    <Text style={styles.iconCounterText}>Switch Off</Text>
                  </TouchableOpacity>
                  
                    <TouchableOpacity
                      style={styles.loginScreenButton}
                      onPress={this.saveRecord}
                      underlayColor='#fff'>
                      <Text style={styles.loginText}>SAVE</Text>
                    </TouchableOpacity>

                </View>
        )
    }
        else{
            return(
                <View style={styles.container}>
                  <TouchableOpacity style={ styles.storyCounters } onPress={() => this.setState({value: '4'})}>
                    <Icon name={this.state.value=='4'?"ios-checkmark-circle":"ios-radio-button-off"} style={styles.iconCounter}/>
                    <Text style={styles.iconCounterText}>Hot</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={ styles.storyCounters } onPress={() => this.setState({value: '5'})}>
                    <Icon name={this.state.value=='5'?"ios-checkmark-circle":"ios-radio-button-off"} style={styles.iconCounter}/>
                    <Text style={styles.iconCounterText}>Cold</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={ styles.storyCounters } onPress={() => this.setState({value: '6'})}>
                    <Icon name={this.state.value=='6'?"ios-checkmark-circle":"ios-radio-button-off"} style={styles.iconCounter}/>
                    <Text style={styles.iconCounterText}>Call Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={ styles.storyCounters } onPress={() => this.setState({value: '7'})}>
                    <Icon name={this.state.value=='7'?"ios-checkmark-circle":"ios-radio-button-off"} style={styles.iconCounter}/>
                    <Text style={styles.iconCounterText}>Not Interested</Text>
                  </TouchableOpacity>
                  <FloatingLabelInput
                      label="Call Back Date Time"
                      value={convert(this.state.datepicked)}
                      iconname="md-calendar"
                      onChangeText={(username) => this.setState({username})}
                      opendatepicker={this.showDateTimePicker}
                      datepickerstatus={this.state.isDateTimePickerVisible}
                    />
                    <FloatingLabelInput
                      label="Remarks"
                      value={this.state.remarks}
                      iconname="md-clipboard"
                      onChangeText={remarks => this.setState({ remarks })}
                    />
                    <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={this.handleDatePicked}
                            onCancel={this.hideDateTimePicker}
                            mode='datetime'
                            is24Hour={this.state.timeformat}
                            />
                    <TouchableOpacity
                      style={styles.loginScreenButton}
                      onPress={this.saveRecord}
                      underlayColor='#fff'>
                      <Text style={styles.loginText}>SAVE</Text>
                    </TouchableOpacity>
                  <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                    mode='datetime'
                    is24Hour={this.state.timeformat}
                    />
                </View>
            )
        }
    }
}
const styles = StyleSheet.create(
  {
    container: {
      flex:1,
      backgroundColor: '#FFFFFF',
    },
      iconstyle:{
        paddingLeft:10,
        paddingRight:10
      },
      storyCounters: {
        flexDirection: 'row',
        marginTop:7,
        marginBottom:3
      },
      iconCounter: {
        marginRight:15,
        marginLeft:10,
        marginTop:2,
        fontSize:20,
        color:'#3f8be4'
      },
      iconCounterText:{
        fontSize:18,
        textAlign:"right"
      },
      input: {
        height: 40,
        borderColor: '#EDEDED',
        borderBottomWidth:2,
        color:'#000000',
        fontSize:16,
        marginLeft:10,
        marginRight:10
     },
     searchSection: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
  },
  searchIcon: {
      padding: 10,
  },
  input_new: {
      flex: 1,
      borderColor: '#EDEDED',
      borderBottomWidth:2,
        color:'#000000',
        fontSize:16,
        marginTop:30
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  loginScreenButton:{
   
    backgroundColor:'#1b96fe',
    position: 'absolute',
    bottom:0,
    left:0,
    right:0,
    paddingTop:10,
    paddingBottom:10,
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  loginText:{
      color:'#FFFFFF',
      textAlign:'center',
      fontSize:18
  }

  });