export enum STATUS {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
}

export type Todo = {
  description?: string;
  status?: STATUS;
};
