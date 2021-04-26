import Enum from '@/core/enum/enum';

/**
 * @namespace
 * @property number
 * @property title
 */
const markupType = new Enum([
  {
    name: 'number',
    title: 'Number',
  },
  {
    name: 'title',
    title: 'Title',
  },
]);

export default markupType;
