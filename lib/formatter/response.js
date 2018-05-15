"use strict";

/*
 * Singleton Response Formatter
 */

const rootPrefix = '../..'
  , ResponseHelperKlass = require(rootPrefix+'/lib/formatter/response_helper')
  , responseHelper = new ResponseHelperKlass({
      moduleName: 'openst-base'
  })
;

module.exports = responseHelper;