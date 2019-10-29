<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
import axios from './common/vue-axios';

export default {
  mounted(){
    const vm = this;
    vm.initHttpInterceptor();
  },
  methods: {
    goBack(){
        this.$router.go(-1);
    },
    initHttpInterceptor() {
        const vm = this;
        const {$toast} = vm;

        // http request 拦截器
        axios.interceptors.request.use(
            req => {
                Object.assign(req.headers.common, {
                    authorization: vm.$cookies.get('userInfo') ? vm.$cookies.get('userInfo')['token']:''
                    // url:'http://47.99.109.79:8887/api/services/app/'+ req.headers.common.url
                });
                req.url = 'http://47.99.109.79:8887/api/services/app/' + req.url;
                return req;
            },
            err => Promise.reject(err)
        );

        // http response 拦截器
        axios.interceptors.response.use(
            res => {
                // const {status = {}} = res.data;
                console.log('212112');
                const { message = '未知错误',data,status} = res;

                if (status === 200) { // api 正常返回
                    return res.data;
                } else {
                    $toast.error(detail);
                    return Promise.reject(res);
                }
            },
            error => {
                // if()
                
                return Promise.reject(error.response.data);
            }
        );
    },
  }
}
</script>
<style>
    @import "./assets/css/main.css";
    @import "./assets/css/color-dark.css";     /*深色主题*/
    /*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/
</style>