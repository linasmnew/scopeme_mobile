import React, { Component } from 'react';
import { View, ListView, Text, StyleSheet } from 'react-native';
import { fetchNotifications, fetchFeed } from '../../../actions';
import { connect } from 'react-redux';
import Row from './Row';

class NotificationPage extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(this.props.feed),
    };
  }
  componentDidMount() {
    //this.props.fetchNotifications();
    this.props.fetchFeed();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.feed !== this.props.feed) {
      this.setState({ dataSource: this.state.dataSource.cloneWithRows(newProps.feed)});
    }
  }

  goToProfilePage = (u_id, photoURL) => {
    this.props.navigator.push({ screen: 'PublicProfilePage',
      backButtonTitle: '',
      title: 'Scopeme',
      passProps: { found_users_id: u_id, photoURL: photoURL }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          style={styles.contentContainer}
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={(data) => <Row {...data} goToProfilePage={this.goToProfilePage} />}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    feed: state.feed
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
});

export default connect(mapStateToProps, { fetchNotifications, fetchFeed })(NotificationPage);
