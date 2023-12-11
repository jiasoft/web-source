
const VuePlugin = {
  install(app) {
    // 添加全局方法

    app.config.globalProperties.$low = (key="") => {
      // 全局方法的实现
      return key.toLocaleLowerCase()
    };
    // 添加全局指令
    app.directive('my-directive', {
      bind(el, binding, vnode, oldVnode) {
        // 指令的实现
        console.log(el, binding, vnode, oldVnode)
      }
    });


    // 添加全局混入
    app.mixin({
      created() {
        // 混入的逻辑
        console.log("mixin")
      }
    });
  }
};

// 导出插件
export default VuePlugin;