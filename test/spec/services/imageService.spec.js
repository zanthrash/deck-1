/*
 * Copyright 2014 Netflix, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

describe('Service: NamedImage', function() {

  var service, $http, config, scope, timeout;

  beforeEach(loadDeckWithoutCacheInitializer);

  beforeEach(inject(function (settings, imageService, $httpBackend, $rootScope, $timeout) {

    service = imageService;
    config = settings;
    $http = $httpBackend;
    timeout = $timeout;
    scope = $rootScope.$new();

  }));

  afterEach(function() {
    $http.verifyNoOutstandingRequest();
  });

  describe('findImages', function () {

    var query = 'abc', region = 'us-west-1', credentials = 'test';

    function buildQueryString() {
      return config.oortUrl + '/aws/images/find?account='+ credentials + '&q='+query + '&region=' + region;
    }

    it('queries oort when 3 or more characters are supplied', function() {
      var result = null;

      $http.when('GET', buildQueryString()).respond(200, [
        {success: true}
      ]);

      service.findImages(query, region, credentials).then(function(results) {
        result = results;
      });

      $http.flush();

      expect(result.length).toBe(1);
      expect(result[0].success).toBe(true);

      query = 'abcd';

      $http.when('GET', buildQueryString()).respond(200, [
        {success: true}
      ]);

      service.findImages(query, region, credentials).then(function(results) {
        result = results;
      });

      $http.flush();

      expect(result.length).toBe(1);
      expect(result[0].success).toBe(true);
    });

    it('returns a message prompting user to enter more characters when less than 3 are supplied', function() {
      query = 'ab';

      var result = null;

      service.findImages(query, region, credentials).then(function(results) {
        result = results;
      });

      scope.$digest();

      expect(result.length).toBe(1);
      expect(result[0].message).toBe('Please enter at least 3 characters...');
    });

    it('returns an empty array when server errors', function() {
      query = 'abc';
      var result = null;

      $http.when('GET', buildQueryString()).respond(404, {});

      service.findImages(query, region, credentials).then(function(results) {
        result = results;
      });

      $http.flush();

      expect(result.length).toBe(0);
    });
  });

  describe('getAmi', function() {
    var imageName = 'abc', region = 'us-west-1', credentials = 'test';

    function buildQueryString() {
      return config.oortUrl + ['/aws/images', credentials, region, imageName].join('/');
    }

    it('returns null if server returns 404 or an empty list', function() {
      var result = 'not null';

      $http.when('GET', buildQueryString()).respond(404, {});

      service.getAmi(imageName, region, credentials).then(function(results) {
        result = results;
      });

      $http.flush();

      expect(result).toBe(null);

      result = 'not null';

      $http.when('GET', buildQueryString()).respond(200, []);

      service.getAmi(imageName, region, credentials).then(function(results) {
        result = results;
      });

      $http.flush();

      expect(result).toBe(null);
    });
  });

});