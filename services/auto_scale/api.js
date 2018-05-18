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
   * Register scalable Target
   *
   * @param params
   *
   * @return {*}
   */
  registerScalableTarget: function(params) {
    const oThis = this
      , createAutoScalingGroup = new ASServiceBaseKlass(oThis.autoScaleObject, 'registerScalableTarget', params)
    ;
    return createAutoScalingGroup.perform();
  },

  /**
   * Put Scaling Policy
   *
   * @param params
   *
   * @return {*}
   */
  putScalingPolicy:function(params) {
    const oThis = this
      , createAutoScalingGroup = new ASServiceBaseKlass(oThis.autoScaleObject, 'putScalingPolicy', params)
    ;
    return createAutoScalingGroup.perform();
  },

  /**
   * Delete Scaling policy
   * @param params
   */
  deleteScalingPolicy: function(params) {
    const oThis = this
      , createAutoScalingGroup = new ASServiceBaseKlass(oThis.autoScaleObject, 'deleteScalingPolicy', params)
    ;
    return createAutoScalingGroup.perform();
  },

  /**
   * De Register Scalable Target
   * @param params
   */
  deregisterScalableTarget: function(params) {
    const oThis = this
      , createAutoScalingGroup = new ASServiceBaseKlass(oThis.autoScaleObject, 'deregisterScalableTarget', params)
    ;
    return createAutoScalingGroup.perform();
  },

  /**
   * Describe Scalable Targets
   * @param params
   */
  describeScalableTargets: function(params) {
    const oThis = this
      , createAutoScalingGroup = new ASServiceBaseKlass(oThis.autoScaleObject, 'describeScalableTargets', params)
    ;
    return createAutoScalingGroup.perform();
  },

  /**
   * Describe scaling policies
   * @param params
   * @return {*}
   */
  describeScalingPolicies: function(params) {
    const oThis = this
      , createAutoScalingGroup = new ASServiceBaseKlass(oThis.autoScaleObject, 'describeScalingPolicies', params)
    ;
    return createAutoScalingGroup.perform();
  }
};

AutoScaleService.prototype.constructor = AutoScaleService;
module.exports = AutoScaleService;