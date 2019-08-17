<template>
  <el-table v-bind="$attrs" v-on="$listeners" size="small">
    <el-table-column v-bind="$attrs" v-on="$listeners">
      <slot></slot>
    </el-table-column>
  </el-table>
</template>

