import { UDPATE_SEARCH_INPUT} from '../actions/types';

export default function(state = '', action) {
  switch (action.type) {
    case UDPATE_SEARCH_INPUT:
      return action.payload;
    default:
      return state;
  }
};
