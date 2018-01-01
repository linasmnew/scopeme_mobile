import firebase from 'firebase';
import React, { Component } from 'react';
import { View, ScrollView, Text, TextInput, Image, StyleSheet, Platform, Dimensions } from 'react-native';
import SearchResultsList from './SearchResultsList';
import { connect } from 'react-redux';
import CustomTopBar from './CustomTopBar';

class SearchPage extends Component {
  state = {
    searchResults: {},
  }

  componentDidMount() {
    this.props.navigator.setStyle({
      navBarCustomView: 'CustomTopBar',
      navBarComponentAlignment: 'center',
      navBarCustomViewInitialProps: {title: 'Hi Custom'},
      navBarComponentAlignment: 'fill'
    });
  }

  decodeUsername(text) {
    if (text) return text.replace(/\%2E/g, '.');
  }

  encodeUsername(text) {
    if (text) return text.replace(/\./g, '%2E');
  }

  componentWillReceiveProps(nextProps) {
    // only execute username lookup if search input changed
    if (nextProps.search_query !== this.props.search_query) {
      this.onSearchEntry(nextProps.search_query);
    }
  }

  shouldComponentUpdate(undefined, nextState) {
    // only re-render if new results were found with user input
    // cheap comparison because it's shallow, since state is immutable
    if (this.state.searchResults !== nextState.searchResults) return true;
    return false;
  }

  onSearchEntry = (searchEntry) => {
    let user = firebase.auth().currentUser;
    searchEntry = searchEntry.toLowerCase();

    if (searchEntry !== '') {

      firebase.database().ref('usernames/'+this.encodeUsername(searchEntry)) // encoding
        .once('value')
        .then((username) => { // username.val() contains user_id associated with the username
          if (username.val() !== null) {
            firebase.database().ref('/users/'+username.val()+'/bio/')
              .once('value')
              .then((snapshot) => {

                this.setState(prevState => ({
                  searchResults: {
                    [username.val()]: {
                      u_id: username.val(),
                      username: this.decodeUsername(snapshot.val().username), // decoding
                      name: snapshot.val().name,
                      photoURL: snapshot.val().photoURL,
                    },
                    ...prevState.searchResults
                  }
                }));

              })
              .catch((error) => {
              });
          }
        })
        .catch((error) => {
        })

    } else {
      this.setState({
        searchResults: {}
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <SearchResultsList results={this.state.searchResults} goToResultProfile={this.goToResultProfile}  />
        </ScrollView>
      </View>
    );
  }

  goToResultProfile = (u_id, photoURL) => () => {
    this.props.navigator.push({ screen: 'PublicProfilePage',
      backButtonTitle: '',
      title: 'Scopeme',
      passProps: { found_users_id: u_id, photoURL: photoURL }
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
  },
  contentContainer: {
    paddingVertical: 20
  },
});

const mapStateToProps = (state) => {
  return {
    search_query: state.searchInput,
  };
};

export default connect(mapStateToProps)(SearchPage);
