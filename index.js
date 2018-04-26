/**
 * Index File for openst-base
 */

"use strict";

const rootPrefix      = '.'
    , Web3            = require( 'web3' )
    , OstWeb3         = require( rootPrefix + '/lib/ost_web3/ost-web3' )
    //, OstWSProvider   = require( rootPrefix + '/lib/ost_web3/ost-web3-providers-ws' )
    , Logger          = require( rootPrefix + '/lib/logger/custom_console_logger' )
    , PromiseContext  = require( rootPrefix + '/lib/promise_context/promise_context' )
    , PCQueueManager  = require( rootPrefix + '/lib/promise_context/promise_queue_manager' )
    , Web3PoolFactory = require( rootPrefix + '/lib/web3_pool/ost_web3_pool_factory' )
    , Web3Pool        = require( rootPrefix + '/lib/web3_pool/ost_web3_pool' )
    , responseHelper  = require(rootPrefix + '/lib/formatter/response')
    , ShardMigrationKlass  = require(rootPrefix + '/services/shard_management/shard_migration')
    , AddShardKlass        = require(rootPrefix +  '/services/shard_management/available_shard/add_shard')
    , ConfigureShardKlass  = require(rootPrefix + '/services/shard_management/available_shard/configure_shard')
    , GetShardsKlass       = require(rootPrefix + '/services/shard_management/available_shard/get_shards')
;

// Expose all libs here. 
// All classes should begin with Capital letter.
// All instances/objects should begin with small letter.
module.exports = {
  OstWeb3         : OstWeb3
  , Web3          : Web3
  , logger        : new Logger()
  , Logger        : Logger
  , OSTPromise    : {
    Context         : PromiseContext
    , QueueManager  : PCQueueManager
  }
  , responseHelper  : responseHelper
  , OstWeb3Pool   : {
    Factory : Web3PoolFactory
    , Pool  : Web3Pool
  }
  , ShardManagement: {
    Migration: ShardMigrationKlass
    , Add: AddShardKlass
    , Configure: ConfigureShardKlass
    , Get: GetShardsKlass
  }
  , DynamoDb: {
  }

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