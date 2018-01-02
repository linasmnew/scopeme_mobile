import { FETCH_FEED, FETCH_MORE_FEED, REMOVE_SCOPE } from '../actions/types';

export default function(state = { list: [], referenceToOldestKey: '', referenceToNewestKey: '' }, action) {
  switch (action.type) {
    case FETCH_FEED:
      return {
        list: [ ...action.payload, ...state.list ],
        referenceToOldestKey: action.referenceToOldestKey ? action.referenceToOldestKey : state.referenceToOldestKey,
        referenceToNewestKey: action.referenceToNewestKey ? action.referenceToNewestKey : state.referenceToNewestKey
      };

    case FETCH_MORE_FEED:
      return {
        list: [ ...state.list, ...action.payload ],
        referenceToOldestKey: action.referenceToOldestKey ? action.referenceToOldestKey : state.referenceToOldestKey,
        referenceToNewestKey: action.referenceToNewestKey ? action.referenceToNewestKey : state.referenceToNewestKey
      };

    case REMOVE_SCOPE:
      const filtered = state.list.filter((scope) => scope.id !== action.payload);
      return {
        list: [ ...filtered ],
        referenceToOldestKey: filtered.length > 0 ? filtered[filtered.length-1][0].id : '',
        referenceToNewestKey: filtered.length > 0 ? filtered[0][0].id : '',
      };

    default:
      return state;
  }
};
