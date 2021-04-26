import { template, templateSettings } from 'lodash';
import { formatCurrency } from '@/core/util/number';
import { processServerDate } from '@/core/util/date';

templateSettings.interpolate = /{{([\s\S]+?)}}/g;
templateSettings.imports = { processServerDate, formatCurrency };

/**
 *
 * @param {String} tpl
 * @param {Boolean} returnElement
 * @returns {Function}
 */
const createTplExecutor = (tpl, returnElement = false) => {
  tpl = tpl.trim();

  const executor = template(tpl);

  if (returnElement) {
    return (data) => {
      const html = executor(data);

      return $.parseHTML(html)[0];
    };
  }

  return executor;
};

export default createTplExecutor;
