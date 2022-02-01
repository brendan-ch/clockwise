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

  // Load tasks on start
  useEffect(() => {
    populateTasksData();
  }, []);

  return {
    tasks,
    setTasks,
    setTasksInStorage,
    handleAddTask,
    handleDeleteTask,
    handleChangeTask,
  };
}

export default useTasks;
