import Enum from './enum';

/**
 * @namespace
 * @property other
 * @property photo
 * @property passport
 * @property certificate
 */
const documentType = new Enum([
  {
    name: 'other',
    title: 'Прочие',
  },
  {
    name: 'photo',
    title: 'Фотография',
  },
  {
    name: 'passport',
    title: 'Паспорт',
  },
  {
    name: 'certificate',
    title: 'Сертификат',
  },
]);

export default documentType;
