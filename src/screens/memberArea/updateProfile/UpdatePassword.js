import firebase from 'firebase';
import React, { Component } from 'react';
import { View, Text, TextInput, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { isPasswordValid } from './validation';

class UpdatePassword extends Component {
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
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
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
        this.updatePassword();
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.labelText}>Current Password</Text>
          <TextInput
            style={styles.inputStyle}
            secureTextEntry
            autoCorrect={false}
            placeholder="Current password"
            value={this.state.currentPassword}
            onChangeText={currentPassword => this.setState({ currentPassword })}
          />
        </View>
        <View>
          <Text style={styles.labelText}>New Password</Text>
          <TextInput
            style={styles.inputStyle}
            secureTextEntry
            autoCorrect={false}
            placeholder="New password"
            value={this.state.newPassword}
            onChangeText={newPassword => this.setState({ newPassword })}
          />
        </View>
        <View>
          <Text style={styles.labelText}>Confirm New Password</Text>
          <TextInput
            style={styles.inputStyle}
            secureTextEntry
            autoCorrect={false}
            placeholder="Confirm new password"
            value={this.state.confirmNewPassword}
            onChangeText={confirmNewPassword => this.setState({ confirmNewPassword })}
          />
        </View>

        {!!this.state.isLoading && <ActivityIndicator style={styles.loadingIndicator} size="small" />}
        {!!this.state.error && <Text style={styles.errorText}>{this.state.error}</Text>}
        {!!this.state.success && <Text style={styles.successText}>{this.state.success}</Text>}
      </View>
    );
  }

  updatePassword = () => {
    if (this.state.currentPassword.length > 5) {
      let user = firebase.auth().currentUser;
      const credential = firebase.auth.EmailAuthProvider.credential(user.email, this.state.currentPassword);

      if (this.state.currentPassword !== this.state.confirmNewPassword) {
        if(this.state.newPassword === this.state.confirmNewPassword) {
          if (isPasswordValid(this.state.confirmNewPassword)) {

            this.setState({ isLoading: true}, () => {

              user.reauthenticateWithCredential(credential)
                .then(() => {
                    user.updatePassword(this.state.confirmNewPassword)
                      .then(() => this.setState({ success: 'updated!', error: '', isLoading: false }) )
                      .catch((error) => this.setState({ error: 'Internal error, please try again', success: '', isLoading: false, }) );
                  })
                .catch((error) => this.setState({ error: 'Old password is incorrect', success: '', isLoading: false }) );
            });

          } else { this.setState({ error: 'Password must be longer than 5 characters', success: '' }) }
        } else { this.setState({ error: 'Password and confirm password do not match', success: '' }) }
      } else { this.setState({ error: 'New password should be different from the current password', success: '' }) }

    } else { this.setState({ error: 'Old password is incorrect', success: '' }) }
  }

}


const styles = {
  container: {
    flex: 1,
    // backgroundColor: '#fff',
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

export default UpdatePassword;
