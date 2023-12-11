const VuePlugin = {
    install(app) {
        app.config.globalProperties.$low = (key = "") => {
            return key.toLocaleLowerCase();
        };
        app.directive('v-my-directive', {
            bind(el, binding, vnode, oldVnode) {
                console.log(el, binding, vnode, oldVnode);
            }
        });
        app.mixin({
            created() {
                console.log("mixin");
            }
        });
    }
};
export default VuePlugin;
//# sourceMappingURL=vue-plugin.js.map