'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-17781000.js');

/*
 Stencil Client Patch Browser v4.8.1 | MIT Licensed | https://stenciljs.com
 */
const patchBrowser = () => {
    const importMeta = (typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('chart-config.cjs.js', document.baseURI).href));
    const opts = {};
    if (importMeta !== '') {
        opts.resourcesUrl = new URL('.', importMeta).href;
    }
    return index.promiseResolve(opts);
};

patchBrowser().then(options => {
  return index.bootstrapLazy([["chart-config.cjs",[[1,"chart-config",{"config":[1],"configOBJ":[32],"attr":[32]},null,{"config":["onConfigChange"]}]]]], options);
});

exports.setNonce = index.setNonce;

//# sourceMappingURL=chart-config.cjs.js.map