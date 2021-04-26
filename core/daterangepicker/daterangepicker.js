import { merge, isEqual } from 'lodash';
import 'daterangepicker';
import '../../../../../node_modules/daterangepicker/daterangepicker.css';
import Component from '../component';

class DateRangePicker extends Component {
  /**
   * @param {Object} p
   * @param {Object} p.datePickerListeners
   */

  constructor(p) {
    super(p);

    this.publishValue();
  }

  initComponent() {
    super.initComponent();

    const { $el, config } = this;

    $el.addClass('form-control');

    this.picker = $el.daterangepicker(config);
  }

  initEvents() {
    this.$el.on({
      'apply.daterangepicker': this.onValueApply.bind(this),
    });
  }

  initPluginConfig() {
    const { cfg = {} } = this;
    const defaultCfg = {
      showDropdowns: true,
      applyClass: 'btn-primary',
      cancelClass: 'btn-light',
      linkedCalendars: false,
      locale: {
        applyLabel: 'Готово',
        cancelLabel: 'Отмена',
        startLabel: 'Начальная дата',
        endLabel: 'Конечная дата',
        customRangeLabel: 'Выбрать дату',
        daysOfWeek: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        monthNames: [
          'Январь',
          'Февраль',
          'Март',
          'Апрель',
          'Май',
          'Июнь',
          'Июль',
          'Август',
          'Сентябрь',
          'Октябрь',
          'Ноябрь',
          'Декабрь',
        ],
        firstDay: 1,
        format: 'DD.MM.YYYY',
      },
    };

    merge(defaultCfg, cfg);

    this.config = defaultCfg;
  }

  onValueApply() {
    const range = this.getRange();

    this.publishValue(range);

    this.trigger('valueapply', this, range);
  }

  publishValue(range = this.getRange()) {
    this.publishState('value', range);
  }

  resetRange() {
    const date = new Date().toLocaleDateString();

    this.setRange({
      startDate: date,
      endDate: date,
    });
  }

  get value() {
    return this.ready ? this.getRange() : {};
  }

  set value(value) {
    if (this.ready) {
      this.setRange(value);
    }
  }
  /**
   * @returns {Object} range
   * @returns {Date} range.startDate
   * @returns {Date} range.finishDate
   */
  getRange() {
    const { startDate, endDate } = this.getDateRangePickerInstance();

    return {
      startDate: startDate.toDate(),
      finishDate: endDate.toDate(),
    };
  }

  setRange(range = {}) {
    const currentRange = this.getRange();
    const { startDate, finishDate } = range || {};
    const picker = this.getDateRangePickerInstance();
    let isUpdated = false;

    if (startDate && !isEqual(startDate, currentRange.startDate)) {
      picker.setStartDate(startDate);
      isUpdated = true;
    }

    if (finishDate && !isEqual(finishDate, currentRange.finishDate)) {
      picker.setEndDate(finishDate);
      isUpdated = true;
    }

    if (isUpdated) {
      this.onValueApply();
    }
  }

  getDateRangePickerInstance() {
    return this.$el.data('daterangepicker');
  }
}

export default DateRangePicker;
