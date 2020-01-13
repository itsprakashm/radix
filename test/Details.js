import React, {Component} from 'react';
import { Avatar, Button, Card, Title, Paragraph,PaperProvider,Appbar,Divider,Text,DefaultTheme } from 'react-native-paper';
import { View,StyleSheet,ScrollView } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import CardView from 'react-native-cardview' ;
import Icon from 'react-native-vector-icons/Ionicons';
import CallLogs from 'react-native-call-log';
let name='';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import CallDetectorManager from 'react-native-call-detection';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
const audioPath = AudioUtils.MusicDirectoryPath;
let filename='';
export default class Details extends Component {
    constructor(props){
        super(props);
        this.state={
          mobile_no:null,
          name:'',
           dataSource:[]
        }
        this.call=this.call.bind(this);
    /*db work*/
    }
     static navigationOptions = ({ navigation }) => {
        const name = navigation.getParam('name', false);
        const {params = {}} = navigation.state;
        if(name){
          return {
            headerTitle: name,
            headerTintColor: '#fff',
            headerRight: (
                <Button
                title = "Test"
                onPress={ () => params.call() }>
                <Text><Icon name={"md-call"} style={styles.headerIcon}/></Text>
                </Button>

              ),
            headerStyle: {
              backgroundColor: '#3f8be4',
            },
          };
        }else{
          return {
            headerTitle: navigation.getParam('mobile_no', false),
            headerTintColor: '#fff',
            headerRight: (
                <Button
                title = "Test"
                onPress={ () => params.call() }>
                <Text><Icon name={"md-call"} style={styles.headerIcon}/></Text>
                </Button>
              ),
            headerStyle: {
              backgroundColor: '#3f8be4',

            },
          };
        }
     };
    /*static navigationOptions = {
    title: name,
    headerTintColor: '#fff',
    headerStyle: {
        backgroundColor: '#3f8be4',

      },
  };*/
    componentWillMount(){
      const { navigation } = this.props;
      const mobile_no = navigation.getParam('mobile_no', '0');
      name = navigation.getParam('name', '0');
      var temp = [];
      var that=this;
      console.log(mobile_no);
      db.transaction(function(txn) {
            txn.executeSql('SELECT * FROM table_call_logs where mobile_no="'+mobile_no+'" order by call_logs_id desc', [], (tx, results) => {
              console.log(results);
                var len = results.rows.length;
                console.log(len);
                for (let i = 0; i < len; i++) {
                temp.push(results.rows.item(i));
                }
                that.setState({
                    dataSource: temp,
                },function(){
                });
                
            },(err)=>{
            console.log(err);
            });
            },function(err){
                    console.log("ok"+err)
                    },function(sus){
                        
                    });

      
      this.setState({
        mobile_no:mobile_no
      })

    }
    componentDidMount() {
    const { navigation } = this.props
    this.props.navigation.setParams({
        call: this.call
    })
}

    call(){
    RNImmediatePhoneCall.immediatePhoneCall(this.state.mobile_no);
    //this.setState({text:''});
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

    render() {
             const items = [];
              const ary=["Engage","Not Picked Up","Disconnected by User","Switch Off","Hot","Cold","Call Back"];
              for(i=0;i<this.state.dataSource.length;i++){
                let mobile_no=this.state.dataSource[i].mobile_no;
                items.push(

                  <CardView
                    cardElevation={5}
                    cardMaxElevation={5}
                    cornerRadius={5}
                    style={styles.cardViewStyle}>
                         {(i == 0) ?
                          <View>
                            <View style={styles.navBar}>
                              <View style={styles.leftContainer}>
                                <Icon name={"md-calendar"} style={styles.iconCounter}/>
                                <Text style={styles.iconCounterText}>Last call on</Text>
                                
                              </View>
                              <View style={styles.rightContainer}>
                                  <Icon name={"md-flame"} style={styles.iconCounterRight}/>
                                  <Text style={styles.iconCounterText}>{ary[this.state.dataSource[i].call_type]}</Text>
                              </View>                            
                            </View>
                              <View style={styles.rightmargin}>
                                <Text>{this.state.dataSource[i].call_log_date}</Text>
                              </View>
                          </View>
                          
                        : null}
                          <View style={styles.storyCounters}>
                          <Icon name={"ios-clipboard"} style={styles.iconCounter}/>
                          <Text style={styles.iconCounterText}>Remark</Text>
                          </View>
                          <View style={styles.rightmargin}>
                          <Text>{this.state.dataSource[i].remarks}</Text>
                          </View>
                          {(i > 0) ?
                          <View style={styles.storyCounters}>
                          <Icon name={"md-calendar"} style={styles.iconCounter}/>
                          <Text>Date and time {this.state.dataSource[i].call_log_date}</Text>
                          </View>
                          : null}
           
                  </CardView>

                );
              }
            return(
              <ScrollView style={styles.parentContainer}>
                <View style={styles.MainContainer}>
                {items}
                </View>
              </ScrollView>
          
            )
        }
    }
    
const styles = StyleSheet.create({

  MainContainer: {
    marginLeft:10,
    marginRight:10,
    paddingTop:5

  },
  storyCounters:{
    flexDirection:'row'
  },
  parentContainer: {
    flex: 1,
    backgroundColor: '#F2f2f2'

  },
  parent: {
        width: '100%', 
        flexDirection: 'row', 
        flexWrap: 'nowrap'
    },
    child: {
        width: '70%'
    },
    child_new: {
        width: '30%',
        textAlign: 'right'
    },
  cardViewStyle:{
    marginTop:10,
     padding:10

  },

  cardView_InsideText:{
    color: '#000',
    marginBottom:10  

  },
  cardView_righttext:{
    textAlign:'right',
    marginBottom:10
  },
  boldtext:{
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14, 
    marginBottom:10

  },
      iconCounter: {
        marginRight:10,
        marginLeft:6,
        marginTop:2,
        fontSize:14,
        color:'#f50d04'
      },
      iconCounterRight: {
        marginRight:10,
        marginLeft:6,
        marginTop:2,
        fontSize:14,
        textAlign:'right',
        color:'#f50d04'
      },
      iconCounterText:{
        fontSize:16,
        fontWeight:'bold'
      },
      navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  rightmargin:{
    marginLeft:25
  },
  headerIcon:{
    fontSize:25,
    color:'#ffffff'
  }
  

});