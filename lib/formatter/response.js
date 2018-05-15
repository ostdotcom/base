"use strict";

/*
 * Singleton Response Formatter
 */

const rootPrefix = '../..'
  , ResponseHelperKlass = require(rootPrefix+'/lib/response')
  , responseHelper = new ResponseHelperKlass({
      moduleName: 'openst-base'
  })
;

module.exports = responseHelper;