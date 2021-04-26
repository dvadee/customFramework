import 'bootstrap';
import 'block-ui';
import 'jquery-uniform';
import '@/core/jquery/jquery';
import Dashboard from './blocks/dashboard/dashboard';
import Notifications from './core/notifications/notifications';
import Tooltip from './core/tooltip/tooltip';
import DataTable from '@/core/datatable/datatable';
import Schedules from '@/core/schedules/schedules';
import ErrorHandler from '@/core/error/handler/error-handler';

ErrorHandler.init();
DataTable.initCustomApi();

document.addEventListener('DOMContentLoaded', () => {
  Dashboard.init();
  Schedules.init();
  Notifications.init();
  Tooltip.init();
});
