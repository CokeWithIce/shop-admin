<template>
        <el-row>
<!--            <el-col :sm="12" :lg="6">
                <el-result
                        icon="success"
                        title="Success Tip"
                        sub-title="Please follow the instructions"
                >
                    <template #extra>
                        <el-button type="primary">Back</el-button>
                    </template>
                </el-result>
            </el-col>
            <el-col :sm="12" :lg="6">
                <el-result
                        icon="warning"
                        title="Warning Tip"
                        sub-title="Please follow the instructions"
                >
                    <template #extra>
                        <el-button type="primary">Back</el-button>
                    </template>
                </el-result>
            </el-col>-->
            <el-col >
                <el-result
                        icon="error"
                        title="404错误"
                        sub-title="页面不存在"
                >
                    <template #extra>
                        <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
                    </template>
                </el-result>
            </el-col>

        </el-row>

</template>

<script>

export default {
    name: "404",
}
</script>

<style scoped>

</style>