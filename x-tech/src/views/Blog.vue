<template>
  <div class="home-container">
    <!-- 左侧导航 -->
    <aside class="sidebar">
      <ul>
        <li v-for="item in navList" :key="item.label" @click="filterPosts(item.label)" 
            :class="{ active: selectedTag === item.label }">
          <div class="nav-item">
            <LucideIcon :name="item.icon" class="icon" />
            <span>{{ item.label }}</span>
          </div>
        </li>
      </ul>
    </aside>

    <!-- 主要内容 -->
    <main class="main-content">
      <div v-for="post in paginatedPosts" :key="post.id" class="post-card">
        <div class="post-header">
          <img :src="post.image" alt="封面图" class="post-image" />
          <div class="post-text">
            <h3>{{ post.title }}</h3>
            <p>{{ post.content }}</p>
            <div class="post-meta">
              <div class="meta-item">
                <LucideThumbsUp class="meta-icon" /> {{ post.likes }}
              </div>
              <div class="meta-item">
                <LucideMessageCircle class="meta-icon" /> {{ post.comments }}
              </div>
              <div class="meta-item">
                <LucideClock class="meta-icon" /> {{ post.date }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">
          <LucideChevronLeft class="pagination-icon" />
          上一页
        </button>
        <span>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
        <button @click="nextPage" :disabled="currentPage >= totalPages">
          下一页
          <LucideChevronRight class="pagination-icon" />
        </button>
      </div>
    </main>

    <!-- 右侧栏 -->
    <aside class="right-sidebar">
      <!-- 热门讨论 -->
      <section class="hot-topics">
        <h4 class="section-title">
          <LucideFlame class="section-icon" /> 热门讨论
        </h4>
        <ul>
          <li v-for="(topic, index) in hotTopics.slice(0, 6)" :key="topic.id" class="topic-item">
            <span class="hot-topic-rank" :class="getRankClass(topic.rank)">
              <LucideCrown v-if="topic.rank <= 3" class="crown-icon" />
              {{ topic.rank }}
            </span>
            <span class="topic-title">{{ topic.title }}</span>
          </li>
        </ul>
      </section>

      <!-- 消息列表 -->
      <section class="messages">
        <h4 class="section-title">
          <LucideMail class="section-icon" /> 消息列表
        </h4>
        <div class="search-box">
          <LucideSearch class="search-icon" />
          <input v-model="searchQuery" placeholder="搜索消息" />
        </div>
        <ul class="message-list">
          <li v-for="msg in filteredMessages.slice(0, 5)" :key="msg.id" class="message-item">
            <img :src="msg.avatar" alt="头像" class="avatar" />
            <div class="message-content">
              <strong>{{ msg.sender }}</strong>
              <p>{{ msg.text }}</p>
            </div>
          </li>
        </ul>
        <button @click="showAllMessages" class="more-btn">查看更多</button>
      </section>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  LucideThumbsUp,
  LucideMessageCircle,
  LucideClock,
  LucideChevronLeft,
  LucideChevronRight,
  LucideFlame,
  LucideMail,
  LucideSearch,
  LucideCrown,
  LucideHome,
  LucideActivity,
  LucideCode,
  LucideDatabase,
  LucideBrain
} from "lucide-vue-next";

// 左侧导航
const navList = ref([
  { label: "推荐", icon: "home" },
  { label: "鸿蒙OS", icon: "activity" },
  { label: "前端", icon: "code" },
  { label: "后端", icon: "database" },
  { label: "人工智能", icon: "brain" }
]);

// 文章数据（完整）
const posts = ref([
  { id: 1, title: "鸿蒙OS起步", content: "鸿蒙OS学习心得...", date: "2025-03-24", likes: 1324, comments: 2975, image: "https://picsum.photos/seed/1/200/150", tags: ["鸿蒙OS"] },
  { id: 2, title: "Vue3 组合式 API", content: "深入理解 Vue3 的新特性...", date: "2025-03-21", likes: 800, comments: 1100, image: "https://picsum.photos/seed/4/200/150", tags: ["前端"] },
  { id: 3, title: "Node.js 性能优化", content: "如何提升 Node.js 应用的性能...", date: "2025-03-19", likes: 690, comments: 860, image: "https://picsum.photos/seed/6/200/150", tags: ["后端"] },
  { id: 4, title: "Python AI开发", content: "利用 Python 进行人工智能开发...", date: "2025-03-18", likes: 650, comments: 720, image: "https://picsum.photos/seed/7/200/150", tags: ["人工智能"] },
  { id: 5, title: "Docker 容器化部署", content: "Docker 快速上手指南...", date: "2025-03-16", likes: 570, comments: 650, image: "https://picsum.photos/seed/9/200/150", tags: ["后端"] },
  { id: 6, title: "React 新特性", content: "探索 React 18 的变化...", date: "2025-03-14", likes: 420, comments: 550, image: "https://picsum.photos/seed/11/200/150", tags: ["前端"] },
  { id: 7, title: "鸿蒙OS开发进阶", content: "深入鸿蒙OS开发技巧...", date: "2025-03-12", likes: 380, comments: 490, image: "https://picsum.photos/seed/12/200/150", tags: ["鸿蒙OS"] }
]);

// 选中分类
const selectedTag = ref("推荐");
const filteredPosts = computed(() => {
  return selectedTag.value === "推荐"
    ? posts.value
    : posts.value.filter(post => post.tags.includes(selectedTag.value));
});

// 分页逻辑
const currentPage = ref(1);
const pageSize = 5;
const totalPages = computed(() => Math.ceil(filteredPosts.value.length / pageSize));
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredPosts.value.slice(start, start + pageSize);
});

const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };

// 筛选文章
const filterPosts = (tag) => {
  selectedTag.value = tag;
  currentPage.value = 1;
};

// 热门讨论（完整）
const hotTopics = ref([
  { id: 1, title: "程序员开发工具终极榜单", rank: 1 },
  { id: 2, title: "编程语言排行榜：Python vs Java", rank: 2 },
  { id: 3, title: "华为 HarmonyOS 生态构建", rank: 3 },
  { id: 4, title: "如何成为全栈工程师", rank: 4 },
  { id: 5, title: "人工智能的未来", rank: 5 }
]);

// 获取排名样式
const getRankClass = (rank) => {
  return {
    'rank-1': rank === 1,
    'rank-2': rank === 2,
    'rank-3': rank === 3,
    'rank-other': rank > 3
  };
};

// 消息搜索
const searchQuery = ref("");
const messages = ref([
  { id: 1, sender: "Vue 开发者", text: "Vue3 真的很棒！", avatar: "https://picsum.photos/seed/a/40/40" },
  { id: 2, sender: "AI 交流群", text: "Transformer 模型解析", avatar: "https://picsum.photos/seed/b/40/40" },
  { id: 3, sender: "后端技术群", text: "微服务架构讨论", avatar: "https://picsum.photos/seed/c/40/40" },
  { id: 4, sender: "前端周刊", text: "本周前端热点", avatar: "https://picsum.photos/seed/d/40/40" },
  { id: 5, sender: "系统通知", text: "系统维护通知", avatar: "https://picsum.photos/seed/e/40/40" }
]);

const filteredMessages = computed(() => 
  messages.value.filter(msg => 
    msg.text.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
    msg.sender.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);
const showAllMessages = () => alert("显示所有消息");

</script>

<style scoped>
.home-container {
  display: flex;
  max-width: 1200px;
  margin: auto;
  padding: 20px;
  gap: 20px;
  background: linear-gradient(to bottom right, #f9fafb, #f0f4f8);
}

.sidebar {
  width: 200px;
  padding: 15px;
  background: white;
  border-radius: 12px;
  height: fit-content;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  padding: 12px 15px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar li:hover {
  background: linear-gradient(to right, #f0f9ff, #e0f2fe);
  transform: translateX(4px);
}

.sidebar li.active {
  background: linear-gradient(to right, #38bdf8, #0ea5e9);
  color: white;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(56, 189, 248, 0.3);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon {
  width: 18px;
  height: 18px;
}

.main-content {
  flex: 1;
  min-width: 0;
}

.post-card {
  background: white;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}

.post-header {
  display: flex;
  gap: 16px;
}

.post-image {
  width: 120px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.post-text {
  flex: 1;
}

.post-text h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #1e293b;
}

.post-text p {
  margin: 0 0 12px 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
}

.post-meta {
  display: flex;
  gap: 16px;
  color: #64748b;
  font-size: 13px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-icon {
  width: 14px;
  height: 14px;
  color: #94a3b8;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 24px;
}

.pagination button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(to bottom, white, #f1f5f9);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #334155;
}

.pagination button:hover:not(:disabled) {
  background: linear-gradient(to bottom, #f8fafc, #e2e8f0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-icon {
  width: 16px;
  height: 16px;
}

.right-sidebar {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #1e293b;
  font-weight: 600;
}

.section-icon {
  width: 18px;
  height: 18px;
  color: #3b82f6;
}

.hot-topics, .messages {
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.hot-topics ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.topic-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px dashed #e2e8f0;
}

.topic-item:last-child {
  border-bottom: none;
}

.hot-topic-rank {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  flex-shrink: 0;
}

.rank-1 {
  background: linear-gradient(135deg, #fcd34d, #f59e0b);
  color: white;
}

.rank-2 {
  background: linear-gradient(135deg, #e5e7eb, #9ca3af);
  color: white;
}

.rank-3 {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
}

.rank-other {
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  color: #64748b;
}

.crown-icon {
  width: 14px;
  height: 14px;
  margin-right: 4px;
  color: white;
}

.topic-title {
  flex: 1;
  font-size: 14px;
  color: #334155;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-box {
  position: relative;
  margin-bottom: 16px;
}

.search-box input {
  width: 80%;
  padding: 10px 12px 10px 36px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: #f8fafc;
  transition: all 0.3s;
}

.search-box input:focus {
  outline: none;
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.3);
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #94a3b8;
}

.message-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.message-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px dashed #e2e8f0;
}

.message-item:last-child {
  border-bottom: none;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid #e0f2fe;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.message-content {
  flex: 1;
}

.message-content strong {
  display: block;
  font-size: 14px;
  margin-bottom: 4px;
  color: #1e293b;
}

.message-content p {
  margin: 0;
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
}

.more-btn {
  width: 100%;
  padding: 10px;
  margin-top: 12px;
  background: linear-gradient(to bottom, white, #f1f5f9);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #3b82f6;
  transition: all 0.3s;
  font-weight: 500;
}

.more-btn:hover {
  background: linear-gradient(to bottom, #f8fafc, #e2e8f0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style>