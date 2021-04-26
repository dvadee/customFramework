import { sortBy, reverse } from 'lodash';

class Sorter {
  /**
   * @param {Object} p
   * @param {String} p.direction ASC DESC
   * @param {String} p.property
   */

  isSorter = true;

  constructor({ direction = 'ASC', property = '' }) {
    this.direction = direction;
    this.property = property;
  }

  sort(data = []) {
    const { direction, property } = this;

    let sorted = sortBy(data, [property]);

    if (direction === 'DESC') {
      sorted = reverse(sorted);
    }

    return sorted;
  }
}

export default Sorter;
