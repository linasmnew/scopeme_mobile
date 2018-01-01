import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

class CheckBox extends Component {
  handlePress = () => {
    this.props.onCheck();
  }

  render() {
    return (
      <TouchableOpacity onPress={this.handlePress}>
        <View style={styles.container}>
          <View style={[styles.checkBox, this.props.isChecked ? {backgroundColor: '#0084ff'} : {backgroundColor:'#fff'} ]}>
          </View>
          <Text style={styles.label}>{this.props.label}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 5,
  },
  checkBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#0084ff',
  },
  label: {
    paddingLeft: 10,
  },
});

export default CheckBox;
