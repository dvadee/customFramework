import { camelCase } from 'lodash';

let counter = 1;

const increase = () => (counter = counter + 1);

const createId = (name = 'component') => {
  const id = `${name}-${counter}`;

  increase();

  return id;
};

const createRefName = (ref) => {
  ref = ref.replace(/.#/gi, '');
  return camelCase(ref);
};

export { createId, createRefName };
