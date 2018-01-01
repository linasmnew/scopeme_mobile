import { FETCH_FEED, REMOVE_SCOPE } from '../actions/types';

export default function(state = [], action) {
  switch (action.type) {
    case FETCH_FEED:
      return [ ...state, ...action.payload ];

    case REMOVE_SCOPE:
      const filtered = state.filter((scope) => scope.data.id !== action.payload);
      return [ ...filtered ];

    default:
      return state;
  }
};
