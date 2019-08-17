<template>
    <el-button v-bind="$attrs"
               v-on="$listeners"
               size="mini"
               type="primary">
        <slot></slot>
    </el-button>
</template>
