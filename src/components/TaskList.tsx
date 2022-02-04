import React, {
  useState, useEffect, useContext, useRef,
} from 'react';
import {
  FlatList, StyleSheet, View, Text, Platform, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import AppContext from '../../AppContext';
import useTheme from '../helpers/hooks/useTheme';
import TextStyles from '../styles/Text';
import { Task } from '../types';
import SelectorGroup from './SelectorGroup';
import SettingsOption from './SettingsOption';
import TaskContext from '../../TaskContext';
import useWindowSize from '../helpers/hooks/useWindowSize';

interface TimeoutTracker {
  /**
   * Task ID that the timeout corresponds to.
   */
  id: number,
  timeout: any,
}

interface Props {
  /**
   * Returns a boolean indicating whether the scroll list is at the top.
   */
  /* eslint-disable-next-line */
  setAtTop?: (value: boolean) => any,
}

/**
 * Task list component that displays selector components and an "Add task" button.
 */
function TaskList({ setAtTop }: Props) {
  const {
    tasks,
    setTasks,
    selected,
    setSelected,
    handleAddTask,
    handleChangeTask,
    handleDeleteTask,
  } = useContext(TaskContext);

  // const [tasks, setTasks] = useState<Task[]>([]);

  // ID of expanded task
  const [expandedTask, setExpandedTask] = useState(-1);
  const [deletionTimeout, setDeletionTimeout] = useState<TimeoutTracker | undefined>(undefined);

  const context = useContext(AppContext);

  // Displayed tasks while timer is running
  // Keybind registration should refer to this array
  // instead of global tasks array when timer is running
  const selectedTasks = tasks.filter(((task) => selected.includes(task.id)));

  const listRef = useRef<FlatList>();

  const timerStopped = !['running', 'paused'].includes(context.timerState);

  const windowSize = useWindowSize();

  // Indicate whether task can be deselected by clicking the primary touch area
  const allowDeselect = !timerStopped && context.mode === 'focus';

  /**
   * Handle scroll events in the task list.
   * @param e
   */
  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const offset = e.nativeEvent.contentOffset.y;
    if (setAtTop) {
      setAtTop(offset <= 0);
    }
  }

  /**
   * Automatically scroll to an item in the list.
   * @param id
   */
  function handleAutoScroll(id: number, pos = 0) {
    const index = context.timerState === 'running'
      ? selectedTasks.findIndex((task) => task.id === id)
      : tasks.findIndex((task) => task.id === id);
    if (index === -1) return;

    listRef?.current?.scrollToIndex({
      animated: true,
      viewPosition: pos,
      index,
    });
  }

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
   * Handle expansion and auto scrolling of an item.
   * @param id
   */
  function handleExpand(id: number) {
    setExpandedTask(id);
    // handleAutoScroll(id);
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
    }
  }

  const colorValues = useTheme();

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
    }
  }, [context.timerState, tasks, deletionTimeout]);

  // Set keybindings
  useEffect(() => {
    const unsubMethods: (() => any)[] = [];

    if (context.keyboardGroup === 'timer') {
      const { keyboardShortcutManager } = context;
      if (!keyboardShortcutManager) return () => {};

      if (context.timerState === 'stopped' || context.mode === 'break') {
        unsubMethods.push(keyboardShortcutManager.registerEvent({
          keys: ['a'],
          action: () => handleAddTask(),
        }));

        unsubMethods.push(keyboardShortcutManager.registerEvent({
          keys: ['+'],
          action: () => handleAddTask(),
        }));

        unsubMethods.push(keyboardShortcutManager.registerEvent({
          keys: ['='],
          action: () => handleAddTask(),
        }));

        for (let i = 0; i < 9; i += 1) {
          unsubMethods.push(keyboardShortcutManager.registerEvent({
            keys: [`${i + 1}`],
            action: () => handleExpand(tasks[i] && tasks[i].id !== expandedTask
              ? tasks[i].id
              : -1),
          }));
        }

        unsubMethods.push(keyboardShortcutManager.registerEvent({
          keys: ['0'],
          action: () => handleExpand(tasks[9] && tasks[9].id !== expandedTask
            ? tasks[9].id
            : -1),
        }));
      } else if (context.timerState === 'running' && context.mode === 'focus') {
        // Refer to selectedTasks array
        for (let i = 0; i < 9; i += 1) {
          unsubMethods.push(keyboardShortcutManager.registerEvent({
            keys: [`${i + 1}`],
            action: () => handleExpand(selectedTasks[i] && selectedTasks[i].id !== expandedTask
              ? selectedTasks[i].id
              : -1),
          }));
        }

        unsubMethods.push(keyboardShortcutManager.registerEvent({
          keys: ['0'],
          action: () => handleExpand(selectedTasks[9] && selectedTasks[9].id !== expandedTask
            ? selectedTasks[9].id
            : -1),
        }));
      }
    }

    return () => unsubMethods.forEach((value) => {
      value();
    });
  }, [context.keyboardGroup, tasks, expandedTask, context.timerState]);

  useEffect(() => {
    handleAutoScroll(expandedTask, 0.4);
  }, [expandedTask]);

  const taskRenderer = ({ item }: { item: Task }) => {
    let iconLeftDisplay;

    if (timerStopped && selected.includes(item.id) && context.mode === 'focus') {
      iconLeftDisplay = 'checkbox';
    } else if (timerStopped && context.mode === 'focus') {
      iconLeftDisplay = 'checkbox-outline';
    }

    return (
      <SelectorGroup
        activeKeyboardGroup="timer"
        fadeInOnMount
        expanded={expandedTask === item.id && !item.completed}
        outsideData={tasks}
        keybindings={[
          {
            title: 'est. sessions',
            select: [['e']],
          },
          {
            title: 'delete',
            press: [['Backspace']],
          },
          {
            title: 'complete',
            press: [['Meta', 'Enter'], ['Control', 'Enter'], ['Backspace']],
          },
        ]}
        headerKeybindings={{
          title: 'header',
          pressLeft: context.timerState === 'stopped' || context.mode === 'break' ? [['s']] : undefined,
          pressInput: [['Enter']],
        }}
        data={[
          {
            type: 'number',
            title: 'est. sessions',
            subtitle: item.actualPomodoros ? `actual sessions: ${item.actualPomodoros}` : undefined,
            value: item.estPomodoros,
            onChange: (data) => handleChangeTask('estPomodoros', data, item.id),
            disabled: !timerStopped && context.mode === 'focus',
          },
          !timerStopped && context.mode === 'focus' ? ({
            type: 'icon',
            value: 'checkmark',
            title: 'complete',
            onPress: () => handleCompleteTask(item.id),
            // keybindingsPress: [['Meta', 'Enter'], ['Control', 'Enter'], ['Backspace']],
          }) : ({
            type: 'icon',
            value: 'trash-outline',
            title: 'delete',
            // index: '1',
            onPress: () => handleDeleteTask(item.id),
            onPressRight: () => handleDeleteTask(item.id),
            // keybindingsPress: [['Backspace']],
          }),
        ]}
        header={item.completed ? ({
          title: 'completed (press to undo)',
          type: 'icon',
          // index: `${item.id}`,
          value: 'arrow-undo-outline',
          titleStyle: {
            color: colorValues.gray3,
          },
          onPress: () => handleUndoComplete(),
        }) : ({
          title: item.title,
          iconLeft: iconLeftDisplay,
          onPressLeft: selected.includes(item.id)
            ? () => handleDeselect(item.id)
            : () => handleSelect(item.id),
          type: 'icon',
          // index: `${item.id}`,
          onPress: expandedTask === item.id && !allowDeselect
            ? undefined
            : () => handleExpand(expandedTask === item.id ? -1 : item.id),
          onPressRight: () => setExpandedTask(expandedTask === item.id ? -1 : item.id),
          value: expandedTask === item.id ? 'chevron-down' : 'chevron-forward',
          onChangeText: timerStopped || context.mode === 'break' ? (text) => handleChangeTask('title', text, item.id) : undefined,
          // keybindingsPressInput: [['Enter']],
          // keybindingsPressLeft: [['s']],
          onInputSelect: Platform.OS !== 'web' ? () => handleAutoScroll(item.id) : undefined,
        })}
        onKeyboardShown={Platform.OS !== 'web' ? () => handleAutoScroll(item.id) : undefined}
      />
    );
  };

  // Render blank view for footer
  const footerRenderer = () => (
    <View style={{
      height: 110,
    }}
    />
  );

  return (
    <View style={[styles.container]}>
      {!timerStopped && context.mode === 'focus' ? (
        undefined
      ) : (
        <SettingsOption
          title="add a task"
          type="icon"
          value="add"
          titleStyle={TextStyles.textBold}
          onPress={() => handleAddTask()}
          onPressRight={() => handleAddTask()}
        />
      )}
      {!timerStopped && context.mode === 'focus' ? undefined : (
        <View style={[styles.line, {
          borderTopColor: colorValues.gray5,
          borderTopWidth: 1,
        }]}
        />
      )}
      {
      ((timerStopped || context.mode === 'break') && tasks.length === 0)
      || (!timerStopped && selectedTasks.length === 0 && context.mode === 'focus') ? (
        <Text style={[TextStyles.textRegular, {
          color: colorValues.gray2,
          marginTop: 10,
        }]}
        >
          {timerStopped || context.mode === 'break'
            ? 'Add some tasks to keep track of them during your session.'
            : 'No tasks to display.'}
        </Text>
        ) : undefined
}
      <FlatList
        style={styles.taskList}
        data={!timerStopped && context.mode === 'focus'
          ? selectedTasks
          : tasks}
        renderItem={taskRenderer}
        maxToRenderPerBatch={10}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="never"
        scrollsToTop
        scrollToOverflowEnabled
        // @ts-ignore
        ref={listRef}
        onScroll={(e) => handleScroll(e)}
        overScrollMode="always"
        ListFooterComponent={windowSize === 'portrait' ? footerRenderer : undefined}
        showsVerticalScrollIndicator={false}
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
    height: 5,
  },
  taskList: {
    height: '100%',
  },
});

export default TaskList;
