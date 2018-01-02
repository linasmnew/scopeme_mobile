import React, { Component } from 'react';
import { View, Text, ListView, RefreshControl, StyleSheet } from 'react-native';
import { fetchFeed } from '../../../actions';
import { connect } from 'react-redux';
import Row from './Row';
import { FEED_LIMIT } from '../../../actions';

class NotificationPage extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows(this.props.feed),
      refreshing: false,
      isLoadingMore: false,
    };
  }

  componentDidMount() {
    this.props.fetchFeed();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.feed !== this.props.feed) {
      this.setState({ dataSource: this.state.dataSource.cloneWithRows(newProps.feed) });
    }
  }

  goToProfilePage = (u_id, photoURL) => {
    this.props.navigator.push({ screen: 'PublicProfilePage',
      backButtonTitle: '',
      title: 'Scopeme',
      passProps: { found_users_id: u_id, photoURL: photoURL }
    });
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.props.fetchFeed('refresh', () => {
      this.setState({ refreshing: false });
    });
  }

  // gets called on each scroll,
  _onScroll = (e) => {
    // if feed is not full, avoid running inner logic and wastful variable creation
    if (this.state.dataSource.getRowCount() >= FEED_LIMIT) {
      const paddingToBottom = 0;
      const a = e.nativeEvent.layoutMeasurement.height + e.nativeEvent.contentOffset.y;
      const b = e.nativeEvent.contentSize.height - paddingToBottom;

      // checking if 0px away from bottom (change paddingToBottom to increase)
      // and checking if nothing else is currently fetching
      if ( a >= b && this.state.isLoadingMore === false) {
        this.setState({ isLoadingMore: true });
        this.props.fetchFeed('load_more', () => {
          this.setState({ isLoadingMore: false });
        });
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          style={styles.contentContainer}
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={(data) => <Row {...data} goToProfilePage={this.goToProfilePage} />}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          onScroll={this._onScroll}
          pageSize={10}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    feed: state.feed.list
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

export default connect(mapStateToProps, { fetchFeed })(NotificationPage);
