import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,ScrollView,StatusBar,Image,ImageBackground} from 'react-native';
import {DefaultTheme, Provider as PaperProvider,TextInput,Surface,Button,ActivityIndicator  } from 'react-native-paper';
import { openDatabase } from 'react-native-sqlite-storage';
import NetInfo from "@react-native-community/netinfo";
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from './actions/';
var db = openDatabase({ name: 'UserDatabase.db' });

let that=null;
class Login extends Component{
	constructor() {
        super()
        this.state = {
      username: '',
      password: '',
      redirectToReferrer: false,
      islogin:false,
      full_name:'',
      is_login:false
      };
      this.login = this.login.bind(this);
      this.onChange = this.onChange.bind(this);
      that=this;
    }
    componentDidMount(){
        /*this.setState({
                islogin:false
              });*/
              
      //LoginManager.logOut();
      db.transaction(function(tx) {
        tx.executeSql(
          'delete from table_user where 1',
          [],
          (tx, results) => {
            console.log("clear");
          },
          (err)=>{
          }
        );
      },function(err){
      },function(sus){
      });
      NetInfo.fetch().then(state => {
        
      });
      
     }

   
    onChange(e)
    {
    	let username=this.state.username;
    	let password=this.state.password;
    }
    login()
    {
      let that=this;
      this.setState({
        is_login:true
      });
      

      NetInfo.fetch().then(state => {
        if(state.isConnected)
        {
          fetch('http://quizsolver.com/radix/dth/index.php/DialerController', {
            method: 'POST',
            body: JSON.stringify({
              username: this.state.username,
              password: this.state.password,
            }),
          }).then((response) => response.json())
              .then((responseJson) => {
                if(responseJson.status=="1")
                {
                  alert("Invalid ID Or Password");
                  this.props.islogin=false;
                  that.setState({
                    is_login:false
                  })
                  this.props.func(false);
                }
                else
                {
                  /*insert data*/
                  let that = this;
                  
                
                        db.transaction(function(tx) {
                          tx.executeSql(
                            'INSERT INTO table_user (full_name,web_user_id,sim_card) VALUES (?,?,?)',
                            [responseJson.data['0'].full_name,responseJson.data['0'].user_id,'0'],
                            (tx, results) => {
                              if (results.rowsAffected > 0) {
                                  //that.props.func(true,responseJson.data['0'].full_name);
                                  let dataState = { user_id: responseJson.data['0'].user_id, loading:true,full_name:responseJson.data['0'].full_name };
                                  that.props.updateuser(dataState);
                              } else {
                                alert('Registration Failed');
                              }
                            },
                            (err)=>{
                            }
                          );
                        },function(err){
                        },function(sus){
                        });

                  /*insert data*/
                }
              })
              .catch((error) => {
          });
        }
        else
        {
          alert("Check your internet Connection");
          this.setState({
            is_login:false
          })
        }
      });
    	
    }
    componentWillUnmount(){
      //this.abortController.abort()
    }
   
  render() {
    return (
      
    	<View style={styles.container}>
        <StatusBar backgroundColor="#0f0f0f" barStyle="light-content" />
	    	<ImageBackground source={require('./images/loginpage.jpg')} style={styles.backgroundImage}>
	            <View style={ styles.loginForm }>
		        	<TextInput
				        label='User Name'
				        value={this.state.username}
				        onChangeText={(username) => this.setState({username})}
				        style={{margin:10}}
				      />
				      <TextInput
				        label='Password'
				        value={this.state.password}
				        secureTextEntry={true}
				        onChangeText={(password) => this.setState({password})}
				        style={{margin:10}}
				      />
				       <Button mode="contained" onPress={this.login} style={{margin:10,borderRadius:20,padding:8}}>
					    Login	
					  </Button>
            <ActivityIndicator animating={this.state.is_login} size={'large'} />
		        </View>
	        </ImageBackground>
          
	      </View>
    );
	}
	
}
var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch'
    },
    loginForm: {
    	flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
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
export default connect(mapStatetoProps,mapDispatchToProps)(Login);