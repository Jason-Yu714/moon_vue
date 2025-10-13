<template>
  <div class="container">
    <h2>Repo 数据</h2>

    <div class="api-toolbar">
      <button @click="goHome">返回 Topic</button>
    </div>

    <button @click="fetchRepo">刷新 Repo 数据</button>

    <div class="cards">
      <CardBox
          v-for="item in data"
          :key="item.id"
          :name="item.name"
          :hint="item.hint"
          :type="item.type"
          :link="item.link"
      />
    </div>

    <div v-if="data.length === 0" class="empty">
      暂无数据
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import CardBox from './CardBox.vue'

const router = useRouter()
const data = ref([])

const goHome = () => router.push('/')

const fetchRepo = async () => {
  try {
    const res = await axios.get('http://localhost:8081/repo')
    data.value = res.data?.data?.data || []
  } catch (err) {
    console.error(err)
    data.value = []
  }
}

// 页面加载时拉一次数据
fetchRepo()
</script>

<style scoped> .container { max-width: 1000px; margin: 20px auto; padding: 16px; } .api-toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; } .api-toolbar button { padding: 6px 14px; border: 1px solid #42b983; background: #fff; color: #42b983; border-radius: 6px; cursor: pointer; transition: all .15s; } .api-toolbar button:hover { opacity: 0.9; } .api-toolbar button:disabled { opacity: 0.6; cursor: not-allowed; } .api-toolbar button.active { background: #42b983; color: #fff; box-shadow: 0 2px 8px rgba(66, 185, 131, 0.15); } .status { margin-left: 8px; font-size: 13px; color: #666; } .status .error { color: #e74c3c; margin-left: 10px; } .status .ok { color: #2d8e5a; margin-left: 10px; } .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; margin-top: 12px; } .empty { margin-top: 20px; color: #888; text-align: center; } </style>
