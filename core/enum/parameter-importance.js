import Enum from '@/core/enum/enum';

const parameterImportance = new Enum([
  {
    name: 'Primary',
    title: 'Основная',
  },
  {
    name: 'Secondary',
    title: 'Второстепенная',
  },
  {
    name: 'Others',
    title: 'Прочие',
  },
]);

export default parameterImportance;
