"use strict";
//This is a derived class of web3js

// Third Party Requires.
const Web3 = require('web3');

// Other Requires
const rootPrefix    = "../.."
    , OstWSProvider = require(rootPrefix + '/lib/ost_web3/ost-web3-providers-ws')
    , Logger        = require(rootPrefix + "/lib/logger/custom_console_logger")
;

const logger = new Logger("OSTWeb3");

const OSTWeb3 = module.exports = function (provider, net, options) {
  const oThis = this;

  options = options || {};

  //If WS Provider, create one.
  var providerOptions = options.providerOptions || {};
  providerOptions = Object.assign({}, OSTWeb3.DefaultOptions.providerOptions, providerOptions );
  if( providerOptions.autoReconnect && typeof provider === "string" && /^ws(s)?:\/\//i.test( provider) ) {
    provider = new OstWSProvider( provider, null, providerOptions );
  }

  return Web3.call(oThis, provider, net ) || oThis;
};

OSTWeb3.OstWSProvider = OstWSProvider;


OSTWeb3.DefaultOptions = {
  providerOptions: {
    autoReconnect: true
    , maxReconnectTries: 100
    , reconnectInterval: 500 /* Miliseconds */
    , killOnReconnectFailure: true
    , emitterMaxListeners: 100
  }
};




//Take care of prototype
OSTWeb3.prototype = Object.create( Web3.prototype );

//Take care of all static properties of Web3.
(function () {

  function addProp( prop ) {
    Object.defineProperty(OSTWeb3, prop, {
      get: function () {
        return Web3[ prop ];
      }
      , set: function ( newValue ) {
        Web3[ prop ] = newValue; 
      }
    });    
  }
  for( var prop in Web3 ) {
    addProp(prop);
  }
})();




