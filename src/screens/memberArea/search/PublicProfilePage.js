import firebase from 'firebase';
import React, { Component } from 'react';
import { View, Text, ScrollView, RefreshControl, Image, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import ScopeList from './ScopeList';
import { SCOPE_LIMIT, scopeRefenceKeyUpdater, publicProfileView, fetch_public_users_bio, fetchPublicScopes, fetch_is_following, followUser } from '../../../actions';

class PublicProfilePage extends Component {
  state = {
    publicBio: {},
    publicScopes: [],
    isFollowing: false,
    refreshing: false,
    isLoadingMore: false,
  }

  componentDidMount() {
    fetch_public_users_bio(this.props.found_users_id)
      .then((data) => {
        this.setState({ publicBio: data });
      })
      .catch((error) => {
      });

    fetch_is_following(this.props.found_users_id)
      .then((data) => {
        this.setState({ isFollowing: data });
      })
      .catch((error) => {
      });

    fetchPublicScopes('initial', this.props.found_users_id)
      .then((data) => {
        this.setState({ publicScopes: data });
      })
      .catch((error) => {
      });

    publicProfileView(this.props.found_users_id);
  }

  componentWillUnmount() {
    scopeRefenceKeyUpdater({ oldest: '', newest: '' }); // resetting scope reference key so it's ready to be used for next user
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });

    fetchPublicScopes('refresh', this.props.found_users_id)
      .then((data) => {
        this.setState((prevState) => {
          let newData = [];
          let flag = false;

          for(var i = 0; i < data.length; i++) {
            for (var j = 0; j < prevState.publicScopes.length; j++) {
              if (data[i].id === prevState.publicScopes[j].id) {
                flag = true;
              }
            }

            if (!flag) newData.push(data[i]);
          }

          return {
            publicScopes: [ ...newData, ...prevState.publicScopes ],
            refreshing: false
          }
        });
      })
      .catch((error) => {
        this.setState({ refreshing: true });
      });
  }

  // gets called on each scroll
  _onScroll = (e) => {
    // if feed is not full, avoid running inner logic and wastful variable creation
    if (this.state.publicScopes.length >= SCOPE_LIMIT) {
      const paddingToBottom = 0;
      const a = e.nativeEvent.layoutMeasurement.height + e.nativeEvent.contentOffset.y;
      const b = e.nativeEvent.contentSize.height - paddingToBottom;

      // 0px away from bottom (change padding to increase)
      // and optimisation to avoid firing load more scopes request if existing page is not filled with 8 scopes
      if ( a >= b  && this.state.isLoadingMore === false) {
        this.setState({ isLoadingMore: true });

        fetchPublicScopes('load_more', this.props.found_users_id)
          .then((data) => {
            this.setState((prevState) => ({
              publicScopes: [ ...prevState.publicScopes, ...data ],
              isLoadingMore: false,
            }));
          })
          .catch((error) => {
            this.setState({ isLoadingMore: false });
          });
      }
    }
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          scrollEventThrottle={400}
          onScroll={this._onScroll}
        >

          <View style={styles.bioContainer}>
            {firebase.auth().currentUser.uid !== this.props.found_users_id &&
              <View style={{borderWidth: 2, width: 90, height: 30, right: 15, justifyContent: 'center', borderRadius: 5, borderColor: '#0084ff', backgroundColor: this.state.isFollowing ? '#0084ff' : '#fff', alignItems: 'center', position: 'absolute', alignSelf: 'flex-end'}}>
                <TouchableOpacity onPress={this.handleFollow}>
                  <Text style={{fontWeight: '700', color: this.state.isFollowing ? '#fff' : '#0084ff'}}>{this.state.isFollowing ? "Following" : "Follow"}</Text>
                </TouchableOpacity>
              </View>
            }

            <View style={styles.imagePlaceholder}>
              {!!this.props.photoURL && <Image source={{ uri: this.props.photoURL }} style={{ width: 100, height: 100, borderRadius: 50 }} />}
            </View>

            {this.state.publicBio.username && <View style={styles.usernameContainer}><Text style={styles.usernameText}>{this.state.publicBio.username}</Text></View>}
            {this.state.publicBio.name && <Text style={styles.nameText}>{this.state.publicBio.name}</Text>}
            {this.state.publicBio.description && <Text style={styles.descriptionText}>{this.state.publicBio.description}</Text>}
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20,
            borderTopWidth:1,
            borderBottomWidth: 2,
            borderColor: '#ddd',
            padding: 5,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 15,
            paddingRight: 15,
         }}>
            <Text>
              <Text style={{fontWeight: '700'}}>
                {this.state.publicBio.followingCount}
              </Text>
              {" Following"}
            </Text>

            <Text>
              <Text style={{fontWeight: '700'}}>
                {this.state.publicBio.viewCount}
              </Text>
              {" Views"}
            </Text>

            <Text>
              <Text style={{fontWeight: '700'}}>
                {this.state.publicBio.followersCount}
              </Text>
              {" Followers"}
            </Text>
          </View>

          <View style={{paddingLeft: 15, paddingRight: 15}}>{!!this.state.publicScopes && <ScopeList scopes={this.state.publicScopes} />}</View>
        </ScrollView>
     </View>
    );
  }

  handleFollow = () => {
    this.props.followUser(this.props.found_users_id);
    this.setState((prevState) => {
      let newCount = this.state.isFollowing ? prevState.publicBio.followersCount -1 : prevState.publicBio.followersCount + 1;

      return {
        publicBio: { ...prevState.publicBio, followersCount: newCount },
        isFollowing: !prevState.isFollowing,
      };
    });
  }
}


const styles = {
  containerStyle: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 20
  },
  bioContainer: {
    alignItems: 'center',
    paddingBottom: 20,
    paddingLeft: 15,
    paddingRight: 15,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    alignSelf: 'center',
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
};

export default connect(null, { followUser })(PublicProfilePage);
