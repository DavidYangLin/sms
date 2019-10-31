<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 个人中心
                </el-breadcrumb-item>
                <el-breadcrumb-item>个人中心</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="用户名">
                        {{userName}}
                    </el-form-item>
                    <el-form-item label="旧密码">
                        <el-input v-model="form.oldPassword" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码">
                        <el-input v-model="form.newPassword" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码">
                        <el-input v-model="form.confirmNewPassword" type="password"></el-input>
                    </el-form-item>
                    <!--<el-form-item label="选择器">
                        <el-select v-model="form.region" placeholder="请选择">
                            <el-option key="bbk" label="步步高" value="bbk"></el-option>
                            <el-option key="xtc" label="小天才" value="xtc"></el-option>
                            <el-option key="imoo" label="imoo" value="imoo"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="日期时间">
                        <el-col :span="11">
                            <el-date-picker
                                type="date"
                                placeholder="选择日期"
                                v-model="form.date1"
                                value-format="yyyy-MM-dd"
                                style="width: 100%;"
                            ></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-time-picker
                                placeholder="选择时间"
                                v-model="form.date2"
                                style="width: 100%;"
                            ></el-time-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="城市级联">
                        <el-cascader :options="options" v-model="form.options"></el-cascader>
                    </el-form-item>
                    <el-form-item label="选择开关">
                        <el-switch v-model="form.delivery"></el-switch>
                    </el-form-item>
                    <el-form-item label="多选框">
                        <el-checkbox-group v-model="form.type">
                            <el-checkbox label="步步高" name="type"></el-checkbox>
                            <el-checkbox label="小天才" name="type"></el-checkbox>
                            <el-checkbox label="imoo" name="type"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="单选框">
                        <el-radio-group v-model="form.resource">
                            <el-radio label="步步高"></el-radio>
                            <el-radio label="小天才"></el-radio>
                            <el-radio label="imoo"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="文本框">
                        <el-input type="textarea" rows="5" v-model="form.desc"></el-input>
                    </el-form-item>-->
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">更改</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseform',
    data() {
        return {
            // options: [
            //     {
            //         value: 'guangdong',
            //         label: '广东省',
            //         children: [
            //             {
            //                 value: 'guangzhou',
            //                 label: '广州市',
            //                 children: [
            //                     {
            //                         value: 'tianhe',
            //                         label: '天河区'
            //                     },
            //                     {
            //                         value: 'haizhu',
            //                         label: '海珠区'
            //                     }
            //                 ]
            //             },
            //             {
            //                 value: 'dongguan',
            //                 label: '东莞市',
            //                 children: [
            //                     {
            //                         value: 'changan',
            //                         label: '长安镇'
            //                     },
            //                     {
            //                         value: 'humen',
            //                         label: '虎门镇'
            //                     }
            //                 ]
            //             }
            //         ]
            //     },
            //     {
            //         value: 'hunan',
            //         label: '湖南省',
            //         children: [
            //             {
            //                 value: 'changsha',
            //                 label: '长沙市',
            //                 children: [
            //                     {
            //                         value: 'yuelu',
            //                         label: '岳麓区'
            //                     }
            //                 ]
            //             }
            //         ]
            //     }
            // ],
            userName:'',
            form: {
                oldPassword:'',
                newPassword:'',
                confirmNewPassword:''
            },
            rules: {
                oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
                newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
                confirmNewPassword: [{ required: true, message: '请输入确认密码', trigger: 'blur' }]
            },
        };
    },
    methods: {
        onSubmit() {
            // this.$message.success('提交成功！');
            this.$refs.form.validate(valid => {
                if(valid){
                    if(this.form.newPassword != this.form.confirmNewPassword){
                        this.$message.error('两次密码输入不一致!');
                        return;
                    }
                    this.axios.put('Mass/UpdatePwd',this.form)
                    .then((data)=>{
                        if(data.status){
                            this.$message.success('更改成功!');
                        }else{
                            this.$message.error(data.message);
                        }
                    })
                    .catch(err => {
                        this.$message.error('更改失败!');
                    })    
                }
            })
        }
    },
    mounted() {
        this.userName = this.$cookies.get('userInfo')['userName'];
    },
};
</script>