import moment from 'moment';
import firebase from 'firebase';
import { FETCH_FEED } from '../types';

const decodeUsername = (text) => {
  if (text) {
    return text.replace(/\%2E/g, '.');
  }
}

const fetchPhotoUrl = (uid) => {
  return firebase.database().ref('users/'+uid+'/bio/photoURL')
    .once('value')
    .then((snapshot) => {
      // could simply return value without wrapping object
      // but would make it harder to read code?
      return { photoURL: snapshot.val() };
    })
    .catch((error) => {
      throw new Error('error fetching photo url');
    });
}

const fetchUsername = (uid) => {
  return firebase.database().ref('users/'+uid+'/bio/username')
    .once('value')
    .then((snapshot) => {
      // could simply return value without wrapping object
      // but would make it harder to read code?
      return { username: decodeUsername(snapshot.val()) };
    })
    .catch((error) => {
      throw new Error('error fetching username');
    });
}

const fetchGlobalScope = (scopeKey) => {
  return firebase.database().ref('scopes/'+scopeKey)
    .once('value')
    .then((snapshot) => {
      return snapshot.val();
    })
    .catch((error) => {
      throw new Error('error fetching global scope');
    });
}


export const fetchFeed = () => {
  let user = firebase.auth().currentUser.uid;

  return (dispatch) => {
    firebase.database().ref('users/'+user+'/feed')
      .limitToLast(10)
      .once('value')
      .then((snapshot) => {
        // snapshot is: { scopeId1: authorId, scopeId2: authorId, etc }
        let feed = [];
        snapshot.forEach((scope) => {
          feed.push({ id: scope.key, author: scope.val() });
        });
        feed.reverse();

        // for each scope reference grab:
          // its full version from global scopes node
          // and the authors username
        return Promise.all(feed.map((item) => {
          return Promise.all([fetchGlobalScope(item.id), fetchUsername(item.author), fetchPhotoUrl(item.author)]);
        }));
      })
      .then((results) => {
        // results: [ Array(3), Array(3), ... ];
          // position 1 is scope object,
          // position 2 is username object,
          // position 3 is photoUrl object
        const handledResults = results.map((result) => {
          return { data: result[0], ...result[1], ...result[2] };
        });

        dispatch({ type: FETCH_FEED, payload: handledResults });
      })
      .catch((error) => {
        console.log('error grabbing feed');
        console.log(error);
      });
  }
};
