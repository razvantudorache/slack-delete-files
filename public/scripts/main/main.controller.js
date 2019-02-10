'use strict';

(function () {
  angular.module("slackDeleteFiles")
    .controller('mainController', mainController);

  mainController.$inject = ['$scope', '$http', 'notificationMessage', "slackDeleteFilesConst"];

  function mainController($scope, $http, notificationMessage, slackDeleteFilesConst) {
    var me = this;

    me.$onInit = function () {
      $scope.showSignInButton = true;

      $scope.multipleToolbar = false;
      $scope.showToolbar = false;

      initFilterByChannels();

      initFilterByTypes();

      checkAuthentication();

      $scope.signInWithSlack = signInWithSlack;

      $scope.deleteSelected = deleteSelected;
      $scope.deleteAllRowsDisplayed = deleteAllRowsDisplayed;

      $scope.applyFilters = applyFilters;

      defineGridColumnsAndProperties();

      initEvents();
    };

    /**
     * Init and configure filter by channels
     * @return {void}
     */
    function initFilterByChannels() {
      $scope.showFilterByChannels = false;

    }

    /**
     * Init and configure filter by types
     * @return {void}
     */
    function initFilterByTypes() {
      $scope.showFilterByTypes = false;

      $scope.filterByTypeConfiguration = {
        options: [
          {
            "text": "All files",
            "value": ""
          },
          {
            "text": "All images",
            "value": "image"
          },
          {
            "text": "All video",
            "value": "video"
          },
          {
            "text": "All archives",
            "value": "archive"
          },
          {
            "text": "All documents",
            "value": "doc"
          },
          {
            "text": "All text files",
            "value": "text"
          }
        ],
        items: [""],
        maxItems: 1,
        placeholder: "Select file type",
        onChange: function (value) {
          me.gridProperties.filters.type = value;
        }
      };
    }



    /**
     * Show/hide sign in button based of the authentication value
     * @return {void}
     */
    function checkAuthentication() {
      $http.get("/authCheck").then(function (response) {
        $scope.showSignInButton = !response.data.success;

        if (!$scope.showSignInButton) {
          // set url to get files list
          me.gridProperties.url = "/filesList";

          // get user details
          //TODO implement

          // get channels
          //TODO implement
        }
      });
    }

    /**
     * Sign in action
     * @return {void}
     */
    function signInWithSlack() {
      location.href = "https://slack.com/oauth/authorize?scope=users:read,channels:read,groups:read,files:read,files:write:user&client_id=101540185972.527491816113";
    }

    /**
     * Delete selected rows
     * @return {void}
     */
    function deleteSelected() {
      var selectedRecords = me.grid.api.getSelectedRows();

      var filesId = [];
      _.forEach(selectedRecords, function (value) {
        filesId.push(value.id);
      });

      deleteRows(filesId);
    }

    /**
     * Delete all rows displayed on UI
     * @return {void}
     */
    function deleteAllRowsDisplayed() {
      var filesId = [];

      me.grid.api.forEachNode(function (rowNode, index) {
        filesId.push(rowNode.data.id);
      });

      deleteRows(filesId);
    }

    /**
     * Apply selected filter(s)
     * @return {void}
     */
    function applyFilters() {
      me.grid.api.requestGridData();
    }

    /**
     * Mass delete files
     * @param {Object} rows - selected rows
     * @return {void}
     */
    function deleteRows(rows) {
      $http.post("massDelete", {
        filesId: rows
      }).then(function (response) {
        var data = response.data;

        if (data.ok) {
          var filesWithoutError = _.filter(data.results, 'ok');

          if (filesWithoutError.length) {
            notificationMessage.showNotificationMessage("Files successfully deleted!", "success");
          } else {
            notificationMessage.showNotificationMessage("Some files weren't been deleted!", "error");
          }

          me.grid.api.requestGridData();

          me.grid.api.deselectAll();
        }
      });
    }

    /**
     * Columns and grid properties
     * @return {void}
     */
    function defineGridColumnsAndProperties() {
      me.gridColumns = [
        {
          minWidth: 80,
          maxWidth: 80,
          cellClass: "checkboxCell",
          checkboxSelection: true
        },
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
        filters: {
          channel: "",
          type: ""
        },
        customGridOptions: {
          suppressRowClickSelection: true,
          onSelectionChanged: selectionChangedHandler,
          rowSelection: 'multiple',
          getRowNodeId: function (data) {
            return data.id;
          }
        }
      };

      me.grid = null;

      me.rowActions = {
        deleteRow: deleteRow
      };
    }

    /**
     * Action column renderer
     * @param {Object} params - column params
     * @returns {string} - column template
     */
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

    /**
     * File cell renderer
     * @param {Object} params - column params
     * @returns {string} - column template
     */
    function fileCellRenderer(params) {
      var columnTemplate = '';

      if (params.data) {
        columnTemplate = "<div class='file'>" +
          "<img class='fileThumbnail' src='" + params.data.thumb + "' alt='" + params.data.name + "'>" +
          "<span class='filename'>" + params.data.name + "</span>" +
          "</div>";
      }

      return columnTemplate;
    }

    /**
     * Show/hide multiple toolbar on row selection
     * @return {void}
     */
    function selectionChangedHandler() {
      var hasSelectedRows = me.grid.api.getSelectedRows().length > 0;

      if ($scope.multipleToolbar !== hasSelectedRows) {
        $scope.multipleToolbar = hasSelectedRows;
        $scope.$apply();
      }
    }

    /**
     * Delete row action
     * @return {void}
     */
    function deleteRow() {
      var $button = $(this);
      var rowId = $button.data('rowId');

      $http.post("delete/" + rowId).then(function (response) {
        var data = response.data;

        if (data.ok) {
          notificationMessage.showNotificationMessage("File successfully deleted!", "success");

          me.grid.api.requestGridData();
        } else {
          notificationMessage.showNotificationMessage(slackDeleteFilesConst.DELETE_ERRORS[data.error], "error");
        }
      });
    }

    /**
     * Init events used in page
     * @return {void}
     */
    function initEvents () {
      $scope.$on("gridDataReady", function () {
        // display the single toolbar button only when grid is loaded
        $scope.showToolbar = true;

        // show file types filters
        $scope.showFilterByTypes = true;
      });
    }
  }
})();