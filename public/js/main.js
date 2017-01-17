var app = angular.module('appointmentApp', ['ngMaterial', 'ngMdIcons', 'moment-picker']);

app.controller('appointmentController', ['$scope', '$rootScope', '$mdBottomSheet','$mdSidenav', '$mdDialog', '$http', function($scope, $rootScope, $mdBottomSheet, $mdSidenav, $mdDialog, $http){
	
	$rootScope.editAppointment = [];
	
	/*
	 * DEFINE SELECTED ORDER DEFAULT VALUE FOR SORTING LISTING OF APPOINTMENT.
	 */
	$scope.selectedOrder = 'startTime';
	
	
	/*
	 * GET APPOINTMENT JSON FILE FROM THE PUBLIC FOLDER TO LOAD AND RENDER THE LISTING.
	 */
	$http.get('appointment.json').then(function(res){
		$rootScope.appointments = res.data; 
	});
	// END


	/*
	 * This scope function has been used in order to ADD NEW RECORD OF APPOINTMENT.
	 * BY CLICKING + SIGN ON THE HTML THIS FUNCTION WILL COMES IN TO THE PICTURE.
	 * Use @ index.html
	 */
	$scope.showAdd = function(ev) {
		
		$rootScope.editAppointment = [];
		
		$rootScope.dialogTitle = 'Add';
		$mdDialog.show({
			controller: DialogController,
			templateUrl: 'appointment.html',
			parent: angular.element(document.body),
		    targetEvent: ev,
		    clickOutsideToClose:false
		})
		.then(function(answer) {
			console.log('save');
		}, function() {
			$scope.alert = 'You cancelled the dialog.';
		});
	};
	// END
	
	/*
	 * This scope function has been used in order to ADD NEW RECORD OF APPOINTMENT.
	 * BY CLICKING + SIGN ON THE HTML THIS FUNCTION WILL COMES IN TO THE PICTURE.
	 * Use @ index.html
	 */
	$scope.showEdit = function(appointment) {
		
		$rootScope.editAppointment = angular.copy(appointment);
		$rootScope.dialogTitle = 'Edit';
		
		if ($rootScope.editAppointment) {
			if ($rootScope.editAppointment.startTime) {
				$rootScope.editAppointment.startTime = moment($rootScope.editAppointment.startTime).format('lll');
			}
			
			if ($rootScope.editAppointment.endTime) {
				$rootScope.editAppointment.endTime = moment($rootScope.editAppointment.endTime).format('lll');
			}
		} 
		
		$mdDialog.show({
			controller: DialogController,
			templateUrl: 'appointment.html',
			parent: angular.element(document.body),
		    clickOutsideToClose:false
		})
		.then(function(answer) {
			console.log('save');
		}, function() {
			$scope.alert = 'You cancelled the dialog.';
		});
	};
	// END

	
	/*
	 * This scope function has been used in order to DELETE THE RECORD
	 * Use @ index.html
	 */
	$scope.deleteRecord = function(appointment){
		 var confirm = $mdDialog.confirm()
         .title('Are you sure?')
         .textContent('Would you like to delete appointment?')
         .ariaLabel('Delete Appointment')
         .ok('Please do it!')
         .cancel('Oh No');

	   $mdDialog.show(confirm).then(function() {
		   var index = $rootScope.appointments.indexOf(appointment);
		   $rootScope.appointments.splice(index, 1);
	   }, function() {
	     	// Do nothing.
	   });
	};
	// END
	
	
	/*
	 * This scope function has been used in order to sort listing of appointments depends on the selection.
	 * Use @ index.html
	 */
	$scope.orderBy = function(order){
		$scope.selectedOrder = order;
	}
}]);

/*
 * DESCRIPTION: CONTROLLER FOR DIALOG WHEN ADDING/EDITING APPOINTMENT.
 * Use @ main.js
 */
function DialogController($scope, $rootScope, $mdDialog) {
	
	$scope.dialogTitle = $rootScope.dialogTitle;
	
	$scope.appointment = angular.copy($rootScope.editAppointment);
	
	/*
	 * MATERIAL DIALOG BOX PREDEFINED FUNCTIONS 
	 */
	$scope.hide = function() {
		$mdDialog.hide();
	};
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	$scope.answer = function(answer) {
		$mdDialog.hide(answer);
	};
	// END
	
	
	/*
	 * WHEN USER CLICK ON SAVING OF THE APPOINTMENT.
	 * ALSO CHECKS FOR THE VALIDATION(S) AND PROPER RETURN MESSAGE.
	 */
	$scope.submitForm = function(appointment){
		$scope.showTitleError = false;
		$scope.showDateError = false;
		$scope.showEmailError = false;
		$scope.showPhoneError = false;
		
		
		// console.log('appointment', appointment);
		
		var validate = true;
		
		validate = $scope.validateForm(appointment);
		console.log('validate', validate);
		
		// Go Inside if validate returns true and has new/updated appointment object.
		if (appointment && validate) {
				if (appointment.id) {
					var key = appointment.id - 1;
					
					$rootScope.appointments[key].title = appointment.title;
					$rootScope.appointments[key].startTime = appointment.startTime;
					$rootScope.appointments[key].endTime = appointment.endTime;
					$rootScope.appointments[key].about = appointment.about;
					$rootScope.appointments[key].email = appointment.email;
					$rootScope.appointments[key].phone = appointment.phone ? appointment.phone : '';
				}
				else {
					var temp_app = [];
					
					temp_app.title = appointment.title;
					temp_app.startTime = new Date(appointment.startTime);
					temp_app.endTime = new Date(appointment.endTime);
					temp_app.about = appointment.about;
					temp_app.email = appointment.email;
					temp_app.phone = appointment.phone;
					
					$rootScope.appointments.push(temp_app);	
				}
				
			$mdDialog.hide('save');
		}
	};
	// END of SubmitForm
	
	
	/*
	 * Function to validate submitted form. 
	 */
	$scope.validateForm = function(appointment) {
		
		if (!appointment.title) {
			$scope.showTitleError = true;
			return false;
		}
		
		if (!appointment.startTime || !appointment.endTime) {
			$scope.showDateError = true;
			return false;
		}
		
		if (!appointment.email) {
			$scope.showEmailError = true;
			return false;
		}
		
		if (appointment.phone) {
			// Check against the format
			if (/^[(][0-9]{3}[)] [0-9]{3}-[0-9]{4}$/.test(appointment.phone)) {
				$scope.showPhoneError = false;
				return true;				
			} else {
				console.log(454);
				$scope.showPhoneError = true;
				return false;
			}
		}
		else {
			$scope.showPhoneError = false;
			return true;
		}
	};
	
};
// END OF DialogController


/*
 * DIRECTIVE FOR userAvatar.
 * Use @ index.html 
 */
app.directive('userAvatar', function() {
	return {
		replace: true,
		template: '<svg class="user-avatar" viewBox="0 0 128 128" height="150" width="150" pointer-events="none" display="block" > <path fill="#FF8A80" d="M0 0h128v128H0z"/> <path fill="#FFE0B2" d="M36.3 94.8c6.4 7.3 16.2 12.1 27.3 12.4 10.7-.3 20.3-4.7 26.7-11.6l.2.1c-17-13.3-12.9-23.4-8.5-28.6 1.3-1.2 2.8-2.5 4.4-3.9l13.1-11c1.5-1.2 2.6-3 2.9-5.1.6-4.4-2.5-8.4-6.9-9.1-1.5-.2-3 0-4.3.6-.3-1.3-.4-2.7-1.6-3.5-1.4-.9-2.8-1.7-4.2-2.5-7.1-3.9-14.9-6.6-23-7.9-5.4-.9-11-1.2-16.1.7-3.3 1.2-6.1 3.2-8.7 5.6-1.3 1.2-2.5 2.4-3.7 3.7l-1.8 1.9c-.3.3-.5.6-.8.8-.1.1-.2 0-.4.2.1.2.1.5.1.6-1-.3-2.1-.4-3.2-.2-4.4.6-7.5 4.7-6.9 9.1.3 2.1 1.3 3.8 2.8 5.1l11 9.3c1.8 1.5 3.3 3.8 4.6 5.7 1.5 2.3 2.8 4.9 3.5 7.6 1.7 6.8-.8 13.4-5.4 18.4-.5.6-1.1 1-1.4 1.7-.2.6-.4 1.3-.6 2-.4 1.5-.5 3.1-.3 4.6.4 3.1 1.8 6.1 4.1 8.2 3.3 3 8 4 12.4 4.5 5.2.6 10.5.7 15.7.2 4.5-.4 9.1-1.2 13-3.4 5.6-3.1 9.6-8.9 10.5-15.2M76.4 46c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6-.1-.9.7-1.6 1.6-1.6zm-25.7 0c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6-.1-.9.7-1.6 1.6-1.6z"/> <path fill="#E0F7FA" d="M105.3 106.1c-.9-1.3-1.3-1.9-1.3-1.9l-.2-.3c-.6-.9-1.2-1.7-1.9-2.4-3.2-3.5-7.3-5.4-11.4-5.7 0 0 .1 0 .1.1l-.2-.1c-6.4 6.9-16 11.3-26.7 11.6-11.2-.3-21.1-5.1-27.5-12.6-.1.2-.2.4-.2.5-3.1.9-6 2.7-8.4 5.4l-.2.2s-.5.6-1.5 1.7c-.9 1.1-2.2 2.6-3.7 4.5-3.1 3.9-7.2 9.5-11.7 16.6-.9 1.4-1.7 2.8-2.6 4.3h109.6c-3.4-7.1-6.5-12.8-8.9-16.9-1.5-2.2-2.6-3.8-3.3-5z"/> <circle fill="#444" cx="76.3" cy="47.5" r="2"/> <circle fill="#444" cx="50.7" cy="47.6" r="2"/> <path fill="#444" d="M48.1 27.4c4.5 5.9 15.5 12.1 42.4 8.4-2.2-6.9-6.8-12.6-12.6-16.4C95.1 20.9 92 10 92 10c-1.4 5.5-11.1 4.4-11.1 4.4H62.1c-1.7-.1-3.4 0-5.2.3-12.8 1.8-22.6 11.1-25.7 22.9 10.6-1.9 15.3-7.6 16.9-10.2z"/> </svg>'
	};
});
// END