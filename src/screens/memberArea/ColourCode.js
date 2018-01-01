import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';

class ColourCode extends Component {
  onPressColor = () => {
    this.props.flagColor(this.props.color);
  }

  render() {
    return (
      <TouchableOpacity onPress={this.onPressColor}>
        <View style={[styles.colourSkeleton, { backgroundColor: this.props.color }]} />
      </TouchableOpacity>
    );
  }
}

const styles = {
  colourSkeleton: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    marginTop: 5,
    marginRight: 5,
  },
};

export default ColourCode;
