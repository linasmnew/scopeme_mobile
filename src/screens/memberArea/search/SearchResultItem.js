import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

class SearchResultItem extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.goToResultProfile(this.props.result.u_id, this.props.result.photoURL)}>
        <View style={styles.searchResultContainer}>
          <View style={styles.imagePlaceholder}>
            {!!this.props.result.photoURL &&
              <Image source={{ uri: this.props.result.photoURL }} style={{ width: 32, height: 32, borderRadius: 16 }} />
            }
          </View>

          <View style={{ paddingLeft: 10}}>
            <Text style={styles.usernameText}>{this.props.result.username}</Text>
            {!!this.props.result.name && <Text style={styles.nameText}>{this.props.result.name}</Text>}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  searchResultContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  imagePlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ccc',
    paddingRight: 10
  },
  usernameText: {
    fontWeight: '600',
  },
  nameText: {
    fontWeight: '400',
  },
});

export default SearchResultItem;
