import React, { useState, useEffect, useContext } from 'react';
import {
  FlatList, StyleSheet, View, Text,
} from 'react-native';
import AppContext from '../../AppContext';
import generateTaskId from '../helpers/generateId';
import { getData, storeData } from '../helpers/storage';
import useTheme from '../helpers/useTheme';
import { TASKS } from '../StorageKeys';
import TextStyles from '../styles/Text';
import { Task } from '../types';
import SelectorGroup from './SelectorGroup';
import SettingsOption from './SettingsOption';

interface TimeoutTracker {
  /**
   * Task ID that the timeout corresponds to.
   */
  id: number,
  timeout: any,
}

/**
 * Task list component that displays selector components and an "Add task" button.
 */
function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // ID of expanded task
  const [expandedTask, setExpandedTask] = useState(-1);
  const [error, setError] = useState<string | undefined>(undefined);
  const [deletionTimeout, setDeletionTimeout] = useState<TimeoutTracker | undefined>(undefined);

  const context = useContext(AppContext);

  /**
   * Add a new task to state.
   */
  async function handleAddTask() {
    const newId = await generateTaskId();

    const newTask: Task = {
      title: 'New task',
      id: newId,
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

  /**
   * Handle task completion. Marks `completion` key as true, and sets
   * a timeout for deletion.
   * @param id
   */
  function handleCompleteTask(id: number) {
    const tasksCopy = tasks.slice();
    const index = tasksCopy.findIndex((existingTask) => id === existingTask.id);

    // Set completion to true
    tasksCopy[index].completed = true;

    // Set timeout for deletion
    const timeout = setTimeout(() => {
      // handleDeleteTask(id);
      tasksCopy.splice(index, 1);
      setTasks(tasksCopy);

      setDeletionTimeout(undefined);
    }, 3000);

    // Check if timeout already exists
    if (deletionTimeout) {
      // Delete the task in the timeout tracker
      const deletedIndex = tasksCopy.findIndex((existing) => existing.id === deletionTimeout.id);
      tasksCopy.splice(deletedIndex, 1);

      // Cancel the timeout
      clearTimeout(deletionTimeout.timeout);
    }

    setDeletionTimeout({
      timeout,
      id,
    });

    setTasks(tasksCopy);
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
        ['running', 'paused'].includes(context.timerState) ? ({
          type: 'icon',
          value: 'checkmark',
          title: 'complete',
          index: '1',
          onPress: () => handleCompleteTask(item.id),
        }) : ({
          type: 'icon',
          value: 'trash-outline',
          title: 'delete',
          index: '1',
          onPress: () => handleDeleteTask(item.id),
        }),
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
          titleStyle={TextStyles.textBold}
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
      {tasks.length === 0 ? (
        <Text style={[TextStyles.textRegular, {
          color: colorValues.gray3,
          marginTop: 10,
        }]}
        >
          {!['running', 'paused'].includes(context.timerState)
            ? 'Add some tasks to keep track of them during your session.'
            : 'No tasks to display.'}
        </Text>
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
