import Enum from '@/core/enum/enum';

const waybillAcceptanceStatus = new Enum([
  {
    name: 'notAccepted',
    title: 'Не принят',
  },
  {
    name: 'accepting',
    title: 'Принимается',
  },
  {
    name: 'accepted',
    title: 'Принят',
  },
  {
    name: 'mismatch',
    title: 'Несоответствие',
  },
  {
    name: 'refused',
    title: 'Возвращён',
  },
]);

export default waybillAcceptanceStatus;
