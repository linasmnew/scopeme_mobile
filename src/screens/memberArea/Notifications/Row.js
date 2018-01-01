import moment from 'moment';
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

function handleDate(timestamp) {
  // let currentTimestamp = new Date().getTime();
  // let receivedTimestamp = timestamp;
  // let diff = currentTimestamp - receivedTimestamp;
  return moment(new Date(timestamp)).fromNow();
}

class Row extends Component {
  invokeCallback = () => {
    this.props.goToProfilePage(this.props.data.uid, this.props.photoURL);
  }

  render() {
    return (
      <TouchableOpacity onPress={this.invokeCallback}>
        <View style={styles.container}>
          <View style={styles.body}>
            <View style={styles.imagePlaceholder}>
              {!!this.props.photoURL &&
                <Image source={{ uri: this.props.photoURL }} style={styles.photo} />
              }
            </View>

            <View>
              <Text style={styles.text}>
                <Text style={styles.username}>{this.props.username}</Text>
                <Text> created a new scope</Text>
                <Text style={styles.data}> {this.props.data.name}</Text>
              </Text>
              <Text style={styles.time}>{handleDate(this.props.data.timestamp)}</Text>
            </View>

          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 20,
    flexWrap: 'wrap',
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
    paddingRight: 10
  },
  photo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  text: {
    marginLeft: 12,
  },
  username: {
    fontWeight: '700'
  },
  data: {
    fontWeight: '700'
  },
  time: {
    color: '#aaa',
    marginLeft: 12,
  }
});

export default Row;
