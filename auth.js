// auth.js - Управление авторизацией на всем сайте Hegir
// Подключите этот файл на всех страницах

const AUTH_CONFIG = {
  // ВАЖНО: Замените на URL вашего Google Apps Script
  API_URL: 'https://script.google.com/macros/s/AKfycbxUIeT7tmBw7wSLLeWHGH1Maj34C22pzL3gJA5Mq44LKPzxFYE3w8h_PvAOFl0vPLpP/exec',
  
  // Ключи localStorage
  STORAGE_KEYS: {
    USER: 'hegir_user',
    SESSION: 'hegir_session',
    THEME: 'hegir_theme'
  },
  
  // Сообщения
  MESSAGES: {
    LOGIN_SUCCESS: 'Вход выполнен успешно!',
    LOGIN_ERROR: 'Неверный email или пароль',
    REGISTER_SUCCESS: 'Регистрация успешна!',
    REGISTER_ERROR: 'Ошибка регистрации',
    LOGOUT_SUCCESS: 'Вы вышли из системы',
    SESSION_EXPIRED: 'Сессия истекла. Пожалуйста, войдите снова.',
    CONNECTION_ERROR: 'Ошибка соединения с сервером'
  }
};

class AuthManager {
  constructor() {
    this.user = null;
    this.session = null;
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;
    
    try {
      // Загружаем данные из localStorage
      this.loadFromStorage();
      
      // Проверяем сессию, если пользователь есть
      if (this.user && this.session) {
        const isValid = await this.validateSession();
        if (!isValid) {
          this.logout();
          this.showNotification(AUTH_CONFIG.MESSAGES.SESSION_EXPIRED, 'warning');
        }
      }
      
      this.isInitialized = true;
      console.log('AuthManager initialized');
    } catch (error) {
      console.error('AuthManager init error:', error);
    }
  }

  loadFromStorage() {
    try {
      const userData = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.USER);
      const sessionData = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.SESSION);
      
      if (userData) {
        this.user = JSON.parse(userData);
      }
      
      if (sessionData) {
        this.session = JSON.parse(sessionData);
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
      this.clearStorage();
    }
  }

  saveToStorage() {
    try {
      if (this.user) {
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.USER, JSON.stringify(this.user));
      }
      
      if (this.session) {
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.SESSION, JSON.stringify(this.session));
      }
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  clearStorage() {
    try {
      localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.USER);
      localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.SESSION);
      this.user = null;
      this.session = null;
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  async login(email, password, rememberMe = false) {
    try {
      const response = await this.apiRequest('login', {
        email: email,
        password: password
      });

      if (response.success) {
        this.user = response.data.user;
        this.session = response.data.session;
        this.saveToStorage();
        
        if (rememberMe) {
          this.setRememberMe(email);
        }
        
        return {
          success: true,
          message: AUTH_CONFIG.MESSAGES.LOGIN_SUCCESS,
          user: this.user
        };
      } else {
        return {
          success: false,
          message: response.message || AUTH_CONFIG.MESSAGES.LOGIN_ERROR
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: AUTH_CONFIG.MESSAGES.CONNECTION_ERROR
      };
    }
  }

  async register(name, email, password) {
    try {
      const response = await this.apiRequest('register', {
        name: name,
        email: email,
        password: password
      });

      if (response.success) {
        this.user = response.data.user;
        this.session = response.data.session;
        this.saveToStorage();
        
        return {
          success: true,
          message: AUTH_CONFIG.MESSAGES.REGISTER_SUCCESS,
          user: this.user
        };
      } else {
        return {
          success: false,
          message: response.message || AUTH_CONFIG.MESSAGES.REGISTER_ERROR
        };
      }
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: AUTH_CONFIG.MESSAGES.CONNECTION_ERROR
      };
    }
  }

  async logout() {
    if (this.session) {
      try {
        await this.apiRequest('logout', {
          token: this.session,
          userId: this.user?.id
        });
      } catch (error) {
        console.error('Logout API error:', error);
      }
    }
    
    this.clearStorage();
    this.clearRememberMe();
    
    return {
      success: true,
      message: AUTH_CONFIG.MESSAGES.LOGOUT_SUCCESS
    };
  }

  async validateSession() {
    if (!this.user || !this.session) return false;
    
    try {
      const response = await this.apiRequest('check_auth', {
        token: this.session,
        userId: this.user.id
      });
      
      return response.success && response.authenticated;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }

  isAuthenticated() {
    return !!this.user && !!this.session;
  }

  getUser() {
    return this.user;
  }

  getSession() {
    return this.session;
  }

  async apiRequest(action, data = {}) {
    const url = `${AUTH_CONFIG.API_URL}?action=${action}`;
    
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

  setRememberMe(email) {
    try {
      // Используем cookies для запоминания на 30 дней
      const date = new Date();
      date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
      const expires = "expires=" + date.toUTCString();
      document.cookie = `hegir_remember_email=${email}; ${expires}; path=/`;
    } catch (error) {
      console.error('Error setting remember me:', error);
    }
  }

  clearRememberMe() {
    document.cookie = 'hegir_remember_email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  getRememberedEmail() {
    const name = 'hegir_remember_email=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `auth-notification auth-notification-${type}`;
    notification.innerHTML = `
      <div class="auth-notification-content">
        <i class="fas fa-${this.getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="auth-notification-close">&times;</button>
      </div>
    `;
    
    // Стили
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      background: ${this.getNotificationColor(type)};
      color: white;
      z-index: 9999;
      min-width: 300px;
      max-width: 400px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      transform: translateX(120%);
      transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Кнопка закрытия
    notification.querySelector('.auth-notification-close').addEventListener('click', () => {
      this.hideNotification(notification);
    });
    
    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
      this.hideNotification(notification);
    }, 5000);
  }

  hideNotification(notification) {
    notification.style.transform = 'translateX(120%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  getNotificationIcon(type) {
    switch (type) {
      case 'success': return 'check-circle';
      case 'error': return 'exclamation-circle';
      case 'warning': return 'exclamation-triangle';
      default: return 'info-circle';
    }
  }

  getNotificationColor(type) {
    switch (type) {
      case 'success': return '#00CC88';
      case 'error': return '#FF4444';
      case 'warning': return '#FF9500';
      default: return '#0066FF';
    }
  }
}

// Создаем глобальный экземпляр
const hegirAuth = new AuthManager();

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
  await hegirAuth.init();
  updateAuthUI();
});

// Функция для обновления UI на основе состояния авторизации
function updateAuthUI() {
  // Обновляем кнопки авторизации
  const authButtons = document.getElementById('auth-buttons');
  if (authButtons) {
    if (hegirAuth.isAuthenticated()) {
      const user = hegirAuth.getUser();
      authButtons.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.8rem;">
          <div class="user-avatar" title="${user.name}">
            ${user.name.charAt(0).toUpperCase()}
          </div>
          <div class="user-name">${user.name}</div>
          <button class="logout-btn" onclick="hegirAuth.logout().then(() => window.location.reload())">
            <i class="fas fa-sign-out-alt"></i>
          </button>
        </div>
      `;
    } else {
      authButtons.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
          <a href="login.html" class="login-btn">
            <i class="fas fa-sign-in-alt"></i>
            <span>Войти</span>
          </a>
          <a href="register.html" class="register-btn">
            <i class="fas fa-user-plus"></i>
            <span>Регистрация</span>
          </a>
        </div>
      `;
    }
  }
  
  // Показываем/скрываем элементы для авторизованных пользователей
  document.querySelectorAll('.auth-only').forEach(el => {
    el.style.display = hegirAuth.isAuthenticated() ? 'block' : 'none';
  });
  
  document.querySelectorAll('.guest-only').forEach(el => {
    el.style.display = hegirAuth.isAuthenticated() ? 'none' : 'block';
  });
}

// Экспортируем для глобального использования
window.hegirAuth = hegirAuth;
window.updateAuthUI = updateAuthUI;
