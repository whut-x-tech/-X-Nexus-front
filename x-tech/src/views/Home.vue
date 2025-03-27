<template>
  <div class="home-page">
    <!-- 顶部轮播图 -->
    <div class="carousel-container">
      <div class="carousel" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div 
          v-for="(slide, index) in slides" 
          :key="index" 
          class="slide"
          :style="{ backgroundImage: `url(${slide.image})` }"
        >
          <div class="slide-content">
            <h2>{{ slide.title }}</h2>
            <p>{{ slide.description }}</p>
            <button @click="openLink(slide.link)">了解更多</button>
          </div>
        </div>
      </div>
      <div class="carousel-controls">
        <button @click="prevSlide" class="control-btn">
          <chevron-left />
        </button>
        <div class="indicators">
          <span 
            v-for="(slide, index) in slides" 
            :key="index"
            :class="{ active: index === currentSlide }"
            @click="goToSlide(index)"
          ></span>
        </div>
        <button @click="nextSlide" class="control-btn">
          <chevron-right />
        </button>
      </div>
    </div>

    <!-- 签到打卡 -->
    <div class="check-in-card">
      <div class="check-in-header">
        <calendar-days class="icon" />
        <h3>每日签到</h3>
        <span class="date">{{ currentDate }}</span>
      </div>
      <div class="check-in-content">
        <div class="fortune" v-if="!checkedIn">
          <p>今日运势：{{ fortune }}</p>
          <button @click="checkIn" class="check-in-btn">
            <star class="icon" /> 立即签到
          </button>
        </div>
        <div class="checked-in" v-else>
          <div class="fortune-result">
            <sparkles class="icon" />
            <p>今日运势：{{ fortune }}</p>
          </div>
          <p class="check-in-success">已签到 {{ checkInTime }}</p>
          <div class="streak">连续签到 {{ streak }} 天</div>
        </div>
      </div>
    </div>

    <!-- 功能导航 -->
    <div class="feature-grid">
    <div class="feature-card" @click="navigateToT('blog')">
      <book-open class="icon" />
      <h3>技术博客</h3>
      <p>阅读最新技术文章</p>
    </div>
    
    <div class="feature-card" @click="navigateToT('forum')">
      <messages-square class="icon" />
      <h3>开发者论坛</h3>
      <p>参与技术讨论</p>
    </div>
    
    <div class="feature-card" @click="navigateToT('team')">
      <users class="icon" />
      <h3>团队协作</h3>
      <p>加入开发团队</p>
    </div>
    
    <div class="feature-card" @click="navigateToT('tools')">
      <wrench class="icon" />
      <h3>便捷工具</h3>
      <p>提高开发效率</p>
    </div>
  </div>

    <!-- 内容区块 -->
    <div class="content-section">
      <div class="content-card">
        <h3><book-open class="icon" /> 热门博客</h3>
        <ul class="blog-list">
          <li v-for="blog in blogs" :key="blog.id" @click="openBlog(blog.id)">
            <span class="blog-title">{{ blog.title }}</span>
            <span class="blog-date">{{ blog.date }}</span>
          </li>
        </ul>
        <button class="view-all" @click="navigateTo('blog')">
          <arrow-right class="icon" /> 查看全部
        </button>
      </div>

      <div class="content-card">
        <h3><messages-square class="icon" /> 论坛热帖</h3>
        <ul class="forum-list">
          <li v-for="post in forumPosts" :key="post.id" @click="openPost(post.id)">
            <span class="post-title">{{ post.title }}</span>
            <span class="post-author">{{ post.author }}</span>
            <span class="post-comments">
              <message-square class="icon" /> {{ post.comments }}
            </span>
          </li>
        </ul>
        <button class="view-all" @click="navigateTo('forum')">
          <arrow-right class="icon" /> 查看全部
        </button>
      </div>
    </div>

    <!-- 工具推荐 -->
    <div class="tools-section">
      <h2><wrench class="icon" /> 开发者工具推荐</h2>
      <div class="tools-grid">
        <div 
          v-for="tool in tools" 
          :key="tool.id" 
          class="tool-card"
          @click="openTool(tool.link)"
        >
          <div class="tool-icon">
            <component :is="tool.icon" />
          </div>
          <h3>{{ tool.name }}</h3>
          <p>{{ tool.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  ChevronLeft, ChevronRight, CalendarDays, Star, Sparkles, 
  BookOpen, MessagesSquare, Users, Wrench, ArrowRight, 
  MessageSquare, Code, Terminal, Cpu, Database, GitBranch 
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
const router = useRouter()

const navigateToT = (route) => {
  router.push(`/${route}`)
}
// 轮播图数据
const slides = ref([
  {
    title: "开发者大会2023",
    description: "年度技术盛会，与行业领袖面对面",
    image: "https://example.com/slide1.jpg",
    link: "/events/developer-conference"
  },
  {
    title: "新课程上线",
    description: "Vue3高级实战课程现已开放",
    image: "https://example.com/slide2.jpg",
    link: "/courses/vue3-advanced"
  },
  {
    title: "黑客马拉松",
    description: "48小时编程挑战赛报名开始",
    image: "https://example.com/slide3.jpg",
    link: "/events/hackathon"
  }
])

const currentSlide = ref(0)
let slideInterval

// 轮播图控制
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
  resetInterval()
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length
  resetInterval()
}

const goToSlide = (index) => {
  currentSlide.value = index
  resetInterval()
}

const resetInterval = () => {
  clearInterval(slideInterval)
  startCarousel()
}

const startCarousel = () => {
  slideInterval = setInterval(() => {
    nextSlide()
  }, 5000)
}

// 签到打卡
const fortunes = [
  "大吉 - 今天会有意外收获",
  "吉 - 适合学习新技术",
  "中吉 - 代码一次通过",
  "小吉 - 注意调试细节",
  "末吉 - 记得备份代码"
]

const checkedIn = ref(false)
const fortune = ref("")
const checkInTime = ref("")
const streak = ref(0)
const currentDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', { 
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' 
  })
})

const checkIn = () => {
  checkedIn.value = true
  fortune.value = fortunes[Math.floor(Math.random() * fortunes.length)]
  checkInTime.value = new Date().toLocaleTimeString('zh-CN', { 
    hour: '2-digit', minute: '2-digit' 
  })
  streak.value = streak.value + 1
  localStorage.setItem('lastCheckIn', new Date().toDateString())
  localStorage.setItem('checkInStreak', streak.value)
}

// 博客数据
const blogs = ref([
  { id: 1, title: "Vue3组合式API最佳实践", date: "2023-05-10" },
  { id: 2, title: "TypeScript在大型项目中的应用", date: "2023-05-08" },
  { id: 3, title: "前端性能优化全攻略", date: "2023-05-05" }
])

// 论坛帖子
const forumPosts = ref([
  { id: 1, title: "React vs Vue 2023年对比", author: "技术达人", comments: 42 },
  { id: 2, title: "如何设计高可用后端架构", author: "架构师", comments: 28 },
  { id: 3, title: "AI辅助编程工具评测", author: "AI探索者", comments: 35 }
])

// 工具推荐
const tools = ref([
  { 
    id: 1, 
    name: "VS Code", 
    description: "强大的代码编辑器", 
    link: "https://code.visualstudio.com",
    icon: Code
  },
  { 
    id: 2, 
    name: "GitHub", 
    description: "代码托管平台", 
    link: "https://github.com",
    icon: GitBranch
  },
  { 
    id: 3, 
    name: "Postman", 
    description: "API开发与测试", 
    link: "https://postman.com",
    icon: Terminal
  },
  { 
    id: 4, 
    name: "Docker", 
    description: "容器化部署", 
    link: "https://docker.com",
    icon: Cpu
  },
  { 
    id: 5, 
    name: "MongoDB", 
    description: "NoSQL数据库", 
    link: "https://mongodb.com",
    icon: Database
  }
])

// 初始化
onMounted(() => {
  startCarousel()
  
  // 检查是否已签到
  const lastCheckIn = localStorage.getItem('lastCheckIn')
  if (lastCheckIn === new Date().toDateString()) {
    checkedIn.value = true
    fortune.value = fortunes[Math.floor(Math.random() * fortunes.length)]
    checkInTime.value = "今天"
    streak.value = parseInt(localStorage.getItem('checkInStreak')) || 1
  } else {
    fortune.value = "签到查看今日运势"
  }
})

// 导航方法
const navigateTo = (route) => {
  // 实际项目中应该使用路由跳转
  console.log(`Navigating to ${route}`)
  // router.push(`/${route}`)
}

const openBlog = (id) => {
  console.log(`Opening blog ${id}`)
  // router.push(`/blog/${id}`)
}

const openPost = (id) => {
  console.log(`Opening forum post ${id}`)
  // router.push(`/forum/post/${id}`)
}

const openLink = (url) => {
  window.open(url, '_blank')
}

const openTool = (url) => {
  window.open(url, '_blank')
}
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 轮播图样式 */
.carousel-container {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.carousel {
  display: flex;
  height: 100%;
  transition: transform 0.5s ease;
}

.slide {
  min-width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}

.slide::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
}

.slide-content {
  position: absolute;
  bottom: 80px;
  left: 50px;
  color: white;
  max-width: 600px;
  text-align: left;
}

.slide-content h2 {
  font-size: 2.2rem;
  margin-bottom: 15px;
}

.slide-content p {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.slide-content button {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.slide-content button:hover {
  background: #4338ca;
}

.carousel-controls {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.control-btn {
  background: rgba(255, 255, 255, 0.3);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: background 0.3s;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.5);
}

.indicators {
  display: flex;
  gap: 10px;
}

.indicators span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}

.indicators span.active {
  background: white;
}

/* 签到卡片样式 */
.check-in-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.check-in-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.check-in-header h3 {
  margin: 0;
  font-size: 1.3rem;
  color: #333;
}

.check-in-header .date {
  margin-left: auto;
  color: #666;
  font-size: 0.9rem;
}

.check-in-header .icon {
  width: 24px;
  height: 24px;
  color: #4f46e5;
}

.check-in-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.fortune p {
  font-size: 1.1rem;
  margin-bottom: 20px;
  color: #333;
}

.check-in-btn {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s;
}

.check-in-btn:hover {
  background: #4338ca;
}

.check-in-btn .icon {
  width: 18px;
  height: 18px;
}

.checked-in {
  text-align: center;
}

.fortune-result {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
}

.fortune-result p {
  font-size: 1.1rem;
  color: #333;
  margin: 0;
}

.fortune-result .icon {
  width: 20px;
  height: 20px;
  color: #f59e0b;
}

.check-in-success {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.streak {
  background: #e0e7ff;
  color: #4f46e5;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
}

/* 功能导航样式 */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.feature-card {
  background: white;
  border-radius: 10px;
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid #eee;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.feature-card .icon {
  width: 40px;
  height: 40px;
  color: #4f46e5;
  margin-bottom: 15px;
}

.feature-card h3 {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  color: #333;
}

.feature-card p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

/* 内容区块样式 */
.content-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .content-section {
    grid-template-columns: 1fr;
  }
}

.content-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.content-card h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 20px 0;
  font-size: 1.2rem;
  color: #333;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.content-card h3 .icon {
  width: 20px;
  height: 20px;
  color: #4f46e5;
}

.blog-list, .forum-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.blog-list li, .forum-list li {
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.blog-list li:hover, .forum-list li:hover {
  background: #f9f9f9;
}

.blog-title, .post-title {
  font-weight: 500;
  color: #333;
  flex: 1;
}

.blog-date, .post-author {
  color: #666;
  font-size: 0.9rem;
  margin-left: 15px;
}

.post-comments {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
  font-size: 0.9rem;
  margin-left: 15px;
}

.post-comments .icon {
  width: 16px;
  height: 16px;
}

.view-all {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  color: #4f46e5;
  font-size: 0.9rem;
  margin-top: 15px;
  cursor: pointer;
  padding: 5px 0;
}

.view-all .icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s;
}

.view-all:hover .icon {
  transform: translateX(3px);
}

/* 工具推荐样式 */
.tools-section {
  margin-bottom: 50px;
}

.tools-section h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
}

.tools-section h2 .icon {
  width: 24px;
  height: 24px;
  color: #4f46e5;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.tool-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid #eee;
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.tool-icon {
  width: 50px;
  height: 50px;
  margin: 0 auto 15px;
  background: #e0e7ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tool-icon svg {
  width: 24px;
  height: 24px;
  color: #4f46e5;
}

.tool-card h3 {
  margin: 0 0 10px 0;
  font-size: 1.1rem;
  color: #333;
}

.tool-card p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}
</style>