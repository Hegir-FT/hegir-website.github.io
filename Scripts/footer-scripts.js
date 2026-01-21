// footer-scripts.js - Скрипты для работы футеров на всех страницах

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем все компоненты футеров
    initFooterComponents();
    initCookieConsent();
    initNewsletterForms();
    initScrollToTop();
    initChatWidget();
    initQuickAccessButtons();
    initCountrySelector();
    initSocialLinks();
    initCategoryLinks();
});

// Инициализация компонентов футера
function initFooterComponents() {
    console.log('Инициализация компонентов футера...');
    
    // Добавляем текущий год в копирайт
    const copyrightElements = document.querySelectorAll('.copyright p');
    const currentYear = new Date().getFullYear();
    copyrightElements.forEach(el => {
        if (el.textContent.includes('2023')) {
            el.textContent = el.textContent.replace('2023', currentYear);
        }
    });
    
    // Инициализируем плавную прокрутку для всех внутренних ссылок
    initSmoothScrolling();
    
    // Инициализируем всплывающие подсказки
    initTooltips();
}

// Плавная прокрутка
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Пропускаем якоря без идентификатора
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Обновляем URL без перезагрузки страницы
                if (href !== window.location.hash) {
                    window.history.pushState(null, null, href);
                }
            }
        });
    });
}

// Всплывающие подсказки
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[title]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const title = this.getAttribute('title');
            if (!title) return;
            
            // Создаем элемент подсказки
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = title;
            
            // Позиционируем подсказку
            const rect = this.getBoundingClientRect();
            tooltip.style.position = 'fixed';
            tooltip.style.top = (rect.top - 40) + 'px';
            tooltip.style.left = (rect.left + rect.width / 2) + 'px';
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.style.zIndex = '9999';
            
            // Стили подсказки
            tooltip.style.cssText += `
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                font-size: 0.8rem;
                white-space: nowrap;
                pointer-events: none;
                transition: opacity 0.2s ease;
            `;
            
            document.body.appendChild(tooltip);
            
            // Удаляем стандартный title
            this.removeAttribute('title');
            this.dataset.originalTitle = title;
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
            
            // Восстанавливаем title
            if (this.dataset.originalTitle) {
                this.setAttribute('title', this.dataset.originalTitle);
                delete this.dataset.originalTitle;
            }
        });
    });
}

// Cookie соглашение
function initCookieConsent() {
    const cookieConsent = document.getElementById('cookie-consent');
    if (!cookieConsent) return;
    
    // Проверяем, не было ли уже принято
    const cookiesAccepted = localStorage.getItem('hegir_cookies_accepted');
    if (cookiesAccepted) {
        cookieConsent.style.display = 'none';
        return;
    }
    
    // Показываем через 2 секунды
    setTimeout(() => {
        cookieConsent.classList.add('show');
    }, 2000);
    
    // Кнопка принятия
    const acceptBtn = document.getElementById('accept-cookies');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            acceptAllCookies();
        });
    }
    
    // Кнопка настроек
    const settingsBtn = document.getElementById('cookie-settings');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            showCookieSettings();
        });
    }
    
    // Сохранение настроек
    const saveBtn = document.getElementById('save-cookie-settings');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveCookieSettings);
    }
    
    // Отклонение всех
    const rejectBtn = document.getElementById('reject-cookies');
    if (rejectBtn) {
        rejectBtn.addEventListener('click', rejectAllCookies);
    }
}

function acceptAllCookies() {
    const settings = {
        necessary: true,
        analytics: true,
        marketing: true,
        functional: true
    };
    
    localStorage.setItem('hegir_cookies_accepted', JSON.stringify(settings));
    localStorage.setItem('hegir_cookies_timestamp', new Date().toISOString());
    
    document.getElementById('cookie-consent').classList.remove('show');
    showNotification('Настройки cookies сохранены', 'success');
    
    // Инициализируем аналитику
    initAnalytics();
}

function rejectAllCookies() {
    const settings = {
        necessary: true, // Обязательные нельзя отключить
        analytics: false,
        marketing: false,
        functional: false
    };
    
    localStorage.setItem('hegir_cookies_accepted', JSON.stringify(settings));
    localStorage.setItem('hegir_cookies_timestamp', new Date().toISOString());
    
    document.getElementById('cookie-consent').classList.remove('show');
    document.getElementById('cookie-settings-modal').style.display = 'none';
    showNotification('Настройки cookies сохранены', 'success');
}

function saveCookieSettings() {
    const settings = {
        necessary: true, // Всегда true
        analytics: document.getElementById('analytics-cookies').checked,
        marketing: document.getElementById('marketing-cookies').checked,
        functional: document.getElementById('functional-cookies').checked
    };
    
    localStorage.setItem('hegir_cookies_accepted', JSON.stringify(settings));
    localStorage.setItem('hegir_cookies_timestamp', new Date().toISOString());
    
    document.getElementById('cookie-consent').classList.remove('show');
    document.getElementById('cookie-settings-modal').style.display = 'none';
    showNotification('Настройки cookies сохранены', 'success');
    
    // Инициализируем аналитику если включена
    if (settings.analytics) {
        initAnalytics();
    }
}

function showCookieSettings() {
    const modal = document.getElementById('cookie-settings-modal');
    if (!modal) return;
    
    modal.style.display = 'flex';
    
    // Заполняем текущие настройки
    const savedSettings = JSON.parse(localStorage.getItem('hegir_cookies_accepted'));
    if (savedSettings) {
        document.getElementById('analytics-cookies').checked = savedSettings.analytics;
        document.getElementById('marketing-cookies').checked = savedSettings.marketing;
        document.getElementById('functional-cookies').checked = savedSettings.functional;
    }
    
    // Закрытие модального окна
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    modal.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    });
}

// Формы подписки на рассылку
function initNewsletterForms() {
    // Главная страница
    const mainNewsletter = document.getElementById('newsletter-submit');
    const mainEmail = document.getElementById('newsletter-email');
    
    if (mainNewsletter && mainEmail) {
        mainNewsletter.addEventListener('click', function(e) {
            e.preventDefault();
            handleNewsletterSubscription(mainEmail, 'main');
        });
        
        mainEmail.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                mainNewsletter.click();
            }
        });
    }
    
    // Страница магазина
    const storeNewsletter = document.getElementById('store-newsletter-submit');
    const storeEmail = document.getElementById('store-newsletter-email');
    
    if (storeNewsletter && storeEmail) {
        storeNewsletter.addEventListener('click', function(e) {
            e.preventDefault();
            handleNewsletterSubscription(storeEmail, 'store');
        });
        
        storeEmail.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                storeNewsletter.click();
            }
        });
    }
}

function handleNewsletterSubscription(emailInput, type = 'main') {
    const email = emailInput.value.trim();
    
    if (!email) {
        showNotification('Пожалуйста, введите ваш email адрес', 'error');
        return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNotification('Пожалуйста, введите корректный email адрес', 'error');
        return;
    }
    
    // Проверяем согласие на главной странице
    if (type === 'main') {
        const consentCheckbox = document.getElementById('newsletter-consent');
        if (consentCheckbox && !consentCheckbox.checked) {
            showNotification('Необходимо согласие на получение новостей', 'error');
            return;
        }
    }
    
    // Загружаем существующих подписчиков
    let subscribers = JSON.parse(localStorage.getItem('hegir_newsletter_subscribers')) || [];
    
    // Проверяем, не подписан ли уже этот email
    if (subscribers.find(s => s.email === email)) {
        showNotification('Этот email уже подписан на рассылку', 'warning');
        return;
    }
    
    // Добавляем нового подписчика
    const newSubscriber = {
        email: email,
        type: type,
        subscribedAt: new Date().toISOString(),
        active: true,
        source: window.location.href
    };
    
    subscribers.push(newSubscriber);
    localStorage.setItem('hegir_newsletter_subscribers', JSON.stringify(subscribers));
    
    // Показываем модальное окно
    const modalId = type === 'store' ? 'store-newsletter-modal' : 'newsletter-modal';
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        
        // Закрытие модального окна
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        });
    }
    
    // Очищаем поле ввода
    emailInput.value = '';
    
    // Отправляем событие в аналитику
    trackEvent('newsletter_subscription', { type: type });
    
    // Показываем уведомление
    showNotification('Спасибо за подписку!', 'success');
}

// Кнопка "Наверх"
function initScrollToTop() {
    const scrollBtn = document.getElementById('scroll-to-top') || document.getElementById('quick-top');
    if (!scrollBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
    
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Онлайн-чат
function initChatWidget() {
    const chatWidget = document.getElementById('chat-widget');
    const chatBtn = document.getElementById('quick-chat');
    if (!chatWidget || !chatBtn) return;
    
    // Открытие/закрытие чата
    chatBtn.addEventListener('click', function() {
        chatWidget.classList.toggle('active');
    });
    
    // Минимизация
    const minimizeBtn = chatWidget.querySelector('.chat-minimize');
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', function() {
            chatWidget.classList.remove('active');
        });
    }
    
    // Отправка сообщений
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-message');
    
    if (chatInput && sendBtn) {
        function sendMessage() {
            const text = chatInput.value.trim();
            if (!text) return;
            
            // Добавляем сообщение пользователя
            addChatMessage(text, 'user');
            
            // Очищаем поле ввода
            chatInput.value = '';
            
            // Имитируем ответ бота через 1-3 секунды
            setTimeout(() => {
                const response = generateBotResponse(text);
                addChatMessage(response, 'bot');
            }, 1000 + Math.random() * 2000);
        }
        
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Автоматические ответы бота
    function generateBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        const responses = [
            "Понял ваш вопрос. Свяжу вас с оператором.",
            "Спасибо за сообщение! Чем могу помочь?",
            "Интересующий вас товар есть в наличии. Хотите оформить заказ?",
            "Наш специалист свяжется с вами в ближайшее время.",
            "Вы можете отследить заказ по номеру на сайте 5post.ru",
            "Гарантия на все товары Hegir - 2 года.",
            "Доставка обычно занимает 1-5 рабочих дней.",
            "Да, у нас есть эта модель в разных конфигурациях.",
            "Вы можете оформить кредит или рассрочку прямо на сайте."
        ];
        
        // Ключевые слова для специальных ответов
        if (message.includes('доставк') || message.includes('достав')) {
            return "Доставка осуществляется через 5post в течение 1-5 дней. Стоимость: от 290 ₽.";
        } else if (message.includes('гаранти') || message.includes('гарант')) {
            return "Гарантия на всю продукцию Hegir - 2 года. Подробнее на странице товара.";
        } else if (message.includes('цена') || message.includes('стоимост')) {
            return "Цены указаны на страницах товаров. Есть возможность кредита и рассрочки.";
        } else if (message.includes('наличи')) {
            return "Информация о наличии отображается на странице товара. Обычно доставка 1-3 дня.";
        } else if (message.includes('заказ') || message.includes('купить')) {
            return "Чтобы оформить заказ, добавьте товар в корзину и перейдите к оформлению.";
        }
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    function addChatMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'user' ? 'Вы' : 'H';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const textElement = document.createElement('div');
        textElement.className = 'message-text';
        textElement.textContent = text;
        
        const timeElement = document.createElement('div');
        timeElement.className = 'message-time';
        timeElement.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        content.appendChild(textElement);
        content.appendChild(timeElement);
        
        messageElement.appendChild(avatar);
        messageElement.appendChild(content);
        
        messagesContainer.appendChild(messageElement);
        
        // Прокручиваем к последнему сообщению
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Кнопки быстрого доступа
function initQuickAccessButtons() {
    const quickCall = document.getElementById('quick-call');
    const quickCart = document.getElementById('quick-cart');
    
    if (quickCall) {
        quickCall.addEventListener('click', function() {
            window.location.href = 'tel:+78005553535';
        });
    }
    
    if (quickCart) {
        quickCart.addEventListener('click', function() {
            const cartModal = document.getElementById('cart-modal');
            if (cartModal) {
                cartModal.classList.add('active');
            } else {
                window.location.href = 'checkout.html';
            }
        });
    }
}

// Выбор страны/региона
function initCountrySelector() {
    const countrySelect = document.getElementById('country-select');
    const countryModal = document.getElementById('country-modal');
    const rememberCountryBtn = document.getElementById('remember-country');
    
    if (!countrySelect && !countryModal) return;
    
    // Загружаем сохраненную страну
    const savedCountry = localStorage.getItem('hegir_country') || 'ru';
    
    if (countrySelect) {
        countrySelect.value = savedCountry;
        countrySelect.addEventListener('change', function() {
            changeCountry(this.value);
        });
    }
    
    // Открытие модального окна при клике на селектор
    const countrySelector = document.querySelector('.country-selector');
    if (countrySelector) {
        countrySelector.addEventListener('click', function() {
            if (countryModal) {
                countryModal.style.display = 'flex';
                
                // Выделяем сохраненную страну
                document.querySelectorAll('.country-option').forEach(option => {
                    option.classList.remove('selected');
                    if (option.dataset.country === savedCountry) {
                        option.classList.add('selected');
                    }
                });
                
                // Выбор страны в модальном окне
                document.querySelectorAll('.country-option').forEach(option => {
                    option.addEventListener('click', function() {
                        document.querySelectorAll('.country-option').forEach(o => o.classList.remove('selected'));
                        this.classList.add('selected');
                        
                        const country = this.dataset.country;
                        changeCountry(country);
                    });
                });
                
                // Запоминание выбора
                if (rememberCountryBtn) {
                    rememberCountryBtn.addEventListener('click', function() {
                        const selected = document.querySelector('.country-option.selected');
                        if (selected) {
                            localStorage.setItem('hegir_country', selected.dataset.country);
                            showNotification('Страна сохранена', 'success');
                        }
                    });
                }
                
                // Закрытие модального окна
                countryModal.addEventListener('click', function(e) {
                    if (e.target === countryModal) {
                        countryModal.style.display = 'none';
                    }
                });
                
                countryModal.querySelectorAll('.close-modal').forEach(btn => {
                    btn.addEventListener('click', function() {
                        countryModal.style.display = 'none';
                    });
                });
            }
        });
    }
}

function changeCountry(countryCode) {
    const countryData = {
        ru: { currency: '₽', language: 'ru', name: 'Россия' },
        kz: { currency: '₸', language: 'ru', name: 'Казахстан' },
        by: { currency: 'Br', language: 'ru', name: 'Беларусь' },
        eu: { currency: '€', language: 'en', name: 'Europe' },
        us: { currency: '$', language: 'en', name: 'USA' },
        cn: { currency: '¥', language: 'zh', name: 'China' }
    };
    
    const country = countryData[countryCode];
    if (!country) return;
    
    // Обновляем валюту на странице (пример)
    updateCurrencyOnPage(country.currency);
    
    // Показываем уведомление
    showNotification(`Регион изменен на ${country.name} (${country.currency})`, 'info');
    
    // Отслеживаем событие
    trackEvent('country_change', { country: countryCode });
}

function updateCurrencyOnPage(currency) {
    // Обновляем цены на странице (простой пример)
    document.querySelectorAll('.product-price, .price').forEach(element => {
        const currentText = element.textContent;
        const numberMatch = currentText.match(/([\d\s]+)/);
        if (numberMatch) {
            const number = numberMatch[1].replace(/\s/g, '');
            element.textContent = `${parseInt(number).toLocaleString('ru-RU')} ${currency}`;
        }
    });
}

// Социальные сети
function initSocialLinks() {
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const platform = this.dataset.platform;
            const url = this.href;
            
            // Открываем в новом окне
            window.open(url, '_blank', 'noopener,noreferrer');
            
            // Отслеживаем клик
            trackEvent('social_click', { platform: platform, url: url });
            
            e.preventDefault();
        });
    });
}

// Ссылки на категории (для магазина)
function initCategoryLinks() {
    document.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const category = this.dataset.category;
            
            // Прокручиваем к соответствующей секции
            const targetSection = document.getElementById(category);
            if (targetSection) {
                e.preventDefault();
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Активируем соответствующую вкладку
                activateCategoryTab(category);
            }
            
            // Отслеживаем клик
            trackEvent('category_click', { category: category });
        });
    });
}

function activateCategoryTab(category) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.add('active');
            // Запускаем отображение товаров этой категории
            if (typeof window.displayProducts === 'function') {
                window.displayProducts(category);
            }
        } else {
            btn.classList.remove('active');
        }
    });
}

// Аналитика (базовая реализация)
function initAnalytics() {
    const settings = JSON.parse(localStorage.getItem('hegir_cookies_accepted'));
    if (!settings || !settings.analytics) return;
    
    // Собираем базовую информацию
    const analyticsData = {
        page: window.location.pathname,
        referrer: document.referrer,
        screen: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
    };
    
    // Сохраняем в localStorage
    let analyticsHistory = JSON.parse(localStorage.getItem('hegir_analytics')) || [];
    analyticsHistory.push(analyticsData);
    
    // Ограничиваем историю последними 100 записями
    if (analyticsHistory.length > 100) {
        analyticsHistory = analyticsHistory.slice(-100);
    }
    
    localStorage.setItem('hegir_analytics', JSON.stringify(analyticsHistory));
    
    // Отслеживаем события
    window.trackEvent = function(eventName, eventData = {}) {
        if (!settings.analytics) return;
        
        const event = {
            name: eventName,
            data: eventData,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        };
        
        let eventsHistory = JSON.parse(localStorage.getItem('hegir_events')) || [];
        eventsHistory.push(event);
        
        if (eventsHistory.length > 200) {
            eventsHistory = eventsHistory.slice(-200);
        }
        
        localStorage.setItem('hegir_events', JSON.stringify(eventsHistory));
        
        console.log(`[Analytics] Event: ${eventName}`, eventData);
    };
    
    // Отслеживаем основные события
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        // Отслеживаем клики по кнопкам
        if (target.tagName === 'BUTTON' || target.closest('button')) {
            const button = target.tagName === 'BUTTON' ? target : target.closest('button');
            const text = button.textContent.trim();
            const className = button.className;
            
            if (text && text.length < 50) {
                trackEvent('button_click', { text: text, className: className });
            }
        }
        
        // Отслеживаем клики по ссылкам
        if (target.tagName === 'A' || target.closest('a')) {
            const link = target.tagName === 'A' ? target : target.closest('a');
            const href = link.getAttribute('href');
            const text = link.textContent.trim();
            
            if (href && href !== '#' && !href.startsWith('javascript:')) {
                trackEvent('link_click', { href: href, text: text });
            }
        }
    });
    
    // Отслеживаем скролл
    let lastScrollPosition = 0;
    window.addEventListener('scroll', function() {
        const currentPosition = window.pageYOffset;
        const maxPosition = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = Math.round((currentPosition / maxPosition) * 100);
        
        // Отслеживаем каждые 25% прокрутки
        if (Math.abs(scrollPercentage - lastScrollPosition) >= 25) {
            trackEvent('scroll_depth', { percentage: scrollPercentage });
            lastScrollPosition = scrollPercentage;
        }
    });
    
    // Отслеживаем время на странице
    let pageStartTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const timeSpent = Math.round((Date.now() - pageStartTime) / 1000);
        trackEvent('page_time', { seconds: timeSpent });
    });
    
    console.log('[Analytics] Инициализировано');
}

// Уведомления
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Стили уведомления
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        background: #1A1A1A;
        border-left: 4px solid ${type === 'success' ? '#00CC88' : type === 'error' ? '#FF4444' : type === 'warning' ? '#FF9500' : '#0066FF'};
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        color: white;
        font-family: 'Inter', sans-serif;
        transform: translateX(120%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Автоматически скрываем через 5 секунд
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Закрытие по клику
    notification.addEventListener('click', function() {
        this.style.transform = 'translateX(120%)';
        setTimeout(() => {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        }, 300);
    });
}

// Инициализация при загрузке
window.addEventListener('load', function() {
    // Отслеживаем событие загрузки страницы
    trackEvent('page_load', {
        load_time: performance.now(),
        page: window.location.pathname
    });
    
    // Проверяем производительность
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            trackEvent('performance', {
                dns: perfData.domainLookupEnd - perfData.domainLookupStart,
                connect: perfData.connectEnd - perfData.connectStart,
                ttfb: perfData.responseStart - perfData.requestStart,
                load: perfData.loadEventEnd - perfData.loadEventStart,
                dom: perfData.domComplete - perfData.domInteractive
            });
        }
    }
});

// Экспорт функций для использования в других скриптах
window.FooterManager = {
    init: initFooterComponents,
    showNotification: showNotification,
    trackEvent: window.trackEvent || (() => {}),
    changeCountry: changeCountry
};

console.log('Footer scripts loaded successfully');
