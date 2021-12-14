import React, { useState, useEffect, useContext } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import AppContext from '../../AppContext';
import useTheme from '../helpers/useTheme';
import TextStyles from '../styles/Text';
import { Task } from '../types';
import Selector from './Selector';
import SelectorGroup from './SelectorGroup';

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

  // ID of expanded task
  const [expandedTask, setExpandedTask] = useState(-1);

  const context = useContext(AppContext);

  /**
   * Add a new task to state.
   */
  function handleAddTask() {
    const newTask: Task = {
      title: 'New task',
      id: tasks.length,
      estPomodoros: 1,
      syncData: {},
    };

    setTasks([
      ...tasks,
      newTask,
    ]);
  }

  /**
   * Handle changing a task in the state.
   */
  function handleChangeTask(key: string, value: any, id: number) {
    const tasksCopy = tasks.slice();
    const index = tasksCopy.findIndex((existingTask) => id === existingTask.id);

    tasksCopy[index] = {
      ...tasksCopy[index],
      [key]: value,
    };

    setTasks(tasksCopy);
  }

  /**
   * Remove a task from state.
   * @param id
   */
  function handleDeleteTask(id: number) {
    const tasksCopy = tasks.slice();
    const index = tasksCopy.findIndex((existingTask) => id === existingTask.id);

    if (id === expandedTask) {
      setExpandedTask(-1);
    }

    tasksCopy.splice(index, 1);
    tasksCopy.forEach((task, i) => {
      if (task.id > id) {
        tasksCopy[i].id = task.id - 1;
      }
    });

    setTasks(tasksCopy);
  }

  const colorValues = useTheme();

  // Load tasks on start
  useEffect(() => {

  }, []);

  const taskRenderer = ({ item }: { item: Task }) => (
    <SelectorGroup
      fadeInOnMount
      expanded={expandedTask === item.id}
      data={[
        {
          type: 'number',
          title: 'est. pomodoros',
          index: '0',
          value: item.estPomodoros,
          onChange: (data) => handleChangeTask('estPomodoros', data, item.id),
          disabled: context.timerState === 'running' || context.timerState === 'paused',
        },
        {
          type: 'icon',
          value: 'trash-outline',
          title: 'delete',
          index: '1',
          onPress: () => handleDeleteTask(item.id),
        },
      ]}
      header={{
        text: item.title,
        index: `${item.id}`,
        onPress: expandedTask === item.id ? undefined : () => setExpandedTask(item.id),
        onPressRight: () => setExpandedTask(expandedTask === item.id ? -1 : item.id),
        iconRight: expandedTask === item.id ? 'chevron-down' : 'chevron-forward',
        onChangeText: context.timerState === 'stopped' ? (text) => handleChangeTask('title', text, item.id) : undefined,
      }}
    />
  );

  return (
    <View style={[styles.container]}>
      {context.timerState === 'running' || context.timerState === 'paused' ? (
        undefined
      ) : (
        <Selector
          text="add a task"
          iconRight="add"
          textStyle={TextStyles.textBold}
          onPress={() => handleAddTask()}
        />
      )}
      {context.timerState === 'stopped' ? (
        <View style={[styles.line, {
          backgroundColor: colorValues.gray5,
        }]}
        />
      ) : undefined}
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
