import { Navigation } from 'react-native-navigation';
import AuthScreen from './auth/AuthScreen';
import ForgotPassword from './auth/ForgotPassword';
import UserScreen from './memberArea/UserScreen';
import EditScope from './memberArea/EditScope';
import ProfileSettingsPage from './memberArea/updateProfile/ProfileSettingsPage';
import UpdateBio from './memberArea/updateProfile/UpdateBio';
import UpdateEmail from './memberArea/updateProfile/UpdateEmail';
import UpdatePassword from './memberArea/updateProfile/UpdatePassword';
import LinkAccountPage from './memberArea/updateProfile/LinkAccountPage';
import SearchPage from './memberArea/search/SearchPage';
import PublicProfilePage from './memberArea/search/PublicProfilePage';
import CustomTopBar from './memberArea/search/CustomTopBar';

import NotificationPage from './memberArea/Notifications/NotificationPage';

// register all screens that should be navigatable to
export function registerScreens(store, Provider) {
  Navigation.registerComponent('AuthScreen', () => AuthScreen, store, Provider);
  Navigation.registerComponent('ForgotPassword', () => ForgotPassword);
  Navigation.registerComponent('UserScreen', () => UserScreen, store, Provider);
  Navigation.registerComponent('ProfileSettingsPage', () => ProfileSettingsPage, store, Provider);
  Navigation.registerComponent('UpdateBio', () => UpdateBio);
  Navigation.registerComponent('UpdateEmail', () => UpdateEmail);
  Navigation.registerComponent('UpdatePassword', () => UpdatePassword);
  Navigation.registerComponent('LinkAccountPage', () => LinkAccountPage);
  Navigation.registerComponent('SearchPage', () => SearchPage, store, Provider);
  Navigation.registerComponent('PublicProfilePage', () => PublicProfilePage, store, Provider);
  Navigation.registerComponent('EditScope', () => EditScope, store, Provider);
  Navigation.registerComponent('CustomTopBar', () => CustomTopBar, store, Provider);
  Navigation.registerComponent('NotificationPage', () => NotificationPage, store, Provider);
}
