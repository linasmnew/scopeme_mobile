import { FOLLOW_COUNT, FETCH_USER_BIO, UPDATE_USER_BIO, UPLOAD_PROFILE_IMAGE } from '../actions/types';

export default function(state = {}, action) {
  switch (action.type) {
    case UPLOAD_PROFILE_IMAGE:
    case FOLLOW_COUNT:
    case FETCH_USER_BIO:
    case UPDATE_USER_BIO:
      return { ...state, ...action.payload };

    default:
      return state;
  }
};
