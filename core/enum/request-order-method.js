import Enum from '@/core/enum/enum';

const requestOrderMethod = new Enum([
  {
    name: 'quantity',
    title: 'С учетом наличия у поставщиков',
  },
  {
    name: 'minprice',
    title: 'По самой низкой цене',
  },
]);

export default requestOrderMethod;
