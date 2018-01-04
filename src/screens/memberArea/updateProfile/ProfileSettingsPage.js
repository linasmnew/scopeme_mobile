import firebase from 'firebase';
import { LoginManager } from 'react-native-fbsdk';
import React, { Component } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Dimensions, Platform , Alert} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Entypo';
import { updateUserBio, logUserOut } from '../../../actions';
import { UPDATE_USER_BIO } from '../../../actions/types';

class ProfileSettingsPage extends Component {
  render() {
    return (
      <View style={styles.profileSettingsContainer}>
        <TouchableOpacity onPress={this.goToUpdateBio}>
          <View>
            <Text style={{color: '#737577', paddingTop: 10}}>Bio</Text>
            <View style={[styles.updateLoginDetailsContainer, { marginTop: 0 }]}>
              <Icon
                name='user'
                size={18}
              />
              <Text style={styles.updateLoginDetailsText}>Update Bio</Text>
              <Icon
                name='chevron-right'
                color='#aaa'
                size={24}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.goToUpdateEmail}>
          <View>
            <Text style={{color: '#737577', marginTop: 20}}>Email</Text>
            <View style={styles.updateLoginDetailsContainer}>
              <Icon
                name='mail'
                size={18}
              />
              <Text style={styles.updateLoginDetailsText}>Update Email</Text>
              <Icon
                name='chevron-right'
                color='#aaa'
                size={24}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.goToUpdatePassword}>
        <View>
        <Text style={{
          color: '#737577', marginTop: 20
        }}>Password</Text>
          <View style={styles.updateLoginDetailsContainer}>
            <Icon
              name='lock'
              size={18}
            />
            <Text style={styles.updateLoginDetailsText}>Update Password</Text>
            <Icon
              name='chevron-right'
              color='#aaa'
              size={24}
            />
          </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.goToAccountLinking}>
          <View>
            <Text style={{ color: '#737577', marginTop: 20 }}>Link accounts</Text>
            <View style={styles.updateLoginDetailsContainer}>
              <Icon
                name='flash'
                size={18}
              />
              <Text style={styles.updateLoginDetailsText}>Link accounts</Text>
              <Icon
                name='chevron-right'
                color='#aaa'
                size={24}
              />
            </View>
          </View>
        </TouchableOpacity>

        <View style={{marginTop: 40}}>
          <Button
            title="Logout"
            onPress={this.logout}
          />
        </View>
      </View>
    );
  }

  logout = () => {
    this.props.logUserOut();
    firebase.auth().signOut().then(() => {
      LoginManager.logOut();
    });
  }

  goToUpdateBio = () => {
    this.props.navigator.push({ screen: 'UpdateBio', title: 'Update Bio',
      passProps: { ...this.props.user, updateUserBio: this.props.updateUserBio }
    });
  }

  goToUpdateEmail = () => {
    this.props.navigator.push({ screen: 'UpdateEmail', title: 'Update Email' });
  }

  goToUpdatePassword = () => {
    this.props.navigator.push({ screen: 'UpdatePassword', title: 'Update Password' });
  }

  goToAccountLinking = () => {
    this.props.navigator.push({ screen: 'LinkAccountPage', title: 'Link Account', backButtonTitle: '' });
  }
}


const styles = StyleSheet.create({
  profileSettingsContainer: {
    overflow: 'hidden',
    flex:1,
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  updateLoginDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#d1d4d6',
    paddingTop: 10,
    paddingBottom: 10,
  },
  updateLoginDetailsText: {
    fontWeight: '500',
    paddingLeft: 15,
    flex: 1,
    fontSize: 14
  },
  errorText: {
    marginTop: 20,
  },
  successText: {
    marginTop: 20,
    color: '#8ae512'
  },
});

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, { updateUserBio, logUserOut })(ProfileSettingsPage);
