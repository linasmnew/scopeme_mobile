import firebase from 'firebase';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import store from './store';
import { registerScreens } from './screens';
import { iconsMap, iconsLoaded } from './utils/AppIcons';
import { credentials } from './config';
// registers all screens of your application that should be able to be navigated to
// i.e. Navigation.registerComponent('screenName', () => ComponentName);
registerScreens(store, Provider);

class App extends Component {
  constructor(props) {
    super(props);
    firebase.initializeApp(credentials);
    iconsLoaded.then(() => {
      this.startApp();
    });
  }

  // now we can actually setup our app
  // i.e. Navigation.startTabBasedApp or Navigation.startSingleScreenApp, etc.
  startApp() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {

        Navigation.startTabBasedApp({
          tabs: [
            {
              screen: 'UserScreen',
              title: 'Scopeme',
              icon: iconsMap['home'],
              iconInsets: { // add this to change icon position (optional, iOS only).
                top: 6, // optional, default is 0.
                left: 0, // optional, default is 0.
                bottom: -6, // optional, default is 0.
                right: 0 // optional, default is 0.
              },
              // navigatorStyle: {
              //   screenBackgroundColor: '#F7F5F5'
              // }
            },
            {
              screen: 'SearchPage',
              title: 'Search',
              icon: iconsMap['search'],
              iconInsets: { // add this to change icon position (optional, iOS only).
                top: 6, // optional, default is 0.
                left: 0, // optional, default is 0.
                bottom: -6, // optional, default is 0.
                right: 0 // optional, default is 0.
              },
              // navigatorStyle: {
              //   screenBackgroundColor: '#F7F5F5'
              // }
            },
            {
              screen: 'NotificationPage',
              title: 'Notifications',
              icon: iconsMap['notifications'],
              iconInsets: { // add this to change icon position (optional, iOS only).
                top: 6, // optional, default is 0.
                left: 0, // optional, default is 0.
                bottom: -6, // optional, default is 0.
                right: 0 // optional, default is 0.
              },
              // navigatorStyle: {
              //   screenBackgroundColor: '#F7F5F5'
              // }
            },
            {
              screen: 'ProfileSettingsPage',
              title: 'Profile',
              icon: iconsMap['settings'],
              iconInsets: { // add this to change icon position (optional, iOS only).
                top: 6, // optional, default is 0.
                left: 0, // optional, default is 0.
                bottom: -6, // optional, default is 0.
                right: 0 // optional, default is 0.
              },
              // navigatorStyle: {
              //   screenBackgroundColor: '#F7F5F5'
              // }
            }
          ]
        });

      } else {

        Navigation.startSingleScreenApp({
          screen: {
            screen: 'AuthScreen',
            title: '',
            navigatorStyle: {
              drawUnderNavBar: true,
              navBarTransparent: true,
              navBarTranslucent: true,
              navBarButtonColor: '#fff'
            }
          },
        });

      }

    });

  }

}

export default App;
