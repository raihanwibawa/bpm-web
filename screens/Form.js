import {
  useNavigation,
  useLinkTo,
  useRoute,
} from '@react-navigation/native';
import React from 'react';
import {
  Platform,
  View,
} from 'react-native';
import {
  Appbar,
  ActivityIndicator,
  Button,
  Dialog,
  Paragraph,
  Portal,
  Text,
  TextInput,
  Switch,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import DropDown from '../components/DropDown';
import { TASK_ADDED, TASK_EDITED, TASK_REMOVED } from '../store/actionTypes';

function Form() {
  const navigation = useNavigation();
  const linkTo = useLinkTo();
  const dispatch = useDispatch();
  const route = useRoute();
  const goBack = () => (navigation.canGoBack() ? navigation.goBack() : navigation.push('/'));

  const {
    categories,
    tasks,
  } = useSelector((state) => ({
    tasks: state.tasks,
    categories: state.categories,
  }));

  const [notFound, setNotFound] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [isDone, setIsDone] = React.useState(false);
  const [showDropDownCategory, setShowDropDownCategory] = React.useState(false);

  const [visible, setVisible] = React.useState(false);

  const onToggleSwitch = () => setIsDone(!isDone);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const onDelete = () => {
    dispatch({ type: TASK_REMOVED, payload: route?.params?.id });
    navigation.navigate('/');
  }

  const onSubmit = () => {
    if (name === '' || description === '' || category === '') {
      alert('Please fill all the fields');
    } else {
      if (route?.params?.id) {
        dispatch({ type: TASK_EDITED, payload: { id: route?.params?.id, name, description, category, isDone, } });
        navigation.navigate('/');
      } else {
        dispatch({ type: TASK_ADDED, payload: { id: `item-${tasks.data.length + 1}`, name, description, category, isDone, } });
        navigation.navigate('/');
      }
    }
  }

  React.useEffect(() => {
    setNotFound(false);
    setMounted(false);
    if (route?.params?.id && tasks.loaded) {
      const task = tasks.data.find((t) => t.id === route?.params?.id);
      if (task) {
        setName(task?.name);
        setDescription(task?.description);
        setCategory(task?.category);
        setIsDone(task?.isDone);
        setNotFound(false);
      } else {
        setName('');
        setDescription('');
        setCategory('');
        setIsDone(false);
        setNotFound(true);
      }
      setMounted(true);
    }
    setMounted(true);
  }, [
    route?.params?.id,
    tasks,
  ]);

  if (!mounted) {
    return (
      <View
        style={{
          height: Platform.OS === 'web' ? '100vh' : '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (notFound) {
    return (
      <View
        style={{
          height: Platform.OS === 'web' ? '100vh' : '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Task not found</Text>
        <Button onPress={() => navigation.navigate('/')} mode="contained" color="tomato" dark>Go to Home screen</Button>
      </View>
    );
  }

  return (
    <>
      <Appbar.Header dark>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content title={route?.params?.id ? 'Edit' : 'Add New'} />
        {route?.params?.id && (<Appbar.Action icon="delete" onPress={showDialog} />)}
        <Appbar.Action icon="check" onPress={onSubmit} />
      </Appbar.Header>
      <View style={{ padding: 20 }}>
        <TextInput
          label="Name"
          value={name}
          onChangeText={(_value) => setName(_value)}
        />
        <View style={{ padding: 10 }} />
        <TextInput
          label="Description"
          value={description}
          onChangeText={(_value) => setDescription(_value)}
          multiline
          numberOfLines={6}
        />
        <View style={{ padding: 10 }} />
        <DropDown
          key={category}
          label="Category"
          searchable={false}
          mode="outlined"
          value={category}
          setValue={setCategory}
          list={categories.data.map((c) => ({
            value: c.id,
            label: c.label,
          }))}
          visible={showDropDownCategory}
          showDropDown={() => setShowDropDownCategory(true)}
          onDismiss={() => setShowDropDownCategory(false)}
        />
        <View style={{ padding: 10 }} />
        {route?.params?.id && (
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Text style={{ marginRight: 20 }}>Mark as Done</Text>
            <Switch value={isDone} onValueChange={onToggleSwitch} color="tomato" />
          </View>
        )}
      </View>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Delete confirmation</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Are you sure?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog} color="gray">No</Button>
            <Button onPress={onDelete}>Yes</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

export default Form;
