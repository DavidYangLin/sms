<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 客户管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!-- <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量开启</el-button>
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量关闭</el-button> -->
                <!-- <el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select> -->
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="editVisible1 = true"
                >添加用户</el-button>
                <el-input v-model="query.keyWords" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="userName" label="用户名"></el-table-column>
                <el-table-column label="服务状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            type="success"
                        >{{scope.row.statusText}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="pushBaseStr" label="推送基数(人/分钟)"></el-table-column>
                <el-table-column prop="sTime" label="服务开启时间"></el-table-column>
                <el-table-column prop="eTime" label="服务关闭时间"></el-table-column>
                <el-table-column prop="runTime" label="运行时间(分钟)"></el-table-column>
                <el-table-column prop="pushEquipmentNum" label="发送总数"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            v-if=" scope.row.serviceStatus != 1"
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >开启</el-button>
                        <el-button
                            v-if=" scope.row.serviceStatus == 1"
                            type="text"
                            icon="el-icon-edit"
                            @click="closeService(scope.$index, scope.row)"
                        >关闭</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="deleteUser(scope.$index, scope.row)"
                        >删除</el-button>
                        <el-button
                            v-if=" scope.row.serviceStatus != 0"
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >计数清零</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="开启服务" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :rules="rules1" :model="form" label-width="100px">
                <el-form-item label="用户名">
                    {{form.userName}}
                </el-form-item>
                <el-form-item prop="serviceName" label="业务名称">
                    <el-input v-model="form.serviceName"></el-input>
                </el-form-item>
                <el-form-item prop="showSendPhone" label="发送号码">
                    <el-input v-model="form.showSendPhone"></el-input>
                </el-form-item>
                <el-form-item prop="pushBase" label="推送基数">
                    <el-radio-group v-model="form.pushBase">
                        <!-- <el-radio label="30-60"></el-radio>
                        <el-radio label="60-90"></el-radio>
                        <el-radio label="90-120"></el-radio>
                        <el-radio label="120-150"></el-radio>
                        <el-radio label="150-200"></el-radio>
                        <el-radio label="200-300"></el-radio> -->
                        <el-radio v-for="item in pubBase" v-bind:key="item.key" :label="item.key">{{item.value}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="直接生成报告">
                    <el-switch v-model="form.isDirectReport"></el-switch>
                </el-form-item>
                <el-form-item v-if="form.isDirectReport" label="开始时间">
                    <el-col :span="11">
                        <el-time-select
                            placeholder="选择时间"
                            v-model="form.sTime"
                            style="width: 100%;"
                            :picker-options="{
                            start: '00:00',
                            end: '23:59'
                            }"></el-time-select>
                    </el-col>
                </el-form-item>
                <el-form-item v-if="form.isDirectReport" label="结束时间">
                    <el-col :span="11">
                        <el-time-select
                            placeholder="选择时间"
                            v-model="form.eTime"
                            style="width: 100%;"
                            :picker-options="{
                            start: '00:00',
                            end: '23:59'
                            }"></el-time-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="发送内容">
                    <el-input type="textarea" maxlength="70" show-word-limit rows="5" v-model="form.contents"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="!form.isDirectReport" @click="startService">开启服务</el-button>
                <el-button v-if="form.isDirectReport" type="primary" @click="generateReport">生成报告</el-button>
            </span>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="添加用户" :visible.sync="editVisible1" width="30%">
            <el-form :model="userForm" :rules="rules" ref="user" label-width="100px">
                <el-form-item prop="userName" label="用户名">
                    <el-input v-model="userForm.userName"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input type="password" v-model="userForm.password"></el-input>
                </el-form-item>
                <el-form-item prop="confirmpwd" label="确认密码">
                    <el-input type="password" v-model="userForm.confirmpwd"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" rows="5" v-model="userForm.remarks"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addUser">确认</el-button>
                <el-button type="primary" @click="editVisible1=false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchData } from '../../api/index';
import { formatTimeToStr } from '../../common/date.js';
let _ = require('lodash');

export default {
    name: 'basetable',
    data() {
        return {
            query: {
                keyWords: '',
                pageIndex: 0,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            editVisible1: false,
            pageTotal: 0,
            form: {},
            userForm:{},
            idx: -1,
            id: -1,
            pubBase: [],
            rules: {
                userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                confirmpwd: [{ required: true, message: '请输入确认密码', trigger: 'blur' }]
            },
            rules1: {
                pushBase: [{ required: true, message: '推送基数必填', trigger: 'blur' }],
                serviceName: [{ required: true, message: '业务名称必填', trigger: 'blur' }],
                showSendPhone: [{ required: true, message: '显示号码必填', trigger: 'blur' }],
            }
        };
    },
    created() {
        this.getData();
        this.getPubBase();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            this.axios.post('Mass/QueryUsers',this.query).then(data =>{
                if(data.status){
                    this.tableData = data.data.list;
                    this.pageTotal = data.data.totalCount;
                    this.pageIndex = data.data.pageIndex;
                    this.tableData.forEach(item => {
                        if(item.serviceStatus === 0){
                            item.statusText = '未开启';
                            item.pushBaseStr = '--';
                            item.sTime = '--';
                            item.eTime = '--';
                            item.runTime = '--';
                            item.pushEquipmentNum = '--';
                        }else if(item.serviceStatus === 1){
                            item.statusText = '运行中';
                            item.sTime = formatTimeToStr(item.sTime,'yyyy-MM-dd hh:mm');
                        }else if(item.serviceStatus === 2){
                            item.sTime = formatTimeToStr(item.sTime,'yyyy-MM-dd hh:mm');
                            item.eTime = formatTimeToStr(item.eTime,'yyyy-MM-dd hh:mm');
                            item.statusText = '已关闭';
                        }
                    })
                }
            }).catch(err => {
                // this.$message.error(err.error.message);
            })
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        deleteUser(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除该用户吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                this.axios.delete('Mass/DeleteUser',{params:{userId:row.userId}})
                .then(data => {
                    if(data.status){
                        this.$message.success('删除成功!');
                        this.query.pageIndex = 0;
                        this.getData();
                    }
                })
                .catch(err=>{
                    
                })
                // this.$message.success('删除成功');
                // this.tableData.splice(index, 1);
            })
            .catch(() => {});
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要清零该服务吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                this.axios.delete('Mass/DeleteService',{params:{userId:row.userId}})
                .then(data => {
                    if(data.status){
                        this.$message.success('清除成功!');
                        this.query.pageIndex = 0;
                        this.getData();
                    }
                })
                .catch(err=>{
                    
                })
                // this.$message.success('删除成功');
                // this.tableData.splice(index, 1);
            })
            .catch(() => {});
        },
        // 关闭服务
        closeService(index, row) {
            // 二次确认删除
            this.$confirm('确定要关闭服务吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                this.axios.post('Mass/CloseService',{},{params:{serviceId:row.serviceId}})
                .then(data => {
                    if(data.status){
                        this.$message.success('关闭成功!');
                        this.query.pageIndex = 0;
                        this.getData();
                    }
                })
                .catch(err=>{
                    this.$message.error('关闭失败!');
                })
                // this.$message.success('删除成功');
                // this.tableData.splice(index, 1);
            })
            .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = _.cloneDeep(row);
            this.form.sTime = null;
            this.form.eTime = null;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },
        addUser(){
            this.$refs.user.validate(valid => {
                if(valid){
                    if(this.userForm.password != this.userForm.confirmpwd){
                        this.$message.error('两次密码输入不一致!');
                        return;
                    }
                    this.axios.post('Mass/AddUser',this.userForm)
                    .then((data)=>{
                        if(data.status){
                            this.$message.success('添加成功!');
                            this.getData();
                            this.editVisible1 = false;
                        }
                    })
                    .catch(err => {
                        this.$message.error('添加失败!');
                    })    
                }
            })
        },
        getPubBase(){
            this.axios.get('Mass/GetPushBase')
            .then((data)=>{
                if(data.status){
                    let arr = Object.keys(data.data);
                    for(var i = 0; i < arr.length;i++){
                        this.pubBase.push({
                            key: arr[i],
                            value: data.data[arr[i]]
                        })
                    }
                    // this.pushBase = data.data;
                    this.editVisible1 = false;
                }
            })
        },
        startService(){
            this.$refs.form.validate(valid => {
                if(valid){
                    this.axios.post('Mass/StartService',this.form)
                    .then(data => {
                        if(data.status){
                            this.$message.success('开启服务成功!');
                            this.getData();
                            this.editVisible  = false;
                        }
                    })
                    .catch(err => {
                        this.$message.error('开启服务失败!');
                    })
                }
            })
        },
        generateReport(){
            this.$refs.form.validate(valid => {
                if(valid){
                    if(this.form.isDirectReport){
                        if(!this.form.sTime||!this.form.eTime){
                            this.$message.error('起始时间必填!');
                            return;
                        }
                        if(this.form.sTime > this.form.eTime){
                            this.$message.error('服务开启时间不能大于服务结束时间!');
                            return;
                        }
                    }
                    this.axios.post('Mass/StartService',this.form)
                    .then(data => {
                        if(data.status){
                            this.$message.success('生成报告成功!');
                            this.getData();
                            this.editVisible  = false;
                        }
                    })
                    .catch(err => {
                        this.$message.error('生成报告失败!');
                    })
                }
            })
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
