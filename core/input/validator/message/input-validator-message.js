class InputValidatorMessage {
  static stringSize = (len) => `Длина поля должна быть равна ${len}`;

  static required = 'Поле необходимо заполнить';

  static stringMaxSize = (len) => `Длина поля должна быть меньше ${len}`;
}

export default InputValidatorMessage;
