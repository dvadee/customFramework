import { initial } from 'lodash';

const encode = (obj) => {
  let result;

  try {
    result = JSON.stringify(obj);
  } catch {
    result = null;
  }

  return result;
};

const decode = (str) => {
  let result;

  try {
    result = JSON.parse(str);
  } catch {
    result = null;
  }

  return result;
};

const goToUrl = (url) => {
  const link = document.createElement('a');

  link.href = url;

  link.target = '_blank';

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
};

const setLocation = (href) => {
  window.location.href = href;
};

const createYandexSearchLink = (searchText) =>
  `https://yandex.ru/search/?text=${encodeURI(searchText)}`;

/**
 *
 * @returns {URLSearchParams}
 */
const getUrlParams = () => {
  const queryString = window.location.search;
  return new URLSearchParams(queryString);
};

/**
 *
 * @param name
 * @returns {string}
 */
const getUrlParam = (name) => {
  const params = getUrlParams();

  return params.get(name);
};

const copyTextToClipboard = (text) => {
  return navigator.clipboard.writeText(text);
};

const createUrl = ({ url, params }) => {
  url = new URL(url);

  if (params) {
    url.search = new URLSearchParams(params).toString();
  }

  return url.toString();
};

const createNewPageUrl = ({ page, params }) => {
  const url = getNewPagePathUrlAddress(page);

  return createUrl({ url, params });
};

function getNewPagePathUrlAddress(pageName) {
  const { location } = window;
  const separator = '/';

  let path = location.pathname.split(separator);

  path = initial(path);

  path.push(pageName);

  path = path.join(separator);

  return `${location.origin}${path}`;
}
export {
  decode,
  encode,
  goToUrl,
  createYandexSearchLink,
  getUrlParams,
  getUrlParam,
  copyTextToClipboard,
  createUrl,
  createNewPageUrl,
  setLocation,
};
