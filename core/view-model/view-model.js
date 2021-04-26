import { forIn, merge, set, last, isObject, chain, get } from 'lodash';
import safeEval from 'safe-eval';
import ViewModelCalculate from './calculate/view-model-calculate';
import ViewModelDepend from './depend/view-model-depend';
import ViewModelBind from './bind/view-model-bind';
import ViewModelBindCollection from '@/core/view-model/bind/collection/view-model-bind-collection';

/**
 * @class ViewModel
 */
class ViewModel {
  expressionRe = /[!*+\-"'&|]+/gm;

  isVM = true;

  holder;

  calculates = [];

  depends = {};

  components = {};

  data = {};

  /**
   *
   * @param p
   * @param {Component} p.holder
   * @param {Object} p.data
   * @param {Object} p.calculate
   */
  constructor({ holder, data, calculate }) {
    this.holder = holder;

    if (data) {
      merge(this.data, data);
    }

    this.initData(this.data);

    if (calculate) {
      this.initCalculate(calculate);
    }

    holder.one('ready', this.onHolderReady.bind(this));
  }

  onHolderReady() {
    this.notify();
  }

  initData(data) {
    forIn(data, (value, prop) => {
      this.initViewModelProp(prop);

      this[prop] = value;
    });
  }

  /**
   * create calculate. Call directly
   * @param {Object} calculate
   */
  initCalculate(calculate) {
    forIn(calculate, ({ depends, fn }, prop) => {
      this.addCalculate({ depends, fn, prop });
    });
  }

  addCalculate({ depends, fn, prop }) {
    const calc = new ViewModelCalculate({
      vm: this,
      fn,
      depends,
      prop,
    });

    depends.forEach((depend) => {
      this.addDepends({ name: depend, cmpProp: depend, cmp: calc });
    });

    calc.calcFn();
  }

  get(prop) {
    return get(this.data, prop);
  }

  set(values) {
    if (!isObject(values)) {
      values = {
        [values]: arguments[1],
      };
    }

    forIn(values, (v, prop) => {
      set(this.data, prop, v);
      //Обновление всех компонентов
      this.notify(prop);
    });
  }

  getExpressionValue(prop) {
    try {
      return safeEval(prop, this.data);
    } catch (err) {
      console.group('View model expression calculate error');
      console.error(`"${prop}"`);
      console.error(err.message);
      console.groupEnd();
      return null;
    }
  }

  initViewModelProp(prop) {
    if (this.isExpressionProp(prop)) {
      return;
    }

    const stubProp = this.stubExpression(prop);

    if (stubProp in this) {
      return;
    }

    Object.defineProperty(this, stubProp, {
      get() {
        //Возвращает значение
        return this.get(stubProp);
      },
      set(v) {
        //Установка значения в хранилище
        this.set(stubProp, v);
      },
    });
  }

  /**
   * Установить прокси геттер во vm
   * Пока только геттеры
   * @param {String} vmProp - vm prop name
   * @param {String} cmpProp - cmp prop name
   * @param {Component} cmp
   * @return {*}
   */
  bind(vmProp, cmpProp, cmp) {
    const stubVmProp = this.stubExpression(vmProp);

    const isExpression = this.isExpressionProp(vmProp);

    const vmBind = new ViewModelBind({
      viewModel: this,
      isExpression,
      stubVmProp,
      cmpProp,
      vmProp,
      cmp,
    });

    //Вложенная зависимость
    const depends = this.getExpressionDepends(vmProp);

    //от каждой переменной в выражении будет меняться значение
    depends.forEach((depend) => {
      this.addDepends({
        name: depend,
        cmpProp,
        cmp,
        vmProp: stubVmProp,
        vmBind,
      });
    });

    if (!isExpression) {
      this.initViewModelProp(vmProp);
    }

    vmBind.notify();

    return vmBind;
  }

  /**
   *
   * @param vmProp - путь/имя переменной откуда будет браться значение в vm. Если нет береться name
   * @param name - название значения vm от которого будет тригериться изменение
   * @param prop - название свойства компонента куда будет записываться значение
   * @param cmp - компонент
   */
  addDepends({ vmProp, name, cmpProp, cmp, vmBind }) {
    const { depends } = this;
    let collection = depends[name];

    if (!collection) {
      collection = [];
      depends[name] = collection;
    }

    const depend = new ViewModelDepend({
      viewModel: this,
      vmProp: vmProp || name,
      vmBind,
      cmpProp,
      cmp,
    });

    collection.push(depend);
  }

  notify(name) {
    const { depends } = this;
    let collection;

    if (name) {
      collection = depends[name];
    } else {
      collection = chain(depends).toArray().flatten().value();
    }

    if (collection) {
      collection.forEach((depend) => {
        depend.notify();
      });
    }
  }

  initComponentBind(cmp) {
    const { reference } = cmp;

    if (reference && !cmp.scopedReference) {
      this.components[reference] = cmp;
    }

    const binds = new ViewModelBindCollection();

    forIn(cmp.bind, (vmProp, cmpProp) => {
      const bind = this.bind(vmProp, cmpProp, cmp);

      binds.add({ bind, name: cmpProp });
    });

    return binds;
  }

  lookup(ref) {
    return this.lookupReference(ref);
  }

  lookupReference(ref) {
    return this.components[ref];
  }

  isExpressionProp(prop) {
    return this.expressionRe.test(prop);
  }

  stubExpression(expression) {
    return expression.replace(/[{}]/gm, '');
  }

  getExpressionDepends(expression) {
    let stub = this.stubExpression(expression);

    if (this.isExpressionProp(expression)) {
      return chain(stub)
        .replace(this.expressionRe, '')
        .split(' ')
        .flatten()
        .value();
    } else {
      // масстив пути ['product', 'name']
      // получаем ['product', 'product.name']
      return stub.split('.').reduce((acc, value) => {
        const prev = last(acc);

        if (prev) {
          value = `${prev}.${value}`;
        }

        acc.push(value);

        return acc;
      }, []);
    }
  }
}

export default ViewModel;
