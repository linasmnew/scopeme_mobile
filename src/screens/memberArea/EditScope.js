import React, { Component } from 'react';
import { View, Text, TextInput, TouchableHighlight, TouchableOpacity, ActivityIndicator } from 'react-native';
import ScopeSubmition from './ScopeSubmition';
import { connect } from 'react-redux';
import ColourCode from './ColourCode';
import { backgroundColorOptions, fontColorOptions } from './scopeColorOptions';
import { EDIT_SCOPE } from '../../actions/types';
import { isValidName, isValidURL, isValidHexCode } from './validation';

class EditScope extends Component {
  static navigatorButtons = {
    leftButtons: [{
      title: 'Cancel',
      id: 'cancel',
    }],
    rightButtons: [{
        title: 'Save',
        id: 'save',
      }],
  }

  state = {
    name: this.props.scope.name,
    url: this.props.scope.url,
    backgroundColor: this.props.scope.backgroundColor || '#ccc',
    fontColor: this.props.scope.fontColor || '#000',
    showColorOption: false,
    error: '',
    success: '',
    isLoading: false,
  }

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'cancel') {
        this.props.navigator.pop();
      }
      if (event.id == 'save') {

        if (isValidName(this.state.name)) {
          if (isValidURL(this.state.url)) {
            if (isValidHexCode(this.state.backgroundColor)) {
              if (isValidHexCode(this.state.fontColor)) {

                const scopeData = {
                  url: this.state.url,
                  name: this.state.name,
                  backgroundColor: this.state.backgroundColor,
                  fontColor: this.state.fontColor,
                };

                this.setState({ isLoading: true }, () => {
                  this.props.editScope(this.props.scope.id, scopeData, (error) => {
                    this.setState({ error, success: 'updated!', isLoading: false });
                  });
                });

              } else { this.setState({ error: 'Invalid font color hex code', success: '' }) }
            } else { this.setState({ error: 'Invalid background color hex code', success: '' }) }
          } else { this.setState({ error: 'Invalid URL', success: '' }) }
        } else { this.setState({ error: 'Name should be between 1 and 32 characters long', success: '' }) }

      }
    }
  }

  onPressBackgroundColor = (color) => {
    this.setState({ backgroundColor: color });
    if (this.props.updateScopeEdit) this.props.updateScopeEdit('backgroundColor', color);
  }

  onPressFontColor = (color) => {
    this.setState({ fontColor: color });
    if (this.props.updateScopeEdit) this.props.updateScopeEdit('fontColor', color);
  }

  renderBackgroundColors() {
    return Object.keys(backgroundColorOptions).map((key, index) => {
      return <ColourCode color={backgroundColorOptions[key]} key={index} flagColor={this.onPressBackgroundColor} />;
    });
  }

  renderTextColors() {
    return Object.keys(fontColorOptions).map((key, index) => {
      return <ColourCode color={fontColorOptions[key]} key={index} flagColor={this.onPressFontColor} />;
    });
  }

  toggleColorOptions = () => {
    this.setState({ showColorOption: !this.state.showColorOption });
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.labelText}>Name</Text>
          <TextInput
            style={styles.inputStyle}
            autoCorrect={false}
            placeholder="Site name"
            value={this.state.name}
            onChangeText={name => this.setState({ name })}
          />
        </View>

        <View>
          <Text style={styles.labelText}>Url</Text>
          <TextInput
            style={styles.inputStyle}
            autoCorrect={false}
            placeholder="Site url"
            value={this.state.url}
            onChangeText={url => this.setState({ url })}
          />
        </View>

        <TouchableOpacity onPress={this.toggleColorOptions}>
          <View style={styles.chooseColorButtonContainer}>
            <Text style={{fontWeight: '600', fontSize: 20, marginBottom: 2.5, paddingRight: 10}}>+</Text>
            <Text>Customise with color</Text>
          </View>
        </TouchableOpacity>

        {this.state.showColorOption &&
          <View style={styles.coloursOverallWrapper}>
            <Text style={[styles.labelText, { paddingTop: 5 }]}>Pick a background color</Text>

            <View style={styles.coloursContainer}>
              {this.renderBackgroundColors()}

              <TextInput
                style={[styles.inputStyle, { flex: 1, paddingBottom: 0, borderBottomWidth: 2, borderColor: this.state.backgroundColor, marginBottom: 1 }]}
                autoCorrect={false}
                placeholder="# color code"
                value={this.state.backgroundColor}
                onChangeText={backgroundColor => this.setState({ backgroundColor }) }
              />
            </View>
        </View>
      }

      {this.state.showColorOption &&
        <View style={styles.coloursOverallWrapper}>
          <Text style={[styles.labelText, { paddingTop: 5 }]}>Pick a text color</Text>

          <View style={styles.coloursContainer}>
            {this.renderTextColors()}
            <TextInput
              style={[styles.inputStyle, { flex: 1, paddingBottom: 0, borderBottomWidth: 2, borderColor: this.state.fontColor, marginBottom: 1 }]}
              autoCorrect={false}
              placeholder="# color code"
              value={this.state.fontColor}
              onChangeText={fontColor => this.setState({ fontColor })}
            />
          </View>
      </View>
    }

    {!!this.state.isLoading && <ActivityIndicator style={styles.loadingIndicator} size="small" />}
    {!!this.state.success && <Text style={styles.successText}>{this.state.success}</Text>}
    {!!this.state.error && <Text style={styles.errorText}>{this.state.error}</Text>}
  </View>
    );
  }
}


const styles = {
  container: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 20,
  },
  inputStyle: {
    paddingTop: 5,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#d1d4d6',
    fontWeight: '500',
    fontSize: 14,
    marginBottom: 10
  },
  labelText: {
    color: '#737577',
  },
  chooseColorButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  coloursOverallWrapper: {
    paddingBottom: 10,
  },
  coloursContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 5,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  errorText: {
    marginTop: 20,
  },
  successText: {
    marginTop: 20,
    color: '#8ae512'
  },
};

export default EditScope;
