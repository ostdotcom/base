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

  getShardTypes: function () {
    return {'all': 2, 'enabled': 1, 'disabled': 0};
  }

};

module.exports = new availableShard();