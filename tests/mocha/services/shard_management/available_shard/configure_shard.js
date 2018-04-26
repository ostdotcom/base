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
    emptyShardName: false,
    invalidAllocationType: false,
  };

  let Validator = function (done) {

  };
  it(optionsDesc, Validator);

};

describe('services/shard_management/available_shard/configure_shard', function () {
  createTestCasesForOptions("Configuring shard happy case");

  createTestCasesForOptions("Configuring shard adding empty shard name", {
    emptyShardName: true
  });

  createTestCasesForOptions("Configuring shard having invalid allocation type", {
    invalidAllocationType: true
  });
});