// ==========================================
// 🎨 НАСТРОЙКИ (МЕНЯЙТЕ ВСЁ ЗДЕСЬ)
// ==========================================

const CORRECT_PASSWORD = "любовь"; // Пароль для входа

const GREETINGS = [
    "Привет,",
    "Добро пожаловать,",
    "Добрый день,",
    "Приветствую,",
    "Рад тебя видеть,",
    "С возвращением,",
    "Здравствуй,",
    "Bonjour,",
];

const NAMES = [
    "Алиса",
    "Солнышко",
    "Любимая",
    "Родная",
    "Красавица",
    "Зая",
    "Счастье",
];

const TYPING_SPEED = 70;         // Скорость печати (мс на символ)
const DELETE_SPEED = 35;         // Скорость удаления
const PAUSE_BETWEEN = 2500;      // Пауза перед сменой текста

// Настройки лепестков (🌸 — сакура, ❤️ — сердечки, можно комбинировать)
const PETAL_EMOJIS = ['🌸', '💮', '❤️', '✨', '💖'];
const PETALS_COUNT = 20;         // Количество лепестков одновременно
const PETAL_CREATE_INTERVAL = 800; // Интервал создания новых лепестков (мс)

// ==========================================
// 🖥️ DOM ЭЛЕМЕНТЫ
// ==========================================

const greetingElement = document.getElementById('greeting-text');
const nameElement = document.getElementById('name-text');
const cursorElement = document.getElementById('cursor');
const passwordInput = document.getElementById('password-input');
const submitBtn = document.getElementById('submit-btn');
const errorMessage = document.getElementById('error-message');
const loginScreen = document.getElementById('login-screen');
const romanticScreen = document.getElementById('romantic-screen');
const canvas = document.getElementById('background-canvas');
const petalsContainer = document.getElementById('petals-container');
const musicBtn = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');

// ==========================================
// ⌨️ ЭФФЕКТ ПЕЧАТНОЙ МАШИНКИ
// ==========================================

let currentGreetingIndex = 0;
let currentNameIndex = 0;
let isTyping = true;
let charIndex = 0;
let currentString = '';
let currentTarget = 'greeting'; // 'greeting' или 'name'

function getRandomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function typeWriter() {
    if (isTyping) {
        // Печатаем
        if (currentTarget === 'greeting') {
            const fullGreeting = getRandomFromArray(GREETINGS);
            if (charIndex < fullGreeting.length) {
                greetingElement.textContent += fullGreeting.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, TYPING_SPEED + Math.random() * 40);
            } else {
                // Переключаемся на имя
                currentTarget = 'name';
                charIndex = 0;
                setTimeout(typeWriter, 200);
            }
        } else if (currentTarget === 'name') {
            const fullName = getRandomFromArray(NAMES);
            if (charIndex < fullName.length) {
                nameElement.textContent += fullName.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, TYPING_SPEED + Math.random() * 30);
            } else {
                // Завершили печать, ждем паузу и начинаем удаление
                isTyping = false;
                setTimeout(typeWriter, PAUSE_BETWEEN);
            }
        }
    } else {
        // Удаляем
        if (currentTarget === 'name') {
            if (charIndex > 0) {
                nameElement.textContent = nameElement.textContent.slice(0, -1);
                charIndex--;
                setTimeout(typeWriter, DELETE_SPEED);
            } else {
                currentTarget = 'greeting';
                charIndex = 0;
                greetingElement.textContent = '';
                isTyping = true;
                setTimeout(typeWriter, 300);
            }
        } else if (currentTarget === 'greeting') {
            if (charIndex > 0) {
                greetingElement.textContent = greetingElement.textContent.slice(0, -1);
                charIndex--;
                setTimeout(typeWriter, DELETE_SPEED);
            } else {
                isTyping = true;
                charIndex = 0;
                setTimeout(typeWriter, 200);
            }
        }
    }
}

// Запускаем пишущую машинку
setTimeout(typeWriter, 500);

// ==========================================
// 🔐 ЛОГИКА ВХОДА
// ==========================================

function attemptLogin() {
    const enteredPassword = passwordInput.value.trim();
    
    if (enteredPassword.toLowerCase() === CORRECT_PASSWORD.toLowerCase()) {
        // Успех: эффект растворения и перехода
        errorMessage.classList.remove('visible');
        
        // Добавляем эффект растворения стеклянной карточки
        const glassCard = document.querySelector('.glass-card');
        glassCard.style.transition = 'all 0.8s ease';
        glassCard.style.filter = 'blur(20px)';
        glassCard.style.opacity = '0';
        glassCard.style.transform = 'scale(1.1)';
        
        // Затемняем весь экран
        loginScreen.style.transition = 'opacity 1s ease, filter 1s ease';
        loginScreen.style.opacity = '0';
        loginScreen.style.filter = 'blur(15px)';
        
        setTimeout(() => {
            loginScreen.classList.add('screen--hidden');
            romanticScreen.classList.remove('screen--hidden');
            
            // Запускаем анимации скролла
            setupScrollAnimations();
            checkVisibilityAll();
            
            // Активируем лепестки и музыку после входа
            startPetals();
            
            // Попытка автовоспроизведения музыки
            playMusic();
            
        }, 900);
        
    } else {
        // Неверный пароль: тряска и свечение
        errorMessage.classList.add('visible');
        const container = document.querySelector('.glass-card');
        container.classList.add('shake');
        
        passwordInput.style.borderColor = 'rgba(255, 100, 100, 0.7)';
        passwordInput.style.boxShadow = '0 0 30px rgba(255, 80, 80, 0.35)';
        
        setTimeout(() => {
            container.classList.remove('shake');
            passwordInput.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            passwordInput.style.boxShadow = 'none';
            errorMessage.classList.remove('visible');
        }, 2000);
    }
}

submitBtn.addEventListener('click', attemptLogin);
passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') attemptLogin();
});

// ==========================================
// 🎵 УПРАВЛЕНИЕ МУЗЫКОЙ
// ==========================================

let isMusicPlaying = false;

function playMusic() {
    bgMusic.play().then(() => {
        isMusicPlaying = true;
        updateMusicButton();
    }).catch(() => {
        // Автовоспроизведение заблокировано браузером
        isMusicPlaying = false;
        updateMusicButton();
    });
}

function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
        isMusicPlaying = false;
    } else {
        bgMusic.play().then(() => {
            isMusicPlaying = true;
        }).catch(() => {
            isMusicPlaying = false;
        });
        isMusicPlaying = true; // Оптимистично
    }
    updateMusicButton();
}

function updateMusicButton() {
    const icon = musicBtn.querySelector('.music-icon');
    if (isMusicPlaying) {
        icon.textContent = '🔊';
        musicBtn.classList.add('playing');
    } else {
        icon.textContent = '🔇';
        musicBtn.classList.remove('playing');
    }
}

musicBtn.addEventListener('click', toggleMusic);

// ==========================================
// 🌸 ЛЕТАЮЩИЕ ЛЕПЕСТКИ / СЕРДЕЧКИ
// ==========================================

function createPetal() {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    
    // Случайный эмодзи из списка
    petal.textContent = PETAL_EMOJIS[Math.floor(Math.random() * PETAL_EMOJIS.length)];
    
    // Случайное положение по горизонтали
    petal.style.left = Math.random() * 100 + '%';
    
    // Случайный размер
    const size = 14 + Math.random() * 20;
    petal.style.fontSize = size + 'px';
    
    // Случайная длительность падения
    const duration = 8 + Math.random() * 12;
    petal.style.animationDuration = duration + 's';
    
    // Случайная задержка
    petal.style.animationDelay = Math.random() * 3 + 's';
    
    petalsContainer.appendChild(petal);
    
    // Удаляем лепесток после завершения анимации
    setTimeout(() => {
        if (petal.parentNode) {
            petal.remove();
        }
    }, (duration + 3) * 1000);
}

let petalInterval;

function startPetals() {
    // Создаем начальные лепестки
    for (let i = 0; i < PETALS_COUNT; i++) {
        setTimeout(() => createPetal(), i * 300);
    }
    
    // Регулярно добавляем новые
    petalInterval = setInterval(createPetal, PETAL_CREATE_INTERVAL);
}

// ==========================================
// 🌌 ЖИВОЙ ФОН: ЧАСТИЦЫ И СВЕТЯЩИЕСЯ СФЕРЫ
// ==========================================

function initBackground() {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let orbs = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    
    // Создаем светящиеся сферы
    class Orb {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = 40 + Math.random() * 80;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.color = Math.random() > 0.5 ? '180, 140, 255' : '255, 150, 200';
            this.opacity = 0.04 + Math.random() * 0.06;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x < -100) this.x = canvas.width + 100;
            if (this.x > canvas.width + 100) this.x = -100;
            if (this.y < -100) this.y = canvas.height + 100;
            if (this.y > canvas.height + 100) this.y = -100;
        }
        
        draw() {
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            gradient.addColorStop(0, `rgba(${this.color}, ${this.opacity * 2})`);
            gradient.addColorStop(0.5, `rgba(${this.color}, ${this.opacity})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Создаем маленькие частицы
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5;
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.speedY = (Math.random() - 0.5) * 0.2;
            this.opacity = Math.random() * 0.6;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        
        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Инициализация
    for (let i = 0; i < 6; i++) {
        orbs.push(new Orb());
    }
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        orbs.forEach(orb => {
            orb.update();
            orb.draw();
        });
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Рисуем соединительные линии между близкими частицами
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ==========================================
// 📜 АНИМАЦИИ ПРИ СКРОЛЛЕ
// ==========================================

function setupScrollAnimations() {
    const scrollElements = document.querySelectorAll('.fade-in-on-scroll');
    
    function checkVisibilityAll() {
        scrollElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top <= windowHeight * 0.85) {
                el.classList.add('visible');
            }
        });
        
        // Легкий параллакс для фото
        document.querySelectorAll('.cinematic-frame').forEach(frame => {
            const rect = frame.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top < windowHeight && rect.bottom > 0) {
                const speed = 0.03;
                const offset = (rect.top - windowHeight / 2) * speed;
                frame.style.transform = `translateY(${offset}px)`;
            }
        });
    }
    
    romanticScreen.addEventListener('scroll', checkVisibilityAll, { passive: true });
}

// Глобальная функция для немедленной проверки
function checkVisibilityAll() {
    document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.85) {
            el.classList.add('visible');
        }
    });
}

// ==========================================
// 🚀 ИНИЦИАЛИЗАЦИЯ
// ==========================================

initBackground();

// Начинаем лепестки только после входа (вызывается в attemptLogin)
// Если хотите лепестки сразу на экране входа — раскомментируйте:
// startPetals();

// Предотвращаем нежелательный зум на iOS
document.addEventListener('gesturestart', (e) => e.preventDefault());
