import firebase from 'firebase';
import { FOLLOW_COUNT } from './types';
import { CLOUD_FUNCTION_ENDPOINT } from '../config';

// Follows user, or if already following, then unfollows the user
export const followUser = (found_users_uid) => {
  const targetUid = { targetUid: found_users_uid };

  return (dispatch) => {
    firebase.auth().currentUser.getIdToken(true).then((idToken) => {
      fetch(CLOUD_FUNCTION_ENDPOINT+'/social/follow', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + idToken,
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(targetUid)
      }).then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            dispatch({ type: FOLLOW_COUNT, payload: { followingCount: data.count } });
          })
        }
      })
      .catch((error) => {
      });
    })
    .catch((error) => {
    });
  }
}
