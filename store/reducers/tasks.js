import { omit } from 'lodash';
import {
  TASKS_FETCH_FAILED,
  TASKS_FETCH_REQUESTED,
  TASKS_FETCH_SUCCEEDED,
  TASK_ADDED,
  TASK_EDITED,
  TASK_REMOVED,
} from "../actionTypes";

const initialState = {
  loaded: false,
  loading: false,
  data: [],
  timestamp: Math.floor(Date.now()),
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case TASKS_FETCH_REQUESTED:
      return {
        ...state,
        loading: true,
      };
    case TASKS_FETCH_SUCCEEDED:
      return {
        ...omit(state, ['error']),
        data: action.payload,
        loaded: true,
        loading: false,
      };
    case TASKS_FETCH_FAILED:
      return {
        ...state,
        error: true,
        loaded: true,
        loading: false,
      };
    case TASK_ADDED:
      return {
        ...state,
        data: [
          action.payload,
          ...state.data
        ],
        timestamp: Math.floor(Date.now()),
      }
    case TASK_EDITED:
      return {
        ...state,
        data: state.data.map((data) => {
          if (data.id === action.payload.id) {
            return action.payload;
          }
          return data;
        }),
        timestamp: Math.floor(Date.now()),
      }
    case TASK_REMOVED:
      return {
        ...state,
        data: state.data.filter((d) => d.id !== action.payload),
        timestamp: Math.floor(Date.now()),
      }
    default:
      return state;
  }
}
