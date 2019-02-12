'use strict';

(function () {
  angular.module('slackDeleteFiles')
    .service('notyMessageService', notyMessageService);

  function notyMessageService() {
    var me = this;

    // override the default configuration of the Noty
    var configurationNotyMessageService = function () {
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
      configurationNotyMessageService();

      new Noty({
        text: message,
        type: type,
        timeout: 4000
      }).show();
    };

    me.showConfirmationMessage = function (message, buttons) {
      configurationNotyMessageService();

      new Noty({
        layout: 'center',
        animation: {
          close: null,
          open: null
        },
        text: message,
        modal: true,
        buttons: buttons
      }).show();
    };
  }
})();
