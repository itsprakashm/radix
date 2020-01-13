/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { Text, View,PermissionsAndroid,Alert,StyleSheet,TextInput, ListView,FlatList,TouchableWithoutFeedback,Button,TouchableOpacity,Image} from 'react-native';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import CallDetectorManager from 'react-native-call-detection';
import {Appbar,ActivityIndicator,Searchbar} from 'react-native-paper';
import CallLogs from 'react-native-call-log';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import { openDatabase } from 'react-native-sqlite-storage';
import Contacts from 'react-native-contacts';
const audioPath = AudioUtils.MusicDirectoryPath;
import { withNavigation } from 'react-navigation';
var db = openDatabase({ name: 'UserDatabase.db' });
import NetInfo from "@react-native-community/netinfo";
import Icon from 'react-native-vector-icons/Ionicons';
import CardView from 'react-native-cardview' ;
type Props = {};
let filename='';
let name='';
class Createcontect extends Component{
  render(){
    
    return(
        <CardView
          cardElevation={5}
          cardMaxElevation={5}
          cornerRadius={5}
          style={styles.cardViewStyle}>
            <View>
              <View style={styles.navBar}>
                <View style={styles.leftContainer}>
                  <Text style={[styles.text, {textAlign: 'left'}]}>
                    <Icon name="md-call" style={styles.icons}/>
                  </Text>
                  <Text style={[styles.text,styles.marginright]}>
                    8603195753
                  </Text>
                </View>
                
                <View style={styles.rightContainer}>
                  <Text>HOT</Text>
                </View>
              </View>
              <Text style={[styles.text,styles.marginbottomtext]}>
                    11:26AM
              </Text>
            </View>
        </CardView>
      )
  }
}

class getContact extends Component<Props> {
  
  constructor() {
    super()
    this.state = {
      dataSource:null,
      isLoading:true
    }
  }
  
  componentDidMount(){
    let currentdate = new Date(); 
    let temp=[];
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
                  
                },function(sus){
                  
                });
  }
  
  render() {
      return(
        <View>
          {this.state.dataSource.map((value,index)=>{
            <Createcontect/>
          })}
        </View>
    );
  }
} 
const styles = StyleSheet.create(
  {
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
      rightIcon: {
        height: 10,
        width: 10,
        resizeMode: 'contain',
      },
      cardViewStyle:{
        marginBottom:10,
         padding:10
      },
      icons:{
        fontSize:20
      },
      marginright:{
        marginLeft:8
      },
      marginbottomtext:{
        marginLeft:17,
        marginTop:5
      }
  });
  export default withNavigation(getContact);
