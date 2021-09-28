import {
  applyMiddleware, combineReducers, compose, createStore,
} from 'redux';
// import { Platform } from 'react-native';
// import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import createSagaMiddleware from 'redux-saga'

import storage from './storage';

/* reducers */
import categories from './reducers/categories';
import tasks from './reducers/tasks';

import mySaga from './sagas';

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const appReducer = combineReducers({
  categories,
  tasks,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

const middleware = [sagaMiddleware];

/* eslint-disable-next-line */
const composeEnhancers = typeof window === 'object' && __DEV__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
  })
  : compose;

const enhancer = composeEnhancers(
  applyMiddleware(...middleware),
  // other store enhancers if any
);

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, enhancer);
export const persistor = persistStore(store);

sagaMiddleware.run(mySaga);