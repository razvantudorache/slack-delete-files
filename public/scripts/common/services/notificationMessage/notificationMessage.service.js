'use strict';

(function () {
  angular.module('slackDeleteFiles')
    .service('notificationMessage', notificationMessage);

  function notificationMessage() {
    var me = this;

    // override the default configuration of the Noty
    var configurationNotificationMessage = function () {
      Noty.overrideDefaults({
        theme: 'metroui',
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
        timeout: 4000
      }).show();
    };
  }
})();
