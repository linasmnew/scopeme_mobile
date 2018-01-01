import firebase from 'firebase';
import React, { Component } from 'react';
import { View, ActivityIndicator, Text, Button, ScrollView, TouchableOpacity, Image , TextInput, StyleSheet, Platform, Dimensions } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { connect } from 'react-redux';
import { fetchUserBio, fetchScopes, createScope, editScope, removeScope, uploadProfileImage, logUserOut } from '../../actions';
import ScopeList from './ScopeList';
import ScopeSubmition from './ScopeSubmition';
import Icon from 'react-native-vector-icons/FontAwesome';

class UserScreen extends Component {
  state = {
    photoURL: '',
    fullName: '',
    selectedImage: '',
    showScopeSubmisionForm: false,
    isInitialising: true,
    isLoadinMore: false,
    error: '',
  }

  componentDidMount() {
    Promise.all([this.props.fetchUserBio(firebase.auth().currentUser), this.props.fetchScopes()])
      .then((data) => {
        this.setState({ isInitialising: false });
      })
      .catch((error) => {
        this.setState({ isInitialising: false, error: 'Something unexpected happened, pull to refresh' });
      });
  }

  launchProfileImagePicker = () => {
    const options = {
      title: 'Select a profile image',
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        // can verify file size here as well.
        this.setState({
          selectedImage: response.uri, // preview image
        });
        this.props.uploadProfileImage(response.uri, response.fileName);
      }
    });
  }

  editScope = (scope) => {
    this.props.navigator.push({ screen: 'EditScope', title: 'Edit Scope',
      passProps: {
        requestToEditScope: true,
        scope: {...scope},
        editScope: this.props.editScope
      }
    });
  }

  _onScroll = (e) => {
    const paddingToBottom = 0;
    let a = e.nativeEvent.layoutMeasurement.height + e.nativeEvent.contentOffset.y;
    let b = e.nativeEvent.contentSize.height - paddingToBottom;

    // 0px away from bottom (change paddingToBottom to increase)
    // and optimisation to avoid firing load more scopes request if existing page is not filled with 8 scopes
    if ( a >= b && this.props.scopes.length === 8 && this.state.isLoadinMore === false ) {
      this.setState({ isLoadinMore: true });

      this.props.fetchScopes(() => {
        this.setState({ isLoadinMore: false });
      });
    }
    // problem: if you scroll to the bottom and stay there:
    //    > this function fires on every tab change and on logout

    // solutions:
    //    > after scrolling pull screen's scroll slightly up
    //    > inside fetchScopes action check if user !== null (currently implemented)
  }

  showScopeSubmisionForm = () => {
    this.setState(prevState => ({
      showScopeSubmisionForm: !prevState.showScopeSubmisionForm
    }));
  }

  // reminder: isn't accessing this.props.user.photoURL dangerous if fetch takes long it will throw error???
  // first should verify? this.props.user && this.props.user.photoURL
  // no because when app is loaded all reducers get called and initialised with their default values
  // and our user reducer defaults to {}, so calling photoURL on that is valid because user is defined,
  // however if you tried calling something on photoURL than it would error as photoURL isn't defined
  // so u only error if u try to access properties on an undefined object
  render() {
    if (this.state.isInitialising) return <ActivityIndicator style={{flex: 1,justifyContent: 'center',alignItems: 'center'}} size="small" />;
    if (this.state.error) return <View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}}><Text>{this.state.error}</Text></View>
    let imageAlreadyExistsOrhasBeenSelected = !!this.state.selectedImage || !!this.props.user.photoURL;

    return (
      <View style={styles.containerStyle}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={400}
          onScroll={this._onScroll}
        >

          <View style={styles.bioContainer}>
            <View style={{borderWidth: 2, width: 90, height: 30, right: 15, justifyContent: 'center', borderRadius: 5, borderColor: '#9F59D0', alignItems: 'center',
              position: 'absolute', alignSelf: 'flex-end'
            }}>
              <Text style={{fontWeight: '700', color: '#565656'}}>{this.props.user.viewCount}</Text>
            </View>

            <TouchableOpacity onPress={this.launchProfileImagePicker}>
              <View style={styles.imagePlaceholder}>
                {imageAlreadyExistsOrhasBeenSelected &&
                  <Image source={{ uri: this.state.selectedImage || this.props.user.photoURL }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                }
              </View>
            </TouchableOpacity>

            {!!this.props.user.username && <View style={styles.usernameContainer}><Text style={styles.usernameText}>{this.props.user.username}</Text></View>}
            {!!this.props.user.name && <Text style={styles.nameText}>{this.props.user.name}</Text>}
            {!!this.props.user.description && <Text style={styles.descriptionText}>{this.props.user.description}</Text>}
          </View>

          <View style={[styles.topGutter, { marginTop: 0,flexDirection: 'row', justifyContent: 'space-between',
          borderTopWidth: 1,
          borderBottomWidth: 2,
          borderColor: '#ddd',
          padding: 5,
          paddingTop: 10,
          paddingBottom: 10,
          marginTop: 20,
          }]}>
            <Text>
              <Text style={{fontWeight: '700'}}>
                {this.props.user.followingCount}
              </Text>
              {" Following"}
            </Text>

            <Text>
              <Text style={{fontWeight: '700'}}>
                {this.props.user.followersCount}
              </Text>
              {" Followers"}
            </Text>
          </View>

          <View style={styles.topGutter}>
            <View style={[styles.addButtonContainer, this.state.showScopeSubmisionForm ? {borderColor: '#0BBDBE'} : {} ]}>
              <TouchableOpacity
                style={[styles.addButton, this.state.showScopeSubmisionForm ? {backgroundColor: '#0BBDBE'} : {} ]}
                onPress={this.showScopeSubmisionForm}
              >
                {this.state.showScopeSubmisionForm ? (
                  <Icon
                    name='plus'
                    type='font-awesome'
                    color='#FBC90B'
                    size={14}
                  />
                ) : (
                  <Icon
                    name='plus'
                    type='font-awesome'
                    color='#fff'
                    size={14}
                  />
                )}
              </TouchableOpacity>
            </View>

            {this.state.showScopeSubmisionForm &&
              <ScopeSubmition createScope={this.props.createScope} />
            }
          </View>

          <View style={[styles.topGutter, {paddingLeft: 15, paddingRight: 15}]}>
            {!!this.props.scopes &&
              <ScopeList scopes={this.props.scopes} removeScope={this.props.removeScope} editScope={this.editScope} />
            }
          </View>
        </ScrollView>
      </View>
    );
  }

  logout() {
    firebase.auth().signOut().then(() => {
      this.props.logUserOut();
    }, (err) => {});
  }

}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 20
  },
  bioContainer: {
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    marginBottom: 10,
  },
  usernameContainer: {
    paddingBottom: 5,
  },
  usernameText: {
    fontWeight: '600',
  },
  nameText: {
    fontWeight: '500',
    paddingBottom: 5,
  },
  topGutter: {
    marginTop: 20,
    paddingLeft: 15,
    paddingRight: 15,

  },
  addButtonContainer: {
    width: 60,
    height: 60,
    borderRadius: 60/2,
    borderWidth: 1,
    borderColor: '#0BBDBE',//'#69D2E7',18C6FE
    alignItems:'center',
    justifyContent:'center',
    alignSelf: 'center',
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 50/2,
    backgroundColor: '#18C6FE',//'#0BBDBE', //#9F59D0',//'#69D2E7', 18C6FE
    alignItems:'center',
    justifyContent:'center',
  }
});

const mapStateToProps = (state) => {
  return {
    user: state.user,
    scopes: state.scopes.list,
  };
};

export default connect(mapStateToProps, { fetchUserBio, fetchScopes, createScope, editScope, removeScope, uploadProfileImage, logUserOut })(UserScreen);
