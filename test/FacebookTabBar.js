import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,

} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

class FacebookTabBar extends React.Component {
  icons = [];

  constructor(props) {
    super(props);
    this.icons = [];
  }

  componentDidMount() {
    //this._listener = this.props.scrollValue.addListener(this.setAnimationValue.bind(this));
  }

  setAnimationValue({ value, }) {
    //console.log(this.icons);
    this.icons.forEach((icon, i) => {
      const progress = (value - i >= 0 && value - i <= 1) ? value - i : 1;
      icon.setNativeProps({
        style: {
          color: this.iconColor(progress),
        },
      });
    });
  }

  //color between rgb(59,89,152) and rgb(204,204,204)
  iconColor(progress) {
    const red = 59 + (204 - 59) * progress;
    const green = 89 + (204 - 89) * progress;
    const blue = 152 + (204 - 152) * progress;
    return `rgb(${red}, ${green}, ${blue})`;
  }

  render() {
    let arr=["Dialer","Contact","Reminders","Hot"];
    return <View style={[styles.tabs, this.props.style, ]}>
      {this.props.tabs.map((tab, i) => {
        return <TouchableOpacity key={tab} onPress={() => this.props.goToPage(i)} style={styles.tab}>
        <View style={this.props.activeTab === i ? styles.activetab:styles.inactivetab}>
          <Icon
            name={tab}
            size={20}
            color={this.props.activeTab === i ? '#3f8be4' : '#ffffff'}
            ref={(icon) => { this.icons[i] = icon; }}
          />
          </View>
          <Text style={styles.headertext}>{arr[i]}</Text>
        </TouchableOpacity>;
      })}
    </View>;
  }
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    color:'#fff'
  },
  headertext:{
    color:'#fff',
    
    marginBottom:8
  },
  tabs: {
    height: 45,
    flexDirection: 'row',
    paddingTop: 5,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    backgroundColor:'#3f8be4'
  },
  activetab:{
    backgroundColor:'#ffffff',
    borderRadius:20,
    padding:5,
    height:35,
    width:35,
    justifyContent:'center',
    alignItems:'center',
    textAlign:'center',
  },
  inactivetab:{
    backgroundColor:'#3f8be4',
    padding:10,
    height:35,
    width:35
  }
});

export default FacebookTabBar;