// forum.js - Полнофункциональная система форума
class ForumSystem {
    constructor() {
        this.dataKey = 'hegir_forum_data';
        this.init();
    }

    // Инициализация форума
    init() {
        let data = this.getData();
        
        if (!data || !data.categories || data.categories.length === 0) {
            data = {
                categories: this.createDefaultCategories(),
                topics: [],
                posts: [],
                reports: [],
                bans: [],
                settings: {
                    postsPerPage: 20,
                    topicsPerPage: 50,
                    allowNewUsers: true,
                    requireEmailVerification: false,
                    maxAttachmentSize: 5242880, // 5MB
                    allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'txt'],
                    maxSignatureLength: 255,
                    floodControl: 30 // секунд между сообщениями
                }
            };
            this.saveData(data);
        }
    }

    // Создание категорий по умолчанию
    createDefaultCategories() {
        return [
            {
                id: 1,
                name: 'Процессоры PENISA',
                slug: 'processors',
                description: 'Обсуждение процессоров Hegir PENISA',
                icon: 'fas fa-microchip',
                color: '#FF9500',
                order: 1,
                isActive: true,
                access: 'all', // all, registered, moderators
                topicsCount: 0,
                postsCount: 0,
                lastTopic: null,
                createdAt: new Date().toISOString(),
                moderators: []
            },
            {
                id: 2,
                name: 'Видеокарты NEXUS',
                slug: 'graphics',
                description: 'Обсуждение видеокарт Hegir NEXUS',
                icon: 'fas fa-project-diagram',
                color: '#0066FF',
                order: 2,
                isActive: true,
                access: 'all',
                topicsCount: 0,
                postsCount: 0,
                lastTopic: null,
                createdAt: new Date().toISOString(),
                moderators: []
            },
            {
                id: 3,
                name: 'Ноутбуки SEVERITY',
                slug: 'laptops',
                description: 'Обсуждение ноутбуков Hegir SEVERITY',
                icon: 'fas fa-laptop',
                color: '#00CC88',
                order: 3,
                isActive: true,
                access: 'all',
                topicsCount: 0,
                postsCount: 0,
                lastTopic: null,
                createdAt: new Date().toISOString(),
                moderators: []
            },
            {
                id: 4,
                name: 'Смартфоны PHTALEX',
                slug: 'smartphones',
                description: 'Обсуждение смартфонов Hegir PHTALEX',
                icon: 'fas fa-mobile-alt',
                color: '#7B2CBF',
                order: 4,
                isActive: true,
                access: 'all',
                topicsCount: 0,
                postsCount: 0,
                lastTopic: null,
                createdAt: new Date().toISOString(),
                moderators: []
            },
            {
                id: 5,
                name: 'VR очки FLUX',
                slug: 'vr',
                description: 'Обсуждение VR очков Hegir FLUX',
                icon: 'fas fa-vr-cardboard',
                color: '#00D1FF',
                order: 5,
                isActive: true,
                access: 'all',
                topicsCount: 0,
                postsCount: 0,
                lastTopic: null,
                createdAt: new Date().toISOString(),
                moderators: []
            },
            {
                id: 6,
                name: 'Техподдержка',
                slug: 'support',
                description: 'Техническая поддержка продукции Hegir',
                icon: 'fas fa-headset',
                color: '#FF4444',
                order: 6,
                isActive: true,
                access: 'all',
                topicsCount: 0,
                postsCount: 0,
                lastTopic: null,
                createdAt: new Date().toISOString(),
                moderators: []
            },
            {
                id: 7,
                name: 'Гайды и инструкции',
                slug: 'guides',
                description: 'Руководства и инструкции по продукции Hegir',
                icon: 'fas fa-book',
                color: '#FF9500',
                order: 7,
                isActive: true,
                access: 'all',
                topicsCount: 0,
                postsCount: 0,
                lastTopic: null,
                createdAt: new Date().toISOString(),
                moderators: []
            },
            {
                id: 8,
                name: 'Оффтоп',
                slug: 'offtopic',
                description: 'Обсуждение на свободные темы',
                icon: 'fas fa-users',
                color: '#9B59B6',
                order: 8,
                isActive: true,
                access: 'registered',
                topicsCount: 0,
                postsCount: 0,
                lastTopic: null,
                createdAt: new Date().toISOString(),
                moderators: []
            },
            {
                id: 9,
                name: 'Модераторский',
                slug: 'moderators',
                description: 'Обсуждения для модераторов',
                icon: 'fas fa-shield-alt',
                color: '#2ECC71',
                order: 9,
                isActive: true,
                access: 'moderators',
                topicsCount: 0,
                postsCount: 0,
                lastTopic: null,
                createdAt: new Date().toISOString(),
                moderators: []
            }
        ];
    }

    // Получение данных
    getData() {
        const data = localStorage.getItem(this.dataKey);
        return data ? JSON.parse(data) : null;
    }

    // Сохранение данных
    saveData(data) {
        localStorage.setItem(this.dataKey, JSON.stringify(data));
        return true;
    }

    // Создание темы
    createTopic(topicData) {
        const currentUser = auth.getCurrentUser();
        if (!currentUser) {
            return {
                success: false,
                message: 'Требуется авторизация'
            };
        }

        // Проверяем блокировку пользователя
        const users = auth.getUsers() || [];
        const user = users.find(u => u.id === currentUser.id);
        if (user.isBanned) {
            return {
                success: false,
                message: 'Ваш аккаунт заблокирован'
            };
        }

        const data = this.getData();
        const category = data.categories.find(c => c.id === topicData.categoryId);
        
        if (!category) {
            return {
                success: false,
                message: 'Категория не найдена'
            };
        }

        // Проверяем доступ к категории
        if (category.access === 'moderators' && !auth.isModerator()) {
            return {
                success: false,
                message: 'Недостаточно прав для создания тем в этой категории'
            };
        }

        if (category.access === 'registered' && !currentUser) {
            return {
                success: false,
                message: 'Требуется регистрация для создания тем в этой категории'
            };
        }

        // Проверяем флуд-контроль
        const userTopics = data.topics.filter(t => t.authorId === currentUser.id);
        const lastTopic = userTopics.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        
        if (lastTopic) {
            const timeDiff = (new Date() - new Date(lastTopic.createdAt)) / 1000;
            if (timeDiff < data.settings.floodControl) {
                return {
                    success: false,
                    message: `Подождите ${Math.ceil(data.settings.floodControl - timeDiff)} секунд перед созданием новой темы`
                };
            }
        }

        const newTopic = {
            id: Date.now(),
            categoryId: topicData.categoryId,
            authorId: currentUser.id,
            title: topicData.title,
            content: topicData.content,
            tags: topicData.tags || [],
            isPinned: false,
            isLocked: false,
            isSticky: false,
            views: 0,
            likes: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastPostId: null,
            postCount: 0
        };

        data.topics.push(newTopic);
        
        // Обновляем статистику категории
        category.topicsCount++;
        category.lastTopic = {
            id: newTopic.id,
            title: newTopic.title,
            authorId: currentUser.id,
            authorName: currentUser.username,
            updatedAt: newTopic.updatedAt
        };

        // Обновляем статистику пользователя
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].postsCount++;
            auth.saveUsers(users);
        }

        this.saveData(data);

        return {
            success: true,
            topic: newTopic,
            message: 'Тема успешно создана'
        };
    }

    // Создание сообщения
    createPost(postData) {
        const currentUser = auth.getCurrentUser();
        if (!currentUser) {
            return {
                success: false,
                message: 'Требуется авторизация'
            };
        }

        // Проверяем блокировку пользователя
        const users = auth.getUsers() || [];
        const user = users.find(u => u.id === currentUser.id);
        if (user.isBanned) {
            return {
                success: false,
                message: 'Ваш аккаунт заблокирован'
            };
        }

        const data = this.getData();
        const topic = data.topics.find(t => t.id === postData.topicId);
        
        if (!topic) {
            return {
                success: false,
                message: 'Тема не найдена'
            };
        }

        // Проверяем, не закрыта ли тема
        if (topic.isLocked && !auth.isModerator()) {
            return {
                success: false,
                message: 'Тема закрыта для новых сообщений'
            };
        }

        // Проверяем флуд-контроль
        const userPosts = data.posts.filter(p => p.authorId === currentUser.id);
        const lastPost = userPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        
        if (lastPost) {
            const timeDiff = (new Date() - new Date(lastPost.createdAt)) / 1000;
            if (timeDiff < data.settings.floodControl) {
                return {
                    success: false,
                    message: `Подождите ${Math.ceil(data.settings.floodControl - timeDiff)} секунд перед отправкой нового сообщения`
                };
            }
        }

        const newPost = {
            id: Date.now(),
            topicId: postData.topicId,
            authorId: currentUser.id,
            content: postData.content,
            parentId: postData.parentId || null,
            isEdited: false,
            editReason: null,
            editedAt: null,
            likes: 0,
            dislikes: 0,
            reports: 0,
            createdAt: new Date().toISOString(),
            attachments: postData.attachments || []
        };

        data.posts.push(newPost);
        
        // Обновляем тему
        topic.postCount++;
        topic.updatedAt = new Date().toISOString();
        topic.lastPostId = newPost.id;
        
        // Обновляем статистику категории
        const category = data.categories.find(c => c.id === topic.categoryId);
        if (category) {
            category.postsCount++;
            category.lastTopic = {
                id: topic.id,
                title: topic.title,
                authorId: currentUser.id,
                authorName: currentUser.username,
                updatedAt: topic.updatedAt
            };
        }

        // Обновляем статистику пользователя
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].postsCount++;
            auth.saveUsers(users);
        }

        this.saveData(data);

        return {
            success: true,
            post: newPost,
            message: 'Сообщение отправлено'
        };
    }

    // Получение тем
    getTopics(options = {}) {
        const data = this.getData();
        let topics = [...data.topics];

        // Фильтрация по категории
        if (options.categoryId) {
            topics = topics.filter(t => t.categoryId === options.categoryId);
        }

        // Фильтрация по автору
        if (options.authorId) {
            topics = topics.filter(t => t.authorId === options.authorId);
        }

        // Фильтрация по статусу
        if (options.status === 'pinned') {
            topics = topics.filter(t => t.isPinned);
        } else if (options.status === 'locked') {
            topics = topics.filter(t => t.isLocked);
        }

        // Поиск
        if (options.search) {
            const searchTerm = options.search.toLowerCase();
            topics = topics.filter(t => 
                t.title.toLowerCase().includes(searchTerm) ||
                t.content.toLowerCase().includes(searchTerm) ||
                t.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }

        // Сортировка
        const sortBy = options.sortBy || 'updatedAt';
        const sortOrder = options.sortOrder || 'desc';
        
        topics.sort((a, b) => {
            if (sortOrder === 'asc') {
                return new Date(a[sortBy]) - new Date(b[sortBy]);
            } else {
                return new Date(b[sortBy]) - new Date(a[sortBy]);
            }
        });

        // Пагинация
        if (options.page && options.perPage) {
            const start = (options.page - 1) * options.perPage;
            const end = start + options.perPage;
            topics = topics.slice(start, end);
        }

        return topics;
    }

    // Получение сообщений темы
    getTopicPosts(topicId, options = {}) {
        const data = this.getData();
        let posts = data.posts.filter(p => p.topicId === topicId);

        // Сортировка по времени
        posts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        // Пагинация
        if (options.page && options.perPage) {
            const start = (options.page - 1) * options.perPage;
            const end = start + options.perPage;
            posts = posts.slice(start, end);
        }

        return posts;
    }

    // Получение категорий
    getCategories() {
        const data = this.getData();
        const currentUser = auth.getCurrentUser();
        
        // Фильтруем категории по правам доступа
        return data.categories.filter(category => {
            if (category.access === 'all') return true;
            if (category.access === 'registered' && currentUser) return true;
            if (category.access === 'moderators' && auth.isModerator()) return true;
            return false;
        });
    }

    // Редактирование сообщения
    editPost(postId, newContent, reason = null) {
        const currentUser = auth.getCurrentUser();
        if (!currentUser) {
            return {
                success: false,
                message: 'Требуется авторизация'
            };
        }

        const data = this.getData();
        const postIndex = data.posts.findIndex(p => p.id === postId);
        
        if (postIndex === -1) {
            return {
                success: false,
                message: 'Сообщение не найдено'
            };
        }

        const post = data.posts[postIndex];
        
        // Проверяем права: автор или модератор
        if (post.authorId !== currentUser.id && !auth.isModerator()) {
            return {
                success: false,
                message: 'Недостаточно прав для редактирования'
            };
        }

        // Сохраняем историю редактирования
        post.editHistory = post.editHistory || [];
        post.editHistory.push({
            content: post.content,
            editedAt: post.editedAt || post.createdAt,
            editedBy: post.editedBy || post.authorId,
            reason: post.editReason
        });

        post.content = newContent;
        post.isEdited = true;
        post.editReason = reason;
        post.editedAt = new Date().toISOString();
        post.editedBy = currentUser.id;

        this.saveData(data);

        return {
            success: true,
            post: post,
            message: 'Сообщение отредактировано'
        };
    }

    // Удаление сообщения
    deletePost(postId, reason = null) {
        const currentUser = auth.getCurrentUser();
        if (!currentUser) {
            return {
                success: false,
                message: 'Требуется авторизация'
            };
        }

        const data = this.getData();
        const postIndex = data.posts.findIndex(p => p.id === postId);
        
        if (postIndex === -1) {
            return {
                success: false,
                message: 'Сообщение не найдено'
            };
        }

        const post = data.posts[postIndex];
        
        // Проверяем права: автор или модератор
        if (post.authorId !== currentUser.id && !auth.isModerator()) {
            return {
                success: false,
                message: 'Недостаточно прав для удаления'
            };
        }

        // Если это первое сообщение в теме - удаляем всю тему
        const topicPosts = data.posts.filter(p => p.topicId === post.topicId);
        if (topicPosts[0].id === postId && auth.isModerator()) {
            // Удаляем всю тему
            data.topics = data.topics.filter(t => t.id !== post.topicId);
            data.posts = data.posts.filter(p => p.topicId !== post.topicId);
        } else {
            // Удаляем только сообщение
            data.posts.splice(postIndex, 1);
            
            // Обновляем статистику темы
            const topic = data.topics.find(t => t.id === post.topicId);
            if (topic) {
                topic.postCount = Math.max(0, topic.postCount - 1);
            }
        }

        // Записываем в логи удалений
        if (reason && auth.isModerator()) {
            data.deletedPosts = data.deletedPosts || [];
            data.deletedPosts.push({
                postId: postId,
                deletedBy: currentUser.id,
                reason: reason,
                deletedAt: new Date().toISOString(),
                originalContent: post.content
            });
        }

        this.saveData(data);

        return {
            success: true,
            message: 'Сообщение удалено'
        };
    }

    // Пожаловаться на сообщение
    reportPost(postId, reason) {
        const currentUser = auth.getCurrentUser();
        if (!currentUser) {
            return {
                success: false,
                message: 'Требуется авторизация'
            };
        }

        const data = this.getData();
        const post = data.posts.find(p => p.id === postId);
        
        if (!post) {
            return {
                success: false,
                message: 'Сообщение не найдено'
            };
        }

        // Проверяем, не жаловался ли уже пользователь
        const existingReport = data.reports.find(r => 
            r.postId === postId && r.reporterId === currentUser.id
        );
        
        if (existingReport) {
            return {
                success: false,
                message: 'Вы уже жаловались на это сообщение'
            };
        }

        const report = {
            id: Date.now(),
            postId: postId,
            reporterId: currentUser.id,
            reason: reason,
            status: 'pending', // pending, reviewed, resolved
            moderatorId: null,
            resolution: null,
            createdAt: new Date().toISOString(),
            resolvedAt: null
        };

        data.reports.push(report);
        post.reports = (post.reports || 0) + 1;

        this.saveData(data);

        return {
            success: true,
            message: 'Жалоба отправлена модераторам'
        };
    }

    // Лайк/дизлайк сообщения
    ratePost(postId, type) { // 'like' или 'dislike'
        const currentUser = auth.getCurrentUser();
        if (!currentUser) {
            return {
                success: false,
                message: 'Требуется авторизация'
            };
        }

        const data = this.getData();
        const postIndex = data.posts.findIndex(p => p.id === postId);
        
        if (postIndex === -1) {
            return {
                success: false,
                message: 'Сообщение не найдено'
            };
        }

        const post = data.posts[postIndex];
        
        // Проверяем, не голосовал ли уже пользователь
        post.ratings = post.ratings || [];
        const existingRating = post.ratings.find(r => r.userId === currentUser.id);
        
        if (existingRating) {
            // Если уже голосовал, удаляем старый голос
            if (existingRating.type === 'like') {
                post.likes = Math.max(0, post.likes - 1);
            } else {
                post.dislikes = Math.max(0, post.dislikes - 1);
            }
            
            const ratingIndex = post.ratings.findIndex(r => r.userId === currentUser.id);
            post.ratings.splice(ratingIndex, 1);
        }

        // Добавляем новый голос
        post.ratings.push({
            userId: currentUser.id,
            type: type,
            votedAt: new Date().toISOString()
        });

        if (type === 'like') {
            post.likes++;
        } else {
            post.dislikes++;
        }

        this.saveData(data);

        return {
            success: true,
            likes: post.likes,
            dislikes: post.dislikes,
            message: 'Голос учтен'
        };
    }

    // Закрыть/открыть тему
    toggleTopicLock(topicId, lock = true, reason = null) {
        if (!auth.isModerator()) {
            return {
                success: false,
                message: 'Недостаточно прав'
            };
        }

        const data = this.getData();
        const topic = data.topics.find(t => t.id === topicId);
        
        if (!topic) {
            return {
                success: false,
                message: 'Тема не найдена'
            };
        }

        topic.isLocked = lock;
        
        // Если закрываем тему, добавляем сообщение о закрытии
        if (lock) {
            const moderator = auth.getCurrentUser();
            const lockPost = {
                id: Date.now(),
                topicId: topicId,
                authorId: moderator.id,
                content: `Тема закрыта${reason ? ` по причине: ${reason}` : ''}`,
                isSystemMessage: true,
                createdAt: new Date().toISOString()
            };
            data.posts.push(lockPost);
            topic.postCount++;
        }

        this.saveData(data);

        return {
            success: true,
            message: lock ? 'Тема закрыта' : 'Тема открыта'
        };
    }

    // Закрепить тему
    toggleTopicPin(topicId, pin = true) {
        if (!auth.isModerator()) {
            return {
                success: false,
                message: 'Недостаточно прав'
            };
        }

        const data = this.getData();
        const topic = data.topics.find(t => t.id === topicId);
        
        if (!topic) {
            return {
                success: false,
                message: 'Тема не найдена'
            };
        }

        topic.isPinned = pin;
        this.saveData(data);

        return {
            success: true,
            message: pin ? 'Тема закреплена' : 'Тема откреплена'
        };
    }

    // Получить статистику форума
    getForumStats() {
        const data = this.getData();
        const users = auth.getUsers() || [];
        
        const totalTopics = data.topics.length;
        const totalPosts = data.posts.length;
        const totalUsers = users.length;
        const activeUsers = users.filter(u => !u.isBanned && u.isActive).length;
        
        // Последние зарегистрированные пользователи
        const recentUsers = users
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(u => ({
                username: u.username,
                role: u.role,
                createdAt: u.createdAt
            }));
        
        // Самые активные пользователи
        const activeUsersByPosts = [...users]
            .sort((a, b) => (b.postsCount || 0) - (a.postsCount || 0))
            .slice(0, 5)
            .map(u => ({
                username: u.username,
                postsCount: u.postsCount || 0,
                reputation: u.reputation || 0
            }));
        
        // Последние темы
        const recentTopics = [...data.topics]
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, 5)
            .map(t => ({
                id: t.id,
                title: t.title,
                authorId: t.authorId,
                postCount: t.postCount,
                updatedAt: t.updatedAt
            }));

        return {
            totalTopics,
            totalPosts,
            totalUsers,
            activeUsers,
            recentUsers,
            activeUsersByPosts,
            recentTopics,
            categories: data.categories.map(c => ({
                name: c.name,
                topicsCount: c.topicsCount,
                postsCount: c.postsCount
            }))
        };
    }

    // Получить жалобы для модераторов
    getReports(status = 'pending') {
        if (!auth.isModerator()) {
            return [];
        }

        const data = this.getData();
        let reports = data.reports.filter(r => r.status === status);
        
        // Добавляем информацию о сообщении и авторе
        reports = reports.map(report => {
            const post = data.posts.find(p => p.id === report.postId);
            const topic = post ? data.topics.find(t => t.id === post.topicId) : null;
            
            return {
                ...report,
                post: post ? {
                    content: post.content.substring(0, 200) + '...',
                    authorId: post.authorId,
                    createdAt: post.createdAt
                } : null,
                topic: topic ? {
                    id: topic.id,
                    title: topic.title
                } : null
            };
        });

        return reports;
    }

    // Обработать жалобу
    processReport(reportId, resolution, moderatorNote = null) {
        if (!auth.isModerator()) {
            return {
                success: false,
                message: 'Недостаточно прав'
            };
        }

        const data = this.getData();
        const reportIndex = data.reports.findIndex(r => r.id === reportId);
        
        if (reportIndex === -1) {
            return {
                success: false,
                message: 'Жалоба не найдена'
            };
        }

        const report = data.reports[reportIndex];
        report.status = 'resolved';
        report.resolution = resolution;
        report.moderatorId = auth.getCurrentUser().id;
        report.resolvedAt = new Date().toISOString();
        report.moderatorNote = moderatorNote;

        this.saveData(data);

        return {
            success: true,
            message: 'Жалоба обработана'
        };
    }
}

// Создаем глобальный экземпляр
const forum = new ForumSystem();
