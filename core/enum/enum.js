import { cloneDeep } from 'lodash';

class Enum {
  #fields;

  /**
   *
   * @param {Object[]} fields
   * @param {String} fields.name
   * @param {String} fields.title
   */
  constructor(fields) {
    this.#fields = fields;

    fields.forEach((field, idx) => {
      this[field.name] = idx;

      Object.freeze(field);
    });

    Object.freeze(this);
  }

  /**
   *
   * @param {Number} num
   * @returns {String}
   */
  getName(num) {
    return this.#fields[num]?.name || '';
  }

  getTitle(num) {
    return this.#fields[num]?.title || '';
  }

  /**
   *
   * @param {String} name
   * @returns {String}
   */
  getTitleByName(name = '') {
    const field = this.#fields.find((field) => field.name === name);

    return field?.title;
  }

  toArray() {
    return cloneDeep(this.#fields);
  }

  toOptionsList() {
    return this.toList();
  }

  toOptionsListByNum() {
    const list = this.toArray();

    return list.map(({ title }, index) => ({ text: title, value: index }));
  }

  toList() {
    const list = this.toArray();

    return list.map(({ name, title }) => ({ text: title, value: name }));
  }
}
export default Enum;
