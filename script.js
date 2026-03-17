// Data Storage (Simulating backend with localStorage)
const STORAGE_KEYS = {
    QA: 'loc_glow_qa',
    STUDENTS: 'loc_glow_students',
    REVIEWS: 'loc_glow_reviews',
    CART: 'loc_glow_cart'
};

// AI Knowledge Base for Hair and Skin Questions
const AI_KNOWLEDGE = {
    microlocs: {
        keywords: ['microloc', 'micro loc', 'small loc', 'install'],
        responses: [
            "Microlocs are smaller than traditional dreadlocks, typically ranging from the size of a pen spring to a drinking straw. Installation can take 8-16 hours depending on hair length and density. I recommend starting with a consultation to determine the best size for your hair type!",
            "For microlocs installation, your hair should be at least 3-4 inches long. The process involves sectioning and twisting/interlocking each loc individually. Would you like tips on preparing your hair before installation?"
        ]
    },
    sisterlocks: {
        keywords: ['sisterlock', 'sister loc', 'trademark'],
        responses: [
            "Sisterlocks are a trademarked loc system using a specific tool and grid pattern. They're typically smaller than microlocs and require certified consultants for installation. The initial investment is higher, but maintenance is easier long-term.",
            "Sisterlocks must be installed by a certified consultant to maintain the warranty and ensure proper technique. Would you like help finding a certified sisterlocks consultant in your area?"
        ]
    },
    maintenance: {
        keywords: ['maintain', 'retwist', 'interlock', 'wash', 'clean'],
        responses: [
            "For microlocs maintenance, I recommend washing every 1-2 weeks with a clarifying shampoo. Retwisting or interlocking should be done every 4-6 weeks, or as needed based on your hair growth.",
            "Proper maintenance includes: 1) Regular cleansing with residue-free shampoo, 2) Moisturizing with light oils or loc sprays, 3) Interlocking or palm rolling every 4-8 weeks, 4) Protecting locs at night with silk/satin."
        ]
    },
    products: {
        keywords: ['product', 'gel', 'oil', 'shampoo', 'conditioner', 'recommend'],
        responses: [
            "For microlocs, look for water-based products that won't cause buildup. Our Nourishing Loc Gel provides light hold without flaking, and our Growth Scalp Oil keeps your roots healthy. Avoid heavy waxes and creams!",
            "Best ingredients for locs: tea tree oil (antibacterial), peppermint oil (stimulates growth), jojoba oil (moisturizing), and aloe vera (hydration). Check out our curated shop for professional-grade products!"
        ]
    },
    skin: {
        keywords: ['skin', 'facial', 'acne', 'glow', 'routine', 'care', 'face'],
        responses: [
            "For glowing skin, consistency is key! A basic routine should include: gentle cleanser, vitamin C serum (AM), moisturizer with SPF, and retinol or peptides (PM). Our Vitamin C Serum is perfect for brightening!",
            "If you're experiencing breakouts, avoid over-washing (2x daily max) and use non-comedogenic products. Book a consultation for a personalized skincare routine based on your skin type."
        ]
    },
    starter: {
        keywords: ['start', 'begin', 'new', 'first time', 'transition'],
        responses: [
            "Starting your loc journey is exciting! First, decide between microlocs vs sisterlocks based on your lifestyle and budget. Then, gather your products: clarifying shampoo, light oils, and satin bonnet/pillowcase.",
            "Before your first install: 1) Stop using heavy conditioners 2 weeks prior, 2) Detangle thoroughly, 3) Do a final clarifying wash, 4) Take photos to track your journey!"
        ]
    },
    issues: {
        keywords: ['itchy', 'dandruff', 'breakage', 'thin', 'damage', 'problem'],
        responses: [
            "Itchy scalp with new locs is common! Try a diluted tea tree oil spray or witch hazel on the scalp. If persistent, you may need to wash more frequently or check for product buildup.",
            "If you notice thinning at the roots, avoid tight styles and give your locs tension-free periods. Massage your scalp daily with our Growth Scalp Oil to stimulate blood flow."
        ]
    }
};

// Initialize data
function initializeData() {
    if (!localStorage.getItem(STORAGE_KEYS.QA)) {
        const defaultQA = [
            {
                question: "How often should I wash my microlocs?",
                answer: "For the first 6 months, wash every 2 weeks to prevent unraveling. After they're mature (6+ months), you can wash weekly or as needed based on your scalp's oil production.",
                date: new Date().toISOString(),
                likes: 12
            },
            {
                question: "Can I swim with sisterlocks?",
                answer: "Yes! Wet your locs with fresh water before swimming (reduces chlorine/salt absorption), wear a swim cap if possible, and rinse immediately after. Clarify wash within 24 hours.",
                date: new Date(Date.now() - 86400000).toISOString(),
                likes: 8
            }
        ];
        localStorage.setItem(STORAGE_KEYS.QA, JSON.stringify(defaultQA));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
        const defaultStudents = [
            {
                name: "Aisha Johnson",
                location: "Houston, TX",
                phone: "(713) 555-0199",
                bio: "Recent graduate specializing in microlocs installation. Looking to build portfolio with 5 new clients. Flexible scheduling!",
                specialty: "Microlocs, Interlocking",
                photo: "http://static.photos/work/600x400/2",
                avatar: "http://static.photos/people/100x100/20",
                date: new Date().toISOString()
            }
        ];
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(defaultStudents));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
        const defaultReviews = [
            {
                name: "Monica R.",
                rating: 5,
                text: "Best decision ever! My microlocs are healthy and beautiful. The scalp treatments here are amazing too.",
                photo: "http://static.photos/beauty/600x600/25",
                avatar: "http://static.photos/people/100x100/25",
                date: new Date(Date.now() - 172800000).toISOString()
            }
        ];
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(defaultReviews));
    }
}

// AI Assistant Functions
function handleAIQuestion(event) {
    event.preventDefault();
    const input = document.getElementById('ai-input');
    const question = input.value.trim();
    
    if (!question) return;
    
    // Add user message to chat
    addMessageToChat('user', question);
    
    // Generate AI response
    const answer = generateAIResponse(question);
    
    // Simulate typing delay
    setTimeout(() => {
        addMessageToChat('ai', answer);
        
        // Save to Q&A history
        saveQA(question, answer);
        renderQAHistory();
    }, 1000);
    
    input.value = '';
}

function addMessageToChat(sender, text) {
    const chatArea = document.getElementById('chat-area');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex gap-4 fade-in';
    
    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="flex-1 flex justify-end">
                <div class="bg-amber-700 text-white rounded-2xl rounded-tr-none p-4 max-w-[80%]">
                    <p>${text}</p>
                </div>
            </div>
            <div class="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center flex-shrink-0">
                <i data-lucide="user" class="w-5 h-5 text-stone-600"></i>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i data-lucide="bot" class="w-5 h-5 text-amber-700"></i>
            </div>
            <div class="bg-stone-100 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                <p class="text-stone-800">${text}</p>
            </div>
        `;
    }
    
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
    
    // Re-initialize icons for new elements
    if (window.lucide) {
        lucide.createIcons();
    }
}

function generateAIResponse(question) {
    const lowerQuestion = question.toLowerCase();
    
    // Check knowledge base
    for (const category in AI_KNOWLEDGE) {
        const { keywords, responses } = AI_KNOWLEDGE[category];
        const hasKeyword = keywords.some(keyword => lowerQuestion.includes(keyword));
        
        if (hasKeyword) {
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }
    
    // Default responses
    const defaults = [
        "That's a great question! For personalized advice, I'd recommend booking a consultation with our expert. In the meantime, check out our blog for detailed guides on this topic!",
        "I can help with that! Based on your question, you might benefit from our AI Assistant's extended knowledge base or a one-on-one session. Would you like me to connect you with a specialist?",
        "Thanks for asking! This topic is covered in our upcoming courses. Join the waitlist to get detailed training on advanced techniques like this!"
    ];
    
    return defaults[Math.floor(Math.random() * defaults.length)];
}

function saveQA(question, answer) {
    const qa = JSON.parse(localStorage.getItem(STORAGE_KEYS.QA) || '[]');
    qa.unshift({
        question,
        answer,
        date: new Date().toISOString(),
        likes: 0
    });
    localStorage.setItem(STORAGE_KEYS.QA, JSON.stringify(qa.slice(0, 10))); // Keep last 10
}

function renderQAHistory() {
    const container = document.getElementById('qa-history');
    const qa = JSON.parse(localStorage.getItem(STORAGE_KEYS.QA) || '[]');
    
    container.innerHTML = qa.map((item, index) => `
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p class="font-semibold text-white mb-2">${item.question}</p>
            <p class="text-stone-300 text-sm mb-3">${item.answer.substring(0, 100)}${item.answer.length > 100 ? '...' : ''}</p>
            <div class="flex justify-between items-center text-sm text-stone-400">
                <span>${new Date(item.date).toLocaleDateString()}</span>
                <button onclick="likeQA(${index})" class="flex items-center gap-1 hover:text-amber-400 transition-colors">
                    <i data-lucide="thumbs-up" class="w-4 h-4"></i>
                    <span>${item.likes}</span>
                </button>
            </div>
        </div>
    `).join('');
    
    if (window.lucide) {
        lucide.createIcons();
    }
}

function likeQA(index) {
    const qa = JSON.parse(localStorage.getItem(STORAGE_KEYS.QA) || '[]');
    if (qa[index]) {
        qa[index].likes++;
        localStorage.setItem(STORAGE_KEYS.QA, JSON.stringify(qa));
        renderQAHistory();
    }
}

// Student Directory Functions
function openStudentModal() {
    document.getElementById('student-modal').classList.remove('hidden');
}

function closeStudentModal() {
    document.getElementById('student-modal').classList.add('hidden');
}

function submitStudent(event) {
    event.preventDefault();
    
    const student = {
        name: document.getElementById('student-name').value,
        location: document.getElementById('student-location').value,
        phone: document.getElementById('student-phone').value,
        bio: document.getElementById('student-bio').value,
        specialty: document.getElementById('student-specialty').value,
        photo: document.getElementById('student-photo').value || 'http://static.photos/work/600x400/1',
        avatar: `http://static.photos/people/100x100/${Math.floor(Math.random() * 50)}`,
        date: new Date().toISOString()
    };
    
    const students = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]');
    students.unshift(student);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    
    renderStudents();
    closeStudentModal();
    showToast('Your listing has been added! Students can now contact you.');
    event.target.reset();
}

function renderStudents() {
    const container = document.getElementById('student-grid');
    const students = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]');
    
    container.innerHTML = students.map(student => `
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
            <div class="h-48 overflow-hidden">
                <img src="${student.photo}" alt="Student Work" class="w-full h-full object-cover">
            </div>
            <div class="p-6">
                <div class="flex items-center gap-3 mb-4">
                    <img src="${student.avatar}" alt="${student.name}" class="w-12 h-12 rounded-full object-cover">
                    <div>
                        <h3 class="font-bold text-stone-900">${student.name}</h3>
                        <p class="text-sm text-stone-500">${student.location}</p>
                    </div>
                </div>
                <div class="flex items-center gap-2 mb-4 text-sm text-stone-600">
                    <i data-lucide="phone" class="w-4 h-4"></i>
                    <span>${student.phone}</span>
                </div>
                <p class="text-stone-600 text-sm mb-4">${student.bio}</p>
                <div class="flex flex-wrap gap-2">
                    ${student.specialty.split(',').map(s => `
                        <span class="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">${s.trim()}</span>
                    `).join('')}
                    <span class="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-xs font-semibold">Student</span>
                </div>
            </div>
        </div>
    `).join('');
    
    if (window.lucide) {
        lucide.createIcons();
    }
}

// Reviews Functions
function openReviewModal() {
    document.getElementById('review-modal').classList.remove('hidden');
}

function closeReviewModal() {
    document.getElementById('review-modal').classList.add('hidden');
}

function submitReview(event) {
    event.preventDefault();
    
    const review = {
        name: document.getElementById('reviewer-name').value,
        rating: parseInt(document.getElementById('review-rating').value),
        text: document.getElementById('review-text').value,
        photo: document.getElementById('review-photo').value || 'http://static.photos/beauty/600x600/30',
        avatar: `http://static.photos/people/100x100/${Math.floor(Math.random() * 50)}`,
        date: new Date().toISOString()
    };
    
    const reviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]');
    reviews.unshift(review);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    
    renderReviews();
    closeReviewModal();
    showToast('Thank you for sharing your experience!');
    event.target.reset();
}

function renderReviews() {
    const container = document.getElementById('reviews-grid');
    const reviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]');
    
    container.innerHTML = reviews.map(review => {
        const stars = Array(5).fill(0).map((_, i) => 
            `<i data-lucide="star" class="w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-stone-300'}"></i>`
        ).join('');
        
        return `
            <div class="bg-stone-50 rounded-2xl overflow-hidden">
                <img src="${review.photo}" alt="Client Photo" class="w-full h-64 object-cover">
                <div class="p-6">
                    <div class="flex items-center gap-2 mb-3 text-amber-500">
                        ${stars}
                    </div>
                    <p class="text-stone-700 mb-4">"${review.text}"</p>
                    <div class="flex items-center gap-3">
                        <img src="${review.avatar}" class="w-10 h-10 rounded-full object-cover" alt="${review.name}">
                        <div>
                            <p class="font-semibold text-stone-900">${review.name}</p>
                            <p class="text-sm text-stone-500">${new Date(review.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    if (window.lucide) {
        lucide.createIcons();
    }
}

// Shopping Cart
function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
    cart.push({ product, date: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    showToast(`${product} added to cart!`);
}

// Utility Functions
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    toastMessage.textContent = message;
    toast.classList.remove('translate-y-24');
    
    setTimeout(()
