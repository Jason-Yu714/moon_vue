<template>
  <div class="container">
    <h2>搜索卡片</h2>

    <div class="api-toolbar">
      <button class="active">Topic</button>
      <button @click="goRepo">Repo</button>
      <button @click="goTool">Tool</button>

    </div>

    <SearchBox @search="handleSearch" />

    <div class="cards">
      <CardBox
          v-for="item in filteredData"
          :key="item.id"
          :name="item.name"
          :hint="item.hint"
          :type="item.type"
          :link="item.link"
      />
    </div>

    <div v-if="filteredData.length === 0" class="empty">
      暂无数据
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import CardBox from './CardBox.vue'
import SearchBox from './SearchBox.vue'


const router = useRouter()
const data = ref([])
const searchType = ref('')

const parseLocalDate = (str) => {
  if (!str) return null
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const fetchData = async () => {
  try {
    const res = await axios.get('http://www.moon5.fun:8081/topic')
    data.value = res.data?.data || []
  } catch {
    data.value = []
  }
}

const goRepo = () => router.push('repo')

const goTool = () => router.push('tools')


const filteredData = computed(() => {
  const now = new Date()
  const showDays = [0, 1, 3, 7, 14, 30]
  return data.value.filter(item => {
    if (searchType.value && !(item.type || '').toLowerCase().includes(searchType.value.toLowerCase())) return false
    if (!item.time) return true
    const diffDays = Math.floor((now - parseLocalDate(item.time)) / (1000*60*60*24))
    return showDays.includes(diffDays)
  })
})

const handleSearch = (keyword) => searchType.value = keyword

onMounted(fetchData)
</script>

<style scoped> .container { max-width: 1000px; margin: 20px auto; padding: 16px; } .api-toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; } .api-toolbar button { padding: 6px 14px; border: 1px solid #42b983; background: #fff; color: #42b983; border-radius: 6px; cursor: pointer; transition: all .15s; } .api-toolbar button:hover { opacity: 0.9; } .api-toolbar button:disabled { opacity: 0.6; cursor: not-allowed; } .api-toolbar button.active { background: #42b983; color: #fff; box-shadow: 0 2px 8px rgba(66, 185, 131, 0.15); } .status { margin-left: 8px; font-size: 13px; color: #666; } .status .error { color: #e74c3c; margin-left: 10px; } .status .ok { color: #2d8e5a; margin-left: 10px; } .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; margin-top: 12px; } .empty { margin-top: 20px; color: #888; text-align: center; } </style>
