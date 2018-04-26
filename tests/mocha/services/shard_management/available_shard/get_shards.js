"use strict";

// Load external packages
const Chai    = require('chai')
  , assert    = Chai.assert
;

// Load dependencies package
const rootPrefix      = "../../../.."
  , ShardManagement     = require( rootPrefix + "/index" ).ShardManagement
  , ShardMigrationKlass = ShardManagement.Migration
;


const createTestCasesForOptions = function (optionsDesc, options) {
  optionsDesc = optionsDesc || "";
  options = options || {
    invalidShardType: false,
    invalidAllocationType: false,
  };

  let Validator = function (done) {

  };
  it(optionsDesc, Validator);

};

describe('services/shard_management/available_shard/get_shards', function () {
  createTestCasesForOptions("Get shards adding happy case");

  createTestCasesForOptions("Get shards having invalid shard type", {
    invalidShardType: true
  });
});