const render = (
  url,
  type,
  row,
  meta,
  manager,
  { urlPrefix, btnTitle = 'Ссылка' }
) => {
  let html = '';

  if (url) {
    if (urlPrefix && !url.includes(urlPrefix)) {
      url = urlPrefix + url;
    }

    html = `
         <a href="${url}" target="_blank" class="btn btn-link btn-block text-center" title="${btnTitle}">
            <i class="icon-new-tab"></i>
         </a>
      `;
  }

  return html;
};

export default { render };
