'use strict';

(function () {
  angular.module('slackDeleteFiles')
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

  agGridController.$inject = ['$scope', '$http'];

  function agGridController($scope, $http) {
    var me = this;

    me.$onInit = function () {
      var defaultGridOptions = {
        columnDefs: me.gridColumns,
        onGridReady: onGridReadyHandler,
        animateRows: true,
        rowSelection: 'single',
        suppressContextMenu: true,
        suppressMenuHide: true,
        suppressCellSelection: true,
        floatingFilter: false,
        cacheOverflowSize: 2,
        rowModelType: 'infinite',
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
          '                         <div class="message">No rows to be displayed</div>' +
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
      var dataSource = {
        rowCount: null,
        getRows: requestGridData
      };

      $scope.gridOptions.api.setDatasource(dataSource);
      $scope.gridOptions.api.sizeColumnsToFit();

      if (!_.isUndefined(me.grid)) {
        me.grid = $scope.gridOptions;
      }

      addRowActionsHandlers();
    }

    /**
     * Events used by grid
     */
    function initEvents() {
      var fitColumns = function () {
        $scope.gridOptions.api.sizeColumnsToFit();
      };

      $(window).on('resize', $.debounce( 300 , fitColumns ))
    }

    /**
     * Get data from the server
     * @param {Object} params - grid options
     * @return {void}
     */
    function requestGridData(params) {
      if (me.gridProperties.url) {

        $scope.gridOptions.api.showLoadingOverlay();

        $http.get(me.gridProperties.url, {
          params: {
            start: params.startRow,
            limit: $scope.gridOptions.paginationPageSize
          }
        }).then(function (response) {
          var results = response.data.results;
          var total = response.data.total;

          params.successCallback(results, total);

          if (!_.isEmpty(results)) {
            $scope.gridOptions.api.hideOverlay();
          } else {
            $scope.gridOptions.api.showNoRowsOverlay();
          }

          $scope.gridOptions.api.sizeColumnsToFit();

        });
      } else {
        params.successCallback([], 0);

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
