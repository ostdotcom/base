/**
 * Index File for @ostdotcom/base
 */

'use strict';

const rootPrefix = '.',
  Logger = require(rootPrefix + '/lib/logger/custom_console_logger'),
  PromiseContext = require(rootPrefix + '/lib/promise_context/promise_context'),
  PCQueueManager = require(rootPrefix + '/lib/promise_context/promise_queue_manager'),
  responseHelper = require(rootPrefix + '/lib/formatter/response_helper'),
  InstanceComposer = require(rootPrefix + '/lib/InstanceComposer');

// Expose all libs here.
// All classes should begin with Capital letter.
// All instances/objects should begin with small letter.
module.exports = {
  logger: new Logger(),
  Logger: Logger,
  OSTPromise: {
    Context: PromiseContext,
    QueueManager: PCQueueManager
  },
  responseHelper: responseHelper,
  InstanceComposer: InstanceComposer
};

/*
  OSTBase = require("./index");

  //Test Logger
  logger = new OSTBase.Logger("Test");
  logger.testLogger()

  //Test PromiseQueueManager
  PQM = OSTBase.OSTPromise.QueueManager;

  //Run these one by one.
  PQM.Examples.allReject();

  PQM.Examples.allResolve();
  PQM.Examples.allReject();
  PQM.Examples.allTimeout();
  PQM.Examples.executorWithParams();
  PQM.Examples.maxZombieCount();
*/
