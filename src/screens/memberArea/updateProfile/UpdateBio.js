import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { updateUserBio } from '../../../actions';
import { isValidUsername, isValidName, isValidDescription } from './validation';

class UpdateBio extends Component {
  static navigatorButtons = {
    leftButtons: [{
      title: 'Cancel',
      id: 'cancel',
    }],
    rightButtons: [
      {
        title: 'Save',
        id: 'save',
      },
    ]
  }

  state = {
    name: this.props.name || '',
    description: this.props.description || '',
    username: this.props.username || '',
    error: '',
    success: '',
    isLoading: false,
  }

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'cancel') {
        this.props.navigator.pop();
      }
      if (event.id == 'save') {
        this.onProfileUpdate();
      }
    }
  }

  onProfileUpdate = () => {
    let data = {};

    if (this.state.username !== this.props.username) { // username was modified so needs to be updated
      if (isValidUsername(this.state.username)) {
        data.username = this.state.username.toLowerCase();
      } else {
        return this.setState({ error: 'Invalid username' });
      }
    }

    if (this.state.name !== this.props.name) { // name was modified so needs to be updated
      if (isValidName(this.state.name)) {
        data.name = this.state.name;
      } else {
        return this.setState({ error: 'Name should not exceed 32 characters' });
      }
    }

    if (this.state.description !== this.props.description) { // description was modified so needs to be updated
      if (isValidDescription(this.state.description)) {
        data.description = this.state.description;
      } else {
        return this.setState({ error: 'Description should not exceed 150 characters' });
      }
    }

    this.setState({ isLoading: true }, () => {
      this.props.updateUserBio(data, (error) => {
        this.setState({ error, success: 'updated!', isLoading: false });
      })
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.labelText}>Username</Text>
          <TextInput
            style={styles.inputStyle}
            autoCorrect={false}
            value={this.state.username}
            onChangeText={this.updateUsernameInput}
          />
        </View>

        <View>
          <Text style={styles.labelText}>Name</Text>
          <TextInput
            style={styles.inputStyle}
            autoCorrect={false}
            value={this.state.name}
            onChangeText={this.updateNameInput}
          />
        </View>

        <View>
          <Text style={styles.labelText}>Description</Text>
          <TextInput
            multiline
            numberOfLines={4}
            style={styles.inputStyle}
            autoCorrect={false}
            value={this.state.description}
            onChangeText={this.updateDescriptionInput}
          />
        </View>

        {!!this.state.isLoading && <ActivityIndicator style={styles.loadingIndicator} size="small" />}
        {!!this.state.error && <Text style={styles.errorText}>{this.state.error}</Text>}
        {!!this.state.success && <Text style={styles.successText}>{this.state.success}</Text>}
      </View>
    );
  }

  updateUsernameInput = (username) => {
    this.setState({ username });
  }
  updateNameInput = (name) => {
    this.setState({ name });
  }
  updateDescriptionInput = (description) => {
    this.setState({ description });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  inputStyle: {
    paddingTop: 5,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#d1d4d6',//dee1e2
    fontWeight: '500',
    fontSize: 14,
  },
  labelText: {
    color: '#737577',
    paddingTop: 10
  },
  loadingIndicator: {
    marginTop: 20,
  },
  errorText: {
    marginTop: 20,
  },
  successText: {
    marginTop: 20,
    color: '#8ae512'
  },
});

export default UpdateBio;
