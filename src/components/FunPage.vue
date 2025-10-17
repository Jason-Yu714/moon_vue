<template>
  <div class="container">
    <h2>Fun Search</h2>

    <!-- ✅ 筛选 + 搜索 + 添加 -->
    <div class="toolbar">
      <select v-model="filterLanguage" class="type-select">
        <option value="">全部语言</option>
        <option v-for="lang in uniqueLanguages" :key="lang" :value="lang">{{ lang }}</option>
      </select>

      <!-- ✅ 搜索框 -->
      <input
          v-model="searchQuery"
          placeholder="搜索工具名称..."
          class="search-input"
      />

      <!-- ✅ 添加按钮 -->
      <button @click="openAddModal">添加工具</button>
      <button @click="fetchFun">刷新数据</button>
    </div>

    <!-- 卡片列表 -->
    <div class="cards">
      <div
          v-for="item in filteredData"
          :key="item.id"
          class="tool-card"
          @click="showMessage(item)"
      >
        <h3>{{ item.name }}</h3>
        <h3>language: {{ item.language }}}</h3>
      </div>
    </div>

    <div v-if="filteredData.length === 0" class="empty">暂无匹配数据</div>

    <!-- ✅ 详情弹窗 -->
    <div v-if="selectedFun" class="modal-mask" @click.self="closeModal">
      <div class="modal-box">
        <h3>{{ selectedFun.name }}</h3>

        <div v-if="!isEditing">
          <p><strong>函数用法</strong>{{ selectedFun.message1 || '暂无内容' }}</p>
          <p><strong>可利用点</strong>{{ selectedFun.message2 || '暂无内容' }}</p>
        </div>

        <div v-else>
          <p><strong>编辑 函数用法</strong></p>
          <textarea v-model="editMessage1" rows="4" class="edit-textarea"></textarea>

          <p><strong>编辑 可利用点</strong></p>
          <textarea v-model="editMessage2" rows="4" class="edit-textarea"></textarea>
        </div>

        <div class="modal-actions">
          <button v-if="!isEditing" @click="enableEdit">编辑</button>
          <button v-else @click="saveEdit">保存</button>
          <button @click="closeModal">关闭</button>
        </div>
      </div>
    </div>

    <!-- ✅ 添加工具弹窗 -->
    <div v-if="showAddModal" class="modal-mask" @click.self="closeAddModal">
      <div class="modal-box">
        <h3>添加新工具</h3>
        <p><strong>名称：</strong></p>
        <input v-model="newFun.name" class="add-input" placeholder="请输入工具名称" />

        <p><strong>语言：</strong></p>
        <input v-model="newFun.language" class="add-input" placeholder="如 Python、PHP..." />

        <p><strong>函数用法：</strong></p>
        <textarea v-model="newFun.message1" rows="3" class="edit-textarea"></textarea>

        <p><strong>可利用点：</strong></p>
        <textarea v-model="newFun.message2" rows="3" class="edit-textarea"></textarea>

        <div class="modal-actions">
          <button @click="submitAddFun">提交</button>
          <button @click="closeAddModal">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import axios from 'axios'

const data = ref([])
const filterLanguage = ref('')
const searchQuery = ref('')
const selectedFun = ref(null)
const isEditing = ref(false)
const editMessage1 = ref('')
const editMessage2 = ref('')

// ✅ 添加功能数据
const showAddModal = ref(false)
const newFun = ref({
  name: '',
  language: '',
  message1: '',
  message2: ''
})

// ✅ 语言下拉去重
const uniqueLanguages = computed(() => {
  return [...new Set(data.value.map(d => d.language).filter(Boolean))]
})

// ✅ 搜索 + 筛选
const filteredData = computed(() => {
  return data.value.filter(item => {
    const matchLang = !filterLanguage.value || item.language === filterLanguage.value
    const matchSearch = !searchQuery.value || item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchLang && matchSearch
  })
})

// ✅ 获取数据
const fetchFun = async () => {
  try {
    const res = await axios.get('http://www.moon5.fun:8081/fun')
    data.value = res.data?.data || []
  } catch (err) {
    console.error('获取 fun 数据失败', err)
    data.value = []
  }
}

// ✅ 打开详情
const showMessage = (item) => {
  selectedFun.value = {...item}
  editMessage1.value = item.message1 || ''
  editMessage2.value = item.message2 || ''
  isEditing.value = false
}

// ✅ 编辑
const enableEdit = () => {
  isEditing.value = true
}

// ✅ 保存修改
const saveEdit = async () => {
  if (!selectedFun.value) return
  try {
    const formData = new FormData()
    formData.append('name', selectedFun.value.name)
    formData.append('message1', editMessage1.value)
    formData.append('message2', editMessage2.value)

    const res = await axios.post('http://www.moon5.fun:8081/updateFun', formData)
    if (res.data.code === 1) {
      alert('更新成功')
      isEditing.value = false
      fetchFun()
    } else {
      alert('更新失败：' + res.data.msg)
    }
  } catch (err) {
    console.error('更新失败', err)
    alert('请求失败')
  }
}

// ✅ 添加工具弹窗
const openAddModal = () => {
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
  newFun.value = {name: '', language: '', message1: '', message2: ''}
}

// ✅ 提交添加
const submitAddFun = async () => {
  if (!newFun.value.name || !newFun.value.language) {
    alert('请填写名称和语言')
    return
  }
  try {
    const formData = new FormData()
    formData.append('name', newFun.value.name)
    formData.append('language', newFun.value.language)
    formData.append('message1', newFun.value.message1)
    formData.append('message2', newFun.value.message2)

    const res = await axios.post('http://www.moon5.fun:8081/addFun', formData)
    if (res.data.code === 1) {
      alert('添加成功')
      closeAddModal()
      fetchFun()
    } else {
      alert('添加失败：' + res.data.msg)
    }
  } catch (err) {
    console.error('添加失败', err)
    alert('请求失败')
  }
}

// ✅ 关闭详情弹窗
const closeModal = () => {
  selectedFun.value = null
  isEditing.value = false
}

onMounted(fetchFun)
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 20px auto;
  padding: 16px;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.type-select,
.search-input {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.search-input {
  width: 180px;
}

button {
  padding: 6px 14px;
  border: 1px solid #42b983;
  background: #fff;
  color: #42b983;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

button:hover {
  background: #42b983;
  color: #fff;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.tool-card {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  text-align: center;
}

.tool-card h3 {
  color: #333;
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
  width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  white-space: pre-wrap;
  word-break: break-word;
}

.add-input {
  width: 100%;
  margin-top: 6px;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 8px;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.edit-textarea {
  width: 100%;
  margin-top: 6px;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 8px;
  font-size: 14px;
  resize: vertical;
}
</style>
