import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,ScrollView,StatusBar,Image,ImageBackground,TextInput,Button,TouchableWithoutFeedback,Keyboard,SafeAreaView} from 'react-native';
import {DefaultTheme, Provider as PaperProvider,ActivityIndicator  } from 'react-native-paper';
import { openDatabase } from 'react-native-sqlite-storage';
import NetInfo from "@react-native-community/netinfo";
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from './actions/';
var db = openDatabase({ name: 'UserDatabase.db' });
let that=null;
let isfocus=false;
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
    console.log(this.props);
  } 
  handleBlur (){
    if(this.props.value=="")
      this.setState({ isFocused: false });
    console.log(isfocus);
    
  }

  render() {
    const { label, ...props } = this.props;
    const { isFocused } = this.state;
    const labelStyle = {
      position: 'absolute',
      left: 0,
      top: !isFocused ? 20 : 0,
      fontSize: !isFocused ? 18 : 14,
      color: !isFocused ? '#ffffff' : '#ffffff',
    };
    return (
      <View style={{ paddingTop: 18 }}>
        <Text style={labelStyle}>
          {label}
        </Text>
        <TextInput
          {...props}
          style={styles.input}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          blurOnSubmit
        />
      </View>
    );
  }
}





class Login extends Component{
	constructor() {
        super()
        this.state = {
      username: '',
      password: '',
      redirectToReferrer: false,
      islogin:false,
      full_name:'',
      is_login:false,
      isfocus:false,
      is_error:false
      };
      this.login = this.login.bind(this);
      this.onChange = this.onChange.bind(this);
      this._keyboardDidShow = this._keyboardDidShow.bind(this);
      this._keyboardDidHide = this._keyboardDidHide.bind(this);
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
     componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
      }

      componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
      }

      _keyboardDidShow () {
        this.setState({
          isfocus: true
        })
      }

      _keyboardDidHide () {
        this.setState({
          isfocus: false
        })
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

                  //alert("Invalid ID Or Password");
                  this.props.islogin=false;
                  that.setState({
                    is_login:false,
                    is_error:true
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
    const logo_container = {
      flexDirection: 'column',
      justifyContent:'center',
      alignItems:'center',
      textAlign:'center',
      height:!this.state.isfocus ? 100 : 0,
      backgroundColor:'#ffffff',
      marginTop:!this.state.isfocus ? 60 : 0
    };

    const logintop= {
      width:'200%',
      height:  !this.state.isfocus ? 100 : 0,
      backgroundColor: '#00A8FF',
      transform: [{ skewY: "10deg" }],
      position: 'relative',
      bottom:-80,
      left:-20
    };
    const loginformfocus={
      paddingTop:!this.state.isfocus ? 0 : 60
    };
    return (
     
      
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#2a89f7" barStyle="light-content" />
          <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{flexGrow: 1}}
        >
    	     <View style={styles.container}>       
              <View style={logo_container }>
                <Image style={styles.logo} source={require('./images/app-logo.png')}/>
              </View>	

              <View style={logintop }></View>    	
	            <View style={[ styles.loginForm , loginformfocus ]}>
                <Text style={[styles.whitetext, styles.big]}>LOG IN</Text>
                <Text style={[styles.whitetext, styles.medium]}>TO YOUR ACCOUNT</Text>
                <View style={ styles.controls }>
                    <FloatingLabelInput
                      label="Enter mobile number or email"
                      value={this.state.username}
                      onChangeText={(username) => this.setState({username})}
                    />
                    {
                      this.state.is_error ? <Text style={styles.error_text}>Entered User ID or password is not correct</Text> : null
                    }
                    
                    <View style={styles.margin_bottom}></View>
                    <FloatingLabelInput
                      label="Password"
                      value={this.state.password}
                      onChangeText={(password) => this.setState({password})}
                      secureTextEntry={true}
                    />
                    <View style={styles.margin_bottom}></View>
                    <TouchableWithoutFeedback
                              onPress={this.login}>
                              <View style={styles.loginScreenButton}>
                              <Text style={styles.loginText}>LOG IN</Text>
                              </View>
                     </TouchableWithoutFeedback>
                     <ActivityIndicator animating={this.state.is_login} size={'large'} />
                </View>
		        </View>      
	      </View>
        </ScrollView>
        </SafeAreaView>

    );
	}
	
}
var styles = StyleSheet.create({
    error_text:{
      color:"#ff4242",
      fontSize:12
    },
    margin_bottom:{
      marginBottom:30
    },
    top_view: {
        flex: 1,
        flexDirection:'column'
    },
    whitetext:{
      color:'#ffffff'
    },
    big:{
      fontSize: 34,
      fontWeight: 'bold',
    },
    medium:{
      fontSize: 18
    },
    container: {
        flex: 1,
        backgroundColor:'#ffffff'
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch'
    },
    logo_container:{
      flexDirection: 'column',
      justifyContent: 'center',
      height:!isfocus ? 200 : 0,
      backgroundColor:'#ffffff'
    },
    logintop:{
      width:'200%',
      height:  !isfocus ? 100 : 0,
      backgroundColor: '#00A8FF',
      transform: [{ skewY: "13deg" }],
      position: 'relative',
      bottom:-100,
      left:-20
    },
    loginForm: {
    	flex: 1,
        backgroundColor:'#00A8FF',
        paddingLeft:40,
        paddingRight:40
    },
    controls:{
      flex: 1,
      marginTop:70,
      backgroundColor:'#00A8FF'
    },
    input: {
      height: 40,
      borderColor: '#ffffff',
      borderBottomWidth:2,
      color:'#ffffff',
      fontSize:16
   },
   loginScreenButton:{
   marginTop:10,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'#ffffff',
    marginBottom:50
  },
  loginText:{
      color:'#3d3d3d',
      textAlign:'center',
      fontSize:18
  }
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