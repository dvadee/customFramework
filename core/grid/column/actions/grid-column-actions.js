import { template, isFunction } from 'lodash';

const dropdownTpl = template(`
<div class="text-center">
    <div class="list-icons">
        <div>
          <a href="#" class="list-icons-item" data-toggle="dropdown"><i class="icon-menu9"></i></a>
          <div class="dropdown-menu dropdown-menu-right">
              <% _.forEach(buttons, (btn) => { %>
                  <button class="dropdown-item {{btn.cls || ''}}" data-action="{{btn.action}}" title="{{btn.title}}">
                      <% if (btn.icon) { %>
                          <i class="{{btn.icon}} <% if (btn.text) { %>mr-2<% } %>"></i>
                      <% } %>
                      {{btn.text}}
                  </button>
              <% }); %>
          </div>
        </div>
    </div>
</div>
`);

const btnGroupTpl = template(`
<div class="btn-group w-100">
    <% _.forEach(buttons, (btn) => { %>
        <button class="btn btn-sm {{btn.cls || 'btn-link'}}" data-action="{{btn.action}}" title="{{btn.title}}">
            <% if (btn.icon) { %>
                <i class="{{btn.icon}} <% if (btn.text) { %>mr-2<% } %>"></i>
            <% } %>
            {{btn.text}}
        </button>
    <% }); %>
</div>
`);

const render = (
  data,
  type,
  row,
  meta,
  colManager,
  { buttons, dropdownType = false }
) => {
  const tpl = dropdownType ? dropdownTpl : btnGroupTpl;

  if (isFunction(buttons)) {
    buttons = buttons({
      row,
      meta,
      colManager,
    });
  }

  return tpl({ buttons });
};

export default { className: 'grid-column-actions', render };
