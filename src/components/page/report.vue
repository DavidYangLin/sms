<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-warn"></i>发送报告</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <h1>发送报告</h1>
            <!-- <p>只有用 admin 账号登录的才拥有管理员权限，才能进到这个页面，其他账号想进来都会跳到403页面，重新用管理员账号登录才有权限。</p>
            <p>想尝试一下，请<router-link to="/login" class="logout">退出登录</router-link>，随便输入个账号名，再进来试试看。</p> -->
            <el-table :data="[1]" :show-header="false" style="width: 100%;font-size:14px;">
                <el-table-column width="150">
                    显示号码：
                </el-table-column>
                <el-table-column>
                    {{reportData.showSendPhone}}
                </el-table-column>
                <el-table-column width="150">
                    号码长度：
                </el-table-column>
                <el-table-column>
                    {{reportData.showSendPhoneLength}}
                </el-table-column>
                <el-table-column width="150">
                    短信长度：
                </el-table-column>
                <el-table-column>
                    {{reportData.contentsLength}}
                </el-table-column>
            </el-table>
            <el-table :data="[1]" :show-header="false" style="width: 100%;font-size:14px;">
                <el-table-column width="150">
                    业务名称：
                </el-table-column>
                <el-table-column>
                    {{reportData.userServiceName}}
                </el-table-column>
                <el-table-column width="150">
                    发送时间：
                </el-table-column>
                <el-table-column>
                    1292
                </el-table-column>
                <el-table-column width="150">
                    发送计数：
                </el-table-column>
                <el-table-column>
                    {{reportData.pushEquipmentNum}}
                </el-table-column>
            </el-table>
            <el-table :data="[1]" :show-header="false" style="width: 100%;font-size:14px;">
                <el-table-column width="150">
                    发送内容：
                </el-table-column>
                <el-table-column>
                    {{reportData.contents}}
                </el-table-column>
            </el-table>
            <br />
           <el-table border class="table"
                ref="multipleTable"
                header-cell-class-name="table-header" :data="todoList" style="width: 100%;font-size:14px;">
                <el-table-column prop="index" label="序号" width="80">
                    1
                </el-table-column>
                <el-table-column prop="userServiceName" label="业务名称">
                </el-table-column>
                <el-table-column prop="pushEquipmentNum" label="计数">
                </el-table-column>
                <el-table-column prop="contents" label="短信内容">
                </el-table-column>
                <el-table-column prop="status" label="任务状态">
                </el-table-column>
            </el-table>
        </div>

    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                textarea:'1',
                todoList:[],
                reportData:{}
            }
        },
        created:function(){
            this.getReportDetial();
        },
        methods:{
            getReportDetial(){
                this.axios.post('Mass/UserReportDetails',{userServiceId:this.$route.params.userServiceId})
                .then(data =>{
                    if(data.status){
                        this.reportData = data.data;
                        this.todoList.push({
                            index:1,
                            userServiceName:this.reportData.userServiceName,
                            pushEquipmentNum:this.reportData.pushEquipmentNum,
                            contents:this.reportData.contents,
                            status:'已关闭'
                        })
                    }
                }).catch(err => {
                    // this.$message.error(err.error.message);
                }) 
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
.logout{
    color: #409EFF;
}
</style>