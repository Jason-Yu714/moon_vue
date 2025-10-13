<template>
  <div class="container">
    <h2>Tools 工具库</h2>

    <!-- 返回按钮 -->
    <div class="api-toolbar">
      <button @click="goHome">返回 Topic</button>
    </div>

    <!-- 搜索与筛选 -->
    <div class="toolbar">
      <input v-model="searchQuery" placeholder="搜索工具名称..." class="search-input" />
      <select v-model="filterType" class="type-select">
        <option value="">全部类型</option>
        <option v-for="t in uniqueTypes" :key="t" :value="t">{{ t }}</option>
      </select>
      <button @click="fetchTools">刷新数据</button>
    </div>

    <!-- 卡片列表 -->
    <div class="cards">
      <div
          v-for="item in filteredData"
          :key="item.id"
          class="tool-card"
      >
        <!-- 点击卡片非按钮区域显示详情 -->
        <div class="card-content" @click="showMessage(item)">
          <h3>{{ item.name }}</h3>
          <p class="hint">{{ item.hint }}</p>
          <p class="type">类型：{{ item.type || '未分类' }}</p>
        </div>
      </div>
    </div>

    <div v-if="filteredData.length === 0" class="empty">暂无匹配数据</div>

    <!-- 弹窗 -->
    <div v-if="selectedTool" class="modal-mask" @click.self="selectedTool = null">
      <div class="modal-box">
        <h3>{{ selectedTool.name }}</h3>
        <p v-if="selectedTool.type"><strong>类型：</strong>{{ selectedTool.type }}</p>
        <p v-if="selectedTool.message"><strong>描述：</strong>{{ selectedTool.message }}</p>
        <p v-if="selectedTool.time"><strong>日期：</strong>{{ selectedTool.time }}</p>

        <!-- 底部按钮组 -->
        <div class="modal-actions">
          <button
              v-if="selectedTool.link"
              @click="openLink(selectedTool.link)"
          >
            跳转
          </button>
          <button @click="selectedTool = null">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const data = ref([])
const searchQuery = ref('')
const filterType = ref('')
const selectedTool = ref(null)

const goHome = () => router.push('/')

// 获取唯一类型
const uniqueTypes = computed(() => {
  const types = data.value.map(d => d.type).filter(Boolean)
  return [...new Set(types)]
})

// 筛选数据
const filteredData = computed(() => {
  return data.value.filter(item => {
    const matchName = item.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchType = !filterType.value || item.type === filterType.value
    return matchName && matchType
  })
})

// 获取工具数据
const fetchTools = async () => {
  try {
    const res = await axios.get('http://www.moon5.fun:8081/tools')
    data.value = res.data?.data || []
  } catch (err) {
    console.error('获取工具数据失败', err)
    data.value = []
  }
}

// 显示详情弹窗
const showMessage = (item) => {
  selectedTool.value = item
}

// 使用 button 跳转链接
const openLink = (url) => {
  window.open(url, '_blank')
}

onMounted(fetchTools)
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 20px auto;
  padding: 16px;
}

.api-toolbar {
  margin-bottom: 12px;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.type-select {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button {
  padding: 6px 14px;
  border: 1px solid #42b983;
  background: #fff;
  color: #42b983;
  border-radius: 6px;
  cursor: pointer;
  transition: all .15s;
}

button:hover {
  background: #42b983;
  color: #fff;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.tool-card {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.tool-card h3 {
  color: #333;
  margin-bottom: 8px;
}

.hint {
  color: #666;
  font-size: 14px;
  margin-bottom: 6px;
}

.empty {
  margin-top: 20px;
  text-align: center;
  color: #888;
}

/* 弹出层 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-box {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  width: 360px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal-box h3 {
  margin-bottom: 10px;
  color: #42b983;
}

/* 弹窗底部按钮组 */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.modal-actions button {
  padding: 6px 14px;
  border: 1px solid #42b983;
  background: #fff;
  color: #42b983;
  border-radius: 6px;
  cursor: pointer;
  transition: all .15s;
}

.modal-actions button:hover {
  background: #42b983;
  color: #fff;
}
</style>
