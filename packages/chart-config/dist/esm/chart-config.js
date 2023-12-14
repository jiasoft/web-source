import { p as promiseResolve, b as bootstrapLazy } from './index-fd23d421.js';
export { s as setNonce } from './index-fd23d421.js';

/*
 Stencil Client Patch Browser v4.8.1 | MIT Licensed | https://stenciljs.com
 */
const patchBrowser = () => {
    const importMeta = import.meta.url;
    const opts = {};
    if (importMeta !== '') {
        opts.resourcesUrl = new URL('.', importMeta).href;
    }
    return promiseResolve(opts);
};

patchBrowser().then(options => {
  return bootstrapLazy([["chart-config",[[1,"chart-config",{"config":[1],"configOBJ":[32],"attr":[32]},null,{"config":["onConfigChange"]}]]]], options);
});

//# sourceMappingURL=chart-config.js.map