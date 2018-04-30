"use strict";

/**
 * Perform basic validations
 *
 * @module helpers/basic
 */

const rootPrefix = '..'
;

/**
 * Basic helper methods constructor
 *
 * @constructor
 *
 */
const BasicHelperKlass = function() {};

BasicHelperKlass.prototype = {

  reverseObject: function(jsonObject) {
    var reverseObject = {};
    for(var key in jsonObject){
      reverseObject[jsonObject[key]] = key;
    }
    return reverseObject;
  }

};

module.exports = new BasicHelperKlass();