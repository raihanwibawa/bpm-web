import { omit } from 'lodash';
import {
  CATEGORIES_FETCH_FAILED,
  CATEGORIES_FETCH_REQUESTED,
  CATEGORIES_FETCH_SUCCEEDED,
} from "../actionTypes";

const initialState = {
  loaded: false,
  loading: false,
  data: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CATEGORIES_FETCH_REQUESTED:
      return {
        ...state,
        loading: true,
      };
    case CATEGORIES_FETCH_SUCCEEDED:
      return {
        ...omit(state, ['error']),
        data: action.payload,
        loaded: true,
        loading: false,
      };
    case CATEGORIES_FETCH_FAILED:
      return {
        ...state,
        error: true,
        loaded: true,
        loading: false,
      };
    default:
      return state;
  }
}
