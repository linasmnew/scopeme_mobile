import React, { Component } from 'react';
import { View, Text, Linking, TouchableWithoutFeedback, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class SingleScope extends Component {
  onPressRemove = () => {
    this.props.onPressRemove(this.props.scope.id);
  }

  onPressEdit = () => {
    this.props.onPressEdit(this.props.scope);
  }

  handleLinkClick() {
    Linking.canOpenURL(this.props.scope.url).then((supported) => {
      if (!supported) {
      } else {
        return Linking.openURL(props.scope.url);
      }
    }).catch((error) => null);
  }

  render() {
    return (
      <View style={[styles.container, { backgroundColor: this.props.scope.backgroundColor ? this.props.scope.backgroundColor : '#ccc' }]}>
        <TouchableWithoutFeedback onPress={this.handleLinkClick}>
          <View style={styles.content}>
            <Text style={[styles.contentText, { color: this.props.scope.fontColor ? this.props.scope.fontColor : '#000' }]}>{ this.props.scope.name }</Text>
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.actionContainer}>
          <Text style={[styles.edit, { fontSize: 12 }]} onPress={this.onPressEdit}>
            edit
          </Text>

          <Icon
            name='times'
            size={12}
            color="#7B7373"
            onPress={this.onPressRemove}
          />
        </View>
      </View>
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
    width: scopeWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eee',
    width: scopeWidth,
    padding: 10,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  edit: {
    fontWeight: '500',
    color: '#7B7373',
  },
  remove: {
    fontWeight: '500',
    color: '#7B7373'
  }
}

export default SingleScope;
