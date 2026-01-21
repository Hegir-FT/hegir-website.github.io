// auth.js - Расширенная система аутентификации с ролями
class AuthSystem {
    constructor() {
        this.usersKey = 'hegir_users_encrypted';
        this.forumDataKey = 'hegir_forum_data';
        this.currentUserKey = 'hegir_current_user';
        this.sessionsKey = 'hegir_sessions';
        this.init();
    }

    // Инициализация системы
    init() {
        if (!this.getUsers()) {
            this.saveUsers([]);
            this.createDefaultUsers();
        }
        
        if (!this.getForumData()) {
            this.saveForumData({
                categories: [],
                topics: [],
                posts: [],
                reports: [],
                bans: []
            });
        }
        
        if (!localStorage.getItem(this.sessionsKey)) {
            localStorage.setItem(this.sessionsKey, JSON.stringify([]));
        }
    }

    // Расширенное шифрование данных
    encrypt(data, key = 'hegir-secret-key') {
        try {
            const text = JSON.stringify(data);
            let result = '';
            for (let i = 0; i < text.length; i++) {
                const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
                result += String.fromCharCode(charCode);
            }
            return btoa(result);
        } catch (error) {
            console.error('Encryption error:', error);
            return null;
        }
    }

    // Дешифрование данных
    decrypt(encryptedData, key = 'hegir-secret-key') {
        try {
            const decoded = atob(encryptedData);
            let result = '';
            for (let i = 0; i < decoded.length; i++) {
                const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
                result += String.fromCharCode(charCode);
            }
            return JSON.parse(result);
        } catch (error) {
            console.error('Decryption error:', error);
            return null;
        }
    }

    // Хеширование пароля с солью
    hashPassword(password, salt = 'hegir-salt-2023') {
        const str = password + salt;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        // Добавляем дополнительный хеш для сложности
        const timestamp = Date.now().toString();
        let finalHash = '';
        for (let i = 0; i < timestamp.length; i++) {
            finalHash += (hash ^ timestamp.charCodeAt(i)).toString(16);
        }
        return finalHash.slice(0, 32);
    }

    // Создание сессии
    createSession(user) {
        const sessionId = this.generateSessionId();
        const session = {
            id: sessionId,
            userId: user.id,
            username: user.username,
            role: user.role,
            createdAt: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            ip: 'localhost', // В реальном приложении получаем IP
            userAgent: navigator.userAgent,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 дней
        };

        const sessions = JSON.parse(localStorage.getItem(this.sessionsKey)) || [];
        sessions.push(session);
        localStorage.setItem(this.sessionsKey, JSON.stringify(sessions));

        // Устанавливаем cookie с sessionId
        document.cookie = `hegir_session=${sessionId}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;

        return sessionId;
    }

    // Генерация ID сессии
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Валидация сессии
    validateSession(sessionId) {
        const sessions = JSON.parse(localStorage.getItem(this.sessionsKey)) || [];
        const session = sessions.find(s => s.id === sessionId);
        
        if (!session) return false;
        
        // Проверяем срок действия
        if (new Date(session.expiresAt) < new Date()) {
            this.removeSession(sessionId);
            return false;
        }
        
        // Обновляем время последней активности
        session.lastActivity = new Date().toISOString();
        localStorage.setItem(this.sessionsKey, JSON.stringify(sessions));
        
        return session;
    }

    // Удаление сессии
    removeSession(sessionId) {
        const sessions = JSON.parse(localStorage.getItem(this.sessionsKey)) || [];
        const filteredSessions = sessions.filter(s => s.id !== sessionId);
        localStorage.setItem(this.sessionsKey, JSON.stringify(filteredSessions));
        
        // Удаляем cookie
        document.cookie = `hegir_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }

    // Создание пользователей по умолчанию
    createDefaultUsers() {
        const defaultUsers = [
            {
                id: 1,
                username: 'admin',
                email: 'admin@hegir.ru',
                password: this.hashPassword('admin123'),
                firstName: 'Администратор',
                lastName: 'Hegir',
                phone: '+7 (999) 000-00-00',
                role: 'admin',
                createdAt: new Date().toISOString(),
                lastLogin: null,
                isActive: true,
                avatar: null,
                signature: 'Главный администратор форума',
                reputation: 1000,
                postsCount: 0,
                isBanned: false,
                banReason: null,
                banExpires: null
            },
            {
                id: 2,
                username: 'moderator',
                email: 'moderator@hegir.ru',
                password: this.hashPassword('mod123'),
                firstName: 'Модератор',
                lastName: 'Hegir',
                phone: '+7 (999) 000-00-01',
                role: 'moderator',
                createdAt: new Date().toISOString(),
                lastLogin: null,
                isActive: true,
                avatar: null,
                signature: 'Модератор форума',
                reputation: 500,
                postsCount: 0,
                isBanned: false,
                banReason: null,
                banExpires: null
            },
            {
                id: 3,
                username: 'user',
                email: 'user@hegir.ru',
                password: this.hashPassword('user123'),
                firstName: 'Пользователь',
                lastName: 'Тестовый',
                phone: '+7 (999) 000-00-02',
                role: 'user',
                createdAt: new Date().toISOString(),
                lastLogin: null,
                isActive: true,
                avatar: null,
                signature: 'Новый пользователь',
                reputation: 10,
                postsCount: 0,
                isBanned: false,
                banReason: null,
                banExpires: null
            }
        ];

        this.saveUsers(defaultUsers);
    }

    // Получение пользователей
    getUsers() {
        const encrypted = localStorage.getItem(this.usersKey);
        if (!encrypted) return null;
        return this.decrypt(encrypted);
    }

    // Сохранение пользователей
    saveUsers(users) {
        const encrypted = this.encrypt(users);
        if (encrypted) {
            localStorage.setItem(this.usersKey, encrypted);
            return true;
        }
        return false;
    }

    // Получение данных форума
    getForumData() {
        const data = localStorage.getItem(this.forumDataKey);
        if (!data) return null;
        return JSON.parse(data);
    }

    // Сохранение данных форума
    saveForumData(data) {
        localStorage.setItem(this.forumDataKey, JSON.stringify(data));
        return true;
    }

    // Регистрация пользователя
    register(userData) {
        const users = this.getUsers() || [];
        
        // Проверка на существующего пользователя
        const existingUser = users.find(user => 
            user.email === userData.email || user.username === userData.username
        );
        
        if (existingUser) {
            return {
                success: false,
                message: 'Пользователь с таким email или именем уже существует'
            };
        }

        const newUser = {
            id: Date.now(),
            username: userData.username,
            email: userData.email,
            password: this.hashPassword(userData.password),
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            phone: userData.phone || '',
            role: 'user',
            createdAt: new Date().toISOString(),
            lastLogin: null,
            isActive: true,
            avatar: userData.avatar || null,
            signature: userData.signature || 'Новый участник форума',
            reputation: 10,
            postsCount: 0,
            isBanned: false,
            banReason: null,
            banExpires: null,
            notifications: [],
            messages: [],
            subscribedTopics: [],
            ignoreList: []
        };

        users.push(newUser);
        const saved = this.saveUsers(users);
        
        if (saved) {
            const sessionId = this.createSession(newUser);
            this.setCurrentUser(newUser, sessionId);
            
            return {
                success: true,
                user: newUser,
                sessionId: sessionId,
                message: 'Регистрация успешна'
            };
        } else {
            return {
                success: false,
                message: 'Ошибка сохранения пользователя'
            };
        }
    }

    // Вход пользователя
    login(credentials) {
        const users = this.getUsers() || [];
        const hashedPassword = this.hashPassword(credentials.password);
        
        const user = users.find(user => 
            (user.email === credentials.email || user.username === credentials.email) &&
            user.password === hashedPassword &&
            user.isActive &&
            !user.isBanned
        );
        
        if (user) {
            // Обновляем время последнего входа
            user.lastLogin = new Date().toISOString();
            this.saveUsers(users);
            
            const sessionId = this.createSession(user);
            this.setCurrentUser(user, sessionId);
            
            return {
                success: true,
                user: user,
                sessionId: sessionId,
                message: 'Вход выполнен успешно'
            };
        } else {
            return {
                success: false,
                message: 'Неверный email/имя пользователя или пароль'
            };
        }
    }

    // Установка текущего пользователя
    setCurrentUser(user, sessionId = null) {
        const userData = {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            role: user.role,
            avatar: user.avatar,
            signature: user.signature,
            reputation: user.reputation,
            postsCount: user.postsCount,
            sessionId: sessionId
        };
        
        localStorage.setItem(this.currentUserKey, JSON.stringify(userData));
        return userData;
    }

    // Получение текущего пользователя
    getCurrentUser() {
        const userData = localStorage.getItem(this.currentUserKey);
        if (!userData) return null;
        
        const parsed = JSON.parse(userData);
        
        // Проверяем валидность сессии
        if (parsed.sessionId) {
            const session = this.validateSession(parsed.sessionId);
            if (!session) {
                this.logout();
                return null;
            }
        }
        
        return parsed;
    }

    // Выход пользователя
    logout() {
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.sessionId) {
            this.removeSession(currentUser.sessionId);
        }
        localStorage.removeItem(this.currentUserKey);
        return {
            success: true,
            message: 'Выход выполнен успешно'
        };
    }

    // Проверка ролей
    hasRole(requiredRole) {
        const user = this.getCurrentUser();
        if (!user) return false;
        
        const roles = ['user', 'moderator', 'admin'];
        const userRoleIndex = roles.indexOf(user.role);
        const requiredRoleIndex = roles.indexOf(requiredRole);
        
        return userRoleIndex >= requiredRoleIndex;
    }

    isAdmin() {
        return this.hasRole('admin');
    }

    isModerator() {
        return this.hasRole('moderator');
    }

    isUser() {
        return this.hasRole('user');
    }

    // Управление пользователями (для администраторов)
    getAllUsers() {
        if (!this.isAdmin()) {
            return {
                success: false,
                message: 'Недостаточно прав'
            };
        }

        const users = this.getUsers() || [];
        return {
            success: true,
            users: users.map(user => ({
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin,
                isActive: user.isActive,
                isBanned: user.isBanned,
                banReason: user.banReason,
                banExpires: user.banExpires,
                reputation: user.reputation,
                postsCount: user.postsCount,
                signature: user.signature
            }))
        };
    }

    // Блокировка пользователя
    banUser(userId, reason, days = 7) {
        if (!this.isAdmin() && !this.isModerator()) {
            return {
                success: false,
                message: 'Недостаточно прав'
            };
        }

        const users = this.getUsers() || [];
        const userIndex = users.findIndex(user => user.id === userId);
        
        if (userIndex === -1) {
            return {
                success: false,
                message: 'Пользователь не найден'
            };
        }

        const moderator = this.getCurrentUser();
        users[userIndex].isBanned = true;
        users[userIndex].banReason = reason;
        users[userIndex].banExpires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
        
        // Записываем в историю банов
        const forumData = this.getForumData();
        forumData.bans.push({
            id: Date.now(),
            userId: userId,
            moderatorId: moderator.id,
            reason: reason,
            expiresAt: users[userIndex].banExpires,
            createdAt: new Date().toISOString()
        });
        this.saveForumData(forumData);

        const saved = this.saveUsers(users);
        
        if (saved) {
            return {
                success: true,
                message: 'Пользователь заблокирован'
            };
        } else {
            return {
                success: false,
                message: 'Ошибка блокировки пользователя'
            };
        }
    }

    // Разблокировка пользователя
    unbanUser(userId) {
        if (!this.isAdmin() && !this.isModerator()) {
            return {
                success: false,
                message: 'Недостаточно прав'
            };
        }

        const users = this.getUsers() || [];
        const userIndex = users.findIndex(user => user.id === userId);
        
        if (userIndex === -1) {
            return {
                success: false,
                message: 'Пользователь не найден'
            };
        }

        users[userIndex].isBanned = false;
        users[userIndex].banReason = null;
        users[userIndex].banExpires = null;

        const saved = this.saveUsers(users);
        
        if (saved) {
            return {
                success: true,
                message: 'Пользователь разблокирован'
            };
        } else {
            return {
                success: false,
                message: 'Ошибка разблокировки пользователя'
            };
        }
    }

    // Изменение роли пользователя
    changeUserRole(userId, newRole) {
        if (!this.isAdmin()) {
            return {
                success: false,
                message: 'Только администратор может изменять роли'
            };
        }

        const users = this.getUsers() || [];
        const userIndex = users.findIndex(user => user.id === userId);
        
        if (userIndex === -1) {
            return {
                success: false,
                message: 'Пользователь не найден'
            };
        }

        users[userIndex].role = newRole;
        const saved = this.saveUsers(users);
        
        if (saved) {
            return {
                success: true,
                message: `Роль пользователя изменена на ${newRole}`
            };
        } else {
            return {
                success: false,
                message: 'Ошибка изменения роли'
            };
        }
    }

    // Получение статистики пользователя
    getUserStats(userId) {
        const user = this.getUsers().find(u => u.id === userId);
        const forumData = this.getForumData();
        
        if (!user) {
            return null;
        }

        const userTopics = forumData.topics.filter(t => t.authorId === userId);
        const userPosts = forumData.posts.filter(p => p.authorId === userId);
        
        return {
            user: {
                username: user.username,
                role: user.role,
                reputation: user.reputation,
                postsCount: user.postsCount,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            },
            stats: {
                topicsCount: userTopics.length,
                postsCount: userPosts.length,
                totalLikes: userPosts.reduce((sum, post) => sum + (post.likes || 0), 0),
                totalViews: userTopics.reduce((sum, topic) => sum + (topic.views || 0), 0),
                averagePostsPerDay: this.calculateAveragePosts(userPosts)
            },
            recentActivity: userPosts
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 10)
        };
    }

    calculateAveragePosts(posts) {
        if (posts.length === 0) return 0;
        
        const firstPostDate = new Date(posts[posts.length - 1].createdAt);
        const lastPostDate = new Date(posts[0].createdAt);
        const daysDiff = Math.max(1, (lastPostDate - firstPostDate) / (1000 * 60 * 60 * 24));
        
        return (posts.length / daysDiff).toFixed(2);
    }
}

// Создаем глобальный экземпляр
const auth = new AuthSystem();
