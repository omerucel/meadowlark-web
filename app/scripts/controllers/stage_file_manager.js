'use strict';

angular.module('meadowlarkWebApp')
	.controller('StageFileManagerCtrl', function ($scope, FileManagerService) {
		$scope.FileManager = new FileManagerService($scope, 'stage');
	});