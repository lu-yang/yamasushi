'use strict';

/* Services */

var phonecatServices = angular.module('phonecatServices', [ 'ngResource' ]);

phonecatServices.factory('Phone', [ '$resource', function($resource) {
	return $resource('phones/:phoneId.json', {}, {
		query : {
			method : 'GET',
			params : {
				phoneId : 'phones'
			},
			isArray : true
		}
	});
} ]);

//
var ProductService = angular.module('ProductService', [ 'ngResource' ]);

ProductService.factory('Product', [ '$resource', function($resource) {
	return $resource('products/:locale/:categoryId', {}, {
		query : {
			method : 'GET',
			params : {
				locale : 'phones'
			},
			isArray : true
		}
	});
} ]);

var baseUrl = 'http://localhost:8080/sushibuffet/';
var authorization = 'YWRtaW46cGFzMndvcmQ=';
var locale = 'fr';

var REQ = {
	headers : {
		'Content-Type' : 'application/json',
		'Authorization' : 'Basic ' + authorization,
		'Access-Control-Allow-Origin' : '*'
	}
};
var GET = {
	method : 'GET'
};
angular.extend(GET, REQ);
var POST = {
	method : 'POST'
};
angular.extend(POST, REQ);
