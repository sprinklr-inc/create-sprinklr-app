import { useState, KeyboardEvent, ChangeEvent } from 'react';
import { Textarea } from '@sprinklrjs/spaceweb/textarea';
import { TextareaProps } from '@sprinklrjs/spaceweb/textarea/types';

export type Props = {
  text?: string;
  placeholder?: string;
  shouldSaveOnBlur?: boolean;
  onSave: (text: string | undefined) => void;
  className?: TextareaProps['className'];
  overrides?: TextareaProps['overrides'];
};

export const TodoInput = ({
  text: initialText,
  shouldSaveOnBlur,
  placeholder,
  onSave: _onSave,
  className,
  overrides,
}: Props) => {
  const [text, setText] = useState<string | undefined>(initialText);

  const onSave = () => {
    _onSave(text);
    if (placeholder) setText('');
  };

  return (
    <Textarea
      value={text ?? ''}
      className={className}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value.replace('\n', ''));
      }}
      size="sm"
      variant="line"
      placeholder={placeholder}
      autoSize
      onKeyUp={(e: KeyboardEvent<HTMLTextAreaElement>) => e.key === 'Enter' && onSave()}
      onBlur={() => shouldSaveOnBlur && onSave()}
      overrides={overrides}
    />
  );
};
