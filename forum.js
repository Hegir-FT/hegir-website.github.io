// forum.js - Управление форумом
// Подключите этот файл на странице forum.html

class ForumManager {
  constructor() {
    this.config = {
      API_URL: 'https://script.google.com/macros/s/1mq4JNlD6HGt3PQIE8mR9oJ7MUOsZnFQN7zHj-sKpU8aXywvMmLG7PN9h/exec',
      CATEGORIES: {
        'products': 'Продукты Hegir',
        'support': 'Техподдержка',
        'ideas': 'Идеи и предложения',
        'general': 'Общие обсуждения',
        'gaming': 'Игры и VR',
        'development': 'Разработка'
      }
    };
    this.threads = [];
    this.currentCategory = 'all';
    this.currentPage = 1;
    this.threadsPerPage = 10;
  }

  async init() {
    try {
      // Загружаем темы
      await this.loadThreads();
      
      // Инициализируем UI
      this.initUI();
      
      // Обновляем каждые 30 секунд
      setInterval(() => this.loadThreads(), 30000);
      
      console.log('ForumManager initialized');
    } catch (error) {
      console.error('ForumManager init error:', error);
    }
  }

  async loadThreads() {
    try {
      const response = await this.apiRequest('get_threads');
      
      if (response.success) {
        this.threads = response.threads;
        this.renderThreads();
        this.updateStats();
      } else {
        this.showError('Не удалось загрузить темы форума');
      }
    } catch (error) {
      console.error('Error loading threads:', error);
      this.showError('Ошибка соединения с сервером');
    }
  }

  async createThread(category, title, content) {
    if (!hegirAuth.isAuthenticated()) {
      hegirAuth.showNotification('Для создания темы необходимо войти в систему', 'warning');
      return;
    }

    if (!category || !title || !content) {
      hegirAuth.showNotification('Заполните все поля', 'error');
      return;
    }

    if (title.length < 5) {
      hegirAuth.showNotification('Заголовок должен быть не менее 5 символов', 'error');
      return;
    }

    if (content.length < 10) {
      hegirAuth.showNotification('Сообщение должно быть не менее 10 символов', 'error');
      return;
    }

    const user = hegirAuth.getUser();
    const session = hegirAuth.getSession();

    try {
      const response = await this.apiRequest('create_thread', {
        userId: user.id,
        userName: user.name,
        token: session,
        category: category,
        title: title,
        content: content
      });

      if (response.success) {
        hegirAuth.showNotification('Тема успешно создана!', 'success');
        this.closeNewThreadModal();
        await this.loadThreads();
        
        // Прокручиваем к новой теме
        setTimeout(() => {
          const threadsList = document.getElementById('threads-list');
          if (threadsList && threadsList.firstChild) {
            threadsList.firstChild.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
      } else {
        hegirAuth.showNotification(response.message || 'Ошибка создания темы', 'error');
      }
    } catch (error) {
      console.error('Error creating thread:', error);
      hegirAuth.showNotification('Ошибка соединения с сервером', 'error');
    }
  }

  async likeThread(threadId) {
    if (!hegirAuth.isAuthenticated()) {
      hegirAuth.showNotification('Для оценки темы необходимо войти в систему', 'warning');
      return;
    }

    // В реальном приложении здесь будет API запрос
    hegirAuth.showNotification('Функция лайков будет доступна в следующем обновлении', 'info');
  }

  async replyToThread(threadId, content) {
    if (!hegirAuth.isAuthenticated()) {
      hegirAuth.showNotification('Для ответа необходимо войти в систему', 'warning');
      return;
    }

    if (!content || content.length < 5) {
      hegirAuth.showNotification('Сообщение должно быть не менее 5 символов', 'error');
      return;
    }

    // В реальном приложении здесь будет API запрос
    hegirAuth.showNotification('Функция ответов будет доступна в следующем обновлении', 'info');
  }

  renderThreads() {
    const threadsList = document.getElementById('threads-list');
    if (!threadsList) return;

    // Фильтруем по категории
    let filteredThreads = this.threads;
    if (this.currentCategory !== 'all') {
      filteredThreads = this.threads.filter(thread => thread.category === this.currentCategory);
    }

    // Пагинация
    const startIndex = (this.currentPage - 1) * this.threadsPerPage;
    const endIndex = startIndex + this.threadsPerPage;
    const pagedThreads = filteredThreads.slice(startIndex, endIndex);

    if (pagedThreads.length === 0) {
      threadsList.innerHTML = `
        <div class="no-threads">
          <i class="fas fa-comments" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
          <h3>Темы не найдены</h3>
          <p>Будьте первым, кто создаст тему в этой категории!</p>
        </div>
      `;
      return;
    }

    threadsList.innerHTML = pagedThreads.map(thread => `
      <div class="thread-card" data-thread-id="${thread.id}">
        <div class="thread-header">
          <div class="thread-author">
            <div class="author-avatar">${thread.userName.charAt(0).toUpperCase()}</div>
            <div>
              <div class="author-name">${thread.userName}</div>
              <div class="thread-category">${this.getCategoryName(thread.category)}</div>
            </div>
          </div>
          <div class="thread-date">${this.formatDate(thread.date)}</div>
        </div>
        
        <div class="thread-content">
          <h3 class="thread-title">${this.escapeHtml(thread.title)}</h3>
          <p class="thread-text">${this.escapeHtml(thread.content)}</p>
        </div>
        
        <div class="thread-footer">
          <div class="thread-stats">
            <span class="stat-item">
              <i class="fas fa-thumbs-up"></i> ${thread.likes || 0}
            </span>
            <span class="stat-item">
              <i class="fas fa-comment"></i> ${thread.replies || 0}
            </span>
          </div>
          
          <div class="thread-actions">
            <button class="thread-action like-btn" onclick="forumManager.likeThread('${thread.id}')">
              <i class="far fa-thumbs-up"></i> Нравится
            </button>
            <button class="thread-action reply-btn" onclick="forumManager.showReplyModal('${thread.id}')">
              <i class="far fa-comment"></i> Ответить
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Обновляем пагинацию
    this.renderPagination(filteredThreads.length);
  }

  renderPagination(totalThreads) {
    const paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(totalThreads / this.threadsPerPage);
    
    if (totalPages <= 1) {
      paginationContainer.innerHTML = '';
      return;
    }

    let paginationHTML = '<div class="pagination">';
    
    // Кнопка "Назад"
    if (this.currentPage > 1) {
      paginationHTML += `
        <button class="pagination-btn" onclick="forumManager.goToPage(${this.currentPage - 1})">
          <i class="fas fa-chevron-left"></i>
        </button>
      `;
    }

    // Номера страниц
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
      if (i === this.currentPage) {
        paginationHTML += `<span class="pagination-current">${i}</span>`;
      } else {
        paginationHTML += `
          <button class="pagination-btn" onclick="forumManager.goToPage(${i})">${i}</button>
        `;
      }
    }

    // Кнопка "Вперед"
    if (this.currentPage < totalPages) {
      paginationHTML += `
        <button class="pagination-btn" onclick="forumManager.goToPage(${this.currentPage + 1})">
          <i class="fas fa-chevron-right"></i>
        </button>
      `;
    }

    paginationHTML += '</div>';
    paginationContainer.innerHTML = paginationHTML;
  }

  goToPage(page) {
    this.currentPage = page;
    this.renderThreads();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateStats() {
    const statsElement = document.getElementById('forum-stats');
    if (!statsElement) return;

    const totalThreads = this.threads.length;
    const totalReplies = this.threads.reduce((sum, thread) => sum + (thread.replies || 0), 0);
    const totalLikes = this.threads.reduce((sum, thread) => sum + (thread.likes || 0), 0);
    const activeUsers = [...new Set(this.threads.map(thread => thread.userId))].length;

    statsElement.innerHTML = `
      <div class="stat-item">
        <i class="fas fa-comments"></i>
        <div class="stat-value">${totalThreads}</div>
        <div class="stat-label">Тем</div>
      </div>
      <div class="stat-item">
        <i class="fas fa-reply"></i>
        <div class="stat-value">${totalReplies}</div>
        <div class="stat-label">Ответов</div>
      </div>
      <div class="stat-item">
        <i class="fas fa-thumbs-up"></i>
        <div class="stat-value">${totalLikes}</div>
        <div class="stat-label">Лайков</div>
      </div>
      <div class="stat-item">
        <i class="fas fa-users"></i>
        <div class="stat-value">${activeUsers}</div>
        <div class="stat-label">Участников</div>
      </div>
    `;
  }

  initUI() {
    // Инициализация категорий
    this.initCategories();
    
    // Инициализация модальных окон
    this.initModals();
    
    // Инициализация поиска
    this.initSearch();
    
    // Инициализация сортировки
    this.initSorting();
  }

  initCategories() {
    const categoriesContainer = document.getElementById('categories-container');
    if (!categoriesContainer) return;

    let categoriesHTML = `
      <button class="category-btn ${this.currentCategory === 'all' ? 'active' : ''}" 
              onclick="forumManager.setCategory('all')">
        <i class="fas fa-layer-group"></i>
        <span>Все темы</span>
      </button>
    `;

    for (const [id, name] of Object.entries(this.config.CATEGORIES)) {
      categoriesHTML += `
        <button class="category-btn ${this.currentCategory === id ? 'active' : ''}" 
                onclick="forumManager.setCategory('${id}')">
          <i class="fas fa-${this.getCategoryIcon(id)}"></i>
          <span>${name}</span>
        </button>
      `;
    }

    categoriesContainer.innerHTML = categoriesHTML;
  }

  setCategory(category) {
    this.currentCategory = category;
    this.currentPage = 1;
    this.renderThreads();
    
    // Обновляем активную кнопку категории
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.closest('.category-btn').classList.add('active');
  }

  initModals() {
    // Модальное окно новой темы
    const newThreadBtn = document.getElementById('new-thread-btn');
    const newThreadModal = document.getElementById('new-thread-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');

    if (newThreadBtn && newThreadModal) {
      newThreadBtn.addEventListener('click', () => {
        if (!hegirAuth.isAuthenticated()) {
          hegirAuth.showNotification('Для создания темы необходимо войти в систему', 'warning');
          window.location.href = 'login.html';
          return;
        }
        newThreadModal.style.display = 'flex';
      });
    }

    closeModalBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.modal').style.display = 'none';
      });
    });

    // Закрытие модального окна при клике вне его
    window.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
      }
    });

    // Обработка формы новой темы
    const newThreadForm = document.getElementById('new-thread-form');
    if (newThreadForm) {
      newThreadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const category = document.getElementById('thread-category').value;
        const title = document.getElementById('thread-title').value;
        const content = document.getElementById('thread-content').value;
        
        this.createThread(category, title, content);
      });
    }
  }

  closeNewThreadModal() {
    const modal = document.getElementById('new-thread-modal');
    if (modal) {
      modal.style.display = 'none';
    }
    
    const form = document.getElementById('new-thread-form');
    if (form) {
      form.reset();
    }
  }

  showReplyModal(threadId) {
    if (!hegirAuth.isAuthenticated()) {
      hegirAuth.showNotification('Для ответа необходимо войти в систему', 'warning');
      return;
    }

    // В реальном приложении здесь будет открытие модального окна ответа
    hegirAuth.showNotification('Функция ответов будет доступна в следующем обновлении', 'info');
  }

  initSearch() {
    const searchInput = document.getElementById('forum-search');
    if (!searchInput) return;

    let searchTimeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.performSearch(searchInput.value);
      }, 500);
    });
  }

  performSearch(query) {
    if (!query.trim()) {
      this.renderThreads();
      return;
    }

    const searchResults = this.threads.filter(thread => {
      const searchText = query.toLowerCase();
      return (
        thread.title.toLowerCase().includes(searchText) ||
        thread.content.toLowerCase().includes(searchText) ||
        thread.userName.toLowerCase().includes(searchText)
      );
    });

    this.renderSearchResults(searchResults);
  }

  renderSearchResults(results) {
    const threadsList = document.getElementById('threads-list');
    if (!threadsList) return;

    if (results.length === 0) {
      threadsList.innerHTML = `
        <div class="no-results">
          <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
          <h3>Ничего не найдено</h3>
          <p>Попробуйте изменить поисковый запрос</p>
        </div>
      `;
      return;
    }

    threadsList.innerHTML = results.map(thread => `
      <div class="thread-card search-result">
        <div class="thread-header">
          <div class="thread-author">
            <div class="author-avatar">${thread.userName.charAt(0).toUpperCase()}</div>
            <div>
              <div class="author-name">${thread.userName}</div>
              <div class="thread-category">${this.getCategoryName(thread.category)}</div>
            </div>
          </div>
          <div class="thread-date">${this.formatDate(thread.date)}</div>
        </div>
        
        <div class="thread-content">
          <h3 class="thread-title">${this.highlightText(this.escapeHtml(thread.title), document.getElementById('forum-search').value)}</h3>
          <p class="thread-text">${this.highlightText(this.escapeHtml(this.truncateText(thread.content, 200)), document.getElementById('forum-search').value)}</p>
        </div>
      </div>
    `).join('');
  }

  initSorting() {
    const sortSelect = document.getElementById('forum-sort');
    if (!sortSelect) return;

    sortSelect.addEventListener('change', (e) => {
      this.sortThreads(e.target.value);
    });
  }

  sortThreads(sortBy) {
    switch (sortBy) {
      case 'newest':
        this.threads.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        this.threads.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'popular':
        this.threads.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'most_replies':
        this.threads.sort((a, b) => (b.replies || 0) - (a.replies || 0));
        break;
    }

    this.renderThreads();
  }

  // Вспомогательные методы
  getCategoryName(categoryId) {
    return this.config.CATEGORIES[categoryId] || 'Общие';
  }

  getCategoryIcon(categoryId) {
    const icons = {
      'products': 'cube',
      'support': 'headset',
      'ideas': 'lightbulb',
      'general': 'comments',
      'gaming': 'gamepad',
      'development': 'code'
    };
    return icons[categoryId] || 'folder';
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 7) {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } else if (diffDay > 0) {
      return `${diffDay} ${this.declension(diffDay, ['день', 'дня', 'дней'])} назад`;
    } else if (diffHour > 0) {
      return `${diffHour} ${this.declension(diffHour, ['час', 'часа', 'часов'])} назад`;
    } else if (diffMin > 0) {
      return `${diffMin} ${this.declension(diffMin, ['минуту', 'минуты', 'минут'])} назад`;
    } else {
      return 'только что';
    }
  }

  declension(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  highlightText(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  }

  async apiRequest(action, data = {}) {
    const url = `${this.config.API_URL}?action=${action}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: this.encodeFormData(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request error (${action}):`, error);
      throw error;
    }
  }

  encodeFormData(data) {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&');
  }

  showError(message) {
    const errorDiv = document.getElementById('forum-error');
    if (errorDiv) {
      errorDiv.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          <span>${message}</span>
        </div>
      `;
      
      setTimeout(() => {
        errorDiv.innerHTML = '';
      }, 5000);
    }
  }
}

// Создаем глобальный экземпляр
const forumManager = new ForumManager();

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
  await forumManager.init();
});

// Экспортируем для глобального использования
window.forumManager = forumManager;
