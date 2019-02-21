'use strict';

(function () {
  angular.module('slackFileBuster')
    .component('agGrid', {
      templateUrl: 'scripts/common/components/agGrid/agGrid.template.html',
      controller: agGridController,
      bindings: {
        gridColumns: "<",
        gridProperties: "<",
        grid: '=',
        rowActions: '<'
      }
    });

  agGridController.$inject = ['$scope', '$http', '$rootScope'];

  function agGridController($scope, $http, $rootScope) {
    var me = this;

    me.$onInit = function () {
      var defaultGridOptions = {
        columnDefs: me.gridColumns,
        onGridReady: onGridReadyHandler,
        animateRows: false,
        rowSelection: 'single',
        suppressContextMenu: true,
        suppressMenuHide: true,
        suppressCellSelection: true,
        floatingFilter: false,
        cacheOverflowSize: 2,
        paginationPageSize: 20,
        rowBuffer: 0,
        maxConcurrentDatasourceRequests: 2,
        infiniteInitialRowCount: 1,
        maxBlocksInCache: 2,
        cacheBlockSize: 20,
        overlayLoadingTemplate: '<div class="ag-overlay-loading-center customLoadingOverlay">' +
          '                         <i class="icon fas fa-circle-notch"></i>' +
          '                         <div class="message">Please wait while your rows are loading</div>' +
          '                      </div>',
        overlayNoRowsTemplate: '<div class="noRowsOverlay">' +
          '                         <i class="icon far fa-sad-tear"></i>' +
          '                         <div class="message">No records to be displayed</div>' +
          '                     </div>'
      };

      $scope.gridOptions = _.merge(defaultGridOptions, me.gridProperties.customGridOptions);

      initEvents();
    };

    /**
     * Handler when the grid is ready
     * @return {void}
     */
    function onGridReadyHandler() {
      requestGridData();

      $scope.gridOptions.api.sizeColumnsToFit();

      if (!_.isUndefined(me.grid)) {
        me.grid = $scope.gridOptions;
      }

      addRowActionsHandlers();

      me.grid.api.requestGridData = requestGridData;
    }

    /**
     * Events used by grid
     */
    function initEvents() {
      var fitColumns = function () {
        $scope.gridOptions.api.sizeColumnsToFit();
      };

      $(window).on('resize', $.debounce(300, fitColumns));
    }

    /**
     * Get data from the server
     * @return {void}
     */
    function requestGridData() {
      if (me.gridProperties.url) {
        $scope.gridOptions.api.deselectAll();

        $scope.gridOptions.api.showLoadingOverlay();

        $http.get(me.gridProperties.url, {
          params: {
            filters: me.gridProperties.filters
          }
        }).then(function (response) {
          var results = response.data.results;
          var totalFilesSize = response.data.totalSize;

          $scope.gridOptions.api.setRowData(results);

          if (results.length) {
            $scope.gridOptions.api.hideOverlay();
          } else {
            $scope.gridOptions.api.showNoRowsOverlay();
          }

          $scope.gridOptions.api.sizeColumnsToFit();

          $rootScope.$broadcast("gridDataReady", results.length, totalFilesSize);

        });
      } else {
        $scope.gridOptions.api.setRowData([]);

        $scope.gridOptions.api.showNoRowsOverlay();
      }
    }

    function addRowActionsHandlers() {
      for (var key in me.rowActions) {
        if (me.rowActions.hasOwnProperty(key)) {
          $(me.grid.api.gridCore.eGridDiv).on('click', '.action.' + key, me.rowActions[key]);
        }
      }
    }
  }
}());
