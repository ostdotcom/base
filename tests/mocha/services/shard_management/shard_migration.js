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
    availableShard: false,
    managedShard: false
  };

  let Validator = function (done) {


  };
  it(optionsDesc, Validator);

};

describe('lib/services/shard_management/shard_migration', function() {
  createTestCasesForOptions("Shard migration happy case");
  createTestCasesForOptions("Shard migration available shard table already exists", {
    availableShard: true
  });
  createTestCasesForOptions("Shard migration managed shared table already exists", {
    managedShard: true
  });
  createTestCasesForOptions("Shard migration managed and available share both table already exists", {
    availableShard: true,
    managedShard: true
  });

});