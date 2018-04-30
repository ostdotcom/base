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

 getShardTypes: function(){
    return ['all', 'enabled', 'disabled']
  }

};

module.exports = new availableShard();