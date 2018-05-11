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

  getTableName: function () {
    return 'available_shards';
  },

  /*** COLUMN NAMES ***/
  SHARD_NAME: "SN",
  ENTITY_TYPE: "ET",
  ALLOCATION_TYPE: "AL",
  CREATED_AT: "C",
  UPDATED_AT: "U",

  // Allocation type params
  ALLOCATION_TYPES: {'enabled':1, 'disabled': 0},

  // Secondary Index
  getIndexNameByEntityAllocationType: function () {
    return 'entity-type-allocation-type-index';
  },

  /*** For shard types filtering ***/
  all: 'all',
  enabled : 'enabled',
  disabled : 'disabled',

  getShardTypes: function () {
    const oThis = this
    ;
    return {[oThis.all]: 2, [oThis.enabled] :1, [oThis.disabled]: 0};
  },

  getInverseShardTypes: function () {
    return utils.invert(this.getShardTypes())
  },
};

module.exports = new availableShard();