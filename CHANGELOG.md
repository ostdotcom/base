## Base v2.0.0
- Upgraded node version to 10.x
- Moved web3 related modules to ([xweb3 repository](https://github.com/ostdotcom/xweb3))

## Base v1.0.0
- Introduced namespacing in Instance Composer.
- Migrated to ES6.
- Migrated repository from OpenST Foundation to OST organization and renamed it.

## Base v0.9.3
- Common style guide followed across all OST repos using prettier ([base#30](https://github.com/ostdotcom/base/issues/30)).
- Error object was earlier getting logged as {} in the custom logger. Fixed this issue.

## Base v0.9.2
- Minor fixes.

## Base v0.9.1
- If an object is passed for logging, it is logged after doing JSON stringify. This support was added to all the logging methods.

## Base v0.9.0 (17 May 2018)
- OST Base repository was created and all the common functionality which different OST modules need were moved to it. Example - Logger, response helper, promise context, promise queue manager and web3.
- Log level support was introduced and non-important logs were moved to debug log level.
- Standardized error codes are now being used in OST Base.
