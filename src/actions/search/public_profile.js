import firebase from 'firebase';
import { UDPATE_SEARCH_INPUT, FETCH_PUBLIC_SCOPES, FETCH_PUBLIC_SCOPES_LOAD_MORE } from '../types';
import { CLOUD_FUNCTION_ENDPOINT } from '../../config';

/*
  updating search input needs to be done through redux
  since custom top bars in react-native-navigation by wix
  only accept serializable data
*/
export const updateSearchQuery = (text) => {
  return {
    type: UDPATE_SEARCH_INPUT,
    payload: text
  };
}


export const publicProfileView = (found_users_uid) => {
  const targetUid = { targetUid: found_users_uid };

  return firebase.auth().currentUser.getIdToken(true).then((idToken) => {
    fetch(CLOUD_FUNCTION_ENDPOINT+'/social/profile_view', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + idToken,
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(targetUid)
      }).then((res) => {
      })
      .catch((error) => {
      });
    })
    .catch((error) => {
    });
}


const decodeUsername = (text) => {
  if (text) {
    return text.replace(/\%2E/g, '.');
  }
}


export const fetch_public_users_bio = (found_users_id) => {
  return firebase.database().ref(`users/${found_users_id}/bio`)
    .once('value')
    .then((snapshot) => {
      const uid = (snapshot.val() && snapshot.val().uid || null);
      let username = (snapshot.val() && snapshot.val().username || null);
      username = decodeUsername(username);
      const description = (snapshot.val() && snapshot.val().description || null);
      const photoURL = (snapshot.val() && snapshot.val().photoURL || null);
      const name = snapshot.val() && snapshot.val().name || null;
      const viewCount = snapshot.val() && snapshot.val().viewCount || 0;
      const followersCount = snapshot.val() && snapshot.val().followersCount || 0;
      const followingCount = snapshot.val() && snapshot.val().followingCount || 0;

      return { uid, photoURL, username, name, description, viewCount, followersCount, followingCount };
    })
    .catch((err) => {
      throw new Error('Error fetching public bio')
    });
};

export const fetch_is_following = (found_users_id) => {
  const currentUser = firebase.auth().currentUser.uid;
  return firebase.database().ref('users/'+currentUser+'/social/following/'+found_users_id)
    .once('value')
    .then((snapshot) => {
      if (snapshot.val() !== null) {
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => {
      throw new Error('Error fetching public bio')
    });
};


let referenceToOldestKey = '';

export const scopeRefenceKeyUpdater = (lastFetchedScopeReference) => {
  referenceToOldestKey = lastFetchedScopeReference;
}

export const fetchPublicScopes = (activity, found_users_id) => {
  let user = firebase.auth().currentUser;
  if (!user) return { type: 'logout' };

  if (activity === 'initial' || activity === 'refresh') {
    return firebase.database().ref('users/'+found_users_id+'/scopes')
      .orderByKey()
      .limitToLast(8)
      .once('value')
      .then((snapshot) => {
        let scopeKeys = [];
        snapshot.forEach((snap) => {
          scopeKeys.push(snap.key);
        });
        scopeKeys = scopeKeys.reverse();

        return Promise.all(scopeKeys.map((scopeKey) => {
          return firebase.database().ref('scopes/'+scopeKey).once('value').then((snapshot) => {
            return snapshot.val();
          });
        }));
      })
      .then((scopes) => {
        scopeRefenceKeyUpdater(scopes[scopes.length-1].id);
        return scopes;
      })
      .catch((error) => {
        throw new Error('Error fetching scopes');
      });

  } else if (activity === 'load_more' ) {

    return firebase.database().ref('users/'+found_users_id+'/scopes')
      .orderByKey()
      .endAt(referenceToOldestKey)
      .limitToLast(9) // fetching 9 because last one will be duplicate of previous fetch - we're removing it inside helper
      .once('value')
      .then((snapshot) => {
        let scopeKeys = [];
        snapshot.forEach((snap) => {
          scopeKeys.push(snap.key);
        });
        scopeKeys = scopeKeys.reverse().slice(1);

        return Promise.all(scopeKeys.map((scopeKey) => {
          return firebase.database().ref('scopes/'+scopeKey).once('value').then((snapshot) => {
            return snapshot.val();
          });
        }));
      })
      .then((scopes) => {
        scopeRefenceKeyUpdater(scopes[scopes.length-1].id);
        return scopes;
      })
      .catch((error) => {
        throw new Error('Error fetching more scopes');
      });

  }
}
