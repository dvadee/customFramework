import { dialog } from '@/core/bootbox/bootbox';
import { copyTextToClipboard } from '@/core/util/util';

class ErrorHandler {
  static init() {
    window.onerror = function (errorMsg) {
      ErrorHandler.handleError(new Error(errorMsg));

      return false;
    };
  }

  static handleApiError({ url, method, errorMessage }) {
    const error = new Error();

    error.name = 'Ошибка выполнения запроса на сервере!';

    error.message = `${method?.toUpperCase()} - ${url}`;

    error.stack = errorMessage;

    ErrorHandler.handleError(error);
  }

  static handleError(error) {
    console.error(error);

    ErrorHandler.showError(error);
  }

  /**
   *
   * @param {Error} error
   */
  static showError(error) {
    dialog({
      animate: false,
      size: 'lg',
      centerVertical: true,
      title: `<i class="icon-warning22 mr-2 text-danger"></i> ${error.name}`,
      message: `
        <p>${error.message}</p>
        <p><pre>${error.stack}</pre></p>
      `,
      buttons: {
        copy: {
          label: 'Cкопировать текст ошибки',
          className: 'btn-light',
          callback() {
            copyTextToClipboard(error.stack);

            return false;
          },
        },
        close: {
          label: 'Закрыть',
          className: 'btn-primary',
        },
      },
    });
  }
}

export default ErrorHandler;
