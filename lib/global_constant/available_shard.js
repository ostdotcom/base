"use strict";

const rootPrefix  = "../.."
;

/**
 * Constructor for available shard globalconstant class
 *
 * @constructor
 */
const availableShard = function() {};

availableShard.prototype = {

  all: 'all',
  enabled : 'enabled',
  disabled : 'disabled',

  getTableName: function () {
    return 'AvailableShard';
  },

  getIndexOnETName: function () {
    return 'AS-ET-index';
  },

  getIndexOnALName: function () {
    return 'AS-AL-index';
  },

  getShardTypes: function () {
    const oThis = this;
    return {'all': 2, 'enabled':1, 'disabled': 0};
  }
};

module.exports = new availableShard();