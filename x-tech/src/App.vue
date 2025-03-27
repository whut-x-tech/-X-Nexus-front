<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

const search = () => {
  console.log('Searching for:', searchQuery.value)
}
</script>

<template>
  <div class="app">
    <!-- Header -->
    <header class="header">
      <nav class="nav">
        <router-link to="/" class="nav-item">首页</router-link>
        <router-link to="/blog" class="nav-item">博客</router-link>
        <router-link to="/forum" class="nav-item">论坛</router-link>
        <router-link to="/team" class="nav-item">团队</router-link>
        <router-link to="/tools" class="nav-item">工具</router-link>
      </nav>
      <div class="search-box">
        <input v-model="searchQuery" placeholder="搜索..." class="search-input" />
        <button @click="search" class="search-button">🔍</button>
      </div>
    </header>

    <!-- 主要内容区域，自动适应大小 -->
    <main class="main-content">
      <router-view></router-view>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-section">
        <h3>关于我们</h3>
        <p><strong>X-nexus项目</strong> 由X-tech团队成员自主开发的互联网学习入门指引平台</p>
      </div>
      <div class="footer-section">
        <h3>开发成员</h3>
        <p>XXX</p>
        <p>XXX</p>
      </div>
      <div class="footer-section">
        <h3>个人博客链接</h3>
        <p><a href="#" class="blog-link">XXX博客</a></p>
        <p><a href="#" class="blog-link">XXX博客</a></p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* 全局布局 */
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0;
  background: linear-gradient(to bottom, #f5f7fa, #e8edf5);
}

/* Header 样式 - 更年轻化的渐变 */
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 5%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: -10px;
  margin-left: -10px;
}

/* 导航栏样式更新 */
.nav {
  display: flex;
  gap: 10px;
}

.nav-item {
  color: white;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  padding: 10px 20px;
  transition: all 0.3s ease;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.nav-item.router-link-active {
  background: white;
  color: #667eea;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 搜索框现代化设计 */
.search-box {
  display: flex;
  margin-right: 200px;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 30px;
  padding: 8px 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.search-box:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.search-input {
  border: none;
  outline: none;
  padding: 5px 10px;
  font-size: 14px;
  width: 180px;
  background: transparent;
  color: #333;
}

.search-button {
  cursor: pointer;
  background: none;
  border: none;
  font-size: 18px;
  padding: 5px;
  color: #667eea;
  transition: transform 0.3s;
}

.search-button:hover {
  transform: scale(1.1);
}

/* 主要内容区域 */
.main-content {
  margin-top: 75px;
}

/* Footer 现代化设计 */
.footer {
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 15px 5%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: -10px;
  margin-left: -10px;
}

.footer-section {
  flex: 1;
  min-width: 250px;
  padding: 20px;
  margin: 10px;
  border-radius: 12px;
  backdrop-filter: blur(5px);
  transition: transform 0.3s;
}


.footer-section h3 {
  color: #ff7e5f;
  font-size: 18px;
  margin-bottom: 15px;
  position: relative;
  padding-bottom: 8px;
}

.footer-section h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(to right, #ff7e5f, #feb47b);
  border-radius: 3px;
}

.footer-section p {
  font-size: 14px;
  color: #d1d5db;
  margin: 10px 0;
  line-height: 1.6;
}

.blog-link {
  color: #6dd5ed;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
  display: inline-block;
  padding: 2px 0;
  position: relative;
}

.blog-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: currentColor;
  transition: width 0.3s;
}

.blog-link:hover {
  color: #ff7e5f;
}

.blog-link:hover::after {
  width: 100%;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    padding: 15px;
  }
  
  .nav {
    margin-bottom: 15px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .search-box {
    margin: 10px 0 0;
    width: 90%;
  }
  
  .main-content {
    padding: 120px 15px 30px;
    margin: 0;
    border-radius: 0;
  }
  
  .footer-section {
    min-width: 100%;
    margin: 10px 0;
  }
}
</style>