import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Dimensions, View } from 'react-native';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Divider } from "react-native-paper";

// fake data generator
const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle, index, isDone) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  marginTop: index === 0 ? 15 : 0,
  marginBottom: 20,
  marginLeft: 20,
  marginRight: 20,
  // change background colour if dragging
  boxShadow: `0px 1px 5px ${isDragging ? 'black' : '#c7c7c7'}`,
  backgroundColor: isDone ? 'green' : 'white',
  color: isDone ? 'white' : 'black',
  borderRadius: 10,
  position: 'relative',
  textAlign: 'center',
  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: 'white',
  padding: grid,
  width: '100%',
  flex: 1,
});

class DraggableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // items: getItems(10)
      items: props?.items || [],
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items
    });
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    const { onClick } = this.props;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div style={{ overflow: 'scroll' }}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <View
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {this.state.items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style,
                          index,
                          item.isDone,
                        )}
                        onClick={() => onClick(item.id)}
                      >
                        {item.name}
                        {item.isDone && (<div style={{ position: 'absolute', height: 1, backgroundColor: 'white', top: 25, left: 20, right: 20 }} />)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </View>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    );
  }
}

DraggableList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default DraggableList;