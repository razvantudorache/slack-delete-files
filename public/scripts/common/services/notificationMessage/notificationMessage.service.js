'use strict';

(function () {
  angular.module('slackDeleteFiles')
    .service('notificationMessage', notificationMessage);

  function notificationMessage() {
    var me = this;

    // override the default configuration of the Noty
    var configurationNotificationMessage = function () {
      Noty.overrideDefaults({
        theme: 'nest',
        layout: 'topCenter',
        progressBar: false,
        animation: {
          close: 'noty_effects_close',
          open: 'noty_effects_open'
        },
        killer: true,
        closeWith: ['button']
      });
    };

    // show the notification message based on message and type
    me.showNotificationMessage = function (message, type) {
      configurationNotificationMessage();

      new Noty({
        text: message,
        type: type,
        timeout: type === 'error' ? 0 : 5000
      }).show();
    };
  }
})();
