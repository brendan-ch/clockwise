import React, { useState, useEffect, useContext } from 'react';
import {
  FlatList, StyleSheet, View, Text, Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
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

  // Track selected task IDs
  const [selected, setSelected] = useState<number[]>([]);

  const selectedTasks = tasks.filter(((task) => selected.includes(task.id)));

  const context = useContext(AppContext);
  const timerStopped = !['running', 'paused'].includes(context.timerState);

  /**
   * Handle selection of a task.
   * @param id
   */
  function handleSelect(id: number) {
    const newSelected = selected.slice();
    newSelected.push(id);
    setSelected(newSelected);
  }

  /**
   * Handle deselection of a task.
   * @param id
   */
  function handleDeselect(id: number) {
    const newSelected = selected.slice();
    const index = newSelected.indexOf(id);
    newSelected.splice(index, 1);
    setSelected(newSelected);
  }

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
      completed: false,
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

    if (selected.includes(id)) {
      handleDeselect(id);
    }

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
      const deletedIndex = tasksCopy.findIndex((existing) => existing.id === id);

      // handleDeleteTask(id);
      tasksCopy.splice(deletedIndex, 1);
      setTasks(tasksCopy);
      setTasksInStorage(tasksCopy);

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
    setTasksInStorage(tasksCopy);

    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }

  /**
   * Handle task completion undo. Cancels the deletion timeout and marks
   * `completed` as false for task.
   */
  function handleUndoComplete() {
    if (deletionTimeout) {
      clearTimeout(deletionTimeout.timeout);

      const tasksCopy = tasks.slice();
      const index = tasksCopy.findIndex((existing) => existing.id === deletionTimeout.id);
      tasksCopy[index].completed = false;

      setDeletionTimeout(undefined);
      setTasks(tasksCopy);
      setTasksInStorage(tasksCopy);
    }
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

  useEffect(() => {
    if (context.timerState === 'stopped' && tasks.length > 0) {
      // Check for completed tasks
      const completed = tasks.filter((task) => task.completed);
      if (completed.length === 0) {
        return;
      }

      if (deletionTimeout) {
        clearTimeout(deletionTimeout.timeout);
        setDeletionTimeout(undefined);
      }

      const tasksCopy = tasks.slice();

      completed.forEach((task) => {
        // Remove completed tasks from list and storage
        const index = tasksCopy.findIndex((existing) => existing.id === task.id);
        tasksCopy.splice(index, 1);
      });

      setTasks(tasksCopy);
      setTasksInStorage(tasksCopy);
    }
  }, [context.timerState, tasks, deletionTimeout]);

  // Load tasks on start
  useEffect(() => {
    populateTasksData();
  }, []);

  const taskRenderer = ({ item }: { item: Task }) => {
    let iconLeftDisplay;

    if (timerStopped && selected.includes(item.id)) {
      iconLeftDisplay = 'checkbox';
    } else if (timerStopped) {
      iconLeftDisplay = 'checkbox-outline';
    }

    return (
      <SelectorGroup
        fadeInOnMount
        expanded={expandedTask === item.id && !item.completed}
        data={[
          {
            type: 'number',
            title: 'est. pomodoros',
            index: '0',
            value: item.estPomodoros,
            onChange: (data) => handleChangeTask('estPomodoros', data, item.id),
            disabled: !timerStopped,
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
        header={item.completed ? ({
          title: 'completed (press to undo)',
          type: 'icon',
          index: `${item.id}`,
          value: 'arrow-undo-outline',
          titleStyle: {
            color: colorValues.gray4,
          },
          onPress: () => handleUndoComplete(),
        }) : ({
          title: item.title,
          iconLeft: iconLeftDisplay,
          onPressLeft: selected.includes(item.id)
            ? () => handleDeselect(item.id)
            : () => handleSelect(item.id),
          type: 'icon',
          index: `${item.id}`,
          onPress: expandedTask === item.id ? undefined : () => setExpandedTask(item.id),
          onPressRight: () => setExpandedTask(expandedTask === item.id ? -1 : item.id),
          value: expandedTask === item.id ? 'chevron-down' : 'chevron-forward',
          onChangeText: context.timerState === 'stopped' ? (text) => handleChangeTask('title', text, item.id) : undefined,
        })}
      />
    );
  };

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
      { tasks.length === 0 ? (
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
          data={!timerStopped
            ? selectedTasks
            : tasks}
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
