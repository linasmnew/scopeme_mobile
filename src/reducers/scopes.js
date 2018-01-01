import { FETCH_SCOPES, CREATE_SCOPE, EDIT_SCOPE, REMOVE_SCOPE } from '../actions/types';

export default function(state = { list: [], referenceToOldestKey: '' }, action) {
  switch (action.type) {
    case FETCH_SCOPES:
      return { list: [ ...state.list, ...action.payload ], referenceToOldestKey: action.referenceToOldestKey };

    case CREATE_SCOPE:
      return { ...state, list: [ action.payload, ...state.list ] };

    case EDIT_SCOPE:
      return {
        ...state,
        list: state.list.map((scope) => {
          if (scope.id === action.id) return { ...scope, ...action.payload };
          return scope;
        })
      };

    case REMOVE_SCOPE:
      const filtered = state.list.filter((scope) => scope.id !== action.payload);
      return { ...state, list: [ ...filtered ] };

    default:
      return state;
  }
};
