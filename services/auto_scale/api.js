"use strict";

/**
 * AutoScale service api
 *
 * @module services/auto_scale/api
 *
 */

const rootPrefix  = "../.."
  , ASBase = require(rootPrefix+'/lib/auto_scale/base')
  , ASServiceBaseKlass = require(rootPrefix + "/services/auto_scale/base")
;

/**
 * Constructor for AutoScale api service class
 *
 * @params {object} params - AutoScale connection configurations
 *
 * @constructor
 */
const AutoScaleService = function(params) {
  const oThis = this
  ;

  oThis.autoScaleObject = new ASBase(params);
};

AutoScaleService.prototype = {

  /**
   * Create table
   *
   * @params {object} params
   *
   * @return {promise<result>}
   *
   */
  createAutoScalingGroup: function(params) {
    const oThis = this
      , createAutoScalingGroup = new ASServiceBaseKlass(oThis.autoScaleObject, 'createAutoScalingGroup', params)
    ;
    return createAutoScalingGroup.perform();
  }
};

AutoScaleService.prototype.constructor = AutoScaleService;
module.exports = AutoScaleService;