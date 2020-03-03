export default {
  /** 组件权重, 越小越先加载 */
  weight: -100,
  /** 组件注册 */
  register: (Vue) => {
    /** 导入应用样式 */
    import("../../assets/app.less");
    /**
     * 调整Element默认参数
     * @type {{size: string, zIndex: number}}
     */
    Vue.prototype.$ELEMENT = {size: 'small', zIndex: 3000};
  }
}