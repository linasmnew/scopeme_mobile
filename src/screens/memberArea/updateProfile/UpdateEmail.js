import firebase from 'firebase';
import React, { Component } from 'react';
import { View, Text, TextInput, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import ReauthenticateModal from './ReauthenticateModal';
import { isValidEmail } from './validation';

class UpdateEmail extends Component {
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
    email: firebase.auth().currentUser.email,
    reauthModalVisible: false,
    isLoading: false,
    error: '',
    success: '',
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
        this.updateEmail();
      }
    }
  }

  removeModal = () => {
    this.setState({ reauthModalVisible: false });
  }

  updateEmail = () => {
    let user = firebase.auth().currentUser;

    if (this.state.email !== user.email) {
      if (isValidEmail(this.state.email)) {

        this.setState({ isLoading: true}, () => {
          user.updateEmail(this.state.email)
            // email successfully updated...
            .then(() => this.setState({ success: 'updated!', error: '', isLoading: false, reauthModalVisible: false }))
            // if not recently authenticated display re-authentication modal
            .catch((error) => this.setState({ reauthModalVisible: true, success: false, isLoading: false }));
        });

      } else { this.setState({ error: 'Invalid email address', success: '' }) }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.reauthModalVisible &&
          <ReauthenticateModal removeModal={this.removeModal} />
        }

        <Text style={styles.labelText}>Email</Text>
        <TextInput
          style={styles.inputStyle}
          autoCorrect={false}
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
        />

        {!!this.state.isLoading && <ActivityIndicator style={styles.loadingIndicator} size="small" />}
        {!!this.state.error && <Text style={styles.errorText}>{this.state.error}</Text>}
        {!!this.state.success && <Text style={styles.successText}>{this.state.success}</Text>}
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  labelText: {
    color: '#737577',
    paddingTop: 10
  },
  inputStyle: {
    paddingTop: 5,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#d1d4d6',//dee1e2
    fontWeight: '500',
    fontSize: 14,
  },
  updateButton: {
    marginLeft: -15,
    marginRight: -15,
    backgroundColor: '#4F4545', //FF5A60
    borderRadius: 20,
    marginTop: 15
  },
  loadingIndicator: {
    marginTop: 20
  },
  errorText: {
    marginTop: 20,
  },
  successText: {
    marginTop: 20,
    color: '#8ae512'
  },
};

export default UpdateEmail;
