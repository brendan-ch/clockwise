import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import useTheme from '../helpers/useTheme';
import TextStyles from '../styles/Text';
import { Task } from '../types';
import Selector from './Selector';

/**
 * Task list component that displays selector components and an "Add task" button.
 */
function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([{
    title: 'New task',
    estPomodoros: 1,
    syncData: {},
    id: 0,
  }]);

  /**
   * Add a new task to state.
   */
  function handleAddTask() {
    const newTask: Task = {
      title: 'New task',
      id: tasks.length + 1,
      estPomodoros: 1,
      syncData: {},
    };

    setTasks([
      ...tasks,
      newTask,
    ]);
  }

  const colorValues = useTheme();

  // Load tasks on start
  useEffect(() => {

  }, []);

  const taskRenderer = ({ item }: { item: Task }) => (
    <Selector text={item.title} />
  );

  return (
    <View style={[styles.container]}>
      <Selector
        text="add a task"
        iconRight="add"
        textStyle={TextStyles.textBold}
        onPress={() => handleAddTask()}
      />
      <View style={[styles.line, {
        backgroundColor: colorValues.gray5,
      }]}
      />
      <FlatList
        style={styles.taskList}
        data={tasks}
        renderItem={taskRenderer}
        maxToRenderPerBatch={10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    borderRadius: 2,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  line: {
    width: '100%',
    height: 1,
  },
  taskList: {
    height: '100%',
  },
});

export default TaskList;
