import firebase from 'firebase';
import React, { Component } from 'react';
import { View, Text, TextInput, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { isValidEmail } from './validation';

class ForgotPassword extends Component {
  static navigatorStyle = {
    drawUnderNavBar: true ,
    navBarTransparent: true,
    navBarTranslucent: true,
  }

  state = {
    email: '',
    success: '',
    error: '',
    loading: false
  }

  onResetPress() {
    if (isValidEmail(this.state.email)) {

      firebase.auth().sendPasswordResetEmail(this.state.email)
        .then(() => {
          this.setState({ error: '', success: 'Please check your email for further instructions' });
        })
        .catch((error) => {
          if (error.code === 'auth/invalid-email') {
            this.setState({ error: 'Please enter a valid email address', success: '' });
          } else {
            this.setState({ error: 'Something went wrong, please try again', success: '' });
          }
        });

    } else {
      this.setState({ error: 'Please enter a valid email address', success: '' });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          autoCorrect={false}
          placeholder="user@gmail.com"
          placeholderTextColor="#eee"
          fontWeight="500"
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
        />

        {!!this.state.error &&
          <Text style={styles.errorText}>
            {this.state.error}
          </Text>
        }
        {!!this.state.success &&
          <Text style={styles.successText}>
            {this.state.success}
          </Text>
        }

        <Button
          buttonStyle={styles.resetButton}
          title="Reset password"
          onPress={this.onResetPress.bind(this)}
          color="#BB87DF"
          fontWeight='600'
        />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#9F59D0' //'#00C0EF' //49E3AE
  },
  textInput: {
    padding: 15,
    borderRadius: 3,
    color: '#eee',
    backgroundColor: '#BB87DF',
    marginBottom: 10,
  },
  resetButton: {
    marginLeft: -15,
    marginRight: -15,
    borderRadius: 3,
    borderWidth: 1.8,
    borderColor: '#BB87DF',
    backgroundColor: 'transparent',
  },
  successText: {
    paddingBottom: 10,
    alignSelf: 'center',
    color: '#8ae512'
  },
  errorText: {
    color: '#545454',
    paddingBottom: 10,
    alignSelf: 'center'
  },
};

export default ForgotPassword;
