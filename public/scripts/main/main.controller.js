'use strict';

(function () {
  angular.module("slackFileBuster")
    .controller('mainController', mainController);

  mainController.$inject = ['$scope', '$http', 'notyMessageService', "slackFileBusterConst", "$state"];

  function mainController($scope, $http, notyMessageService, slackFileBusterConst, $state) {
    var me = this;

    me.$onInit = function () {
      $scope.deleteSelectedRecords = 0;
      $scope.deleteDisplayedRecords = null;

      $scope.showSignInButton = true;

      $scope.multipleToolbar = false;
      $scope.showToolbar = false;

      $scope.showGrid = false;

      initFilterByChannels();

      initFilterByTypes();

      checkAuthentication();

      $scope.signInWithSlack = signInWithSlack;
      $scope.signOut = signOut;

      $scope.deleteSelected = deleteSelected;
      $scope.deleteRowsDisplayed = deleteRowsDisplayed;

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
          },
          {
            "text": "My files",
            "value": "my"
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

        $scope.showGrid = true;
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
    function deleteRowsDisplayed() {
      var filesId = [];

      me.grid.api.forEachNode(function (rowNode, index) {
        if (index < slackFileBusterConst.MAX_DELETE_FILES) {
          filesId.push(rowNode.data.id);
        } else {
          return;
        }
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
          Noty.closeAll();

          $http.post("massDelete", {
            filesId: rows
          }).then(function (response) {
            var data = response.data;

            if (data.ok) {
              var filesWithoutError = _.filter(data.results, 'ok');

              if (filesWithoutError.length) {
                notyMessageService.showNotificationMessage("Files successfully deleted!", "success");
              } else {
                notyMessageService.showNotificationMessage("Some files have not been deleted!", "error");
              }

              me.grid.api.requestGridData();
            }
          });
        })
      ];

      notyMessageService.showConfirmationMessage("Are you sure you want to delete the selected file(s)?", buttons);
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
        },
        {
          headerName: 'Size',
          field: 'size',
          minWidth: 200,
          maxWidth: 200,
          filter: "agTextColumnFilter",
          filterParams: {
            newRowsAction: "keep",
            suppressAndOrCondition: true
          }
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
          },
          onRowSelected: rowSelectedHandler
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
     * Event on row selected
     * @param {Object} params - grid params
     * @return {void}
     */
    function rowSelectedHandler (params) {
      var selectedRecords = me.grid.api.getSelectedRows().length;
      var node = params.node;

      if (selectedRecords > slackFileBusterConst.MAX_DELETE_FILES) {
        node.setSelected(false);

        notyMessageService.showNotificationMessage("You reached the maximum number of files that can be deleted at once!", "warning");
      }

      $scope.deleteSelectedRecords = me.grid.api.getSelectedRows().length;
      $scope.$apply();
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
          Noty.closeAll();

          $http.post("delete/" + rowId).then(function (response) {
            var data = response.data;

            if (data.ok) {
              notyMessageService.showNotificationMessage("File successfully deleted!", "success");

            } else {
              notyMessageService.showNotificationMessage(slackFileBusterConst.DELETE_ERRORS[data.error], "error");
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
      $scope.$on("gridDataReady", function (event, totalRecords) {
        // display the single toolbar button only when grid is loaded
        $scope.showToolbar = !!totalRecords;

        // show file types filter
        $scope.showFilterByTypes = true;

        $scope.deleteDisplayedRecords = totalRecords > slackFileBusterConst.MAX_DELETE_FILES ? slackFileBusterConst.MAX_DELETE_FILES : totalRecords;
      });
    }
  }
})();