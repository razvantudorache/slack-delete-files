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
        cacheBlockSize: 20
      };

      // $scope.gridOptions = _.merge(defaultGridOptions, me.gridProperties.customGridOptions);
      $scope.gridOptions = defaultGridOptions;

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
     * Get data from the server
     * @param {Object} params - grid options
     * @return {void}
     */
    function requestGridData(params) {
      $http.get(me.gridProperties.url, {
        params: {
          start: params.startRow,
          limit: $scope.gridOptions.paginationPageSize
        }
      }).then(function (response) {
        var results = response.data.docs;
        var total = response.data.total;

        params.successCallback(results, total);
      });
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
