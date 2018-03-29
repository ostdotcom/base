/**
 * Index File for openst-core
 */

"use strict";

const rootPrefix    = "."
    , OstWeb3       = require( rootPrefix + "/lib/ost-web3" )
    , OstWSProvider = require( rootPrefix + '/lib/ost-web3-providers-ws' )
    , logger        = require( rootPrefix + "/lib/custom_console_logger" )
;

// Expose all libs here. 
// All classes should begin with Capital letter.
// All instances/objects should begin with small letter.
module.exports = {
  OstWeb3         : OstWeb3
  , OstWSProvider : OstWSProvider
  , logger        : logger
};
