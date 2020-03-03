import {getToken, setToken} from "./utils/auth-helper";

export default {
  weight: 0,

  /**
   * 注册拦截等事件
   */
  register: (Vue, router, store, name) => {
    /**
     * 添加授权检测
     */
    router.beforeEach(async (to, from, next) => {
      if (to.name === 'Login') {

        /** 取消模板 */
        store.dispatch('vaApp/layout', false);
        return next();
      }

      if (!getToken()) {
        return next({name: 'Login', replace: true});
      }
      store.dispatch('vaApp/layout', true);
      next();
    });

    /**
     * 拦截请求, 添加Token
     */
    Vue.prototype.$http.interceptors.request.use(
      config => {
        if (getToken()) {
          config.headers['Authorization'] = 'Bear ' + getToken()
        }
        return config
      },
      error => {
        // do something with request error
        return Promise.reject(error)
      }
    );

    /**
     * 这里需要注意:
     *
     *  因为_booter里面已经对响应数据进行了处理, 所以得到的结果是处理后的
     */
    Vue.prototype.$http.interceptors.response.use(
      response => {
        if (response.code === 401) {
          setToken(null);
          router.push({name: 'Login'});
          return Promise.reject('未检测到登录信息');
        } else if (response.code !== 1) {
          return Promise.reject(response.msg || response.message);
        }

        return response.data;
      },
      error => {
        return Promise.reject(error)
      }
    );

    /** 添加退出按钮到Layout */
    store.dispatch('vaLayout/addTopMenus', {
      label: '退出登录',
      icon: '',
      click: () => {
        setToken(null);
        router.push({name: 'Login'})
      }
    })
  },

  /**
   * 登录组件路由
   */
  routers: [{
    path: '/login',
    name: 'Login',
    hidden: true,
    component: () => import("./pages/login"),
    meta: {title: '登录'}
  }],

  /**
   * 登录组件Store, 其他组件调用, 只能从this.$store里面取, 不能直接调用组件
   */
  store: {
    namespaced: true,
    state: {
      token: getToken()
    },
    mutations: {},
    getters: {}
  }
}