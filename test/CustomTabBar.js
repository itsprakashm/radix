import React, {Component} from 'react';
import { StyleSheet} from 'react-native'; 
import { Appbar  } from 'react-native-paper'; 

export default class CustomTabBar extends Component {
    render() {
        return (
          <Appbar.Header>
            <Appbar.Content
              title="Home"
            />
          </Appbar.Header>
        );
      }
}