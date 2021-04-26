import 'bootstrap';
import 'block-ui';
import 'jquery-uniform';
import '@/core/jquery/jquery';
import '@/base/js/limitlessApp';
import {
  initLimitless,
  initUniformDefaults,
} from './base/js/limitlessAppCustom';
import Dashboard from './blocks/dashboard/dashboard';
import Notifications from './core/notifications/notifications';
import Tooltip from './core/tooltip/tooltip';
import DataTable from '@/core/datatable/datatable';
import Schedules from '@/core/schedules/schedules';
import ErrorHandler from '@/core/error/handler/error-handler';

ErrorHandler.init();
initUniformDefaults();
DataTable.initCustomApi();

document.addEventListener('DOMContentLoaded', () => {
  Dashboard.init();
  initLimitless();
  Schedules.init();
  Notifications.init();
  Tooltip.init();
});
