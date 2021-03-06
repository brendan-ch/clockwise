import { useEffect, useState } from 'react';
import { TASKS } from '../../StorageKeys';
import { Task } from '../../types';
import generateTaskId from '../generateId';
import { getData, storeData } from '../storage';

/**
 * Hook to control task management inside the app, as well as
 * synchronize with local storage.
 */
function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  /**
   * Add a new task to state.
   * @returns The ID of the task.
   */
  async function handleAddTask() {
    const newId = await generateTaskId();

    const newTask: Task = {
      title: 'New task',
      id: newId,
      estPomodoros: 1,
      actualPomodoros: 0,
      syncData: {},
      completed: false,
    };

    const selectedCopy = selected.slice();
    selectedCopy.push(newId);
    setSelected(selectedCopy);

    setTasks([
      ...tasks,
      newTask,
    ]);

    setTasksInStorage([
      ...tasks,
      newTask,
    ]);

    return newId;
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

    // if (id === expandedTask) {
    //   setExpandedTask(-1);
    // }

    tasksCopy.splice(index, 1);

    if (selected.includes(id)) {
      const selectedCopy = selected.slice();
      const indexSelected = selectedCopy.findIndex((existing) => existing === id);
      selectedCopy.splice(indexSelected, 1);
      setSelected(selectedCopy);
    }

    setTasks(tasksCopy);
    setTasksInStorage(tasksCopy);
  }

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
      throw new Error('Unable to load tasks. Please reset your browser\'s cache and try again.');
    }
  }

  /**
   * Bump the `actualPomodoros` count of selected tasks.
   */
  async function bumpActualPomodoros() {
    const tasksCopy = tasks.slice();

    await Promise.all(selected.map(async (item) => {
      const i = tasksCopy.findIndex((value) => value.id === item);

      if (tasksCopy[i] && tasksCopy[i]?.actualPomodoros === undefined) {
        tasksCopy[i].actualPomodoros = 1;
      } else if (tasksCopy[i]) {
        // @ts-ignore
        tasksCopy[i].actualPomodoros += 1;
      }
    }));

    setTasks(tasksCopy);
    setTasksInStorage(tasksCopy);
  }

  // Load tasks on start
  useEffect(() => {
    populateTasksData();
  }, []);

  return {
    tasks,
    setTasks: (newTasks: Task[]) => {
      setTasks(newTasks);
      setTasksInStorage(newTasks);
    },
    selected,
    setSelected,
    setTasksInStorage,
    handleAddTask,
    handleDeleteTask,
    handleChangeTask,
    bumpActualPomodoros,
  };
}

export default useTasks;
