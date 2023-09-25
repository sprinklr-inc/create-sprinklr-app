import { useState } from 'react';

import { Box } from '@sprinklrjs/spaceweb/box';
import { TodoItem } from './TodoItem';
import { TodoInput } from './TodoInput';

import { Todo as TodoType, STATUS } from './types';

const DEFAULT_TODOS: Array<TodoType> = [
  { description: "Search and find Customer's ticket in CRM" },
  { description: "Reply to Customer's query" },
  { description: "Resolve the Customer's ticket" },
];

export const Todo = () => {
  const [todos, setTodos] = useState<Array<TodoType>>(DEFAULT_TODOS);

  const onEdit = ({ todo, index }: { todo: TodoType; index: number }) =>
    setTodos((_todos: Array<TodoType>) =>
      todo.description
        ? [..._todos.slice(0, index), todo, ..._todos.slice(index + 1)]
        : [..._todos.slice(0, index), ..._todos.slice(index + 1)]
    );

  return (
    <Box className="flex flex-col px-3">
      <TodoInput
        placeholder="Type your todo"
        onSave={(description?: string) => {
          if (description) {
            setTodos((_todos: Array<TodoType>) => [{ description, status: STATUS.PENDING }, ..._todos]);
          }
        }}
      />
      <Box className="flex flex-col pt-2">
        {todos.map((todo: TodoType, index: number) => (
          <TodoItem
            key={`${todo.description}_${index}`}
            value={todo}
            onSave={(updatedTodo: TodoType) => onEdit({ todo: updatedTodo, index })}
          />
        ))}
      </Box>
    </Box>
  );
};
