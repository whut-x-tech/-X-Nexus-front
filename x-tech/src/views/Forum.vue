<template>
    <div class="forum-container">
      <!-- 顶部导航栏 -->
      <nav class="main-nav">
        <ul>
          <li v-for="tab in tabs" 
              :key="tab.id" 
              :class="{ active: activeTab === tab.id }" 
              @click="switchTab(tab.id)">
              <span class="nav-item">
                <component :is="tab.icon" class="nav-icon" />
                {{ tab.name }}
              </span>
          </li>
        </ul>
      </nav>
  
      <div class="content-wrapper">
        <!-- 主内容区 -->
        <main class="main-content">
          <!-- 关注内容 -->
          <div v-if="activeTab === 'following'" class="tab-content">
            <h2 class="tab-title">我关注的动态</h2>
            <article v-for="post in followingPosts" :key="post.id" class="post-card">
              <div class="post-header">
                <h3>{{ post.title }}</h3>
                <span class="author">作者: {{ post.author }}</span>
              </div>
              <div class="post-content">
                <p>{{ post.content }}</p>
                <button class="read-more">阅读全文</button>
              </div>
              <div class="post-footer">
                <span class="likes">
                <ThumbsUp class="action-icon" />
                赞同 {{ post.likes }}
                </span>
                <span class="comments">
                <MessageSquare class="action-icon" />
                {{ post.comments }}条评论
                </span>
                <span class="actions">
                <button>
                    <Share2 class="action-icon" />
                    分享
                </button>
                <button>
                    <Bookmark class="action-icon" />
                    收藏
                </button>
                <button>
                    <Heart class="action-icon" />
                    喜欢
                </button>
                </span>
            </div>
            </article>
            <div v-if="followingPosts.length === 0" class="empty-tip">
              <p>你还没有关注任何人，快去发现有趣的内容吧！</p>
              <button @click="activeTab = 'recommend'">查看推荐内容</button>
            </div>
          </div>
  
          <!-- 推荐内容 -->
          <div v-if="activeTab === 'recommend'" class="tab-content">
            <h2 class="tab-title">为你推荐</h2>
            <article v-for="post in recommendedPosts" :key="post.id" class="post-card">
              <div class="post-header">
                <h3>{{ post.title }}</h3>
                <span class="author">作者: {{ post.author }}</span>
              </div>
              <div class="post-content">
                <p>{{ post.content }}</p>
                <button class="read-more">阅读全文</button>
              </div>
              <div class="post-footer">
                <span class="likes">
                <ThumbsUp class="action-icon" />
                赞同 {{ post.likes }}
                </span>
                <span class="comments">
                <MessageSquare class="action-icon" />
                {{ post.comments }}条评论
                </span>
                <span class="actions">
                <button>
                    <Share2 class="action-icon" />
                    分享
                </button>
                <button>
                    <Bookmark class="action-icon" />
                    收藏
                </button>
                <button>
                    <Heart class="action-icon" />
                    喜欢
                </button>
                </span>
            </div>
            </article>
          </div>
  
          <!-- 热榜内容 -->
          <div v-if="activeTab === 'hot'" class="tab-content">
            <h2 class="tab-title">今日热榜</h2>
            <div class="hot-list">
              <div v-for="(post, index) in hotPosts" :key="post.id" class="hot-item">
                <span class="hot-rank" :class="{ top3: index < 3 }">{{ index + 1 }}</span>
                <div class="hot-content">
                  <h3>{{ post.title }}</h3>
                  <p>{{ post.hotValue }} 热度 · {{ post.comments }}条评论</p>
                </div>
              </div>
            </div>
          </div>
        </main>
  
        <!-- 右侧边栏 -->
        <aside class="sidebar">
          <!-- 快速发布框 -->
          <div class="quick-post">
            <h3>开启你的技术分享</h3>
            <textarea placeholder="写下你的问题或想法..."></textarea>
            <div class="post-actions">
            <button @click="startQuestion">
                <HelpCircle class="action-icon" />
                提问
            </button>
            <button @click="startArticle">
                <FileText class="action-icon" />
                写文章
            </button>
            <button @click="startIdea">
                <PenLine class="action-icon" />
                写想法
            </button>
            </div>
          </div>
  
          <!-- 推荐关注 -->
          <div class="recommendations">
            <h3>推荐关注</h3>
            <div v-for="user in recommendedUsers" :key="user.id" class="recommended-user">
              <span>{{ user.name }}</span>
              <span class="user-title">{{ user.title }}</span>
              <button class="follow-btn" @click="followUser(user.id)">+ 关注</button>
            </div>
          </div>
  
          <!-- 推荐话题 -->
          <div v-if="activeTab !== 'hot'" class="recommended-topics">
            <h3>推荐话题</h3>
            <div v-for="topic in recommendedTopics" :key="topic.id" class="topic">
              <span>{{ topic.name }}</span>
              <span class="followers">{{ topic.followers }}人关注</span>
            </div>
          </div>
  
          <!-- 热榜相关话题 -->
          <div v-if="activeTab === 'hot'" class="hot-topics">
            <h3>热榜相关话题</h3>
            <div v-for="topic in hotTopics" :key="topic.id" class="topic">
              <span>{{ topic.name }}</span>
              <span class="hot-value">{{ topic.hotValue }} 热度</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { 
  ThumbsUp, MessageSquare, Share2, Bookmark, Heart,
  HelpCircle, FileText, PenLine, Plus,
  Bell, Star, Flame, BookOpen 
} from 'lucide-vue-next';
  // 导航标签
  const tabs = ref([
  { id: 'following', name: '关注', icon: Bell },
  { id: 'recommend', name: '推荐', icon: Star },
  { id: 'hot', name: '热榜', icon: Flame }
]);
  
  // 当前激活的标签
  const activeTab = ref('recommend');
  
  // 切换标签
  const switchTab = (tabId) => {
    activeTab.value = tabId;
    // 可以在这里添加获取对应标签数据的逻辑
  };
  
  // 关注的内容
  const followingPosts = ref([
    // 初始为空，表示用户还未关注任何人
  ]);
  
  // 推荐内容
  const recommendedPosts = ref([
  {
    id: 1,
    title: '如何实现高效的二叉树遍历？',
    author: '数据结构大师',
    content: '二叉树遍历是数据结构中的基础内容，要实现高效遍历需要注意以下几点：1. 递归实现简洁但可能有栈溢出风险 2. 迭代实现需要使用栈结构 3. 层次遍历需要借助队列...',
    likes: 128,
    comments: 8,
    tags: ['tree', 'algorithm'],
    avatar: 'binary-tree'
  },
  {
    id: 2,
    title: '图的最短路径算法比较',
    author: '算法爱好者',
    content: 'Dijkstra算法和Floyd算法都是解决最短路径问题的经典算法，但各有适用场景...',
    likes: 89,
    comments: 12,
    tags: ['graph', 'algorithm'],
    avatar: 'graph'
  },
  {
    id: 3,
    title: '哈希表的冲突解决策略对比',
    author: '编程老手',
    content: '链地址法和开放地址法是解决哈希冲突的两种主要方法，本文详细比较它们的优缺点和适用场景...',
    likes: 76,
    comments: 5,
    tags: ['hash', 'algorithm'],
    avatar: 'hash'
  },
  {
    id: 4,
    title: 'AVL树与红黑树的性能分析',
    author: '树结构专家',
    content: '两者都是自平衡二叉搜索树，但红黑树在实际应用中往往表现更好，因为它的平衡条件不那么严格...',
    likes: 102,
    comments: 15,
    tags: ['tree', 'algorithm'],
    avatar: 'balanced-tree'
  },
  {
    id: 5,
    title: '堆排序与优先队列实现',
    author: '算法工程师',
    content: '堆数据结构不仅可以高效实现堆排序，还是优先队列的理想实现方式，本文详解其原理和应用...',
    likes: 94,
    comments: 7,
    tags: ['heap', 'algorithm'],
    avatar: 'heap'
  }
]);
  
  // 热榜内容
  const hotPosts = ref([
    {
      id: 101,
      title: 'Vue3组合式API的最佳实践',
      hotValue: 125000,
      comments: 342
    },
    {
      id: 102,
      title: 'React 18新特性详解',
      hotValue: 98700,
      comments: 256
    },
    {
      id: 103,
      title: 'TypeScript 5.0发布',
      hotValue: 87650,
      comments: 198
    },
    {
      id: 104,
      title: '前端性能优化全攻略',
      hotValue: 76540,
      comments: 176
    },
    {
      id: 105,
      title: 'Web3.0开发入门',
      hotValue: 65430,
      comments: 154
    }
  ]);
  
  // 推荐用户
  const recommendedUsers = ref([
    { id: 1, name: '算法之美', title: '算法领域答主', isFollowed: false },
    { id: 2, name: '数据结构达人', title: '数据结构专家', isFollowed: false },
    { id: 3, name: '编程思考', title: '计算机科学博士', isFollowed: false }
  ]);
  
  // 推荐话题
  const recommendedTopics = ref([
    { id: 1, name: '动态规划', followers: 12500 },
    { id: 2, name: 'B树与B+树', followers: 8700 },
    { id: 3, name: '内存管理', followers: 15300 }
  ]);
  
  // 热榜相关话题
  const hotTopics = ref([
    { id: 1, name: '前端框架', hotValue: 98700 },
    { id: 2, name: 'JavaScript', hotValue: 87650 },
    { id: 3, name: 'Web开发', hotValue: 76540 }
  ]);
  
  // 关注用户
  const followUser = (userId) => {
    const user = recommendedUsers.value.find(u => u.id === userId);
    if (user) {
      user.isFollowed = true;
      // 模拟添加关注后，关注页面会出现内容
      if (followingPosts.value.length === 0) {
        followingPosts.value.push({
          id: 1001,
          title: `${user.name}的最新动态`,
          author: user.name,
          content: '这是你关注用户的最新动态内容...',
          likes: 42,
          comments: 3
        });
      }
    }
  };
  
  // 发布相关方法
  const startQuestion = () => {
    console.log('开始提问');
  };
  
  const startArticle = () => {
    console.log('开始写文章');
  };
  
  const startIdea = () => {
    console.log('开始写想法');
  };
  
  // 模拟初始化加载数据
  onMounted(() => {
    // 可以在这里添加初始化数据加载的逻辑
  });
  </script>
  
  <style scoped>
  /* 导航栏图标样式 */
.nav-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.nav-icon {
  width: 18px;
  height: 18px;
}

/* 操作按钮图标样式 */
.action-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  vertical-align: middle;
}

.post-footer span,
.post-footer button {
  display: inline-flex;
  align-items: center;
}

/* 关注按钮图标 */
.follow-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.follow-icon {
  width: 14px;
  height: 14px;
}

/* 快速发布按钮 */
.post-actions button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.forum-container {
    max-width: 1200px;
    margin: -50px auto auto; /* 上边距-50px，左右自动，下边距自动 */
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
  
  .main-nav ul {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0 0 20px 0;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .main-nav li {
    padding: 10px 20px;
    cursor: pointer;
    color: #8590a6;
    font-size: 16px;
    font-weight: 500;
  }
  
  .main-nav li.active {
    color: #121212;
    border-bottom: 2px solid #0084ff;
  }
  
  .content-wrapper {
    display: flex;
    gap: 20px;
  }
  
  .main-content {
    flex: 1;
  }
  
  .sidebar {
    width: 300px;
  }
  
  .tab-title {
    font-size: 20px;
    margin-bottom: 20px;
    color: #121212;
  }
  
  .post-card {
    padding: 20px;
    margin-bottom: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .post-header {
    margin-bottom: 10px;
  }
  
  .post-header h3 {
    margin: 0;
    font-size: 18px;
    color: #121212;
  }
  
  .author {
    font-size: 14px;
    color: #8590a6;
  }
  
  .post-content {
    margin-bottom: 15px;
    color: #121212;
    line-height: 1.6;
  }
  
  .read-more {
    color: #0084ff;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-size: 14px;
  }
  
  .post-footer {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #8590a6;
  }
  
  .post-footer span {
    margin-right: 15px;
  }
  
  .post-footer .actions button {
    margin-left: 10px;
    color: #8590a6;
    background: none;
    border: none;
    cursor: pointer;
  }
  
  /* 热榜样式 */
  .hot-list {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .hot-item {
    display: flex;
    padding: 15px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .hot-item:last-child {
    border-bottom: none;
  }
  
  .hot-rank {
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    margin-right: 15px;
    color: #8590a6;
    font-size: 14px;
  }
  
  .hot-rank.top3 {
    color: #ff6b6b;
    font-weight: bold;
  }
  
  .hot-content {
    flex: 1;
  }
  
  .hot-content h3 {
    margin: 0 0 5px 0;
    font-size: 16px;
    color: #121212;
  }
  
  .hot-content p {
    margin: 0;
    font-size: 14px;
    color: #8590a6;
  }
  
  /* 空状态提示 */
  .empty-tip {
    text-align: center;
    padding: 40px 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .empty-tip p {
    color: #8590a6;
    margin-bottom: 15px;
  }
  
  .empty-tip button {
    background: #0084ff;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
  }
  
  /* 右侧边栏样式 */
  .quick-post {
    background: #fff;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }
  
  .quick-post h3 {
    margin-top: 0;
    font-size: 16px;
  }
  
  .quick-post textarea {
    width: 91%;
    height: 80px;
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #ebebeb;
    border-radius: 8px;
    resize: none;
  }
  
  .post-actions {
    display: flex;
    gap: 10px;
  }
  
  .post-actions button {
    flex: 1;
    padding: 8px;
    border: none;
    border-radius: 8px;
    background: #0084ff;
    color: white;
    cursor: pointer;
  }
  
  .recommendations, .recommended-topics, .hot-topics {
    background: #fff;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }
  
  .recommendations h3, .recommended-topics h3, .hot-topics h3 {
    margin-top: 0;
    font-size: 16px;
  }
  
  .recommended-user, .topic {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .recommended-user:last-child, .topic:last-child {
    border-bottom: none;
  }
  
  .user-title, .followers, .hot-value {
    font-size: 12px;
    color: #8590a6;
  }
  
  .follow-btn {
    background: #f6f6f6;
    border: none;
    border-radius: 8px;
    padding: 4px 10px;
    cursor: pointer;
    color: #0084ff;
  }
  
  .follow-btn:disabled {
    color: #8590a6;
    cursor: not-allowed;
  }
  </style>