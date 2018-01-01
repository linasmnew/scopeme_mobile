import firebase from 'firebase';
import React, { Component } from 'react';
import { Modal, View, Text, TextInput, ActivityIndicator, TouchableOpacity, NativeModules, Dimensions, Alert } from 'react-native';
import { LoginManager, LoginButton, AccessToken } from 'react-native-fbsdk';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { logUserOut } from '../../actions';
import ForgotPassword from './ForgotPassword';
import Icon from 'react-native-vector-icons/Entypo';
import { isValidEmail, isPasswordValid } from './validation';

class AuthScreen extends Component {
  state = {
    email: '',
    password: '',
    error: '',
    loading: false,
    modalVisible: false,
  };

  setModalVisible = () => {
    this.setState({modalVisible: !this.state.modalVisible});
  }

  onLoginPress = () => {
    const { email, password } = this.state;

    if (isValidEmail(this.state.email)) {
      if (isPasswordValid(this.state.password)) {

        this.setState({ loading: true });
        firebase.auth().signInWithEmailAndPassword(email, password)
          .then() // on success gets redirected because of firebase.onAuthStateChanged
          .catch((signinError) => {
            switch (signinError.code) {
              case 'auth/invalid-email':
                this.onLoginFail(signinError.message);
                return; // break breaks out of switch, return exits onLoginPress function
                break;
              case 'auth/wrong-password':
                this.onLoginFail(signinError.message);
                return;
                break;
              case 'auth/user-disabled':
                this.onLoginFail(signinError.message);
                return;
              default:
            }

            firebase.auth().createUserWithEmailAndPassword(email, password)
              .then(() => this.setState({ loading: false }))
              .catch((signupError) => this.onLoginFail(signupError.message));
          });

      } else { this.setState({ error: 'Password must be longer than 5 characters', success: '' }) }
    } else { this.setState({ error: 'Invalid email address', success: '' }) }

  }

  onLoginFail(error) {
    if (error) {
      this.setState({ error: error, loading: false });
    } else {
      this.setState({ error: 'Authentication Failed', loading: false });
    }
  }

  renderButtonOrSpinner() {
    if (this.state.loading) {
      return <View><Text>Loading....</Text></View>
    }
  }


  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="small" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Scopeme</Text>
        </View>

        <View style={styles.inputStyles}>
          <TextInput
            style={styles.textInput}
            placeholderTextColor="#eee"
            autoCorrect={false}
            placeholder="Email"
            fontWeight="500"
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
          />

          <TextInput
            style={styles.textInput}
            placeholderTextColor="#eee"
            autoCorrect={false}
            secureTextEntry
            placeholder="Password"
            fontWeight="500"
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
          />
        </View>
        {!!this.state.error &&
          <Text style={styles.errorText}>
            {this.state.error}
          </Text>
        }
        <Button
          buttonStyle={styles.loginButton}
          title="Login"
          onPress={this.onLoginPress}
          color="#BB87DF"
          fontWeight='600'
        />

        <View style={{ paddingTop: 10 }}>
          <TouchableOpacity onPress={this.forgotPassword}>
            <Text style={styles.forgotButtonText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={this._fbAuth}>
          <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Icon
              name='facebook'
              color='#fff'
              size={24}
              style={{paddingRight: 10}}
            />
            <Text style={{fontWeight: '700', color: '#fff'}}>Log in with Facebook</Text>
          </View>
        </TouchableOpacity>

        <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          >
          <View style={styles.modalWrapper}>
            <TouchableOpacity onPress={this.setModalVisible}>
              <Text style={{fontWeight: '700'}}>CLOSE</Text>
            </TouchableOpacity>

            <Text style={{paddingTop: 10}}>
              <Text>You already have an account registered with this email: </Text>
              <Text style={{fontWeight: '700'}}>linasm20@gmail.com</Text>
              <Text>. To add a Facebook login to this account, login with this account and</Text>
              <Text style={{fontWeight: '700'}}> go to settings -> link account.</Text>
            </Text>
          </View>
        </Modal>
        </View>

      </View>
    );
  }

  _fbAuth = () => {
    LoginManager.logInWithReadPermissions(["public_profile"])
      .then((result) => {
        if (result.isCancelled) return;
        AccessToken.getCurrentAccessToken()
          .then((data) => {
            const accessToken = firebase.auth.FacebookAuthProvider.credential(data.accessToken); // link with firebase
            firebase.auth().signInWithCredential(accessToken)
            .then((result) => {}, // now let's login
              (error) => {
                if (error.code === 'auth/account-exists-with-different-credential') {
                  return this.setModalVisible();
                }
            });
        }, (error) => {
          Alert.alert(error.message);
        });
      }, (error) => {
        Alert.alert(error.message);
      });
  }

  forgotPassword = () => {
    this.props.navigator.push({ screen: 'ForgotPassword' });
  }

}

let heighty = Dimensions.get('window').height / 2.5;

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
  titleContainer: {
    backgroundColor: 'transparent',
    paddingBottom: 25
  },
  titleText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '600',
    alignSelf: 'center'
  },
  loginButton: {
    marginLeft: -15,
    marginRight: -15,
    borderRadius: 3,
    borderWidth: 1.8,
    borderColor: '#BB87DF',
    backgroundColor: 'transparent',
  },
  errorText: {
    color: '#545454',
    paddingBottom: 10,
    alignSelf: 'center'
  },
  forgotButtonText: {
    color: '#eee',
    alignSelf: 'flex-end',
    fontWeight: '600',
    paddingBottom: 20,
  },
  modalWrapper: {
    marginLeft: 15,
    marginRight: 15,
    padding: 15,
    marginTop: heighty,
    backgroundColor: '#f7f7f7',
    shadowOffset : { height: 5 },
    shadowColor: 'black',
    shadowOpacity: 0.3,
  },
};


export default AuthScreen;
