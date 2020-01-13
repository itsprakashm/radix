/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { Text, ScrollView,Alert,StyleSheet, ListView,FlatList,TouchableWithoutFeedback} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import { withNavigation } from 'react-navigation';
import { List, Checkbox,ActivityIndicator,Button  } from 'react-native-paper';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
var db = openDatabase({ name: 'UserDatabase.db' });
type Props = {};
let filename='';
let name='';
class Call_logs extends Component {
  
  constructor() {
    super()
    this.createlist=this.createlist.bind(this);
    //this.setModalVisible = this.setModalVisible.bind(this);
    this.state = {
        isLoading:true,
        dataSource:[]
    }
    this.call = this.call.bind(this);
  }
  call(number){
    RNImmediatePhoneCall.immediatePhoneCall(number);
  }
  createlist(){
    //alert("1");
    let str='';
    this.props.records.map((item)=>{
      console.log("prakash"+item);
    })
    /*for(i=0;i<this.props.records.length;i++)
    {
      str+='<List.Section title="Accordions">'+
                   '<List.Accordion'+
                   'title="Uncontrolled Accordion"'+
                   '>'+
                   '<List.Item title="First item" />'+
                   '<List.Item title="Second item" />'+
               '</List.Accordion>'+
               '</List.Section>';
    }
    return str;*/

    
  }
  componentDidMount(){
    //this.createlist();
    /*this.props.records.map((item)=>{
      console.log("prakash"+item);
    })*/
  }
  
  
  render() {
    
    const items = [];
    const ary=["Engage","Not Picked Up","Disconnected by User","Switch Off","Hot","Cold","Call Back"];
    for(i=0;i<this.props.records.length;i++){
      let mobile_no=this.props.records[i].mobile_no;
      items.push(<List.Section title={ary[this.props.records[i].call_type]} key={i}>
      <List.Accordion
      title={mobile_no}
      >
      <List.Item title= {"Time-: "+this.props.records[i].call_duration}/>
      <List.Item title={"Remarks-: "+this.props.records[i].remarks} />
      <List.Item title={"Call Again"} onPress={() => this.call(mobile_no)}/>
  </List.Accordion>
  </List.Section>);
    }
    
      if(this.props.status)
      {
        return(
          <Text>{this.props.status}</Text>
        )
      }
      else{
        return(
          <ScrollView>
          {items}
          </ScrollView>
        )
      }
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
      padding: 10,
      marginLeft:0,
      marginRight:0,
      marginTop: 0,
      marginBottom: 0,
      borderRadius: 5,
      backgroundColor: '#FFF',
      elevation: 2,
  },
    container_text: {
      flex: 1,
      flexDirection: 'column',
      marginLeft: 12,
      justifyContent: 'center',
  },
    flatview: {
      width: '100%',
      justifyContent: 'center',
      borderRadius: 2,
    },
    name: {
      fontSize: 16,
        color: '#000',
    },
    email: {
      color: '#000',
        fontSize:14
    },   
       
      textStyle:{
        color: '#fff',
        fontSize:22
      }
  });
  export default withNavigation(Call_logs);