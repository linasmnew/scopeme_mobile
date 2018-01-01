import firebase from 'firebase';
import React, { Component } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import { isPasswordValid } from './validation';

class ReauthenticateModal extends Component {
  state = {
    password: '',
    error: '',
  }

  removeModal = () => {
    this.props.removeModal();
  }

  reauthenticate = () => {
    // re-authenticate and try again
    if (isPasswordValid(this.state.password)) {

      const user = firebase.auth().currentUser;
      const credential = firebase.auth.EmailAuthProvider.credential(user.email, this.state.password);

      user.reauthenticateWithCredential(credential)
        .then(() => this.removeModal() ) // successfully re-authenticated
        .catch((error) => this.setState({ error: 'Incorrect password' }));

    } else { this.setState({ error: 'Incorrect password' }); } // else email updated
  }

  render() {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent
          visible
        >
          <View style={styles.modalWrapper}>
            <TouchableOpacity onPress={this.removeModal}>
              <Text>CLOSE</Text>
            </TouchableOpacity>

            <Text style={styles.labelText}>Re-authenticate and try again</Text>
            <TextInput
              secureTextEntry
              placeholder="Password"
              style={styles.inputStyle}
              autoCorrect={false}
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
            />

            <Button
              buttonStyle={styles.updateButton}
              title="Reauthenticate"
              fontWeight='500'
              onPress={this.reauthenticate}
            />

            {!!this.state.error && <Text style={styles.errorText}>{this.state.error}</Text>}
          </View>
        </Modal>
      </View>
    );
  }

}

let heighty = Dimensions.get('window').height / 3;

const styles = {
  modalWrapper: {
    marginLeft: 15,
    marginRight: 15,
    padding: 10,
    marginTop: heighty,
    backgroundColor: '#f7f7f7',
    shadowOffset : { height: 5 },
    shadowColor: 'black',
    shadowOpacity: 0.3,
  },
  labelText: {
    color: '#737577',
    paddingTop: 10
  },
  inputStyle: {
    paddingTop: 5,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#d1d4d6', //dee1e2
    fontWeight: '500',
    fontSize: 14,
  },
  updateButton: {
    marginLeft: -15,
    marginRight: -15,
    backgroundColor: '#4F4545',
    borderRadius: 20,
    marginTop: 10
  },
  errorText: {
    marginTop: 20,
  },
};


export default ReauthenticateModal;
