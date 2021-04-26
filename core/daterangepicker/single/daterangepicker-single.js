import DateRangePicker from '@/core/daterangepicker/daterangepicker';

class DaterangepickerSingle extends DateRangePicker {
  initPluginConfig() {
    super.initPluginConfig();

    this.config.singleDatePicker = true;
  }

  getRange() {
    const range = super.getRange();

    return range.startDate;
  }
}

export default DaterangepickerSingle;
