import firebase from 'firebase';
import { FETCH_USER_BIO, UPDATE_USER_BIO, UPLOAD_PROFILE_IMAGE, LOGOUT } from './types';
import { CLOUD_FUNCTION_ENDPOINT } from '../config';

const decodeUsername = (text) => {
  if (text) {
    return text.replace(/\%2E/g, '.');
  }
}

export const uploadProfileImage = (uri, name) => {
  return (dispatch) => {
    let imgBody = new FormData();
    imgBody.append('file', { uri: uri, name: name, type: 'image/jpeg' });

    firebase.auth().currentUser.getIdToken(true).then((idToken) => {
      fetch(CLOUD_FUNCTION_ENDPOINT+'/upload/image', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + idToken,
          'content-type': 'multipart/form-data'
        },
        body: imgBody,
      }).then((res) => {
        res.json()
         .then((data) => {
           firebase.auth().currentUser.updateProfile({
             photoURL: data.publicUrl
           })
           .then(() => {
             dispatch({ type: UPLOAD_PROFILE_IMAGE, payload: { photoURL: data.publicUrl, isUploaded: true } });
           })
           .catch((error) => {
             dispatch({ type: UPLOAD_PROFILE_IMAGE, payload: { isUploaded: false } });
           });
         })
         .catch((error) => {
           console.log('2');
           console.log(error);
         })
      })
      .catch((error) => {
        console.log('fetch failed');
        console.log(error);
        dispatch({ type: UPLOAD_PROFILE_IMAGE, payload: { isUploaded: false } });
      });

    })
    .catch((error) => {
      console.log(error);
      console.log('3');
    });
  };
}


// promise 1
function updateUsername(idToken, username) {
  return fetch(CLOUD_FUNCTION_ENDPOINT+'/createusername/username', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + idToken,
    },
    body: JSON.stringify({ username }),
  });
}

// promise 2
function updateBio(data) {
  if (data.username) delete data.username;
  return firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/bio/').update({ ...data });
}

export const updateUserBio = (data, cb) => (dispatch) => {
  firebase.auth().currentUser.getIdToken(true)
    .then((idToken) => {

        if (!data.username) {
          updateBio(data)
            .then(() => {
              dispatch({ type: UPDATE_USER_BIO, payload: data });
              cb();
            })
            .catch((error) => {
              cb('Something unexpected happened, please try again');
            });

        } else {
          let dataCopy = Object.assign({}, data);

          let updateUsernamePromise = updateUsername(idToken, data.username);
          let updateBioPromise = updateBio(dataCopy);

          Promise.all([updateUsernamePromise, updateBioPromise])
            .then((bioResults) => {
              if (bioResults[0].ok) { // 2xx status codes
                dispatch ({ type: UPDATE_USER_BIO, payload: data });
                cb();
              } else {
                bioResults[0].json().then(data => {
                  // data.errors contains server returned username errors
                  cb('Something unexpected happened, please try again');
                });
              }
            })
            .catch((error) => {
              cb('Something unexpected happened, please try again');
            });
        }
    })
    .catch((error) => { // token decoding errors, network conenction errors
      cb('Something unexpected happened, please try again');
    })
}


export const fetchUserBio = (user) => {
  return (dispatch) => {
    return firebase.database().ref(`users/${user.uid}/bio`)
      .once('value')
      .then((snapshot) => {
        let username = (snapshot.val() && snapshot.val().username || null);
        username = decodeUsername(username);
        const description = (snapshot.val() && snapshot.val().description || null);
        const photoURL = user.photoURL;
        const name = user.displayName || snapshot.val() && snapshot.val().name || null;
        const viewCount = snapshot.val() && snapshot.val().viewCount || 0;
        const followersCount = snapshot.val() && snapshot.val().followersCount || 0;
        const followingCount = snapshot.val() && snapshot.val().followingCount || 0;

        dispatch({ type: FETCH_USER_BIO, payload: { username, name, description, photoURL, viewCount, followersCount, followingCount  } });
      })
      .catch((error) => {
      })
  }
};

export const logUserOut = () => {
  return {
    type: LOGOUT,
  };
};
