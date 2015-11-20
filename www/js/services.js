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

var baseUrl = '';
var defaultThumb = '';
var categoryRootUrl = '';
var productRootUrl = '';
var authorization = 'YWRtaW46cGFzMndvcmQ=';
var locale = 'fr';

var REQ = {
	headers : {
		'Content-Type' : 'application/json',
		'Authorization' : 'Basic ' + authorization
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

function convertImageURL(thumb) {
	thumb = thumb ? thumb : defaultThumb;
	return productRootUrl + thumb;
}

function convertCatImageURL(thumb) {
	thumb = thumb ? thumb : defaultThumb;
	return categoryRootUrl + thumb;
}
