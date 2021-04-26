import fileDownload from 'js-file-download';

const saveFileContent = (fileResult, filename = '') => {
  const blob = new Blob([fileResult]);

  fileDownload(blob, filename);
};

const saveFileByUrl = (url, params) => {
  const href = `${url}?${$.param(params)}`;

  const link = document.createElement('a');

  link.href = href;

  link.target = '_blank';

  link.click();

  link.remove();
};

export { saveFileContent, saveFileByUrl };
