<template>
  <div class="container">
    <h2>Tools 工具库</h2>

    <!-- 返回 & 新增按钮 -->
    <div class="api-toolbar">
      <button @click="goHome">返回 Topic</button>
      <button @click="showAddModal">新增工具</button>
    </div>

    <!-- 搜索 & 联动下拉 -->
    <div class="toolbar">
      <input v-model="searchQuery" placeholder="搜索工具名称..." class="search-input" />

      <!-- 一级类型 -->
      <select v-model="filterType1" class="type-select">
        <option value="">全部一级类型</option>
        <option v-for="t1 in uniqueType1" :key="t1" :value="t1">{{ t1 }}</option>
      </select>

      <!-- 二级类型 -->
      <select v-model="filterType" class="type-select" :disabled="!filterType1">
        <option value="">全部二级类型</option>
        <option v-for="t2 in uniqueType2ForFilter" :key="t2" :value="t2">{{ t2 }}</option>
      </select>

      <button @click="fetchTools">刷新数据</button>
    </div>

    <!-- 卡片列表 -->
    <div class="cards">
      <div v-for="item in filteredData" :key="item.id" class="tool-card">
        <div class="card-content" @click="showMessage(item)">
          <h3>{{ item.name }}</h3>
          <p class="type">
            类型：{{ item.type || '未分类' }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="filteredData.length === 0" class="empty">暂无匹配数据</div>

    <!-- 弹窗、编辑、新增保持原样 -->
    <div v-if="selectedTool" class="modal-mask" @click.self="closeModal">
      <div class="modal-box">
        <h3>{{ selectedTool.name }}</h3>
        <p><strong>类型：</strong>{{ selectedTool.type || '未分类' }}</p>
        <p v-if="!isEditing"><strong>描述：</strong>{{ selectedTool.message || '暂无描述' }}</p>
        <div v-else>
          <strong>编辑描述：</strong>
          <textarea v-model="editMessage" rows="6" class="edit-textarea"></textarea>
        </div>
        <div class="modal-actions">
          <button v-if="selectedTool.link" @click="openLink(selectedTool.link)">跳转</button>
          <button v-if="!isEditing" @click="enableEdit">编辑</button>
          <button v-else @click="saveEdit">保存</button>
          <button @click="closeModal">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="showAdd" class="modal-mask" @click.self="showAdd = false">
      <div class="modal-box">
        <h3>新增工具</h3>
        <div class="add-form">
          <label>名称</label>
          <input v-model="newTool.name" placeholder="请输入工具名称" />
          <label>一级类型</label>
          <input v-model="newTool.type1" placeholder="请输入一级类型" />
          <label>二级类型</label>
          <input v-model="newTool.type" placeholder="请输入二级类型" />
          <label>链接</label>
          <input v-model="newTool.link" placeholder="请输入链接" />
          <label>描述</label>
          <textarea v-model="newTool.message" rows="6" placeholder="请输入描述，可多行"></textarea>
        </div>
        <div class="modal-actions">
          <button @click="insertTool">保存</button>
          <button @click="showAdd = false">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const data = ref([])
const searchQuery = ref('')
const filterType1 = ref('')  // 一级类型
const filterType = ref('')   // 二级类型
const selectedTool = ref(null)
const isEditing = ref(false)
const editMessage = ref('')

// 新增工具
const showAdd = ref(false)
const newTool = ref({ name: '', type1: '', type: '', link: '', message: '' })

// 一级类型数组
const uniqueType1 = ref([])

// 二级类型根据选中的一级类型过滤
const uniqueType2ForFilter = computed(() => {
  if (!filterType1.value) return []
  return [...new Set(data.value.filter(d => d.type1 === filterType1.value).map(d => d.type).filter(Boolean))]
})

// 当选择一级类型时，重置二级选择为“全部”
watch(filterType1, () => {
  filterType.value = ''
})

// 筛选数据
const filteredData = computed(() => {
  return data.value.filter(item => {
    const matchName = item.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchType1 = !filterType1.value || item.type1 === filterType1.value
    const matchType = !filterType.value || item.type === filterType.value
    return matchName && matchType1 && matchType
  })
})

const goHome = () => router.push('/')

// 获取工具数据
const fetchTools = async () => {
  try {
    const res = await axios.get('http://www.moon5.fun:8081/tools')
    data.value = res.data?.data || []
    uniqueType1.value = [...new Set(data.value.map(d => d.type1).filter(Boolean))]
  } catch (err) {
    console.error('获取工具数据失败', err)
    data.value = []
    uniqueType1.value = []
  }
}

// 显示详情弹窗
const showMessage = (item) => {
  selectedTool.value = { ...item }
  isEditing.value = false
  editMessage.value = item.message || ''
}

// 编辑
const enableEdit = () => { isEditing.value = true }

// 关闭弹窗
const closeModal = () => { selectedTool.value = null; isEditing.value = false }

// 保存编辑
const saveEdit = async () => {
  if (!selectedTool.value) return
  try {
    const formData = new FormData()
    formData.append('name', selectedTool.value.name)
    formData.append('message', editMessage.value)
    const res = await axios.post('http://www.moon5.fun:8081/update', formData)
    if (res.data.code === 1) {
      selectedTool.value.message = editMessage.value
      alert('更新成功')
      isEditing.value = false
      fetchTools()
    } else {
      alert('更新失败：' + res.data.msg)
    }
  } catch (err) {
    console.error('更新失败', err)
    alert('请求失败')
  }
}

// 打开链接
const openLink = (url) => window.open(url, '_blank')

// 新增工具
const showAddModal = () => {
  showAdd.value = true
  newTool.value = { name: '', type1: '', type: '', link: '', message: '' }
}

const insertTool = async () => {
  try {
    const formData = new FormData()
    formData.append('name', newTool.value.name)
    formData.append('type1', newTool.value.type1)
    formData.append('type', newTool.value.type)
    formData.append('link', newTool.value.link)
    formData.append('message', newTool.value.message)
    const res = await axios.post('http://www.moon5.fun:8081/insert', formData)
    if (res.data.code === 1) {
      alert('新增成功')
      showAdd.value = false
      fetchTools()
    } else {
      alert('新增失败：' + res.data.msg)
    }
  } catch (err) {
    console.error('新增失败', err)
    alert('请求失败')
  }
}

onMounted(fetchTools)
</script>



<style scoped>
/* 保留原样式 */
.container {
  max-width: 1000px;
  margin: 20px auto;
  padding: 16px;
}

.api-toolbar {
  margin-bottom: 12px;
  display: flex;
  gap: 8px;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.search-input, .type-select {
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
  white-space: pre-wrap;
  word-break: break-word;
}

.modal-box h3 {
  margin-bottom: 10px;
  color: #42b983;
}

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

.edit-textarea, .add-form textarea {
  width: 100%;
  margin-top: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 8px;
  font-size: 14px;
  resize: vertical;
  white-space: pre-wrap;
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.add-form input {
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>
