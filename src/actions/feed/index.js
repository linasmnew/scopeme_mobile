import moment from 'moment';
import firebase from 'firebase';
import { FETCH_FEED, FETCH_MORE_FEED } from '../types';

export const FEED_LIMIT = 10;

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





export const fetchFeed = (activity, cb) => {
  let user = firebase.auth().currentUser.uid;

  return (dispatch, getState) => {
    const { referenceToOldestKey, referenceToNewestKey } = getState().feed;

    if (!referenceToOldestKey && !referenceToNewestKey) { // initial fetch

      firebase.database().ref('users/'+user+'/feed')
        .orderByKey()
        .limitToLast(FEED_LIMIT)
        .once('value')
        .then((snapshot) => {
          // snapshot is: { scopeId1: authorId, scopeId2: authorId, etc }
          let feed = [];
          snapshot.forEach((scope) => {
            feed.push({ id: scope.key, author: scope.val() });
          });
          feed = feed.reverse();

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

          dispatch({
            type: FETCH_FEED,
            payload: handledResults,
            // if got new results then update reference, else keep reference the same
            referenceToOldestKey: handledResults.length > 0 ? handledResults[handledResults.length-1].data.id : referenceToOldestKey,
            referenceToNewestKey: handledResults.length > 0 ? handledResults[0].data.id : referenceToNewestKey
          });
          if (cb) cb();
        })
        .catch((error) => {
          if (cb) cb();
          console.log('error grabbing feed');
          console.log(error);
        });

      } else if (activity === 'refresh') {

        firebase.database().ref('users/'+user+'/feed')
          .orderByKey()
          .startAt(referenceToNewestKey)
          .limitToFirst(FEED_LIMIT+1)
          .once('value')
          .then((snapshot) => {
            let feed = [];
            snapshot.forEach((scope) => {
              feed.push({ id: scope.key, author: scope.val() });
            });
            feed = feed.reverse().slice(1);

            return Promise.all(feed.map((item) => {
              return Promise.all([fetchGlobalScope(item.id), fetchUsername(item.author), fetchPhotoUrl(item.author)]);
            }));
          })
          .then((results) => {
            const handledResults = results.map((result) => {
              return { data: result[0], ...result[1], ...result[2] };
            });

            dispatch({
              type: FETCH_FEED,
              payload: handledResults,
              // if got new results then update reference, else keep reference the same
              referenceToNewestKey: handledResults.length > 0 ? handledResults[0].data.id : referenceToNewestKey
            });
            if (cb) cb();
          })
          .catch((error) => {
            if (cb) cb();
            console.log('error grabbing feed');
            console.log(error);
          });

      } else if (activity === 'load_more' ) {

        firebase.database().ref('users/'+user+'/feed')
          .orderByKey()
          .endAt(referenceToOldestKey)
          .limitToLast(FEED_LIMIT+1)
          .once('value')
          .then((snapshot) => {
            let feed = [];
            snapshot.forEach((scope) => {
              feed.push({ id: scope.key, author: scope.val() });
            });
            feed = feed.reverse().slice(1);

            return Promise.all(feed.map((item) => {
              return Promise.all([fetchGlobalScope(item.id), fetchUsername(item.author), fetchPhotoUrl(item.author)]);
            }));
          })
          .then((results) => {
            const handledResults = results.map((result) => {
              return { data: result[0], ...result[1], ...result[2] };
            });

            dispatch({
              type: FETCH_MORE_FEED,
              payload: handledResults,
              // if got new results then update reference, else keep reference the same
              referenceToOldestKey: handledResults.length > 0 ? handledResults[handledResults.length-1].data.id : referenceToOldestKey,
            });
            if (cb) cb();
          })
          .catch((error) => {
            if (cb) cb();
            console.log('error grabbing feed');
            console.log(error);
          });
      }
    }
};
