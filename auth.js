// auth.js - Система аутентификации с шифрованием
class AuthSystem {
    constructor() {
        this.usersKey = 'hegir_users';
        this.currentUserKey = 'hegir_current_user';
        this.init();
    }

    // Инициализация системы
    init() {
        if (!this.getUsers()) {
            this.saveUsers([]);
            this.createAdminUser();
        }
    }

    // Шифрование данных
    encrypt(data) {
        try {
            // Простое шифрование для демонстрации
            // В реальном проекте используйте более надежные методы
            return btoa(encodeURIComponent(JSON.stringify(data)));
        } catch (error) {
            console.error('Encryption error:', error);
            return null;
        }
    }

    // Дешифрование данных
    decrypt(encryptedData) {
        try {
            const decrypted = decodeURIComponent(atob(encryptedData));
            return JSON.parse(decrypted);
        } catch (error) {
            console.error('Decryption error:', error);
            return null;
        }
    }

    // Хеширование пароля
    hashPassword(password) {
        // Простое хеширование для демонстрации
        // В реальном проекте используйте bcrypt или подобное
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
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

    // Создание пользователя-администратора по умолчанию
    createAdminUser() {
        const adminUser = {
            id: 1,
            username: 'admin',
            email: 'admin@hegir.ru',
            password: this.hashPassword('admin123'),
            firstName: 'Администратор',
            lastName: 'Hegir',
            phone: '+7 (999) 000-00-00',
            role: 'admin',
            createdAt: new Date().toISOString(),
            isActive: true
        };

        const users = this.getUsers() || [];
        users.push(adminUser);
        this.saveUsers(users);
    }

    // Регистрация нового пользователя
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
            isActive: true,
            cart: [],
            orders: [],
            addresses: []
        };

        users.push(newUser);
        const saved = this.saveUsers(users);
        
        if (saved) {
            this.setCurrentUser(newUser);
            return {
                success: true,
                user: newUser,
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
            user.isActive
        );
        
        if (user) {
            this.setCurrentUser(user);
            return {
                success: true,
                user: user,
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
    setCurrentUser(user) {
        const userData = {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            role: user.role,
            cart: user.cart || []
        };
        
        localStorage.setItem(this.currentUserKey, JSON.stringify(userData));
        return userData;
    }

    // Получение текущего пользователя
    getCurrentUser() {
        const userData = localStorage.getItem(this.currentUserKey);
        return userData ? JSON.parse(userData) : null;
    }

    // Выход пользователя
    logout() {
        localStorage.removeItem(this.currentUserKey);
        return {
            success: true,
            message: 'Выход выполнен успешно'
        };
    }

    // Обновление данных пользователя
    updateUser(userId, updates) {
        const users = this.getUsers() || [];
        const userIndex = users.findIndex(user => user.id === userId);
        
        if (userIndex === -1) {
            return {
                success: false,
                message: 'Пользователь не найден'
            };
        }

        // Обновляем данные
        users[userIndex] = { ...users[userIndex], ...updates };
        
        // Если обновляем пароль, хешируем его
        if (updates.password) {
            users[userIndex].password = this.hashPassword(updates.password);
        }

        const saved = this.saveUsers(users);
        
        if (saved) {
            // Обновляем текущую сессию если это текущий пользователь
            const currentUser = this.getCurrentUser();
            if (currentUser && currentUser.id === userId) {
                this.setCurrentUser(users[userIndex]);
            }
            
            return {
                success: true,
                user: users[userIndex],
                message: 'Данные обновлены'
            };
        } else {
            return {
                success: false,
                message: 'Ошибка сохранения данных'
            };
        }
    }

    // Удаление пользователя (администратор)
    deleteUser(userId) {
        const currentUser = this.getCurrentUser();
        if (!currentUser || currentUser.role !== 'admin') {
            return {
                success: false,
                message: 'Недостаточно прав'
            };
        }

        const users = this.getUsers() || [];
        const filteredUsers = users.filter(user => user.id !== userId);
        
        const saved = this.saveUsers(filteredUsers);
        
        if (saved) {
            return {
                success: true,
                message: 'Пользователь удален'
            };
        } else {
            return {
                success: false,
                message: 'Ошибка удаления пользователя'
            };
        }
    }

    // Получение всех пользователей (администратор)
    getAllUsers() {
        const currentUser = this.getCurrentUser();
        if (!currentUser || currentUser.role !== 'admin') {
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
                isActive: user.isActive,
                ordersCount: user.orders ? user.orders.length : 0
            }))
        };
    }

    // Проверка роли администратора
    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    }

    // Добавление товара в корзину пользователя
    addToCart(productId, quantity = 1) {
        const user = this.getCurrentUser();
        if (!user) return false;

        const users = this.getUsers() || [];
        const userIndex = users.findIndex(u => u.id === user.id);
        
        if (userIndex === -1) return false;

        // Инициализируем корзину если её нет
        if (!users[userIndex].cart) {
            users[userIndex].cart = [];
        }

        // Проверяем, есть ли товар уже в корзине
        const existingItemIndex = users[userIndex].cart.findIndex(item => item.id === productId);
        
        if (existingItemIndex !== -1) {
            // Обновляем количество
            users[userIndex].cart[existingItemIndex].quantity += quantity;
        } else {
            // Добавляем новый товар
            users[userIndex].cart.push({
                id: productId,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }

        this.saveUsers(users);
        
        // Обновляем текущую сессию
        const updatedUser = users[userIndex];
        this.setCurrentUser(updatedUser);
        
        return true;
    }

    // Очистка корзины
    clearCart() {
        const user = this.getCurrentUser();
        if (!user) return false;

        const users = this.getUsers() || [];
        const userIndex = users.findIndex(u => u.id === user.id);
        
        if (userIndex === -1) return false;

        users[userIndex].cart = [];
        this.saveUsers(users);
        
        // Обновляем текущую сессию
        const updatedUser = users[userIndex];
        this.setCurrentUser(updatedUser);
        
        return true;
    }
}

// Создаем глобальный экземпляр
const auth = new AuthSystem();
