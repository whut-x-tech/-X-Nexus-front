<template>
    <div class="tools-container">
      <div class="header">
        <h1>工具与资源</h1>
        <div class="search-bar">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="搜索工具..."
            @input="handleSearch"
          >
          <svg class="search-icon" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>
        <div class="tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>
  
      <div class="tools-grid">
        <div 
          v-for="tool in filteredTools" 
          :key="tool.id"
          class="tool-card"
          @click="openTool(tool.url)"
        >
          <div class="tool-header">
            <h3>{{ tool.name }}</h3>
            <div class="tool-actions">
              <button 
                class="favorite-btn"
                @click.stop="toggleFavorite(tool.id)"
                :class="{ favorited: isFavorite(tool.id) }"
                :title="isFavorite(tool.id) ? '移除收藏' : '添加到收藏'"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
              <span class="tool-category">{{ tool.category }}</span>
            </div>
          </div>
          <p class="tool-desc">{{ tool.description }}</p>
          <div class="tool-tags">
            <span v-for="tag in tool.tags" :key="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  
  // 工具数据
  const tools = ref([
    // 修图工具
    {
      id: 1,
      name: "PhotoXie",
      description: "强大的AI修图工具，支持一键美化",
      url: "https://photoxie.com",
      tags: ["修图", "AI", "照片处理"],
      category: "修图"
    },
    {
      id: 2,
      name: "像素蛋糕PixCake",
      description: "商业级人像精修工具",
      url: "https://pixcake.com",
      tags: ["商业", "专业", "人像"],
      category: "修图"
    },
  
    // Markdown编辑器
    {
      id: 10,
      name: "Typora",
      description: "优雅的Markdown编辑器，实时预览",
      url: "https://typora.io",
      tags: ["Markdown", "写作", "代码高亮"],
      category: "开发工具"
    },
    {
      id: 11,
      name: "StackEdit",
      description: "在线Markdown编辑器，支持导出多种格式",
      url: "https://stackedit.io",
      tags: ["在线", "Markdown", "协作"],
      category: "开发工具"
    },
    {
      id: 12,
      name: "VS Code",
      description: "强大的代码编辑器，支持Markdown预览和扩展",
      url: "https://code.visualstudio.com",
      tags: ["IDE", "多语言", "扩展"],
      category: "开发工具"
    },
  
    // 在线代码运行
    {
      id: 20,
      name: "Replit",
      description: "支持50+语言的在线IDE，协作编程",
      url: "https://replit.com",
      tags: ["Python", "Java", "C++", "在线"],
      category: "编程学习"
    },
    {
      id: 21,
      name: "CodeSandbox",
      description: "前端开发沙盒环境，实时预览",
      url: "https://codesandbox.io",
      tags: ["JavaScript", "React", "Vue", "在线"],
      category: "编程学习"
    },
    {
      id: 22,
      name: "JDoodle",
      description: "支持多种语言的在线编译执行工具",
      url: "https://www.jdoodle.com",
      tags: ["Python", "Java", "C++", "编译器"],
      category: "编程学习"
    },
  
    // 学习路线
    {
      id: 30,
      name: "前端学习路线",
      description: "从HTML/CSS到现代前端框架的完整学习路径",
      url: "https://frontendmasters.com/guides/learning-roadmap",
      tags: ["HTML", "CSS", "JavaScript", "React"],
      category: "学习资源"
    },
    {
      id: 31,
      name: "后端开发路线",
      description: "服务器、数据库和API开发学习指南",
      url: "https://roadmap.sh/backend",
      tags: ["Node.js", "Java", "Python", "数据库"],
      category: "学习资源"
    },
    {
      id: 32,
      name: "AI学习路径",
      description: "机器学习与深度学习从入门到进阶",
      url: "https://github.com/AMAI-GmbH/AI-Expert-Roadmap",
      tags: ["机器学习", "深度学习", "Python", "数学"],
      category: "学习资源"
    },
    {
      id: 33,
      name: "数据库工程师",
      description: "SQL与NoSQL数据库系统学习路线",
      url: "https://roadmap.sh/postgresql-dba",
      tags: ["SQL", "MySQL", "PostgreSQL", "MongoDB"],
      category: "学习资源"
    }
  ])
  
  // 标签页数据
  const tabs = ref([
    { id: 'all', name: '全部' },
    { id: '修图', name: '修图工具' },
    { id: '开发工具', name: '开发工具' },
    { id: '编程学习', name: '编程环境' },
    { id: '学习资源', name: '学习路线' },
    { id: 'favorites', name: '我的收藏' }
  ])
  
  // 状态管理
  const activeTab = ref('all')
  const favoriteTools = ref([])
  const searchQuery = ref('')
  
  // 从本地存储加载收藏
  onMounted(() => {
    const savedFavorites = localStorage.getItem('favoriteTools')
    if (savedFavorites) {
      favoriteTools.value = JSON.parse(savedFavorites)
    }
  })
  
  // 计算属性 - 过滤工具
  const filteredTools = computed(() => {
    let result = tools.value
    
    // 按分类筛选
    if (activeTab.value === 'favorites') {
      result = result.filter(tool => favoriteTools.value.includes(tool.id))
    } else if (activeTab.value !== 'all') {
      result = result.filter(tool => tool.category === activeTab.value)
    }
    
    // 按搜索词筛选
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(tool => 
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }
    
    return result
  })
  
  // 检查是否收藏
  const isFavorite = (id) => {
    return favoriteTools.value.includes(id)
  }
  
  // 切换收藏状态
  const toggleFavorite = (id) => {
    const index = favoriteTools.value.indexOf(id)
    if (index === -1) {
      favoriteTools.value.push(id)
    } else {
      favoriteTools.value.splice(index, 1)
    }
    // 保存到本地存储
    localStorage.setItem('favoriteTools', JSON.stringify(favoriteTools.value))
  }
  
  // 打开工具链接
  const openTool = (url) => {
    window.open(url, '_blank')
  }
  
  // 处理搜索
  const handleSearch = () => {
    // 搜索逻辑已在计算属性中处理
  }
  </script>
  
  <style scoped>
  .tools-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .header {
    margin-bottom: 30px;
    text-align: center;
  }
  
  .header h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
    color: #333;
  }
  
  .search-bar {
    position: relative;
    max-width: 500px;
    margin: 0 auto 20px;
  }
  
  .search-bar input {
    width: 100%;
    padding: 12px 20px 12px 40px;
    border: 1px solid #ddd;
    border-radius: 25px;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.3s;
  }
  
  .search-bar input:focus {
    border-color: #4f46e5;
  }
  
  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    fill: #999;
  }
  
  .tabs {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .tabs button {
    padding: 8px 16px;
    border: none;
    border-radius: 20px;
    background: #f0f0f0;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 0.9rem;
  }
  
  .tabs button.active {
    background: #4f46e5;
    color: white;
  }
  
  .tools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 25px;
  }
  
  .tool-card {
    background: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;
    border: 1px solid #eee;
  }
  
  .tool-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
  
  .tool-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
  }
  
  .tool-header h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #333;
    flex: 1;
  }
  
  .tool-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .favorite-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    color: #ccc;
    transition: color 0.3s;
    display: flex;
    align-items: center;
  }
  
  .favorite-btn svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
  
  .favorite-btn.favorited {
    color: #ff4757;
  }
  
  .tool-category {
    background: #e0e7ff;
    color: #4f46e5;
    padding: 3px 8px;
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: bold;
  }
  
  .tool-desc {
    margin: 10px 0;
    color: #666;
    font-size: 0.9rem;
    line-height: 1.5;
    min-height: 40px;
  }
  
  .tool-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 15px;
  }
  
  .tool-tags span {
    background: #f0f0f0;
    padding: 3px 8px;
    border-radius: 10px;
    font-size: 0.8rem;
    color: #555;
  }
  
  @media (max-width: 768px) {
    .tools-grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
    
    .tabs {
      justify-content: flex-start;
      overflow-x: auto;
      padding-bottom: 10px;
    }
    
    .tabs button {
      white-space: nowrap;
    }
  }
  </style>