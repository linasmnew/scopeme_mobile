import firebase from 'firebase';
import { LoginManager, LoginButton, AccessToken, ShareApi } from 'react-native-fbsdk';
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import ColourCode from './ColourCode';
import { backgroundColorOptions, fontColorOptions } from './scopeColorOptions';
import { isValidName, isValidURL, isValidHexCode } from './validation';
import CheckBox from './CheckBox';

class ScopeSubmition extends Component {
  state = {
    name: '',
    url: '',
    backgroundColor: '#ccc',
    fontColor: '#000',
    showColorOption: false,
    error: '',
    success: '',
    isLoading: false,
    isFbShareChecked: false,
  }

  onPressBackgroundColor = (color) => {
    this.setState({ backgroundColor: color });
  }

  onPressFontColor = (color) => {
    this.setState({ fontColor: color });
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
              <Text style={{fontWeight: '600', fontSize: 20, marginBottom: 2.5, paddingRight: 10, color: '#0DDCDC'}}>+</Text>
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

      <CheckBox label="Share on Facebook" onCheck={this.handleShareOnFacebook} isChecked={this.state.isFbShareChecked} />

      <Button
        buttonStyle={styles.saveButton}
        title="Save"
        onPress={this.onSubmitScope}
        fontWeight='700'
        color='#fff'
      />

      {!!this.state.isLoading && <ActivityIndicator style={styles.loadingIndicator} size="small" />}
      {!!this.state.error && <Text style={styles.errorText}>{this.state.error}</Text>}
      {!!this.state.success && <Text style={styles.successText}>{this.state.success}</Text>}
    </View>
   );
  }


  getShareLinkContent = () => {
    return {
      contentType: 'link',
      contentUrl: this.state.url,
      contentDescription: 'I just added a new scope: ' + this.state.name,
    };
  }

  publishShareLink = (shareLinkContent) => { // put this inside Promise.All with scope submission?
      return ShareApi.canShare(shareLinkContent).then((canShare) => {
        if (canShare) {
          return ShareApi.share(shareLinkContent, '/me', 'I just added a new scope: '+this.state.name);
        }
      }).then((result) => {
        return true;
      }).catch((error) => {
        return false;
      });
  }


  handleShareOnFacebook = () => {
    // TODO check if there's a token expiration code
    AccessToken.getCurrentAccessToken()
      .then((data) => { // if no token, or token but no publish permissions
        if (!data || (data && !data.permissions.includes("publish_actions"))) {
          this.logInWithPublishPermissions()
            .then((data) => {
              if (data === "success") {
                this.setState({ isFbShareChecked: true }); return;
              } else {
                this.setState({ isFbShareChecked: false }); return;
              }
            })
        }
        this.setState({ isFbShareChecked: !this.state.isFbShareChecked });
      },
      (error) => alert(error.message));
  }

  logInWithPublishPermissions = () => {
     return LoginManager.logInWithPublishPermissions(["publish_actions"])
       .then((result) => {
         if (result.isCancelled) return;
         return "success";
       },
       (error) => alert(error.message));
   }

  onSubmitScope = () => {
    if (isValidName(this.state.name)) {
      if (isValidURL(this.state.url)) {
        if (isValidHexCode(this.state.backgroundColor)) {
          if (isValidHexCode(this.state.fontColor)) {

            const scopeData = {
              uid: firebase.auth().currentUser.uid,
              name: this.state.name,
              url: this.state.url,
              backgroundColor: this.state.backgroundColor,
              fontColor: this.state.fontColor,
            };

            this.setState({ isLoading: true }, () => {
              this.props.createScope(scopeData, (error) => {
                if (!error) {
                  if (this.state.isFbShareChecked) {
                    this.publishShareLink(this.getShareLinkContent())
                      .then((status) => {
                        this.setState({ error, isLoading: false, isFbShareChecked: false });
                      });
                  } else {
                    this.setState({ error, isLoading: false, isFbShareChecked: false });
                  }
                } else {
                  this.setState({ error, isLoading: false, isFbShareChecked: false });
                }
              })
            });

          } else { this.setState({ error: 'Invalid font color hex code', success: '' }) }
        } else { this.setState({ error: 'Invalid background color hex code', success: '' }) }
      } else { this.setState({ error: 'Invalid URL', success: '' }) }
    } else { this.setState({ error: 'Name should be between 1 and 32 characters long', success: '' }) }
  }

} // end of class


const styles = {
  container: {
    flex: 1,
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
  saveButton: {
    marginLeft: -15,
    marginRight: -15,
    backgroundColor: '#9F59D0', //'#D7618E',//'#20E8AC', //BF48B5 //FF4C6A //4F4545
    borderRadius: 25,
    marginTop: 10
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


export default ScopeSubmition;
