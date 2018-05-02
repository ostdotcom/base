"use strict";

// Load external packages
const Chai        = require('chai')
  , assert      = Chai.assert
  , rootPrefix  = "../../../.."
  , OSTBase     = require( rootPrefix + "/index" )
  , paramErrorConfig = require('./param_error_config')
  , apiErrorConfig = require('./api_error_config')
;

const api_error_key = Object.keys(apiErrorConfig)[0]
  , param_error_key = Object.keys(paramErrorConfig)[0]
;

const responseHelper = new OSTBase.responseHelper({
  moduleName: 'openst-base'
});

const errorConfig = {
  param_error_config: paramErrorConfig,
  api_error_config: apiErrorConfig
};

const testHash = { 'test_key': 'test_value'};

describe('lib/formatter/response_helper', function(){
  
  it('Should create responseHelper object', function(){

    assert.instanceOf(responseHelper, OSTBase.responseHelper);
  });

  it('Should return failure status for error call', function(){

    assert.equal(true, responseHelper.error('test_1', api_error_key, {}).isFailure());
  });

  it('Should return false for isSuccess call for error', function(){

    assert.equal(false, responseHelper.error('test_1', api_error_key, {}).isSuccess());
  });

  it('Should return failure status for paramValidationError call', function(){

    assert.equal(true, responseHelper.paramValidationError('test_1', api_error_key, [param_error_key], {}).isFailure());
  });

  it('Should return false for isSuccess call for paramValidationError', function(){

    assert.equal(false, responseHelper.paramValidationError('test_1', api_error_key, [param_error_key], {}).isSuccess());
  });

  it('Should return true for isSuccess when called successWithData', function(){

    assert.equal(true, responseHelper.successWithData(testHash).isSuccess());
  });

  it('Should return false for isFailure when called successWithData', function(){

    assert.equal(false, responseHelper.successWithData(testHash).isFailure());
  });

  it('Should have all the expected keys in response hash', function(){

    let responseData = responseHelper.error('test_1', api_error_key, {}).toHash(errorConfig);

    assert.equal(true, responseData.hasOwnProperty('success'));
    assert.equal(true, responseData.hasOwnProperty('err'));
    assert.equal(true, responseData.err.hasOwnProperty('code'));
    assert.equal(true, responseData.err.hasOwnProperty('msg'));
    assert.equal(true, responseData.err.hasOwnProperty('param'));
    assert.equal(true, responseData.err.hasOwnProperty('internal_id'));

  });

  it('Should have all the expected keys and values when called successWithData', function(){

    let responseData = responseHelper.successWithData(testHash).toHash(errorConfig);

    assert.equal(true, responseData.hasOwnProperty('success'));
    assert.equal(true, responseData.hasOwnProperty('data'));
    assert.equal(true, responseData.data.hasOwnProperty('test_key'));
    assert.equal('test_value', responseData.data.test_key);

  });

  it('Should return an array for param in err object', function(){
    let responseData = responseHelper.paramValidationError('test_1', api_error_key, [param_error_key], {}).toHash(errorConfig);

    assert.equal(true, responseData.err.param instanceof Array);
  });

  it('Should return code in err as per input error code', function(){

    assert.equal(apiErrorConfig[api_error_key].code,
      responseHelper.error('test_1', api_error_key, {}).toHash(errorConfig).err.code);
  });

  it('Should return msg in err as per input error code', function(){

    assert.equal(apiErrorConfig[api_error_key].message,
      responseHelper.error('test_1', api_error_key, {}).toHash(errorConfig).err.msg);
  });

  it('Should return internal_id in err as per input error code', function(){

    assert.equal('test_1',
      responseHelper.error('test_1', api_error_key, {}).toHash(errorConfig).err.internal_id);
  });

  it('Should have key count of 3 in response hash', function(){

    assert.equal(2,
      Object.keys(responseHelper.error('test_1', api_error_key, {}).toHash(errorConfig)).length);
  });

  it('Should have key count of 4 in err object of response hash', function(){

    assert.equal(4,
      Object.keys(responseHelper.error('test_1', api_error_key, {}).toHash(errorConfig).err).length);
  });

  it('Should return name in param object as per code in input', function(){

    assert.equal(paramErrorConfig.test_1.name,
      responseHelper.paramValidationError('test_1', api_error_key, [param_error_key], {}).toHash(errorConfig).err.param[0].name);
  });

  it('Should return message in param object as per code in input', function(){

    assert.equal(paramErrorConfig.test_1.message,
      responseHelper.paramValidationError('test_1', api_error_key, [param_error_key], {}).toHash(errorConfig).err.param[0].msg);
  });

  it('Should return a Result object', function(){

    var obj = responseHelper.paramValidationError('test_1', api_error_key, [param_error_key], {});

    assert.equal(true, responseHelper.isCustomResult(obj));
  });

});