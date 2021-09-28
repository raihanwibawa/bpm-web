/* eslint-disable */
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
} from 'react-native';
import {
  Menu,
  TextInput,
  TouchableRipple,
  useTheme,
  List,
} from 'react-native-paper';
import React, {
  forwardRef, useEffect, useState,
} from 'react';

const DropDown = forwardRef(
  (props, ref) => {
    const activeTheme = useTheme();
    const {
      visible,
      onDismiss,
      showDropDown,
      value,
      setValue,
      activeColor,
      mode,
      label,
      placeholder,
      inputProps,
      list,
      dropDownContainerMaxHeight,
      theme,
      disabled,
    } = props;
    const [displayValue, setDisplayValue] = useState(value);
    const [inputLayout, setInputLayout] = useState({
      height: 0,
      width: 0,
      x: 0,
      y: 0,
    });

    const onLayout = (event) => {
      setInputLayout(event.nativeEvent.layout);
    };

    useEffect(() => {
      const _label = list.find((_) => _.value === value)?.label;
      if (_label) {
        setDisplayValue(_label);
      }
    }, [list, value]);

    return (
      <Menu
        visible={visible}
        onDismiss={onDismiss}
        theme={theme}
        anchor={(
          <TouchableRipple
            ref={ref}
            onPress={showDropDown}
            onLayout={onLayout}
            disabled={disabled}
          >
            <View pointerEvents="none">
              <TextInput
                value={displayValue}
                mode={mode}
                label={label}
                placeholder={placeholder}
                pointerEvents="none"
                theme={theme}
                {...inputProps}
              />
            </View>
          </TouchableRipple>
        )}
        style={{
          maxWidth: inputLayout?.width,
          width: inputLayout?.width,
          marginTop: inputLayout?.height,
        }}
      >
        <ScrollView style={{ maxHeight: dropDownContainerMaxHeight || 200 }}>
          {list.map((_item, _index) => (
            <List.Item
              key={_item.value}
              title={_item.custom || _item.label}
              titleStyle={{
                color:
                  value === _item.value
                    ? activeColor || (theme || activeTheme).colors.primary
                    : undefined,
              }}
              description={_item.description}
              onPress={() => {
                setValue(_item.value);
                if (onDismiss) {
                  onDismiss();
                }
              }}
              style={{ width: inputLayout?.width }}
            />
          ))}
        </ScrollView>
      </Menu>
    );
  },
);

DropDown.propTypes = {
  disabled: PropTypes.bool,
  list: PropTypes.arrayOf(PropTypes.any),
}

DropDown.defaultProps = {
  disabled: false,
  list: [],
}

export default DropDown;
