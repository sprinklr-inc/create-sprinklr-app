import { ChangeEvent } from 'react';

import { Box } from '@sprinklrjs/spaceweb/box';
import { Checkbox } from '@sprinklrjs/spaceweb/checkbox';
import { TodoInput } from './TodoInput';

import { Todo, STATUS } from './types';

export type Props = {
  value?: Todo;
  onSave: (todo: Todo) => void;
};

const TODO_INPUT_OVERRIDES = {
  InputContainer: {
    style: {
      borderWidth: '0px',
    },
  },
};

export const TodoItem = ({ value, onSave }: Props) => (
  <Box className="flex items-center">
    <Checkbox
      size="sm"
      checked={value?.status === STATUS.COMPLETED}
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        onSave({
          ...value,
          status: e.target.checked ? STATUS.COMPLETED : STATUS.PENDING,
        })
      }
      className="mr-1"
    />
    <TodoInput
      text={value?.description ?? ''}
      className={value?.status === STATUS.COMPLETED ? 'line-through' : ''}
      overrides={TODO_INPUT_OVERRIDES}
      onSave={(description: string | undefined) => onSave({ ...value, description })}
      shouldSaveOnBlur
    />
  </Box>
);
