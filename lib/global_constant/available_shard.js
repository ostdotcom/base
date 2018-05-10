"use strict";

const rootPrefix  = "../.."
  , utils = require(rootPrefix + '/lib/utils')
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


  SHARD_NAME: "SN",
  ENTITY_TYPE: "ET",
  ALLOCATION_TYPE: "AL",
  CREATED_AT: "C",
  UPDATED_AT: "U",

  // TODO: Integrate below  ALLOCATION_TYPES everywhere
  // Allocation type params
  ALLOCATION_TYPES: {'enabled':1, 'disabled': 0},

  getTableName: function () {
    return 'AvailableShard';
  },

  // Secondary Index
  getIndexNameByEntityAllocationType: function () {
    return 'entity-type-allocation-type-index';
  },

  getShardTypes: function () {
    const oThis = this;
    return {'all': 2, 'enabled':1, 'disabled': 0};
  },

  getInverseShardTypes: function () {
    return utils.invert(this.getShardTypes())
  },
};

module.exports = new availableShard();