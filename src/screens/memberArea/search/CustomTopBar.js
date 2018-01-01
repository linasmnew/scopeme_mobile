import React, { Component } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, TouchableOpacity, StyleSheet, Animated, LayoutAnimation, NativeModules } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { updateSearchQuery } from '../../../actions';

const { UIManager } = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

var CustomLayoutLinear = {
    duration: 70,
    create: {
      type: LayoutAnimation.Types.linear,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.linear,
    },
  };

class CustomTopBar extends Component {
  state = {
    input: '',
    isFocused: false,
  }

  clearInput = () => {
    this.props.updateSearchQuery('');
    this.setState({ input: '' });
  }

  cancelInput = () => {
    this.props.updateSearchQuery('');
    this.setState({ input: '' });
    this.setState({ isFocused: false });
    this.refs.input.blur();
  }

  handleInput = (text) => {
    this.props.updateSearchQuery(text);
    this.setState({ input: text });
  }

  handleInputFocus = () => {
    LayoutAnimation.configureNext(CustomLayoutLinear);
    this.setState({ isFocused: true });
  }

  focusInputContainingIcon = () => {
    this.refs.input.focus();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchInputAndCancelContainer}>

        <TouchableWithoutFeedback onPress={this.focusInputContainingIcon}>
          <View style={styles.searchInputContainer}>
            <View style={this.state.isFocused ? {alignItems: 'flex-start'} : {flex: 1, alignItems: 'flex-end' }}>
              <Icon
                name='search'
                type='font-awesome'
                color='#bbb'
                size={14}
                style={{paddingLeft: 10}}
              />
            </View>
            <TextInput
              style={[styles.inputStyle, {paddingLeft: this.state.isFocused ? 10 : 8, paddingRight: this.state.isFocused ? 0 : 30}]}
              ref="input"
              autoCorrect={false}
              value={this.state.input}
              placeholder="Search"
              onFocus={this.handleInputFocus}
              onChangeText={this.handleInput}
            />
            {!!this.state.input &&
              <TouchableWithoutFeedback onPress={this.clearInput}>
                <Icon
                  name='times-circle'
                  type='font-awesome'
                  color='#bbb'
                  size={14}
                  style={{paddingRight: 10}}
                />
              </TouchableWithoutFeedback>
            }
          </View>
          </TouchableWithoutFeedback>

          {this.state.isFocused &&
            <View>
              <TouchableOpacity onPress={this.cancelInput}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  searchInputAndCancelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    borderRadius: 10,
    marginLeft: 6,
    marginRight: 6,
  },
  inputStyle: {
    paddingLeft: 10,
    paddingBottom: 5,
    paddingTop: 5,
    fontWeight: '500',
    fontSize: 14,
    flex: 1,
  },
  cancelText: {
    fontSize: 17,
    color: '#007aff',
    marginLeft: 8,
    marginRight: 8,
  },
});

export default connect(null, { updateSearchQuery })(CustomTopBar);
