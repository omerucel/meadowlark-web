'use strict';

angular.module('meadowlarkWebApp')
	.controller('WelcomeCtrl', function ($scope, UserResource) {
		if (UserResource.isAuthenticated === false)
		{
			return;
		}

		$scope.$emit('setPageHeader', 'Hoş geldiniz!', true);
		$scope.$emit('setCurrentMenu', '');
	});
