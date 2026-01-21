<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hegir Forum - Сообщество пользователей</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --bg-dark: #0D0D0D;
            --text-white: #FFFFFF;
            --text-light: #E5E5E5;
            --accent-primary: #0066FF;
            --accent-secondary: #00AAFF;
            --card-bg: #1A1A1A;
            --success: #00CC88;
            --warning: #FF9500;
            --error: #FF4444;
            --moderator: #2ECC71;
            --admin: #E74C3C;
            --transition: all 0.3s ease;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-dark);
            color: var(--text-light);
            line-height: 1.6;
        }
        
        /* Header */
        header {
            position: fixed;
            top: 0;
            width: 100%;
            padding: 1rem 5%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: rgba(13, 13, 13, 0.98);
            backdrop-filter: blur(10px);
            z-index: 1000;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .logo {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--text-white);
            text-decoration: none;
            letter-spacing: -1px;
        }
        
        .logo span {
            background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        
        .main-nav {
            display: flex;
            gap: 2rem;
            align-items: center;
        }
        
        .main-nav a {
            color: var(--text-light);
            text-decoration: none;
            font-weight: 500;
            font-size: 0.95rem;
            transition: var(--transition);
            padding: 0.5rem 0;
        }
        
        .main-nav a:hover {
            color: var(--accent-primary);
        }
        
        .main-nav a.active {
            color: var(--accent-primary);
        }
        
        .user-menu {
            display: flex;
            gap: 1rem;
            align-items: center;
        }
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .user-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            color: white;
        }
        
        .user-name {
            font-weight: 500;
        }
        
        .user-role {
            font-size: 0.8rem;
            padding: 0.2rem 0.5rem;
            border-radius: 10px;
            font-weight: 600;
        }
        
        .role-user {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-light);
        }
        
        .role-moderator {
            background: rgba(46, 204, 113, 0.2);
            color: var(--moderator);
        }
        
        .role-admin {
            background: rgba(231, 76, 60, 0.2);
            color: var(--admin);
        }
        
        .notifications {
            position: relative;
        }
        
        .notification-count {
            position: absolute;
            top: -5px;
            right: -5px;
            background: var(--error);
            color: white;
            font-size: 0.7rem;
            padding: 0.1rem 0.4rem;
            border-radius: 10px;
            font-weight: 600;
        }
        
        /* Forum Container */
        .forum-container {
            display: flex;
            padding: 120px 5% 2rem;
            gap: 2rem;
            min-height: 100vh;
        }
        
        /* Forum Sidebar */
        .forum-sidebar {
            width: 300px;
            flex-shrink: 0;
        }
        
        .sidebar-card {
            background: var(--card-bg);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .sidebar-card h3 {
            margin-bottom: 1rem;
            color: var(--text-white);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        /* Quick Stats */
        .quick-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        
        .stat-item {
            text-align: center;
            padding: 0.5rem;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 8px;
        }
        
        .stat-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--accent-primary);
        }
        
        .stat-label {
            font-size: 0.8rem;
            opacity: 0.7;
        }
        
        /* Category List */
        .category-list {
            list-style: none;
        }
        
        .category-item {
            margin-bottom: 0.5rem;
        }
        
        .category-link {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            padding: 0.8rem;
            color: var(--text-light);
            text-decoration: none;
            border-radius: 8px;
            transition: var(--transition);
        }
        
        .category-link:hover {
            background: rgba(255, 255, 255, 0.05);
        }
        
        .category-link.active {
            background: rgba(0, 102, 255, 0.1);
            color: var(--accent-primary);
        }
        
        .category-icon {
            width: 30px;
            height: 30px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
        }
        
        .category-info {
            flex: 1;
        }
        
        .category-name {
            font-weight: 600;
            margin-bottom: 0.2rem;
        }
        
        .category-stats {
            font-size: 0.8rem;
            opacity: 0.7;
        }
        
        /* Forum Main */
        .forum-main {
            flex: 1;
        }
        
        .forum-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        
        .search-box {
            display: flex;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            overflow: hidden;
            width: 300px;
        }
        
        .search-input {
            flex: 1;
            padding: 0.8rem 1rem;
            background: none;
            border: none;
            color: var(--text-white);
            font-family: 'Inter', sans-serif;
            outline: none;
        }
        
        .search-btn {
            padding: 0 1rem;
            background: none;
            border: none;
            color: var(--text-light);
            cursor: pointer;
        }
        
        /* Topics List */
        .topics-container {
            background: var(--card-bg);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            overflow: hidden;
        }
        
        .topics-header {
            padding: 1.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .topic-filters {
            display: flex;
            gap: 0.5rem;
        }
        
        .filter-btn {
            padding: 0.5rem 1rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            color: var(--text-light);
            cursor: pointer;
            transition: var(--transition);
            font-size: 0.9rem;
        }
        
        .filter-btn:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .filter-btn.active {
            background: rgba(0, 102, 255, 0.1);
            border-color: var(--accent-primary);
            color: var(--accent-primary);
        }
        
        /* Topic Item */
        .topic-item {
            padding: 1.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            transition: var(--transition);
        }
        
        .topic-item:hover {
            background: rgba(255, 255, 255, 0.02);
        }
        
        .topic-item:last-child {
            border-bottom: none;
        }
        
        .topic-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
        }
        
        .topic-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: var(--text-white);
            text-decoration: none;
            transition: var(--transition);
        }
        
        .topic-title:hover {
            color: var(--accent-primary);
        }
        
        .topic-badges {
            display: flex;
            gap: 0.5rem;
        }
        
        .topic-badge {
            padding: 0.2rem 0.6rem;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 600;
        }
        
        .badge-pinned {
            background: rgba(255, 149, 0, 0.2);
            color: var(--warning);
        }
        
        .badge-locked {
            background: rgba(255, 68, 68, 0.2);
            color: var(--error);
        }
        
        .badge-new {
            background: rgba(0, 204, 136, 0.2);
            color: var(--success);
        }
        
        .topic-meta {
            display: flex;
            gap: 1rem;
            color: var(--text-light);
            opacity: 0.7;
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }
        
        .topic-author {
            color: var(--accent-primary);
        }
        
        .topic-preview {
            margin-bottom: 1rem;
            opacity: 0.9;
        }
        
        .topic-tags {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
            margin-bottom: 1rem;
        }
        
        .topic-tag {
            padding: 0.2rem 0.6rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            font-size: 0.8rem;
        }
        
        .topic-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .topic-stats {
            display: flex;
            gap: 1rem;
        }
        
        .stat {
            display: flex;
            align-items: center;
            gap: 0.3rem;
            font-size: 0.9rem;
        }
        
        .last-post {
            text-align: right;
            font-size: 0.9rem;
        }
        
        .last-post-author {
            color: var(--accent-primary);
        }
        
        /* Pagination */
        .pagination {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            padding: 1.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .page-btn {
            padding: 0.5rem 1rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: var(--text-light);
            cursor: pointer;
            transition: var(--transition);
        }
        
        .page-btn:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .page-btn.active {
            background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
            color: white;
        }
        
        /* Topic View */
        .topic-view {
            background: var(--card-bg);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .topic-view-header {
            padding: 1.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .topic-view-title {
            font-size: 1.8rem;
            margin-bottom: 1rem;
            color: var(--text-white);
        }
        
        .topic-view-meta {
            display: flex;
            gap: 1rem;
            font-size: 0.9rem;
            opacity: 0.7;
        }
        
        .posts-container {
            padding: 1.5rem;
        }
        
        /* Post Item */
        .post-item {
            display: flex;
            gap: 1.5rem;
            padding: 1.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .post-item:last-child {
            border-bottom: none;
        }
        
        .post-sidebar {
            width: 200px;
            flex-shrink: 0;
        }
        
        .post-author {
            text-align: center;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 8px;
            margin-bottom: 1rem;
        }
        
        .author-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
            margin: 0 auto 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: 600;
            color: white;
        }
        
        .author-name {
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        
        .author-role {
            font-size: 0.8rem;
            padding: 0.2rem 0.5rem;
            border-radius: 10px;
            display: inline-block;
            margin-bottom: 0.5rem;
        }
        
        .author-stats {
            font-size: 0.8rem;
            opacity: 0.7;
        }
        
        .post-content {
            flex: 1;
        }
        
        .post-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .post-date {
            opacity: 0.7;
            font-size: 0.9rem;
        }
        
        .post-actions {
            display: flex;
            gap: 0.5rem;
        }
        
        .action-btn {
            padding: 0.3rem 0.8rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            color: var(--text-light);
            cursor: pointer;
            transition: var(--transition);
            font-size: 0.8rem;
        }
        
        .action-btn:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .post-body {
            margin-bottom: 1rem;
        }
        
        .post-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .post-rating {
            display: flex;
            gap: 1rem;
        }
        
        .rating-btn {
            display: flex;
            align-items: center;
            gap: 0.3rem;
            background: none;
            border: none;
            color: var(--text-light);
            cursor: pointer;
            transition: var(--transition);
        }
        
        .rating-btn:hover {
            color: var(--accent-primary);
        }
        
        .like-btn:hover {
            color: var(--success);
        }
        
        .dislike-btn:hover {
            color: var(--error);
        }
        
        /* Reply Form */
        .reply-form {
            margin-top: 2rem;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 8px;
        }
        
        .reply-header {
            margin-bottom: 1rem;
            font-weight: 600;
        }
        
        .reply-textarea {
            width: 100%;
            min-height: 150px;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: var(--text-white);
            font-family: 'Inter', sans-serif;
            margin-bottom: 1rem;
            resize: vertical;
        }
        
        .reply-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .reply-buttons {
            display: flex;
            gap: 0.5rem;
        }
        
        /* Moderation Panel */
        .moderation-panel {
            background: var(--card-bg);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            margin-top: 2rem;
        }
        
        .moderation-header {
            padding: 1.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            background: rgba(46, 204, 113, 0.1);
        }
        
        .moderation-content {
            padding: 1.5rem;
        }
        
        .reports-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .report-item {
            padding: 1rem;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 8px;
        }
        
        /* Responsive */
        @media (max-width: 1200px) {
            .forum-container {
                flex-direction: column;
            }
            
            .forum-sidebar {
                width: 100%;
            }
        }
        
        @media (max-width: 768px) {
            .main-nav {
                display: none;
            }
            
            .forum-container {
                padding: 100px 1rem 2rem;
            }
            
            .post-item {
                flex-direction: column;
            }
            
            .post-sidebar {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header>
        <a href="index-shop.html" class="logo">HEG<span>IR</span> FORUM</a>
        
        <nav class="main-nav">
            <a href="index-shop.html">Магазин</a>
            <a href="forum.html" class="active">Форум</a>
            <a href="#help">Помощь</a>
            <a href="#guides">Гайды</a>
            <a href="#news">Новости</a>
        </nav>
        
        <div class="user-menu" id="user-menu">
            <!-- Заполняется JavaScript -->
        </div>
    </header>

    <!-- Forum Container -->
    <div class="forum-container">
        <!-- Sidebar -->
        <aside class="forum-sidebar" id="forum-sidebar">
            <!-- Заполняется JavaScript -->
        </aside>

        <!-- Main Content -->
        <main class="forum-main" id="forum-main">
            <!-- Содержимое меняется динамически -->
        </main>
    </div>

    <!-- Модальные окна -->
    <div class="modal" id="login-modal" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Вход на форум</h3>
                <button class="btn btn-secondary close-modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p>Для участия в обсуждениях необходимо войти в аккаунт.</p>
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <a href="login.html" class="btn btn-primary">Войти</a>
                    <a href="register.html" class="btn btn-secondary">Зарегистрироваться</a>
                </div>
            </div>
        </div>
    </div>

    <div class="modal" id="topic-modal" style="display: none;">
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h3>Создать новую тему</h3>
                <button class="btn btn-secondary close-modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="topic-form">
                    <div class="form-group">
                        <label for="topic-title">Заголовок темы</label>
                        <input type="text" id="topic-title" class="form-input" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="topic-category">Категория</label>
                        <select id="topic-category" class="form-select" required>
                            <!-- Заполняется JavaScript -->
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="topic-content">Содержание</label>
                        <textarea id="topic-content" class="form-textarea" rows="10" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="topic-tags">Теги (через запятую)</label>
                        <input type="text" id="topic-tags" class="form-input" placeholder="например: процессор, охлаждение, проблема">
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary close-modal">Отмена</button>
                        <button type="submit" class="btn btn-primary">Создать тему</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Notifications -->
    <div class="notification" id="notification" style="display: none;"></div>

    <script src="auth.js"></script>
    <script src="forum.js"></script>
    <script>
        // DOM элементы
        const forumMain = document.getElementById('forum-main');
        const forumSidebar = document.getElementById('forum-sidebar');
        const userMenu = document.getElementById('user-menu');
        const loginModal = document.getElementById('login-modal');
        const topicModal = document.getElementById('topic-modal');
        const notification = document.getElementById('notification');

        // Текущее состояние
        let currentView = 'home'; // home, category, topic, create-topic
        let currentCategoryId = null;
        let currentTopicId = null;
        let currentPage = 1;
        const postsPerPage = 20;

        // Инициализация
        document.addEventListener('DOMContentLoaded', function() {
            initForum();
            checkAuth();
            loadForumStats();
            loadCategories();
            showHomeView();
            
            // Проверяем URL параметры
            const urlParams = new URLSearchParams(window.location.search);
            const categoryId = urlParams.get('category');
            const topicId = urlParams.get('topic');
            
            if (categoryId) {
                showCategoryView(parseInt(categoryId));
            } else if (topicId) {
                showTopicView(parseInt(topicId));
            }
        });

        // Инициализация форума
        function initForum() {
            const forumData = forum.getData();
            if (!forumData) {
                forum.init();
            }
        }

        // Проверка авторизации
        function checkAuth() {
            const user = auth.getCurrentUser();
            renderUserMenu(user);
        }

        // Рендер меню пользователя
        function renderUserMenu(user) {
            if (!user) {
                userMenu.innerHTML = `
                    <a href="login.html" class="btn btn-secondary">
                        <i class="fas fa-user"></i> Войти
                    </a>
                `;
                return;
            }

            const roleClass = `role-${user.role}`;
            const roleText = user.role === 'admin' ? 'Админ' : 
                            user.role === 'moderator' ? 'Модератор' : 'Пользователь';

            userMenu.innerHTML = `
                <div class="user-info">
                    <div class="user-avatar">
                        ${user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div class="user-name">${user.username}</div>
                        <div class="user-role ${roleClass}">${roleText}</div>
                    </div>
                </div>
                ${user.role === 'moderator' || user.role === 'admin' ? `
                    <div class="notifications" id="mod-notifications">
                        <i class="fas fa-flag"></i>
                        <span class="notification-count" id="notification-count" style="display: none;">0</span>
                    </div>
                ` : ''}
                <button class="btn btn-secondary" id="logout-btn">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            `;

            // Обработчики
            document.getElementById('logout-btn').addEventListener('click', function() {
                auth.logout();
                window.location.reload();
            });

            // Загрузка уведомлений для модераторов
            if (user.role === 'moderator' || user.role === 'admin') {
                loadModeratorNotifications();
            }
        }

        // Загрузка уведомлений для модераторов
        function loadModeratorNotifications() {
            const reports = forum.getReports('pending');
            const count = reports.length;
            
            const notificationCount = document.getElementById('notification-count');
            if (count > 0) {
                notificationCount.textContent = count;
                notificationCount.style.display = 'block';
                
                // Обработчик клика на уведомления
                document.getElementById('mod-notifications').addEventListener('click', function() {
                    showModerationPanel();
                });
            }
        }

        // Загрузка статистики форума
        function loadForumStats() {
            const stats = forum.getForumStats();
            
            forumSidebar.innerHTML = `
                <div class="sidebar-card">
                    <h3><i class="fas fa-chart-bar"></i> Статистика форума</h3>
                    <div class="quick-stats">
                        <div class="stat-item">
                            <div class="stat-value">${stats.totalTopics}</div>
                            <div class="stat-label">Тем</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${stats.totalPosts}</div>
                            <div class="stat-label">Сообщений</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${stats.totalUsers}</div>
                            <div class="stat-label">Пользователей</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${stats.activeUsers}</div>
                            <div class="stat-label">Активных</div>
                        </div>
                    </div>
                    <button class="btn btn-primary" id="create-topic-btn" style="width: 100%; margin-top: 1rem;">
                        <i class="fas fa-plus"></i> Новая тема
                    </button>
                </div>
                <div class="sidebar-card">
                    <h3><i class="fas fa-list"></i> Категории</h3>
                    <ul class="category-list" id="category-list">
                        <!-- Заполняется динамически -->
                    </ul>
                </div>
                <div class="sidebar-card">
                    <h3><i class="fas fa-fire"></i> Активные темы</h3>
                    <div id="active-topics">
                        <!-- Заполняется динамически -->
                    </div>
                </div>
            `;

            // Обработчик создания темы
            document.getElementById('create-topic-btn').addEventListener('click', function() {
                const user = auth.getCurrentUser();
                if (!user) {
                    showLoginModal();
                } else {
                    showCreateTopicModal();
                }
            });
        }

        // Загрузка категорий
        function loadCategories() {
            const categories = forum.getCategories();
            const categoryList = document.getElementById('category-list');
            
            if (!categoryList) return;
            
            categoryList.innerHTML = categories.map(category => `
                <li class="category-item">
                    <a href="#" class="category-link ${currentCategoryId === category.id ? 'active' : ''}" 
                       data-id="${category.id}">
                        <div class="category-icon" style="background: ${category.color}20; color: ${category.color};">
                            <i class="${category.icon}"></i>
                        </div>
                        <div class="category-info">
                            <div class="category-name">${category.name}</div>
                            <div class="category-stats">
                                ${category.topicsCount} тем • ${category.postsCount} сообщений
                            </div>
                        </div>
                    </a>
                </li>
            `).join('');

            // Обработчики клика по категориям
            document.querySelectorAll('.category-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const categoryId = parseInt(this.dataset.id);
                    showCategoryView(categoryId);
                    window.history.pushState({}, '', `?category=${categoryId}`);
                });
            });
        }

        // Показать главную страницу
        function showHomeView() {
            currentView = 'home';
            
            // Получаем последние темы
            const topics = forum.getTopics({
                sortBy: 'updatedAt',
                sortOrder: 'desc',
                page: currentPage,
                perPage: 20
            });

            forumMain.innerHTML = `
                <div class="forum-header">
                    <h1>Последние обсуждения</h1>
                    <div class="search-box">
                        <input type="text" class="search-input" placeholder="Поиск по форуму...">
                        <button class="search-btn">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
                
                <div class="topics-container">
                    <div class="topics-header">
                        <div class="topic-filters">
                            <button class="filter-btn active" data-filter="all">Все темы</button>
                            <button class="filter-btn" data-filter="new">Новые</button>
                            <button class="filter-btn" data-filter="popular">Популярные</button>
                            ${auth.isModerator() ? `
                                <button class="filter-btn" data-filter="reported">Жалобы</button>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div id="topics-list">
                        ${topics.length > 0 ? topics.map(topic => renderTopicItem(topic)).join('') : `
                            <div style="padding: 3rem; text-align: center; opacity: 0.7;">
                                <i class="fas fa-comments" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                                <p>Пока нет тем для обсуждения</p>
                                <button class="btn btn-primary" id="create-first-topic">
                                    <i class="fas fa-plus"></i> Создать первую тему
                                </button>
                            </div>
                        `}
                    </div>
                    
                    ${topics.length > 0 ? `
                        <div class="pagination">
                            <button class="page-btn prev-btn">← Назад</button>
                            <button class="page-btn active">1</button>
                            <button class="page-btn">2</button>
                            <button class="page-btn">3</button>
                            <button class="page-btn next-btn">Вперед →</button>
                        </div>
                    ` : ''}
                </div>
            `;

            // Обработчики
            if (topics.length === 0) {
                document.getElementById('create-first-topic').addEventListener('click', function() {
                    const user = auth.getCurrentUser();
                    if (!user) {
                        showLoginModal();
                    } else {
                        showCreateTopicModal();
                    }
                });
            }

            document.querySelectorAll('.topic-title').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const topicId = parseInt(this.dataset.id);
                    showTopicView(topicId);
                    window.history.pushState({}, '', `?topic=${topicId}`);
                });
            });

            // Поиск
            document.querySelector('.search-btn').addEventListener('click', performSearch);
            document.querySelector('.search-input').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') performSearch();
            });
        }

        // Рендер элемента темы
        function renderTopicItem(topic) {
            const data = forum.getData();
            const author = auth.getUsers().find(u => u.id === topic.authorId);
            const category = data.categories.find(c => c.id === topic.categoryId);
            
            const badges = [];
            if (topic.isPinned) badges.push('<span class="topic-badge badge-pinned">Закреплено</span>');
            if (topic.isLocked) badges.push('<span class="topic-badge badge-locked">Закрыто</span>');
            
            // Проверяем, новая ли тема (менее 24 часов)
            const isNew = (new Date() - new Date(topic.createdAt)) < 24 * 60 * 60 * 1000;
            if (isNew) badges.push('<span class="topic-badge badge-new">Новое</span>');
            
            return `
                <div class="topic-item">
                    <div class="topic-header">
                        <a href="#" class="topic-title" data-id="${topic.id}">${topic.title}</a>
                        <div class="topic-badges">
                            ${badges.join('')}
                        </div>
                    </div>
                    
                    <div class="topic-meta">
                        <span class="topic-author">${author ? author.username : 'Неизвестно'}</span>
                        <span>в категории <strong>${category ? category.name : 'Без категории'}</strong></span>
                        <span>${new Date(topic.createdAt).toLocaleDateString('ru-RU')}</span>
                    </div>
                    
                    <div class="topic-preview">
                        ${topic.content.substring(0, 200)}${topic.content.length > 200 ? '...' : ''}
                    </div>
                    
                    ${topic.tags && topic.tags.length > 0 ? `
                        <div class="topic-tags">
                            ${topic.tags.map(tag => `<span class="topic-tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                    
                    <div class="topic-footer">
                        <div class="topic-stats">
                            <div class="stat">
                                <i class="fas fa-eye"></i>
                                <span>${topic.views}</span>
                            </div>
                            <div class="stat">
                                <i class="fas fa-comment"></i>
                                <span>${topic.postCount}</span>
                            </div>
                        </div>
                        <div class="last-post">
                            Обновлено ${new Date(topic.updatedAt).toLocaleDateString('ru-RU')}
                        </div>
                    </div>
                </div>
            `;
        }

        // Показать категорию
        function showCategoryView(categoryId) {
            currentView = 'category';
            currentCategoryId = categoryId;
            
            const data = forum.getData();
            const category = data.categories.find(c => c.id === categoryId);
            
            if (!category) {
                showHomeView();
                return;
            }
            
            // Получаем темы категории
            const topics = forum.getTopics({
                categoryId: categoryId,
                sortBy: 'updatedAt',
                sortOrder: 'desc',
                page: currentPage,
                perPage: 20
            });

            forumMain.innerHTML = `
                <div class="forum-header">
                    <h1>${category.name}</h1>
                    <div>
                        <button class="btn btn-primary" id="create-topic-in-category">
                            <i class="fas fa-plus"></i> Новая тема
                        </button>
                    </div>
                </div>
                
                <div class="category-description" style="margin-bottom: 2rem; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 8px;">
                    <p>${category.description}</p>
                    <div style="display: flex; gap: 2rem; margin-top: 1rem; font-size: 0.9rem; opacity: 0.7;">
                        <span><i class="fas fa-list"></i> ${category.topicsCount} тем</span>
                        <span><i class="fas fa-comment"></i> ${category.postsCount} сообщений</span>
                    </div>
                </div>
                
                <div class="topics-container">
                    <div class="topics-header">
                        <h3>Темы в категории</h3>
                    </div>
                    
                    <div id="topics-list">
                        ${topics.length > 0 ? topics.map(topic => renderTopicItem(topic)).join('') : `
                            <div style="padding: 3rem; text-align: center; opacity: 0.7;">
                                <i class="fas fa-comments" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                                <p>Пока нет тем в этой категории</p>
                                <button class="btn btn-primary" id="create-first-topic-cat">
                                    <i class="fas fa-plus"></i> Создать первую тему
                                </button>
                            </div>
                        `}
                    </div>
                </div>
            `;

            // Обработчики
            document.getElementById('create-topic-in-category').addEventListener('click', function() {
                const user = auth.getCurrentUser();
                if (!user) {
                    showLoginModal();
                } else {
                    showCreateTopicModal(categoryId);
                }
            });

            if (topics.length === 0) {
                document.getElementById('create-first-topic-cat')?.addEventListener('click', function() {
                    const user = auth.getCurrentUser();
                    if (!user) {
                        showLoginModal();
                    } else {
                        showCreateTopicModal(categoryId);
                    }
                });
            }

            document.querySelectorAll('.topic-title').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const topicId = parseInt(this.dataset.id);
                    showTopicView(topicId);
                    window.history.pushState({}, '', `?topic=${topicId}`);
                });
            });
        }

        // Показать тему
        function showTopicView(topicId) {
            currentView = 'topic';
            currentTopicId = topicId;
            
            const data = forum.getData();
            const topic = data.topics.find(t => t.id === topicId);
            
            if (!topic) {
                showHomeView();
                showNotification('Тема не найдена', 'error');
                return;
            }
            
            // Увеличиваем счетчик просмотров
            topic.views = (topic.views || 0) + 1;
            forum.saveData(data);
            
            const author = auth.getUsers().find(u => u.id === topic.authorId);
            const category = data.categories.find(c => c.id === topic.categoryId);
            const posts = forum.getTopicPosts(topicId);
            
            forumMain.innerHTML = `
                <div class="topic-view">
                    <div class="topic-view-header">
                        <h1 class="topic-view-title">${topic.title}</h1>
                        <div class="topic-view-meta">
                            <span>Автор: <strong>${author ? author.username : 'Неизвестно'}</strong></span>
                            <span>Категория: <strong>${category ? category.name : 'Без категории'}</strong></span>
                            <span>Создано: ${new Date(topic.createdAt).toLocaleDateString('ru-RU')}</span>
                            <span>Просмотров: ${topic.views}</span>
                            <span>Сообщений: ${topic.postCount}</span>
                        </div>
                        
                        ${auth.isModerator() ? `
                            <div class="topic-mod-actions" style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                                <button class="btn btn-secondary" id="lock-topic-btn">
                                    <i class="fas fa-lock"></i> ${topic.isLocked ? 'Открыть тему' : 'Закрыть тему'}
                                </button>
                                <button class="btn btn-secondary" id="pin-topic-btn">
                                    <i class="fas fa-thumbtack"></i> ${topic.isPinned ? 'Открепить' : 'Закрепить'}
                                </button>
                                <button class="btn btn-secondary" id="delete-topic-btn">
                                    <i class="fas fa-trash"></i> Удалить тему
                                </button>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="posts-container" id="posts-container">
                        ${posts.map((post, index) => renderPostItem(post, index === 0)).join('')}
                    </div>
                    
                    ${!topic.isLocked || auth.isModerator() ? `
                        <div class="reply-form" id="reply-form">
                            <div class="reply-header">Ответить в тему</div>
                            <textarea class="reply-textarea" id="reply-content" placeholder="Ваш ответ..."></textarea>
                            <div class="reply-actions">
                                <div class="reply-buttons">
                                    <button class="btn btn-primary" id="submit-reply">
                                        <i class="fas fa-paper-plane"></i> Отправить
                                    </button>
                                </div>
                            </div>
                        </div>
                    ` : `
                        <div style="padding: 2rem; text-align: center; background: rgba(255,68,68,0.1); border-radius: 8px; margin: 1.5rem;">
                            <i class="fas fa-lock" style="font-size: 2rem; color: var(--error); margin-bottom: 1rem;"></i>
                            <h3>Тема закрыта</h3>
                            <p>Новые сообщения в эту тему запрещены</p>
                        </div>
                    `}
                </div>
            `;

            // Обработчики
            if (!topic.isLocked || auth.isModerator()) {
                document.getElementById('submit-reply').addEventListener('click', submitReply);
            }

            // Модераторские действия
            if (auth.isModerator()) {
                document.getElementById('lock-topic-btn').addEventListener('click', function() {
                    const reason = prompt('Причина закрытия темы (оставьте пустым если открываете):');
                    forum.toggleTopicLock(topicId, !topic.isLocked, reason);
                    showTopicView(topicId);
                });
                
                document.getElementById('pin-topic-btn').addEventListener('click', function() {
                    forum.toggleTopicPin(topicId, !topic.isPinned);
                    showTopicView(topicId);
                });
                
                document.getElementById('delete-topic-btn').addEventListener('click', function() {
                    if (confirm('Вы уверены, что хотите удалить эту тему?')) {
                        // Находим первое сообщение темы и удаляем его (это удалит всю тему)
                        const firstPost = posts[0];
                        if (firstPost) {
                            forum.deletePost(firstPost.id, 'Удаление темы модератором');
                            showNotification('Тема удалена', 'success');
                            showHomeView();
                        }
                    }
                });
            }

            // Обработчики для кнопок в сообщениях
            document.querySelectorAll('.like-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const postId = parseInt(this.dataset.id);
                    ratePost(postId, 'like');
                });
            });
            
            document.querySelectorAll('.dislike-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const postId = parseInt(this.dataset.id);
                    ratePost(postId, 'dislike');
                });
            });
            
            document.querySelectorAll('.report-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const postId = parseInt(this.dataset.id);
                    const reason = prompt('Причина жалобы:');
                    if (reason) {
                        forum.reportPost(postId, reason);
                        showNotification('Жалоба отправлена', 'success');
                    }
                });
            });
            
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const postId = parseInt(this.dataset.id);
                    const post = posts.find(p => p.id === postId);
                    if (post) {
                        const newContent = prompt('Редактировать сообщение:', post.content);
                        if (newContent && newContent !== post.content) {
                            const reason = prompt('Причина редактирования (опционально):');
                            forum.editPost(postId, newContent, reason);
                            showTopicView(topicId);
                            showNotification('Сообщение отредактировано', 'success');
                        }
                    }
                });
            });
            
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const postId = parseInt(this.dataset.id);
                    if (confirm('Удалить это сообщение?')) {
                        const reason = auth.isModerator() ? prompt('Причина удаления:') : null;
                        forum.deletePost(postId, reason);
                        showTopicView(topicId);
                        showNotification('Сообщение удалено', 'success');
                    }
                });
            });
        }

        // Рендер сообщения
        function renderPostItem(post, isFirstPost = false) {
            const author = auth.getUsers().find(u => u.id === post.authorId);
            const currentUser = auth.getCurrentUser();
            const isAuthor = currentUser && currentUser.id === post.authorId;
            const canModerate = auth.isModerator();
            const canEdit = isAuthor || canModerate;
            const canDelete = isAuthor || canModerate;
            
            const roleClass = author ? `role-${author.role}` : 'role-user';
            const roleText = author ? (author.role === 'admin' ? 'Админ' : 
                                author.role === 'moderator' ? 'Модератор' : 'Пользователь') : 'Пользователь';
            
            return `
                <div class="post-item" id="post-${post.id}">
                    <div class="post-sidebar">
                        <div class="post-author">
                            <div class="author-avatar">
                                ${author ? author.username.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div class="author-name">${author ? author.username : 'Неизвестно'}</div>
                            <div class="author-role ${roleClass}">${roleText}</div>
                            <div class="author-stats">
                                <div>Сообщений: ${author ? author.postsCount : 0}</div>
                                <div>Репутация: ${author ? author.reputation : 0}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="post-content">
                        <div class="post-header">
                            <div class="post-date">
                                ${new Date(post.createdAt).toLocaleString('ru-RU')}
                                ${post.isEdited ? ` (ред. ${new Date(post.editedAt).toLocaleDateString('ru-RU')})` : ''}
                            </div>
                            <div class="post-actions">
                                ${canEdit ? `
                                    <button class="action-btn edit-btn" data-id="${post.id}">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                ` : ''}
                                ${canDelete ? `
                                    <button class="action-btn delete-btn" data-id="${post.id}">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                ` : ''}
                                ${currentUser && !isAuthor ? `
                                    <button class="action-btn report-btn" data-id="${post.id}">
                                        <i class="fas fa-flag"></i>
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                        
                        <div class="post-body">
                            ${post.content}
                        </div>
                        
                        <div class="post-footer">
                            <div class="post-rating">
                                <button class="rating-btn like-btn" data-id="${post.id}">
                                    <i class="fas fa-thumbs-up"></i>
                                    <span>${post.likes || 0}</span>
                                </button>
                                <button class="rating-btn dislike-btn" data-id="${post.id}">
                                    <i class="fas fa-thumbs-down"></i>
                                    <span>${post.dislikes || 0}</span>
                                </button>
                            </div>
                            ${isFirstPost ? '<div style="opacity: 0.7;">Первое сообщение в теме</div>' : ''}
                        </div>
                    </div>
                </div>
            `;
        }

        // Отправить ответ
        function submitReply() {
            const user = auth.getCurrentUser();
            if (!user) {
                showLoginModal();
                return;
            }
            
            const content = document.getElementById('reply-content').value.trim();
            if (!content) {
                showNotification('Введите текст сообщения', 'error');
                return;
            }
            
            const result = forum.createPost({
                topicId: currentTopicId,
                content: content
            });
            
            if (result.success) {
                document.getElementById('reply-content').value = '';
                showTopicView(currentTopicId);
                showNotification('Сообщение отправлено', 'success');
            } else {
                showNotification(result.message, 'error');
            }
        }

        // Оценить сообщение
        function ratePost(postId, type) {
            const user = auth.getCurrentUser();
            if (!user) {
                showLoginModal();
                return;
            }
            
            const result = forum.ratePost(postId, type);
            if (result.success) {
                // Обновляем счетчики на кнопках
                const likeBtn = document.querySelector(`.like-btn[data-id="${postId}"]`);
                const dislikeBtn = document.querySelector(`.dislike-btn[data-id="${postId}"]`);
                
                if (likeBtn) {
                    likeBtn.querySelector('span').textContent = result.likes;
                }
                if (dislikeBtn) {
                    dislikeBtn.querySelector('span').textContent = result.dislikes;
                }
            } else {
                showNotification(result.message, 'error');
            }
        }

        // Показать модераторскую панель
        function showModerationPanel() {
            const reports = forum.getReports('pending');
            
            forumMain.innerHTML = `
                <div class="moderation-panel">
                    <div class="moderation-header">
                        <h2><i class="fas fa-shield-alt"></i> Панель модератора</h2>
                        <p>Управление жалобами и модерация контента</p>
                    </div>
                    <div class="moderation-content">
                        <h3>Жалобы на сообщения (${reports.length})</h3>
                        
                        ${reports.length > 0 ? `
                            <div class="reports-list">
                                ${reports.map(report => `
                                    <div class="report-item">
                                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                            <strong>Жалоба #${report.id}</strong>
                                            <small>${new Date(report.createdAt).toLocaleDateString('ru-RU')}</small>
                                        </div>
                                        <p><strong>Причина:</strong> ${report.reason}</p>
                                        ${report.post ? `
                                            <div style="margin: 1rem 0; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 8px;">
                                                <p>${report.post.content}</p>
                                                <small style="opacity: 0.7;">Сообщение от пользователя ID: ${report.post.authorId}</small>
                                            </div>
                                        ` : ''}
                                        <div class="report-actions" style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                                            <button class="btn btn-primary resolve-btn" data-id="${report.id}" data-action="approve">
                                                Принять жалобу
                                            </button>
                                            <button class="btn btn-secondary resolve-btn" data-id="${report.id}" data-action="reject">
                                                Отклонить
                                            </button>
                                            <a href="?topic=${report.topic?.id || ''}" class="btn btn-secondary">
                                                Перейти к теме
                                            </a>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : `
                            <div style="text-align: center; padding: 3rem; opacity: 0.7;">
                                <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--success); margin-bottom: 1rem;"></i>
                                <p>Нет активных жалоб</p>
                            </div>
                        `}
                        
                        <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.05);">
                            <h3>Быстрые действия</h3>
                            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                                <button class="btn btn-secondary" id="view-banned-users">
                                    <i class="fas fa-ban"></i> Заблокированные
                                </button>
                                <button class="btn btn-secondary" id="view-forum-stats">
                                    <i class="fas fa-chart-bar"></i> Статистика
                                </button>
                                <button class="btn btn-secondary" id="back-to-forum">
                                    <i class="fas fa-arrow-left"></i> Назад к форуму
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Обработчики для кнопок обработки жалоб
            document.querySelectorAll('.resolve-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const reportId = parseInt(this.dataset.id);
                    const action = this.dataset.action;
                    
                    if (action === 'approve') {
                        const resolution = prompt('Решение по жалобе:');
                        if (resolution) {
                            forum.processReport(reportId, resolution, 'Жалоба одобрена');
                            showModerationPanel();
                            showNotification('Жалоба обработана', 'success');
                        }
                    } else {
                        forum.processReport(reportId, 'Отклонено', 'Жалоба не обоснована');
                        showModerationPanel();
                        showNotification('Жалоба отклонена', 'success');
                    }
                });
            });

            // Другие кнопки
            document.getElementById('back-to-forum').addEventListener('click', showHomeView);
        }

        // Показать модальное окно входа
        function showLoginModal() {
            loginModal.style.display = 'flex';
            
            // Закрытие по клику вне окна
            loginModal.addEventListener('click', function(e) {
                if (e.target === loginModal) {
                    loginModal.style.display = 'none';
                }
            });
            
            // Закрытие по кнопке
            loginModal.querySelector('.close-modal').addEventListener('click', function() {
                loginModal.style.display = 'none';
            });
        }

        // Показать модальное окно создания темы
        function showCreateTopicModal(categoryId = null) {
            // Заполняем список категорий
            const categories = forum.getCategories();
            const categorySelect = document.getElementById('topic-category');
            
            categorySelect.innerHTML = categories.map(cat => `
                <option value="${cat.id}" ${categoryId === cat.id ? 'selected' : ''}>
                    ${cat.name}
                </option>
            `).join('');
            
            topicModal.style.display = 'flex';
            
            // Обработчик отправки формы
            document.getElementById('topic-form').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const title = document.getElementById('topic-title').value;
                const content = document.getElementById('topic-content').value;
                const categoryId = parseInt(document.getElementById('topic-category').value);
                const tags = document.getElementById('topic-tags').value
                    .split(',')
                    .map(tag => tag.trim())
                    .filter(tag => tag.length > 0);
                
                const result = forum.createTopic({
                    title: title,
                    content: content,
                    categoryId: categoryId,
                    tags: tags
                });
                
                if (result.success) {
                    topicModal.style.display = 'none';
                    showTopicView(result.topic.id);
                    window.history.pushState({}, '', `?topic=${result.topic.id}`);
                    showNotification('Тема создана', 'success');
                    document.getElementById('topic-form').reset();
                } else {
                    showNotification(result.message, 'error');
                }
            });
            
            // Закрытие модального окна
            topicModal.addEventListener('click', function(e) {
                if (e.target === topicModal) {
                    topicModal.style.display = 'none';
                }
            });
            
            topicModal.querySelector('.close-modal').addEventListener('click', function() {
                topicModal.style.display = 'none';
            });
        }

        // Поиск
        function performSearch() {
            const query = document.querySelector('.search-input').value.trim();
            if (query) {
                const topics = forum.getTopics({
                    search: query,
                    sortBy: 'updatedAt',
                    sortOrder: 'desc'
                });
                
                forumMain.innerHTML = `
                    <div class="forum-header">
                        <h1>Результаты поиска: "${query}"</h1>
                        <button class="btn btn-secondary" id="back-to-home">
                            <i class="fas fa-arrow-left"></i> Назад
                        </button>
                    </div>
                    
                    <div class="topics-container">
                        <div id="topics-list">
                            ${topics.length > 0 ? topics.map(topic => renderTopicItem(topic)).join('') : `
                                <div style="padding: 3rem; text-align: center; opacity: 0.7;">
                                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                                    <p>По запросу "${query}" ничего не найдено</p>
                                </div>
                            `}
                        </div>
                    </div>
                `;
                
                document.getElementById('back-to-home').addEventListener('click', showHomeView);
                
                document.querySelectorAll('.topic-title').forEach(link => {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        const topicId = parseInt(this.dataset.id);
                        showTopicView(topicId);
                        window.history.pushState({}, '', `?topic=${topicId}`);
                    });
                });
            }
        }

        // Показать уведомление
        function showNotification(message, type = 'info') {
            notification.textContent = message;
            notification.className = `notification ${type}`;
            notification.style.display = 'block';
            
            // Позиционирование
            notification.style.position = 'fixed';
            notification.style.top = '100px';
            notification.style.right = '20px';
            notification.style.padding = '1rem 1.5rem';
            notification.style.borderRadius = '8px';
            notification.style.background = 'var(--card-bg)';
            notification.style.borderLeft = `4px solid ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--accent-primary)'}`;
            notification.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
            notification.style.zIndex = '3000';
            
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        }

        // Обработка навигации браузера
        window.addEventListener('popstate', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const categoryId = urlParams.get('category');
            const topicId = urlParams.get('topic');
            
            if (categoryId) {
                showCategoryView(parseInt(categoryId));
            } else if (topicId) {
                showTopicView(parseInt(topicId));
            } else {
                showHomeView();
            }
        });
    </script>
</body>
</html>
