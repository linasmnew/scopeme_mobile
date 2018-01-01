import React, { Component } from 'react';
import { View, Text, Linking, TouchableWithoutFeedback, Dimensions } from 'react-native';

class SingleScope extends Component {
  handleLinkClick = () => {
    Linking.canOpenURL(this.props.scope.url).then((supported) => {
      if (!supported) {
      } else {
        return Linking.openURL(this.props.scope.url);
      }
    }).catch((error) => null);
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.handleLinkClick}>
        <View style={[styles.container, { backgroundColor: this.props.scope.backgroundColor ? this.props.scope.backgroundColor : '#ccc' }]}>
          <View style={styles.content}>
            <Text style={[styles.contentText, { color: this.props.scope.fontColor ? this.props.scope.fontColor : '#000' }]}>{ this.props.scope.name }</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const gutter = 14;
const { width, height } = Dimensions.get('window');
const scopeWidth = (width - gutter * 3)/2;

const styles = {
  container: {
    height: 125,
    width: scopeWidth,
    flexDirection: 'column',
    marginBottom: 11,
    borderRadius: 15,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  contentText: {
    fontSize: 14,
    fontWeight: '600',
  },
}

export default SingleScope;
