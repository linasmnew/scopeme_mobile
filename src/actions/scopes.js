import firebase from 'firebase';
import { FETCH_SCOPES, CREATE_SCOPE, EDIT_SCOPE, REMOVE_SCOPE } from './types';

export const editScope = (scopeId, data, cb) => {
  let user = firebase.auth().currentUser;
  return (dispatch) => {
    firebase.database().ref('scopes/'+scopeId).update({ ...data })
      .then(() => {
        dispatch({ type: EDIT_SCOPE, id: scopeId, payload: data });
        cb();
      })
      .catch((error) => {
        cb('Something unexpected happened, please try again');
      });
  };
}


export const removeScope = (scopeId) => {
  let user = firebase.auth().currentUser;
  return (dispatch) => {

    const updates = {};
    updates['/scopes/'+scopeId] = null;
    updates['/users/'+user.uid+'/scopes/'+scopeId] = null;
    updates['/users/'+user.uid+'/feed/'+scopeId] = null;

    firebase.database().ref().update(updates)
      .then(() => {
        dispatch({ type: REMOVE_SCOPE, payload: scopeId });
      })
      .catch((error) => {
      });
  };
}



export const createScope = (data, cb) => {
  let user = firebase.auth().currentUser;
  return (dispatch) => {
    let newScopeKey = firebase.database().ref('/scopes/').push().key;
    data = { id: newScopeKey, ...data, timestamp: firebase.database.ServerValue.TIMESTAMP };

    const updates = {};
    updates['/scopes/'+newScopeKey] = data;
    updates['/users/'+user.uid+'/scopes/'+newScopeKey] = true;
    updates['/users/'+user.uid+'/feed/'+newScopeKey] = user.uid;

    firebase.database().ref().update(updates)
      .then(() => {
        dispatch({ type: CREATE_SCOPE, payload: data });
        cb();
      })
      .catch((error) => {
        cb('Something unexpected happen, please try again');
      });
    }
}




export const fetchScopes = (cb) => {
  let user = firebase.auth().currentUser;

  // _onScroll throtting bug
  if (!user) return { type: 'logout' };

    return (dispatch, getState) => {
      const { referenceToOldestKey } = getState().scopes;
      // referenceToOldestKey is initially undefined
      if (!referenceToOldestKey) { // initial fetch
        return firebase.database().ref('users/'+user.uid+'/scopes')
          .orderByKey()
          .limitToLast(8)
          .once('value')
          .then((snapshot) => {
            let scopeKeys = [];
            snapshot.forEach((scopeId) => {
              scopeKeys.push(scopeId.key);
            });
            scopeKeys = scopeKeys.reverse();

            return Promise.all(scopeKeys.map((scopeKey) => {
              return firebase.database().ref('scopes/'+scopeKey).once('value').then((snapshot) => {
                return snapshot.val();
              });
            }));
          })
          .then((scopes) => {
            dispatch({
              type: FETCH_SCOPES,
              payload: scopes,
              referenceToOldestKey: scopes[scopes.length-1].id
            });
            if (cb) cb();
          })
          .catch((error) => {
            if (cb) cb();
          });
      } else { // load more fetch
        return firebase.database().ref('users/'+user.uid+'/scopes')
          .orderByKey()
          .endAt(referenceToOldestKey)
          .limitToLast(9) // fetching 6 because last one will be duplicate of previous fetch - we're removing it inside helper
          .once('value')
          .then((snapshot) => {
            let scopeKeys = [];
            snapshot.forEach((scopeId) => {
              scopeKeys.push(scopeId.key);
            });
            scopeKeys = scopeKeys.reverse().slice(1);

            return Promise.all(scopeKeys.map((scopeKey) => {
              return firebase.database().ref('scopes/'+scopeKey).once('value').then((snapshot) => {
                return snapshot.val();
              });
            }));
          })
          .then((scopes) => {
            dispatch({
              type: FETCH_SCOPES,
              payload: scopes,
              referenceToOldestKey: scopes[scopes.length-1].id
            });
            if (cb) cb();
          })
          .catch((error) => {
            if (cb) cb();
          });
      }
    }
}
