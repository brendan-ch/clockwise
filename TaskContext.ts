import React, { Dispatch, SetStateAction } from 'react';
import { Task } from './src/types';

/* eslint-disable */

interface DefaultTaskState {
  tasks: Task[],
  selected: number[],
  setTasks: (tasks: Task[]) => any,
  setSelected: Dispatch<SetStateAction<number[]>>,
  handleAddTask: () => any,
  handleChangeTask: (key: string, value: any, id: number) => any,
  handleDeleteTask: (id: number) => any,
}

const defaultTaskState: DefaultTaskState = {
  tasks: [],
  selected: [],
  setTasks: () => {},
  setSelected: () => {},
  handleAddTask: () => {},
  handleChangeTask: () => {},
  handleDeleteTask: () => {},
};

const TaskContext = React.createContext(defaultTaskState);
export default TaskContext;
