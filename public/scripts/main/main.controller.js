'use strict';

(function () {
  angular.module("slackDeleteFiles")
    .controller('mainController', mainController);

  mainController.$inject = ['$scope', '$http', 'notificationMessage'];

  function mainController($scope, $http, notificationMessage) {
    var me = this;

    me.$onInit = function () {
      $scope.showSignInButton = true;

      checkAuthentication();

      $scope.signInWithSlack = signInWithSlack;

      defineGridColumnsAndProperties();
    };

    /**
     * Sign in action
     * @return {void}
     */
    function signInWithSlack() {
      location.href = "https://slack.com/oauth/authorize?scope=files:read,files:write:user&client_id=101540185972.527491816113";
    }

    /**
     * Show/hide sign in button based of the authentication value
     * @return {void}
     */
    function checkAuthentication() {
      $http.get("/checkAuthentication").then(function (response) {
        $scope.showSignInButton = !response.data.success;

        if (!$scope.showSignInButton) {
          me.gridProperties.url = "/filesList";
        }
      });
    }

    function defineGridColumnsAndProperties() {
      me.gridColumns = [
        {
          headerName: 'Actions',
          minWidth: 150,
          maxWidth: 150,
          cellClass: 'actionColumn',
          cellRenderer: actionColumnRenderer
        },
        {
          headerName: 'File',
          field: 'name',
          minWidth: 150,
          cellRenderer: fileCellRenderer
        }
      ];
      me.gridProperties = {
        url: '',
        customGridOptions: {
          getRowNodeId: function (data) {
            return data.id;
          }
        }
      };

      me.grid = null;

      me.rowActions = {
        deleteRow: deleteRow
      }
    }

    // action column renderer
    function actionColumnRenderer(params) {
      var columnTemplate = '';

      if (params.data) {
        //the current user should not be deleted from the user list
        var deleteButton = '<li class="action deleteRow" data-row-id="' + params.node.id + '"></li>';

        columnTemplate = '<ul class="actionList">' +
          deleteButton +
          '               </ul>';
      }

      return columnTemplate;
    }

    // file cell renderer
    function fileCellRenderer(params) {
      var columnTemplate = '';

      if (params.data) {
        columnTemplate = "<div class='file'>" +
          "<img class='fileThumbnail' src='" + params.data.thumb + "' alt='" + params.data.name + "'>" +
          "<span class='filename'>" + params.data.name + "</span>" +
          "</div>"
      }

      return columnTemplate;
    }

    // delete row action
    function deleteRow() {
      var $button = $(this);
      var rowId = $button.data('rowId');

      $http.post("delete/" + rowId).then(function (response) {
        var data = response.data;

        if (data.ok) {
          notificationMessage.showNotificationMessage("Success", "success");

          me.grid.api.refreshInfiniteCache();
        } else {
          notificationMessage.showNotificationMessage(data.error, "error");
        }
      })
    }
  }
})();
