'use strict';

(function () {
  angular.module("slackDeleteFiles")
    .controller('mainController', mainController);

  mainController.$inject = ['$scope', '$http', 'notyMessageService', "slackDeleteFilesConst", "$state"];

  function mainController($scope, $http, notyMessageService, slackDeleteFilesConst, $state) {
    var me = this;

    me.$onInit = function () {
      $scope.showSignInButton = true;

      $scope.multipleToolbar = false;
      $scope.showToolbar = false;

      initFilterByChannels();

      initFilterByTypes();

      checkAuthentication();

      $scope.signInWithSlack = signInWithSlack;
      $scope.signOut = signOut;

      $scope.deleteSelected = deleteSelected;
      $scope.deleteAllRowsDisplayed = deleteAllRowsDisplayed;

      $scope.applyFilters = applyFilters;
      $scope.resetFilters = resetFilters;

      defineGridColumnsAndProperties();

      initEvents();
    };

    /**
     * Init and configure filter by channels
     * @return {void}
     */
    function initFilterByChannels() {
      $scope.showFilterByChannels = false;

      $scope.filterByChannelsConfiguration = {
        options: [
          {
            "text": "All channels",
            "value": ""
          }
        ],
        items: [""],
        maxItems: 1,
        placeholder: "Select channel",
        onChange: function (value) {
          me.gridProperties.filters.channel = value;
        }
      };
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
            "text": "All videos",
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
          getUserDetails();

          // get channels
          getChannels();
        }
      });
    }

    /**
     * Get user details
     * @return {void}
     */
    function getUserDetails() {
      $http.get("/userDetails").then(function (response) {
        $scope.user = response.data.user;

        if (!$scope.user) {
          $scope.user = {
            name: "Unavailable",
            avatar: ""
          };
        }
      });
    }

    /**
     * Get channels list
     * @return {void}
     */
    function getChannels() {
      $http.get("/channelsList").then(function (response) {
        $scope.filterByChannelsConfiguration.options = _.concat($scope.filterByChannelsConfiguration.options, response.data.results);

        // show channels filter
        $scope.showFilterByChannels = true;
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
     * Sign out function
     * @return {void}
     */
    function signOut() {
      $http.get("/signOut").then(function (response) {
        $state.reload();
      });
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
     * Reset filters to the default values
     * @return {void}
     */
    function resetFilters() {
      // reset channels filter
      var channelsFilterSelectize = angular.element(".channelsFilter").data("selectize");
      channelsFilterSelectize.setValue("");

      // reset channels filter
      var typesFilterSelectize = angular.element(".typesFilter").data("selectize");
      typesFilterSelectize.setValue("");

      me.grid.api.requestGridData();
    }

    /**
     * Mass delete files
     * @param {Object} rows - selected rows
     * @return {void}
     */
    function deleteRows(rows) {
      var buttons = [
        Noty.button('NO', 'flatButton', function () {
          Noty.closeAll();
        }),

        Noty.button('YES', 'flatButton', function () {
          $http.post("massDelete", {
            filesId: rows
          }).then(function (response) {
            var data = response.data;

            if (data.ok) {
              var filesWithoutError = _.filter(data.results, 'ok');

              if (filesWithoutError.length) {
                notyMessageService.showNotificationMessage("Files successfully deleted!", "success");
              } else {
                notyMessageService.showNotificationMessage("Some files weren't been deleted!", "error");
              }

              me.grid.api.requestGridData();
            }
          });
        })
      ];

      notyMessageService.showConfirmationMessage("Are you sure you want to delete the selected file?", buttons);
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
        var thumbnail = "<span class='fileThumbnail noThumbnail'></span>";

        if (params.data.thumb) {
          thumbnail = "<img class='fileThumbnail' src='" + params.data.thumb + "' alt='" + params.data.name + "'>";
        }

        columnTemplate = "<div class='file'>" +
          thumbnail +
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

      var buttons = [
        Noty.button('NO', 'flatButton', function () {
          Noty.closeAll();
        }),

        Noty.button('YES', 'flatButton', function () {
          $http.post("delete/" + rowId).then(function (response) {
            var data = response.data;

            if (data.ok) {
              notyMessageService.showNotificationMessage("File successfully deleted!", "success");

            } else {
              notyMessageService.showNotificationMessage(slackDeleteFilesConst.DELETE_ERRORS[data.error], "error");
            }

            me.grid.api.requestGridData();
          });
        })
      ];

      notyMessageService.showConfirmationMessage("Are you sure you want to delete the selected file?", buttons);
    }

    /**
     * Init events used in page
     * @return {void}
     */
    function initEvents() {
      $scope.$on("gridDataReady", function () {
        // display the single toolbar button only when grid is loaded
        $scope.showToolbar = true;

        // show file types filter
        $scope.showFilterByTypes = true;
      });
    }
  }
})();