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
    invalidSchema: false,
    corruptSchema : false
  };

  let Validator = function (done) {


  };
  it(optionsDesc, Validator);

};

describe('services/shard_management/available_shard/add_shard', function () {
  createTestCasesForOptions("Shard adding happy case");

  createTestCasesForOptions("Shard adding empty shard name", {
    emptyShardName: true
  });

  createTestCasesForOptions("Shard adding having invalid schema", {
    invalidSchema: true
  });

  createTestCasesForOptions("Shard adding having corrupt schema", {
    corruptSchema: true
  });
});