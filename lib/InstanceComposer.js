'use strict';

/**
 * @fileoverview - Functionality to share configStrategy between classes and objects.
 */

const instanceComposerMethodName = 'ic';
const composerMap = {};
const shadowMap = {};

/**
 * Get full getter name
 *
 * @param getterNamespace {string} - getter namespace
 * @param getterName {string} - getter name
 *
 * @returns {string} - returns the full getter name
 */
const fullGetterName = function(getterNamespace, getterName) {
  return getterNamespace + '.' + getterName;
};

/**
 * Check if full getter name is available
 *
 * @param fullGetterName {string} - full getter name
 *
 * Throws error if fullGetterName is not available, i.e. already taken.
 */
function checkAvailability(fullGetterName) {
  if (composerMap.hasOwnProperty(fullGetterName) || shadowMap.hasOwnProperty(fullGetterName)) {
    console.trace('Duplicate Getter Method name', fullGetterName);
    throw 'Duplicate Getter Method Name ';
  }
}

/**
 * @class Instance Composer Class
 */
class InstanceComposer {
  /**
   * Constructor for Instance Composer Class
   *
   * @param configStrategy {object} - config strategy
   */
  constructor(configStrategy) {
    this.configStrategy = configStrategy || {};
    this.instanceMap = {};
    this.shadowedClassMap = {};
  }

  /**
   * Get Instance for getter name space and getter name
   *
   * @param getterNamespace {string} - getter name space
   * @param getterName {string} - getter name
   *
   * @returns {object}
   */
  getInstanceFor(getterNamespace, getterName) {
    const oThis = this; //this refers to instance of InstanceComposer.

    let _getterName = fullGetterName(getterNamespace, getterName);
    let registryInfo = composerMap[_getterName];
    let ClassConstructor = registryInfo.c;
    let mustRetainInstance = registryInfo.mustRetain;

    let _instance;

    if (mustRetainInstance) {
      _instance = oThis.instanceMap[_getterName];
      if (!_instance) {
        _instance = new ClassConstructor(oThis.configStrategy, oThis);
        _instance[instanceComposerMethodName] = function() {
          return oThis;
        };
        oThis.instanceMap[_getterName] = _instance;
      }
    } else {
      _instance = new ClassConstructor(oThis.configStrategy, oThis);
      _instance[instanceComposerMethodName] = function() {
        return oThis;
      };
    }

    return _instance;
  }

  /**
   * Get Shadowed Class for getter name space and getter name
   *
   * @param getterNamespace {string} - getter name space
   * @param getterName {string} - getter name
   *
   * @returns {*}
   */
  getShadowedClassFor(getterNamespace, getterName) {
    const oThis = this; //this refers to instance of InstanceComposer.

    let _getterName = fullGetterName(getterNamespace, getterName);

    let registryInfo = shadowMap[_getterName];
    let ClassConstructor = registryInfo.c;

    let _shadowedClass;
    _shadowedClass = oThis.shadowedClassMap[_getterName];

    if (!_shadowedClass) {
      oThis.shadowedClassMap[_getterName] = _shadowedClass = oThis._createShadowClass(ClassConstructor);
    }

    return _shadowedClass;
  }

  /**
   * Register as object
   *
   * @param ClassConstructor {function} - class constructor to use for creation of the object
   * @param getterNamespace {string} - getter name space
   * @param getterName {string} - getter name
   * @param mustRetainInstance {boolean} - should the instance of the object be retained.
   */
  static registerAsObject(ClassConstructor, getterNamespace, getterName, mustRetainInstance) {
    let _getterName = fullGetterName(getterNamespace, getterName);

    checkAvailability(_getterName);

    composerMap[_getterName] = { c: ClassConstructor, mustRetain: mustRetainInstance };
  }

  /**
   * Register as shadowable class
   *
   * @param ClassConstructor {function} - class constructor to use for creation of the shadowed class
   * @param getterNamespace {string} - getter name space
   * @param getterName {string} - getter name
   */
  static registerAsShadowableClass(ClassConstructor, getterNamespace, getterName) {
    let _getterName = fullGetterName(getterNamespace, getterName);

    checkAvailability(_getterName);

    shadowMap[_getterName] = { c: ClassConstructor };
  }

  /**
   * create shadowable class
   *
   * @param ClassConstructor {function} - class constructor to use for creation of the shadowed class
   * @private
   */
  _createShadowClass(ClassConstructor) {
    const oThis = this; //this refers to instance of InstanceComposer.

    class DerivedClass extends ClassConstructor {
      constructor(...args) {
        super(...args);
      }

      [instanceComposerMethodName]() {
        return oThis;
      }
    }

    return DerivedClass;
  }
}

module.exports = InstanceComposer;
