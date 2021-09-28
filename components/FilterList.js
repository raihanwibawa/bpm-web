import React from 'react';
import PropTypes from 'prop-types';
import { Searchbar } from 'react-native-paper';

const FilterList = ({ close, searchQuery, setSearchQuery }) => {

  const onChangeSearch = query => setSearchQuery(query);

  return (
    <Searchbar
      placeholder="Search"
      onChangeText={onChangeSearch}
      value={searchQuery}
      onSubmitEditing={close}
      onIconPress={close}
    />
  );
};

FilterList.propTypes = {
  close: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
};

export default FilterList;