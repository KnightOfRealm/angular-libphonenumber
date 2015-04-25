/**
 * @ngdoc filter
 * @name phone-number
 * @kind function
 *
 * @description
 * filters a user typed phone number into a formatted number
 *
 */
/* global phoneUtils, angular */
angular.module('cwill747.phonenumber', [])
  .directive('phoneNumber', ['$log', function($log) {
    function clearValue(value) {
      if (!value) {
        return value;
      }
      return value.replace(/([^0-9|+])/g, '');
    }

    function applyPhoneMask(value, region) {
      if (!value) {
        return value;
      }
      else {
        var phoneMask = value;
        try {
          phoneMask = phoneUtils.formatAsTyped(value, region);
        }
        catch (err) {
          $log.debug(err);
        }
        return phoneMask;
      }
    }

    return {
      restrict: 'A',
      require: '?ngModel',
      scope: {
        countryCode: '='
      },
      controllerAs: '',
      controller: function() {
        this.countryCode = this.countryCode || 'us';
      },
      link: function(scope, element, attrs, ctrl) {
        function formatter(value) {
          if (ctrl.$isEmpty(value)) {
            return value;
          }
          return applyPhoneMask(clearValue(value), scope.countryCode);
        }

        function parser(value) {
          if (ctrl.$isEmpty(value)) {
            return value;
          }

          var cleanValue = clearValue(value);
          var formattedValue = '';
          if (cleanValue.length > 1) {
            formattedValue = applyPhoneMask(cleanValue, scope.countryCode);
          }
          else {
            formattedValue = cleanValue;
          }
          if (ctrl.$viewValue !== formattedValue) {
            ctrl.$setViewValue(formattedValue);
            ctrl.$render();
          }
          return clearValue(formattedValue);
        }

        function validator(value) {
          var isValidForRegion = false;
          try {
            isValidForRegion = phoneUtils.isValidNumberForRegion(value, scope.countryCode);
          }
          catch (err) {
            $log.debug(err);
          }
          var valid = ctrl.$isEmpty(value) || isValidForRegion;
          ctrl.$setValidity('phoneNumber', valid);
          return value;
        }

        ctrl.$formatters.push(formatter);
        ctrl.$formatters.push(validator);
        ctrl.$parsers.push(parser);
        ctrl.$parsers.push(validator);
      }
    };

  }]);