import React, { Component } from 'react';
import { View } from 'react-native';
import SearchResultItem from './SearchResultItem';

class SearchResultsList extends Component {
  renderSearchResult() {
      return Object.keys(this.props.results).map((key) =>
        <SearchResultItem
          key={key}
          result={this.props.results[key]}
          goToResultProfile={this.props.goToResultProfile}
        />
      );
  }

  render() {
    return (
      <View style={styles.wrapper}>
        {this.renderSearchResult()}
      </View>
    );
  }
}

const styles = {
  wrapper: {
    flex: 1,
  },
};

export default SearchResultsList;
