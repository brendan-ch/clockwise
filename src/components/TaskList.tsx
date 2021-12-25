import React, { useState, useEffect, useContext } from 'react';
import {
  FlatList, StyleSheet, View, Text,
} from 'react-native';
import AppContext from '../../AppContext';
import { getData, storeData } from '../helpers/storage';
import useTheme from '../helpers/useTheme';
import { TASKS } from '../StorageKeys';
import TextStyles from '../styles/Text';
import { Task } from '../types';
import SelectorGroup from './SelectorGroup';
import SettingsOption from './SettingsOption';

/**
 * Task list component that displays selector components and an "Add task" button.
 */
function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // ID of expanded task
  const [expandedTask, setExpandedTask] = useState(-1);
  const [error, setError] = useState<string | undefined>(undefined);

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

    setTasksInStorage([
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
    setTasksInStorage(tasksCopy);
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
    setTasksInStorage(tasksCopy);
  }

  const colorValues = useTheme();

  /**
   * Save tasks to local storage.
   * @param tasks
   */
  async function setTasksInStorage(newTasks: Task[]) {
    const stringified = JSON.stringify(newTasks);

    await storeData(TASKS, stringified);
  }

  /**
   * Populate tasks data from storage.
   */
  async function populateTasksData() {
    const loadedTasks = await getData(TASKS);
    if (!loadedTasks) {
      return;
    }

    try {
      const parsed = JSON.parse(loadedTasks);

      setTasks(parsed);
    } catch (e) {
      setError('Unable to load tasks. Please reset your browser\'s cache and try again.');
    }
  }

  // Load tasks on start
  useEffect(() => {
    populateTasksData();
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
        title: item.title,
        type: 'icon',
        index: `${item.id}`,
        onPress: expandedTask === item.id ? undefined : () => setExpandedTask(item.id),
        onPressRight: () => setExpandedTask(expandedTask === item.id ? -1 : item.id),
        value: expandedTask === item.id ? 'chevron-down' : 'chevron-forward',
        onChangeText: context.timerState === 'stopped' ? (text) => handleChangeTask('title', text, item.id) : undefined,
      }}
    />
  );

  return (
    <View style={[styles.container]}>
      {context.timerState === 'running' || context.timerState === 'paused' ? (
        undefined
      ) : (
        <SettingsOption
          title="add a task"
          type="icon"
          value="add"
          // textStyle={TextStyles.textBold}
          onPress={() => handleAddTask()}
        />
      )}
      {context.timerState === 'stopped' ? (
        <View style={[styles.line, {
          borderTopColor: colorValues.gray5,
          borderTopWidth: 1,
        }]}
        />
      ) : undefined}
      {error ? (
        <Text style={[TextStyles.textRegular, {
          color: colorValues.primary,
        }]}
        >
          {error}

        </Text>
      ) : (
        <FlatList
          style={styles.taskList}
          data={tasks}
          renderItem={taskRenderer}
          maxToRenderPerBatch={10}
        />
      )}
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
    height: 5,
  },
  taskList: {
    height: '100%',
  },
});

export default TaskList;
