<template>
  <div class="card">
    <h3 class="card-title">{{ name || '无标题' }}</h3>
    <p class="card-hint" v-if="hint">提示: {{ hint }}</p>
    <p class="card-type" v-if="type">类型: {{ type }}</p>
    <p class="card-time" v-if="time">日期: {{ time }}</p>
    <a
        v-if="link"
        class="card-link"
        :href="link"
        target="_blank"
        rel="noopener noreferrer"
    >
      查看链接
    </a>
  </div>
</template>

<script setup>
// defineProps 不需要 import
const props = defineProps({
  name: { type: String, default: '' },
  hint: { type: String, default: '' },
  type: { type: String, default: '' },
  time: { type: String, default: '' },
  link: { type: String, default: '' }
})
</script>

<style scoped>
.card {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
}

.card-hint,
.card-type,
.card-time {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
}

.card-link {
  display: inline-block;
  margin-top: 6px;
  font-size: 13px;
  color: #42b983;
  text-decoration: none;
}

.card-link:hover {
  text-decoration: underline;
}
</style>
