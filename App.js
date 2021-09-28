import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import Home from './screens/Home';
import Form from './screens/Form';
import { CATEGORIES_FETCH_REQUESTED, TASKS_FETCH_REQUESTED } from './store/actionTypes';

const Stack = createNativeStackNavigator();

const config = {
  screens: {
    '/': '/',
    '/form/:id?': 'form/:id?',
  },
};

const linking = {
  prefixes: [],
  config,
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    accent: 'yellow',
  },
};

function Entry() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch({ type: TASKS_FETCH_REQUESTED });
    dispatch({ type: CATEGORIES_FETCH_REQUESTED });
  }, []);

  return (
    <NavigationContainer linking={linking} styl>
      <Stack.Navigator
        screenOptions={{
          headerTitle: 'My App',
          contentStyle: {
            overflow: 'hidden',
            backgroundColor: '#FFF',
            boxShadow: '0px 1px 5px #000',
          }
        }}
      >
        <Stack.Screen name="/" path="/" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="/form/:id?" path="form/:id?" component={Form} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={theme} dark>
          <Entry />
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
