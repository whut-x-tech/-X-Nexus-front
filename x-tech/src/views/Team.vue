<template>
    <div class="team-dashboard">
      <!-- 左侧导航 -->
      <div class="left-sidebar">
        <!-- 导师/学长学姐部分 -->
        <div class="mentor-section">
          <div class="section-header">
            <h3><IconUsers class="icon" /> 导师/学长学姐</h3>
            <button v-if="!mentor" @click="showMentorModal = true" class="add-button">
              <IconUserPlus class="icon" /> 添加
            </button>
          </div>
          
          <div v-if="mentor" class="mentor-card" @click="viewMentorDetails">
            <div class="mentor-avatar">
              <img :src="mentor.avatar || defaultAvatar" alt="导师头像">
              <div class="notification-badge" v-if="mentor.unreadMessages">
                <IconBell class="icon" />
              </div>
            </div>
            <div class="mentor-info">
              <h4>{{ mentor.name }}</h4>
              <div class="mentor-skills">
                <span v-for="skill in mentor.skills" :key="skill" class="skill-tag">{{ skill }}</span>
              </div>
            </div>
          </div>
          
          <div v-else class="empty-state">
            <p>暂无导师/学长学姐</p>
          </div>
        </div>
        
        <!-- 团队成员部分 -->
        <div class="team-members-section">
          <div class="section-header">
            <h3><IconUsers class="icon" /> 团队成员</h3>
          </div>
          
          <div class="members-list">
            <div 
              v-for="member in teamMembers" 
              :key="member.id" 
              class="member-card"
              :class="{ expanded: expandedMembers[member.id] }"
            >
              <div class="member-summary" @click="toggleMemberExpansion(member.id)">
                <img :src="member.avatar || defaultAvatar" alt="成员头像" class="member-avatar">
                <div class="member-name">{{ member.name }}</div>
                <button 
                  class="follow-button" 
                  :class="{ followed: member.isFollowed }"
                  @click.stop="toggleFollowMember(member.id)"
                >
                  <IconHeart class="icon" />
                  {{ member.isFollowed ? '已关注' : '关注' }}
                </button>
              </div>
              
              <div v-if="expandedMembers[member.id]" class="member-details">
                <div class="skills-section">
                  <h4>擅长领域</h4>
                  <div class="skills-list">
                    <span v-for="skill in member.skills" :key="skill" class="skill-tag">{{ skill }}</span>
                  </div>
                </div>
                
                <div class="tags-section">
                  <h4>个性标签</h4>
                  <div class="tags-list">
                    <span v-for="tag in member.tags" :key="tag" class="tag">{{ tag }}</span>
                  </div>
                </div>
                
                <a :href="member.github" target="_blank" class="github-link">
                  <IconGithub class="icon" /> GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 中间内容 -->
      <div class="main-content">
        <div class="team-activities">
          <div class="activities-header">
            <h2>团队动态</h2>
            <div class="activity-filters">
              <button 
                v-for="filter in activityFilters" 
                :key="filter.value"
                :class="{ active: activityFilter === filter.value }"
                @click="setActivityFilter(filter.value)"
              >
                <component :is="filter.icon" class="icon" />
                {{ filter.label }}
              </button>
            </div>
          </div>
          
          <div class="activities-list">
            <div v-for="activity in filteredActivities" :key="activity.id" class="activity-card">
              <div class="activity-icon" :class="activity.type">
                <component :is="getActivityIcon(activity.type)" class="icon" />
              </div>
              <div class="activity-content">
                <h3>{{ activity.title }}</h3>
                <p>{{ activity.content }}</p>
                <div class="activity-meta">
                  <span class="date">{{ activity.date }}</span>
                  <span class="author">{{ activity.author }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧边栏 -->
      <div class="right-sidebar">
        <!-- 日历组件 -->
        <div class="calendar-widget">
          <div class="calendar-header">
            <h3><IconCalendar class="icon" /> 日历</h3>
            <div class="calendar-nav">
              <button @click="prevMonth">&lt;</button>
              <span>{{ currentMonth }} {{ currentYear }}</span>
              <button @click="nextMonth">&gt;</button>
            </div>
          </div>
          
          <div class="calendar-grid">
            <div class="day-header" v-for="day in dayNames" :key="day">{{ day }}</div>
            <div 
              v-for="day in calendarDays" 
              :key="day.date"
              class="calendar-day"
              :class="{ 
                'current-month': day.isCurrentMonth,
                'today': day.isToday,
                'has-events': day.hasEvents
              }"
              @click="handleDayClick(day)"
            >
              <span class="day-number">{{ day.dayNumber }}</span>
              <div class="event-dots">
                <span 
                  v-for="event in day.events" 
                  :key="event.type"
                  class="event-dot"
                  :class="event.type"
                ></span>
              </div>
            </div>
          </div>
          
          <div class="event-legend">
            <div v-for="type in eventTypes" :key="type.value" class="legend-item">
              <span class="legend-dot" :class="type.value"></span>
              <span>{{ type.label }}</span>
            </div>
          </div>
        </div>
        
        <!-- 待办事项 -->
        <div class="todo-widget">
          <div class="todo-header">
            <h3><IconClipboard class="icon" /> 待办事项</h3>
            <button @click="addNewTodo" class="add-todo-button">
              <IconPlus class="icon" />
            </button>
          </div>
          
          <div class="todo-input" v-if="showTodoInput">
            <input 
              type="text" 
              v-model="newTodoText" 
              placeholder="输入待办事项..."
              @keyup.enter="addTodo"
            >
            <button @click="addTodo" class="confirm-button">添加</button>
          </div>
          
          <div class="todo-list">
            <div v-for="todo in todos" :key="todo.id" class="todo-item">
              <label class="todo-checkbox">
                <input 
                  type="checkbox" 
                  v-model="todo.completed"
                  @change="toggleTodoCompletion(todo.id)"
                >
                <span class="checkmark"></span>
              </label>
              <span class="todo-text" :class="{ completed: todo.completed }">{{ todo.text }}</span>
              <button @click="deleteTodo(todo.id)" class="delete-button">
                <IconX class="icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 导师弹窗 -->
      <div class="modal-overlay" v-if="showMentorModal">
        <div class="mentor-modal">
          <div class="modal-header">
            <h3>选择导师/学长学姐</h3>
            <button @click="showMentorModal = false" class="close-button">
              <IconX class="icon" />
            </button>
          </div>
          
          <div class="modal-content">
            <div class="search-filter">
              <input type="text" placeholder="搜索导师..." v-model="mentorSearchQuery">
              <select v-model="mentorFilterField">
                <option value="all">全部领域</option>
                <option value="computer">计算机</option>
                <option value="design">设计</option>
                <option value="business">商科</option>
              </select>
            </div>
            
            <div class="mentors-list">
              <div 
                v-for="mentor in filteredAvailableMentors" 
                :key="mentor.id" 
                class="mentor-item"
                @click="selectMentor(mentor)"
              >
                <img :src="mentor.avatar || defaultAvatar" alt="导师头像" class="mentor-avatar">
                <div class="mentor-details">
                  <h4>{{ mentor.name }}</h4>
                  <div class="mentor-field">{{ mentor.department }}</div>
                  <div class="mentor-skills">
                    <span v-for="skill in mentor.skills" :key="skill">{{ skill }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
import { 
  UserPlus as IconUserPlus,
  Bell as IconBell,
  Github as IconGithub,
  Heart as IconHeart,
  Users as IconUsers,
  Calendar as IconCalendar,
  Check as IconCheck,
  Plus as IconPlus,
  Filter as IconFilter,
  MessageCircle as IconMessageCircle,
  Award as IconAward,
  Briefcase as IconBriefcase,
  Clipboard as IconClipboard,
  X as IconX
} from 'lucide-vue-next'
  import { ref, computed, onMounted } from 'vue'
  
  // 数据状态
  const mentor = ref(null)
  const teamMembers = ref([])
  const activities = ref([])
  const activityFilter = ref('all')
  const calendarEvents = ref([])
  const todos = ref([])
  const showMentorModal = ref(false)
  const availableMentors = ref([])
  const expandedMembers = ref({})
  const currentDate = ref(new Date())
  const showTodoInput = ref(false)
  const newTodoText = ref('')
  const mentorSearchQuery = ref('')
  const mentorFilterField = ref('all')
  
  // 常量
  const dayNames = ['日', '一', '二', '三', '四', '五', '六']
  const defaultAvatar = 'https://via.placeholder.com/80'
  
  const activityFilters = [
    { value: 'all', label: '全部', icon: IconFilter },
    { value: 'competition', label: '比赛', icon: IconAward },
    { value: 'meeting', label: '会议', icon: IconUsers },
    { value: 'job', label: '求职', icon: IconBriefcase },
    { value: 'project', label: '项目', icon: IconClipboard },
    { value: 'discussion', label: '讨论', icon: IconMessageCircle }
  ]
  
  const eventTypes = [
    { value: 'meeting', label: '会议' },
    { value: 'competition', label: '比赛' },
    { value: 'deadline', label: '截止日期' },
    { value: 'activity', label: '活动' }
  ]
  
  // 计算属性
  const filteredActivities = computed(() => {
    if (activityFilter.value === 'all') return activities.value
    return activities.value.filter(act => act.type === activityFilter.value)
  })
  
  const currentYear = computed(() => currentDate.value.getFullYear())
  const currentMonth = computed(() => currentDate.value.toLocaleString('zh-CN', { month: 'long' }))
  
  const calendarDays = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    const today = new Date()
    
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    
    const daysInMonth = lastDayOfMonth.getDate()
    const startingDayOfWeek = firstDayOfMonth.getDay()
    
    const prevMonthDays = startingDayOfWeek
    const totalDays = Math.ceil((daysInMonth + prevMonthDays) / 7) * 7
    
    const days = []
    
    // 上个月的最后几天
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i
      days.push({
        date: `${year}-${month}-${day}`,
        dayNumber: day,
        isCurrentMonth: false,
        isToday: false,
        hasEvents: false,
        events: []
      })
    }
    
    // 当前月的日期
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${month + 1}-${day}`
      const dateObj = new Date(year, month, day)
      const isToday = dateObj.getDate() === today.getDate() && 
                     dateObj.getMonth() === today.getMonth() && 
                     dateObj.getFullYear() === today.getFullYear()
      
      const dayEvents = calendarEvents.value.filter(event => {
        const eventDate = new Date(event.date)
        return eventDate.getDate() === day && 
               eventDate.getMonth() === month && 
               eventDate.getFullYear() === year
      }).map(event => ({ type: event.type }))
      
      days.push({
        date: dateStr,
        dayNumber: day,
        isCurrentMonth: true,
        isToday: isToday,
        hasEvents: dayEvents.length > 0,
        events: dayEvents
      })
    }
    
    // 下个月的前几天
    const daysToAdd = totalDays - days.length
    for (let day = 1; day <= daysToAdd; day++) {
      days.push({
        date: `${year}-${month + 2}-${day}`,
        dayNumber: day,
        isCurrentMonth: false,
        isToday: false,
        hasEvents: false,
        events: []
      })
    }
    
    return days
  })
  
  const filteredAvailableMentors = computed(() => {
    return availableMentors.value.filter(mentor => {
      const matchesSearch = mentor.name.toLowerCase().includes(mentorSearchQuery.value.toLowerCase()) || 
                           mentor.skills.some(skill => skill.toLowerCase().includes(mentorSearchQuery.value.toLowerCase()))
      const matchesField = mentorFilterField.value === 'all' || 
                          mentor.department.toLowerCase().includes(mentorFilterField.value)
      return matchesSearch && matchesField
    })
  })
  
  // 方法
  const fetchData = async () => {
    // 模拟API调用
    teamMembers.value = [
      { 
        id: 1, 
        name: '张三', 
        avatar: '', 
        skills: ['Vue', 'UI设计', '前端开发'], 
        tags: ['创意', '细心', '沟通能力强'], 
        github: 'https://github.com/user1', 
        isFollowed: false 
      },
      { 
        id: 2, 
        name: '李四', 
        avatar: '', 
        skills: ['后端开发', '数据库', '系统架构'], 
        tags: ['逻辑思维强', '高效', '责任心强'], 
        github: 'https://github.com/user2', 
        isFollowed: true 
      },
      { 
        id: 3, 
        name: '王五', 
        avatar: '', 
        skills: ['产品设计', '用户体验', '市场分析'], 
        tags: ['创新', '敏锐', '团队协作'], 
        github: 'https://github.com/user3', 
        isFollowed: false 
      }
    ]
    
    activities.value = [
      { 
        id: 1, 
        type: 'competition', 
        title: '全国大学生程序设计竞赛', 
        content: '报名截止日期为5月15日，请有意向参加的同学尽快组队报名', 
        date: '2023-05-10', 
        author: '王老师' 
      },
      { 
        id: 2, 
        type: 'meeting', 
        title: '项目进度会议', 
        content: '本周五下午2点在实验室讨论前端界面设计和后端API对接问题', 
        date: '2023-05-12', 
        author: '李四' 
      },
      { 
        id: 3, 
        type: 'job', 
        title: '暑期实习机会', 
        content: '腾讯前端开发实习生岗位内推，有意向的同学请私聊我获取内推码', 
        date: '2023-05-08', 
        author: '张学姐' 
      },
      { 
        id: 4, 
        type: 'project', 
        title: '新项目启动', 
        content: '基于AI的校园社交平台项目即将启动，招募前端、后端和产品设计同学', 
        date: '2023-05-05', 
        author: '王老师' 
      }
    ]
    
    calendarEvents.value = [
      { date: '2023-05-12', type: 'meeting', title: '项目会议' },
      { date: '2023-05-15', type: 'deadline', title: '竞赛报名截止' },
      { date: '2023-05-20', type: 'competition', title: '设计比赛提交' },
      { date: '2023-05-25', type: 'activity', title: '团队建设活动' }
    ]
    
    todos.value = [
      { id: 1, text: '完成项目提案文档', completed: false },
      { id: 2, text: '回复导师邮件', completed: true },
      { id: 3, text: '准备周五会议材料', completed: false },
      { id: 4, text: '学习Vue3新特性', completed: false }
    ]
    
    availableMentors.value = [
      { 
        id: 1, 
        name: '王学长', 
        avatar: '', 
        skills: ['机器学习', 'Python', '数据分析'], 
        department: '计算机科学', 
        bio: '专注AI领域研究，有多篇顶会论文' 
      },
      { 
        id: 2, 
        name: '李学姐', 
        avatar: '', 
        skills: ['产品设计', '用户体验', '交互设计'], 
        department: '设计学院', 
        bio: '现任某大厂高级产品经理，擅长从0到1产品设计' 
      },
      { 
        id: 3, 
        name: '张学长', 
        avatar: '', 
        skills: ['后端架构', '分布式系统', '云计算'], 
        department: '计算机科学', 
        bio: '技术负责人，有丰富的大型系统架构经验' 
      }
    ]
  }
  
  const toggleMemberExpansion = (memberId) => {
    expandedMembers.value[memberId] = !expandedMembers.value[memberId]
  }
  
  const toggleFollowMember = (memberId) => {
    const member = teamMembers.value.find(m => m.id === memberId)
    if (member) member.isFollowed = !member.isFollowed
  }
  
  const setActivityFilter = (filter) => {
    activityFilter.value = filter
  }
  
  const getActivityIcon = (type) => {
    const icons = {
      competition: IconAward,
      meeting: IconUsers,
      job: IconBriefcase,
      project: IconClipboard,
      discussion: IconMessageCircle
    }
    return icons[type] || IconMessageCircle
  }
  
  const prevMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  }
  
  const nextMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  }
  
  const handleDayClick = (day) => {
    if (day.hasEvents) {
      // 可以在这里显示当天的事件详情
      console.log('Day clicked:', day)
    }
  }
  
  const selectMentor = (selectedMentor) => {
    mentor.value = selectedMentor
    showMentorModal.value = false
  }
  
  const viewMentorDetails = () => {
    // 查看导师详情逻辑
    console.log('View mentor details:', mentor.value)
  }
  
  const addNewTodo = () => {
    showTodoInput.value = true
  }
  
  const addTodo = () => {
    if (newTodoText.value.trim()) {
      todos.value.push({
        id: Date.now(),
        text: newTodoText.value.trim(),
        completed: false
      })
      newTodoText.value = ''
      showTodoInput.value = false
    }
  }
  
  const toggleTodoCompletion = (todoId) => {
    const todo = todos.value.find(t => t.id === todoId)
    if (todo) todo.completed = !todo.completed
  }
  
  const deleteTodo = (todoId) => {
    todos.value = todos.value.filter(t => t.id !== todoId)
  }
  
  // 初始化
  onMounted(() => {
    fetchData()
  })
  </script>
  
  <style scoped>
  .team-dashboard {
    display: grid;
    grid-template-columns: 300px 1fr 300px;
    height: 100vh;
    gap: 20px;
    padding: 20px;
    background-color: #f5f7fa;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  }
  
  .left-sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .main-content {
    background: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    overflow-y: auto;
  }
  
  .right-sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  /* 导师部分样式 */
  .mentor-section {
    background: white;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .section-header h3 {
    margin: 0;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .add-button {
    display: flex;
    align-items: center;
    gap: 5px;
    background: #4f46e5;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s;
  }
  
  .add-button:hover {
    background: #4338ca;
  }
  
  .mentor-card {
    display: flex;
    gap: 15px;
    align-items: center;
    cursor: pointer;
    padding: 10px;
    border-radius: 8px;
    transition: background 0.2s;
  }
  
  .mentor-card:hover {
    background: #f8f9fa;
  }
  
  .mentor-avatar {
    position: relative;
    width: 50px;
    height: 50px;
  }
  
  .mentor-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .notification-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ef4444;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }
  
  .mentor-info {
    flex-grow: 1;
  }
  
  .mentor-info h4 {
    margin: 0;
    font-size: 15px;
  }
  
  .mentor-skills {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
    margin-top: 5px;
  }
  
  .skill-tag {
    background: #e0e7ff;
    color: #4f46e5;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 12px;
  }
  
  .empty-state {
    text-align: center;
    padding: 20px;
    color: #64748b;
    font-size: 14px;
  }
  
  /* 团队成员部分样式 */
  .team-members-section {
    background: white;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    flex-grow: 1;
    overflow-y: auto;
  }
  
  .members-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .member-card {
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid #e2e8f0;
  }
  
  .member-card.expanded {
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
  
  .member-summary {
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    background: #f8fafc;
  }
  
  .member-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 10px;
  }
  
  .member-name {
    flex-grow: 1;
    font-weight: 500;
    font-size: 14px;
  }
  
  .follow-button {
    display: flex;
    align-items: center;
    gap: 5px;
    background: #e2e8f0;
    border: none;
    padding: 5px 10px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.2s;
  }
  
  .follow-button:hover {
    background: #cbd5e1;
  }
  
  .follow-button.followed {
    background: #fee2e2;
    color: #dc2626;
  }
  
  .follow-button.followed:hover {
    background: #fecaca;
  }
  
  .member-details {
    padding: 15px;
    background: white;
  }
  
  .skills-section, .tags-section {
    margin-bottom: 15px;
  }
  
  .skills-section h4, .tags-section h4 {
    margin-bottom: 8px;
    font-size: 14px;
    color: #64748b;
  }
  
  .skills-list, .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .skill-tag {
    background: #e0e7ff;
    color: #4f46e5;
    padding: 4px 10px;
    border-radius: 10px;
    font-size: 12px;
  }
  
  .tag {
    background: #ecfdf5;
    color: #059669;
    padding: 4px 10px;
    border-radius: 10px;
    font-size: 12px;
  }
  
  .github-link {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: #3b82f6;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.2s;
  }
  
  .github-link:hover {
    color: #2563eb;
  }
  
  /* 团队动态样式 */
  .team-activities {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .activities-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .activities-header h2 {
    margin: 0;
    font-size: 18px;
    color: #1e293b;
  }
  
  .activity-filters {
    display: flex;
    gap: 10px;
  }
  
  .activity-filters button {
    display: flex;
    align-items: center;
    gap: 5px;
    background: #f1f5f9;
    border: none;
    padding: 5px 12px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
  }
  
  .activity-filters button:hover {
    background: #e2e8f0;
  }
  
  .activity-filters button.active {
    background: #4f46e5;
    color: white;
  }
  
  .activity-filters button.active:hover {
    background: #4338ca;
  }
  
  .activities-list {
    flex-grow: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding-right: 5px;
  }
  
  .activity-card {
    display: flex;
    gap: 15px;
    padding: 15px;
    border-radius: 8px;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .activity-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
  
  .activity-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .activity-icon.competition {
    background: #fef3c7;
    color: #d97706;
  }
  
  .activity-icon.meeting {
    background: #dbeafe;
    color: #2563eb;
  }
  
  .activity-icon.job {
    background: #ecfccb;
    color: #65a30d;
  }
  
  .activity-icon.project {
    background: #e9d5ff;
    color: #7e22ce;
  }
  
  .activity-icon.discussion {
    background: #fce7f3;
    color: #db2777;
  }
  
  .activity-content {
    flex-grow: 1;
  }
  
  .activity-content h3 {
    margin: 0 0 5px 0;
    font-size: 16px;
    color: #1e293b;
  }
  
  .activity-content p {
    margin: 0 0 10px 0;
    color: #64748b;
    font-size: 14px;
    line-height: 1.5;
  }
  
  .activity-meta {
    display: flex;
    gap: 15px;
    font-size: 12px;
    color: #94a3b8;
  }
  
  .activity-meta .date {
    font-weight: 500;
  }
  
  /* 日历组件样式 */
  .calendar-widget {
    background: white;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  }
  
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .calendar-header h3 {
    margin: 0;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .calendar-nav {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .calendar-nav button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    color: #4f46e5;
    padding: 2px 5px;
    border-radius: 4px;
  }
  
  .calendar-nav button:hover {
    background: #e0e7ff;
  }
  
  .calendar-nav span {
    font-size: 14px;
    font-weight: 500;
  }
  
  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
    margin-bottom: 15px;
  }
  
  .day-header {
    text-align: center;
    font-size: 12px;
    color: #64748b;
    padding: 5px 0;
    font-weight: 500;
  }
  
  .calendar-day {
    aspect-ratio: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .calendar-day:hover {
    background: #f1f5f9;
  }
  
  .calendar-day.current-month {
    background: white;
  }
  
  .calendar-day:not(.current-month) {
    color: #94a3b8;
  }
  
  .calendar-day.today {
    background: #e0e7ff;
    color: #4f46e5;
    font-weight: bold;
  }
  
  .day-number {
    font-size: 12px;
    align-self: flex-start;
  }
  
  .event-dots {
    display: flex;
    gap: 3px;
    justify-content: center;
    width: 100%;
  }
  
  .event-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
  
  .event-dot.meeting {
    background: #2563eb;
  }
  
  .event-dot.competition {
    background: #d97706;
  }
  
  .event-dot.deadline {
    background: #dc2626;
  }
  
  .event-dot.activity {
    background: #059669;
  }
  
  .event-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    font-size: 12px;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .legend-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  
  .legend-dot.meeting {
    background: #2563eb;
  }
  
  .legend-dot.competition {
    background: #d97706;
  }
  
  .legend-dot.deadline {
    background: #dc2626;
  }
  
  .legend-dot.activity {
    background: #059669;
  }
  
  /* 待办事项样式 */
  .todo-widget {
    background: white;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  }
  
  .todo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .todo-header h3 {
    margin: 0;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .add-todo-button {
    background: #4f46e5;
    color: white;
    border: none;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .add-todo-button:hover {
    background: #4338ca;
  }
  
  .todo-input {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
  }
  
  .todo-input input {
    flex-grow: 1;
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 14px;
  }
  
  .todo-input input:focus {
    outline: none;
    border-color: #4f46e5;
  }
  
  .confirm-button {
    background: #4f46e5;
    color: white;
    border: none;
    padding: 0 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .confirm-button:hover {
    background: #4338ca;
  }
  
  .todo-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .todo-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
  }
  
  .todo-checkbox {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  .todo-checkbox input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }
  
  .checkmark {
    width: 18px;
    height: 18px;
    border: 2px solid #cbd5e1;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  
  .todo-checkbox input:checked ~ .checkmark {
    background: #4f46e5;
    border-color: #4f46e5;
  }
  
  .todo-checkbox input:checked ~ .checkmark::after {
    content: "✓";
    color: white;
    font-size: 12px;
  }
  
  .todo-text {
    flex-grow: 1;
    font-size: 14px;
  }
  
  .todo-text.completed {
    text-decoration: line-through;
    color: #94a3b8;
  }
  
  .delete-button {
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    opacity: 0;
    transition: all 0.2s;
  }
  
  .todo-item:hover .delete-button {
    opacity: 1;
  }
  
  .delete-button:hover {
    color: #ef4444;
  }
  
  /* 导师弹窗样式 */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .mentor-modal {
    background: white;
    border-radius: 10px;
    width: 600px;
    max-width: 90%;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .modal-header h3 {
    margin: 0;
    font-size: 18px;
  }
  
  .close-button {
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 5px;
    border-radius: 4px;
  }
  
  .close-button:hover {
    background: #f1f5f9;
  }
  
  .modal-content {
    flex-grow: 1;
    overflow-y: auto;
    padding: 20px;
  }
  
  .search-filter {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .search-filter input {
    flex-grow: 1;
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 14px;
  }
  
  .search-filter input:focus {
    outline: none;
    border-color: #4f46e5;
  }
  
  .search-filter select {
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 14px;
    background: white;
    cursor: pointer;
  }
  
  .search-filter select:focus {
    outline: none;
    border-color: #4f46e5;
  }
  
  .mentors-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .mentor-item {
    display: flex;
    gap: 15px;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .mentor-item:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
  
  .mentor-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }
  
  .mentor-details {
    flex-grow: 1;
  }
  
  .mentor-details h4 {
    margin: 0 0 5px 0;
    font-size: 16px;
    color: #1e293b;
  }
  
  .mentor-field {
    font-size: 14px;
    color: #64748b;
    margin-bottom: 8px;
  }
  
  .mentor-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .mentor-skills span {
    background: #e0e7ff;
    color: #4f46e5;
    padding: 4px 10px;
    border-radius: 10px;
    font-size: 12px;
  }
  
  /* 响应式设计 */
  @media (max-width: 1200px) {
    .team-dashboard {
      grid-template-columns: 250px 1fr 250px;
    }
  }
  
  @media (max-width: 992px) {
    .team-dashboard {
      grid-template-columns: 1fr;
      height: auto;
    }
    
    .left-sidebar, .right-sidebar {
      order: 1;
    }
    
    .main-content {
      order: 0;
    }
  }
  
  /* 图标样式 */
  .icon {
    width: 16px;
    height: 16px;
  }
  </style>