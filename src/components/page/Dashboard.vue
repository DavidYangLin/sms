<template>
    <div>
        <div class="container">
            <h1>2019启网5G群发系统</h1>
            <!-- <p>只有用 admin 账号登录的才拥有管理员权限，才能进到这个页面，其他账号想进来都会跳到403页面，重新用管理员账号登录才有权限。</p>
            <p>想尝试一下，请<router-link to="/login" class="logout">退出登录</router-link>，随便输入个账号名，再进来试试看。</p> -->
            <el-table :data="[1]" :show-header="false" style="width: 100%;font-size:14px;">
                <el-table-column width="200">
                    服务状态：
                </el-table-column>
                <el-table-column>
                    {{reportData.statusText}}
                </el-table-column>
            </el-table>
            <el-table :data="[1]" :show-header="false" style="width: 100%;font-size:14px;">
                <el-table-column width="200">
                    当前每分钟推送设备数：
                </el-table-column>
                <el-table-column>
                    {{reportData.rdCount}}
                </el-table-column>
            </el-table>
            <el-table :data="[1]" :show-header="false" style="width: 100%;font-size:14px;">
                <el-table-column width="200">
                    已推送设备数：
                </el-table-column>
                <el-table-column>
                    {{reportData.pushEquipmentNum}}
                </el-table-column>
            </el-table>
            <el-table :data="[1]" :show-header="false" style="width: 100%;font-size:14px;">
                <el-table-column width="200">
                    发送内容：
                </el-table-column>
                <el-table-column>
                    {{reportData.contents}}
                </el-table-column>
            </el-table>
            <br />
            <el-table v-el-table-infinite-scroll="load" border class="table scrollTable"
                ref="multipleTable"
                header-cell-class-name="table-header" :data="todoList" height="300" style="width: 100%;font-size:14px;">
                <el-table-column type="index" label="序号" width="80">
                </el-table-column>
                <el-table-column label="设备MAC地址">
                    <template slot-scope="scope">
                        <div class="todo-item" :class="{'todo-item-del': scope.row.status}">{{scope.row.mac}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="设备IP地址">
                    <template slot-scope="scope">
                        <div class="todo-item" :class="{'todo-item-del': scope.row.status}">{{scope.row.ip}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="主机名称">
                    <template slot-scope="scope">
                        <div class="todo-item" :class="{'todo-item-del': scope.row.status}">{{scope.row.host}}</div>
                    </template>
                </el-table-column>
            </el-table>
            <br />
            <div style="text-align:center">
                <el-button v-if="reportData.serviceStatus == 2" type="default">
                    <router-link :to="'../report/'+reportData.userServiceId" class="tags-li-title">
                        查看发送报告
                    </router-link>
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    import bus from '../common/bus';
    import elTableInfiniteScroll from 'el-table-infinite-scroll';

    export default {
        name: 'dashboard',
        directives: {
            'el-table-infinite-scroll': elTableInfiniteScroll
        },
        data() {
            return {
                todoList:[],
                reportData:{}
            }
        },
        computed: {
            role() {
                return this.name === 'admin' ? '超级管理员' : '普通用户';
            }
        },
        created(){
            this.getDetail();
            // this.handleListener();
            // this.changeDate();
        },
        methods: {
            getDetail(){
                this.axios.post('Mass/UserReport')
                .then(data =>{
                    if(data.status){
                        this.reportData = data.data;
                        if(this.reportData.serviceStatus == 0){
                            this.reportData.statusText = '未开启';
                        }else if(this.reportData.serviceStatus == 1){
                            this.reportData.statusText = '运行中';                            
                        }else if(this.reportData.serviceStatus == 2){
                            this.reportData.statusText = '已关闭';
                            this.reportData.rdCount = '--';
                        }
                        // let count = this.reportData.pushEquipmentNum > 100 ? 100:this.reportData.pushEquipmentNum;
                        // for(var i = 0; i< count;i++) {
                        //     this.todoList.push({
                        //         mac: this.roundMAC(),
                        //         ip: this.roundIP(),
                        //         host: this.roundHOST()
                        //     })
                        // }
                        this.todoList = [];
                        this.pushData(this.reportData.pushEquipmentNum);
                    }
                }).catch(err => {
                    // this.$message.error(err.error.message);
                })
            },
            roundMAC(){
                return `${this.randomString(2)}:${this.randomString(2)}:${this.randomString(2)}:${this.randomString(2)}:**:**`;
            },
            roundIP(){
                return `**.*.${parseInt(Math.random()*255)}.${parseInt(Math.random()*255)}`;
            },
            roundHOST(){
                let phoneHead = ['Honor_','OPPO-','vivo-','USER-','android-','HUAWEI_','Redmi4A-','MIMAX-'];
                return `${phoneHead[parseInt(Math.random()*7)]}${this.randomString(Math.random()*16)}`;
            },
            randomString(len) {
            　　len = len || 32;
            　　var $chars = 'abcdefhijkmnprstwxyz2345678';
            　　var maxPos = $chars.length;
            　　var pwd = '';
            　　for (var i = 0; i < len; i++) {
            　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            　　}
            　　return pwd;
            },
            pushData(total) {
                let count = total > 200 ? 200:total;
                let arr = [];
                for(var i = 0; i< count;i++) {
                    arr.push({
                        mac: this.roundMAC(),
                        ip: this.roundIP(),
                        host: this.roundHOST()
                    })
                }
                this.todoList = this.todoList.concat(arr);
            },
            load() {
                if(this.reportData.pushEquipmentNum){
                    let count = this.reportData.pushEquipmentNum - this.todoList.length;
                    this.pushData(count);
                }
            }
        }
    }

</script>


<style scoped>
    h1{
        text-align: center;
        margin: 30px 0;
    }
    p{
        line-height: 30px;
        margin-bottom: 10px;
        text-indent: 2em;
    }
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .schart {
        width: 100%;
        height: 300px;
    }

</style>
