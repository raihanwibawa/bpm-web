import { call, put, takeEvery, all } from 'redux-saga/effects'
import {
  CATEGORIES_FETCH_FAILED,
  CATEGORIES_FETCH_REQUESTED,
  CATEGORIES_FETCH_SUCCEEDED,
  TASKS_FETCH_FAILED,
  TASKS_FETCH_REQUESTED,
  TASKS_FETCH_SUCCEEDED,
} from './actionTypes';
import Api from './api';

// Worker saga will be fired on TASKS_FETCH_REQUESTED actions
function* fetchCategories() {
  try {
    const categories = yield call(Api.fetchCategories);
    if (categories.status !== 200) {
      throw Error();
    }
    const payload = yield categories.data;
    yield put({ type: CATEGORIES_FETCH_SUCCEEDED, payload: payload.data });
  } catch (e) {
    yield put({ type: CATEGORIES_FETCH_FAILED, message: e.message });
  }
}

function* fetchCategoriesSaga() {
  yield takeEvery(CATEGORIES_FETCH_REQUESTED, fetchCategories);
}
// Worker saga will be fired on TASKS_FETCH_REQUESTED actions
function* fetchTasks() {
  try {
    const tasks = yield call(Api.fetchTasks);
    if (tasks.status !== 200) {
      throw Error();
    }
    const payload = yield tasks.data;
    yield put({ type: TASKS_FETCH_SUCCEEDED, payload: payload.data });
  } catch (e) {
    yield put({ type: TASKS_FETCH_FAILED, message: e.message });
  }
}

function* fetchTasksSaga() {
  yield takeEvery(TASKS_FETCH_REQUESTED, fetchTasks);
}

export default function* mySaga() {
  yield all([
    fetchCategoriesSaga(),
    fetchTasksSaga(),
  ])
}