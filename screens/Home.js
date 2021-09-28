import React from 'react';
import { useLinkTo } from '@react-navigation/native';
import { Platform, View } from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Divider,
  List,
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import FilterList from '../components/FilterList';
import DraggableList from '../components/Draggable';
import DropDown from '../components/DropDown';

function Home() {
  const {
    categories,
    tasks,
  } = useSelector((state) => ({
    categories: state.categories,
    tasks: state.tasks,
  }));
  const linkTo = useLinkTo();

  const [showDropDownStatus, setShowDropDownStatus] = React.useState(false);
  const [showDropDownCategory, setShowDropDownCategory] = React.useState(false);

  const [category, setCategory] = React.useState('');
  const [status, setStatus] = React.useState('');

  const [searchQuery, setSearchQuery] = React.useState('');

  const _getList = () => {
    let items = tasks.data;
    if (searchQuery !== '') {
      items = items.filter((item) => {
        return item.name.toUpperCase().indexOf(searchQuery.toUpperCase()) > -1;
      });
    }
    if (status !== '') {
      if (status === 'done') {
        items = items.filter((item) => {
          return item.isDone;
        });
      } else {
        items = items.filter((item) => {
          return !item.isDone;
        });
      }
    }
    if (category !== '') {
      items = items.filter((item) => {
        return item.category === category;
      });
    }
    return items;
  }

  return (
    <>
      <Appbar.Header dark>
        <Appbar.Content title="To Do" />
        <Appbar.Action icon="plus" onPress={() => linkTo('/form')} />
      </Appbar.Header>
      {tasks.loading || categories.loading ? (
        <View
          style={{
            height: Platform.OS === 'web' ? '100vh' : '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          <List.Accordion
            title="Filter"
            style={{ backgroundColor: '#FFF' }}
            left={props => <List.Icon {...props} icon="filter" />}>
            <View style={{ width: '100%', marginLeft: -36 }}>
              <FilterList
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </View>
            <View style={{ width: '100%', marginLeft: -36, marginTop: 10 }}>
              <DropDown
                label="Status"
                searchable={false}
                mode="outlined"
                value={status}
                setValue={setStatus}
                list={[
                  {
                    value: '',
                    label: 'All',
                  },
                  {
                    value: 'done',
                    label: 'Done'
                  },
                  {
                    value: 'todo',
                    label: 'To Do'
                  },
                ]}
                visible={showDropDownStatus}
                showDropDown={() => setShowDropDownStatus(true)}
                onDismiss={() => setShowDropDownStatus(false)}
              />
            </View>
            <View style={{ width: '100%', marginLeft: -36, marginTop: 10, marginBottom: 20 }}>
              <DropDown
                label="Category"
                searchable={false}
                mode="outlined"
                value={category}
                setValue={setCategory}
                list={[
                  {
                    value: '',
                    label: 'All',
                  },
                  ...categories.data.map((c) => ({
                    value: c.id,
                    label: c.label,
                  })),
                ]}
                visible={showDropDownCategory}
                showDropDown={() => setShowDropDownCategory(true)}
                onDismiss={() => setShowDropDownCategory(false)}
              />
            </View>
          </List.Accordion>
          <Divider />
          <DraggableList
            items={_getList()}
            onClick={(itemId) => linkTo(`/form/${itemId}`)}
            key={`${searchQuery}-${status}-${category}-${tasks.timestamp}`}
          />
        </>
      )}

    </>
  );
}

export default Home;