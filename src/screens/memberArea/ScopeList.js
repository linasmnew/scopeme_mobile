import React, { Component } from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import SingleScope from './SingleScope';

class ScopeList extends Component {
  renderScopes() {
    return this.props.scopes.map((scope) => {
      return <SingleScope
        key={scope.id}
        scope={scope}
        onPressRemove={this.props.removeScope}
        onPressEdit={this.props.editScope}
      />
    }
   );
  }

  render() {
    return (
      <View style={styles.wrapper}>
        {this.renderScopes()}
      </View>
    );
  }
}

const styles = {
  wrapper: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
};

export default ScopeList;
