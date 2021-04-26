import { isString, isDate, isNaN } from 'lodash';

const DAY_MILLISECONDS = 24 * 60 * 60 * 1000;

const getWeekDays = () => [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
  'Воскресенье',
];

const getShortWeekDays = () => ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const parseInputDate = (d) => new Date(Date.parse(d));

const processServerDate = (date) => {
  if (isString(date)) {
    date = new Date(date);
  }

  if (isDate(date)) {
    date = date.toLocaleDateString();
  } else {
    date = '';
  }

  return date;
};
/**
 *
 * @param date
 * @return {Date|null}
 */
const parseServerDate = (date) => {
  date = new Date(date);
  return isNaN(date.getTime()) ? null : date;
};

const cloneDate = (date) => new Date(date.getTime());

const clearTime = (date) => {
  date = new Date(date.getTime());

  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
};

const getPeriod = (endDate = new Date(), daysCount = 1) => {
  endDate = clearTime(endDate);

  const startTime = endDate.getTime() - daysCount * DAY_MILLISECONDS;
  const startDate = clearTime(new Date(startTime));

  return {
    from: startDate,
    to: endDate,
  };
};

const getDatesFromPeriod = ({ from, to }) => {
  const dates = [];
  const targetTime = to.getTime();
  let currentDate = cloneDate(from);

  while (currentDate.getTime() < targetTime) {
    dates.push(cloneDate(currentDate));

    currentDate = new Date(currentDate.getTime() + DAY_MILLISECONDS);
  }

  return dates;
};

export {
  getWeekDays,
  getShortWeekDays,
  processServerDate,
  getPeriod,
  getDatesFromPeriod,
  parseServerDate,
  parseInputDate,
  clearTime,
};
