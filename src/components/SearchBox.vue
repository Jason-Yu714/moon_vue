/* eslint-disable */


<template>
  <div class="search-box">
    <input
        v-model="keyword"
        @input="$emit('update:keyword', keyword)"
        type="text"
        placeholder="输入关键词搜索..."
    />
    <button @click="$emit('search', keyword)">搜索</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const keyword = ref('')
</script>

<style scoped>
.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}
.search-box input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.search-box button {
  padding: 6px 14px;
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all .2s;
}
.search-box button:hover {
  opacity: 0.9;
}
</style>
