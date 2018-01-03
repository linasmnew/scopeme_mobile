import firebase from 'firebase';
import { LoginManager, LoginButton, AccessToken } from 'react-native-fbsdk';
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Modal, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Entypo';
import { isValidEmail, isPasswordValid } from './validation';

class LinkAccountPage extends Component {
  static navigatorStyle = {
    tabBarHidden: true
  };
  
  state = {
    passwordProvider: false,
    facebookProvider: false,
    email: '',
    password: '',
    modalVisible: false,
    isLoading: false,
    success: '',
    error: '',
    modalIsLoading: false,
    modalError: '',
    modalSuccess: '',
  };

  componentDidMount() {
    let providers = firebase.auth().currentUser.providerData.map((provider) => {
      return provider.providerId;
    });

    this.setState({
      passwordProvider: providers.includes('password'),
      facebookProvider: providers.includes('facebook.com'),
    });
  }

  closeModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  setModalVisible = () => {
    if (this.state.passwordProvider) {
      this._unlinkProvider('passwordProvider', 'password');
      return;
    }
    this.setState({ modalVisible: !this.state.modalVisible, email: '', password: '', modalIsLoading: false, modalSuccess: '', modalError: '' });
  }

  _passwordAuth = () => {
    const { email, password } = this.state;

    if (isValidEmail(this.state.email)) {
      if (isPasswordValid(this.state.password)) {
        this.setState({ modalIsLoading: true }, () => {

          let credential = firebase.auth.EmailAuthProvider.credential(email, password);
          firebase.auth().currentUser.linkWithCredential(credential)
            .then((user) => this.setState({ passwordProvider: true, modalSuccess: 'Account linked successfully', modalError: '', modalIsLoading: false }),
            (error) => {
              if (error.code === 'auth/requires-recent-login') {
                AccessToken.getCurrentAccessToken()
                  .then((data) => {

                    const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
                    firebase.auth().currentUser.reauthenticateWithCredential(credential)
                      .then(() => {
                        this.setState({modalError: '', modalSuccess: 'Account linked successfully', modalIsLoading: false });
                      }, (error) => this.setState({modalError: 'Something went wrong, please try again', modalSuccess: '', modalIsLoading: false }));

                  }, (error) => this.setState({modalError: 'Something went wrong, please try again', modalSuccess: '', modalIsLoading: false }));

              } else if (error.code === 'auth/provider-already-linked') {
                this.setState({modalError: 'You already have an Email / Password login linked to your account', modalSuccess: '', modalIsLoading: false });
              }
            });

        });
      } else { this.setState({ modalError: 'Password must be longer than 5 characters', modalSuccess: '' }) }
    } else { this.setState({ modalError: 'Invalid email address', modalSuccess: '' }) }
  }

  _fbAuth = () => {
    if (this.state.facebookProvider) {
      this._unlinkProvider('facebookProvider', 'facebook.com');
      return;
    }

    this.setState({ isLoading: true }, () => {
      LoginManager.logInWithReadPermissions(['public_profile'])
        .then((result) => {
          if (result.isCancelled) return this.setState({error: '', success: '', isLoading: false });
          AccessToken.getCurrentAccessToken()
            .then((data) => {
              const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);

              firebase.auth().currentUser.linkWithCredential(credential)
                .then(() => this.setState({facebookProvider: true, success: 'Account linked successfully', error: '', isLoading: false }),
                (error) => {
                  if (error.code === 'auth/credential-already-in-use') {
                    return this.setState({
                      error: 'This Facebook account is already associated with a different user, sign out of Facebook to choose a different Facebook account',
                      success: '',
                      isLoading: false
                    });
                  }
                  if (error.code === 'auth/provider-already-linked') {
                    return this.setState({error: 'You already have a Facebook login linked to your account', success: '', isLoading: false });
                  }
                  if (error.code === 'auth/email-already-in-use') {
                    return this.setState({error: 'You already have an account registered with this email', success: '', isLoading: false });
                  }
                  else {
                    return this.setState({error: 'Something went wrong, please try again', success: '', isLoading: false });
                  }
                });

            }, (error) => this.setState({error: 'Something went wrong, please try again', success: '', isLoading: false }));
        }, (error) => this.setState({error: 'Error connecting to Facebook, please try again', success: '', isLoading: false }));
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          >
          <View style={styles.modalWrapper}>
            <TouchableOpacity onPress={this.closeModal}>
              <Text style={{fontWeight: '700'}}>CLOSE</Text>
            </TouchableOpacity>

            <View style={{paddingTop: 10}}>
              <TextInput
                style={styles.textInput}
                placeholderTextColor="#aaa"
                autoCorrect={false}
                placeholder="user@gmail.com"
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
              />

              <TextInput
                style={styles.textInput}
                placeholderTextColor="#aaa"
                autoCorrect={false}
                secureTextEntry
                placeholder="password"
                value={this.state.password}
                onChangeText={password => this.setState({ password })}
              />
            </View>
            {!!this.state.modalIsLoading && <ActivityIndicator style={{marginBottom: 10}} size="small" />}
            {!!this.state.modalError && <Text style={{ marginBottom: 10}}> {this.state.modalError}</Text>}
            {!!this.state.modalSuccess && <Text style={{marginBottom: 10}}>{this.state.modalSuccess}</Text>}

            <Button
              buttonStyle={styles.loginButton}
              title="Add account"
              onPress={this._passwordAuth}
              color="#FEF9F9"
              fontWeight='600'
            />
          </View>
        </Modal>

        <TouchableOpacity onPress={this._fbAuth}>
          <View style={[styles.linkButtonContainer, {paddingBottom: 15}]}>
          <Icon name='facebook' size={18} />
            <Text style={styles.textStyle}>
              <Text style={this.state.facebookProvider ? {color: 'red'} : {color: 'green'}}>
                {this.state.facebookProvider ? 'Remove ' : 'Add a '}
              </Text>
               Facebook Login
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.setModalVisible}>
          <View style={[styles.linkButtonContainer, {paddingTop: 15, paddingBottom: 15}]}>
          <Icon name='mail' size={18} />
            <Text style={styles.textStyle}>
              <Text style={this.state.passwordProvider ? {color: 'red'} : {color: 'green'}}>
                {this.state.passwordProvider ? 'Remove ' : 'Add an '}
              </Text>
               Email And Password Login
            </Text>
          </View>
        </TouchableOpacity>

        {!!this.state.isLoading && <ActivityIndicator style={styles.loadingIndicator} size="small" />}
        {!!this.state.error && <Text style={styles.errorText}>{this.state.error}</Text>}
        {!!this.state.success && <Text style={styles.successText}>{this.state.success}</Text>}

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 40 }}>
          <Text style={{ fontWeight: '500' }}>
            What is account linking?
          </Text>
          <Text style={{ paddingTop: 10, fontSize: 12 }}>
            Account linking allows you to add additional ways of logging in into your account.
          </Text>
        </View>
      </View>
    );
  }

  _unlinkProvider = (providerBeingLinked, providerId) => {

    if (firebase.auth().currentUser.providerData.length === 1) {
      return this.setState({
        error: "Operation could not be performed because this is the only account linked to this profile - removing it would make the profile unreachable" });
    }

    firebase.auth().currentUser.unlink(providerId).then(() => {
      this.setState({[providerBeingLinked]: false, error: '', success: 'Account unlinked successfully', isLoading: false });
    }).catch((error) => {
      // unlink throws: auth/no-such-provider
      this.setState({error: 'User does not have this provider linked', success: '', isLoading: false });
    });
  }
}


let heighty = Dimensions.get('window').height / 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
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
  textInput: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#DDDDDD',
    color: '#545454',
    marginBottom: 10,
  },
  loginButton: {
    marginLeft: -15,
    marginRight: -15,
    borderRadius: 10,
    backgroundColor: '#EF678D',
  },
  linkButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#d1d4d6',
    paddingTop: 10,
    paddingBottom: 10,
  },
  textStyle: {
    fontWeight: '500',
    paddingLeft: 10,
    fontSize: 14,
    flex: 1,
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
});

export default LinkAccountPage;
