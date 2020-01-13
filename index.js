/**
 * @format
 */

import {AppRegistry,AppState} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import {createStore,applyMiddleware} from 'redux';
import reducer from './reducers/counterReducer';
import thunk from 'redux-thunk';
import { AudioRecorder, AudioUtils } from 'react-native-audio'
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

//import Rec from './Rec';

const theme = {
  roundness: 2,
  colors: {
    primary: '#3f8be4',
    accent: '#3f8be4',
  },
};
const store = createStore(reducer, applyMiddleware(thunk));
let RandomNumber = Math.floor(Math.random() * 100) + 1 ;
const audioPath = AudioUtils.MusicDirectoryPath + '/record'+RandomNumber+'.aac'
const Appcontainer=() =>
<StoreProvider store={store}>
<PaperProvider theme={theme}>
<App/>
</PaperProvider>
</StoreProvider>
let i=0;
let isrecording=false;
const Rec = async (data) => {
	i++;
	console.log("ctr"+i);
  /*if (data.state === 'extra_state_offhook') {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 44100,
      Channels: 2,
      AudioQuality: "High",
      AudioEncoding: "aac"
    })
    if(i%2==1){
      console.log("if");
    	await AudioRecorder.startRecording();
    	isrecording=true;
    	i=0;
    	console.log("record start"+audioPath);
    }
  } else if (data.state === 'extra_state_idle') {
  	//if(i%2==0){
  		if(isrecording)
    	{
    		isrecording=false;
    		await AudioRecorder.stopRecording()
    	}
    	i=0;
    	console.log("record stop");
    //}
  }*/
}
AppRegistry.registerHeadlessTask('Rec', () => Rec);
AppRegistry.registerComponent(appName, () => Appcontainer);
