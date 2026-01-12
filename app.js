let currentCategory = null;
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

const homePage = document.getElementById('home-page');
const quizPage = document.getElementById('quiz-page');
const resultPage = document.getElementById('result-page');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackText = document.getElementById('feedback-text');
const progressFill = document.getElementById('progress-fill');
const difficultyBadge = document.getElementById('difficulty-badge');

// Kategori seçimi
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        currentCategory = card.dataset.category;
        startQuiz();
    });
});

// Geri butonu
document.getElementById('back-btn').addEventListener('click', goHome);
document.getElementById('home-btn').addEventListener('click', goHome);
document.getElementById('retry-btn').addEventListener('click', () => startQuiz());
document.getElementById('next-btn').addEventListener('click', nextQuestion);

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function startQuiz() {
    currentQuestions = shuffleArray(quizData[currentCategory]);
    currentQuestionIndex = 0;
    score = 0;

    showPage(quizPage);
    document.getElementById('total-questions').textContent = currentQuestions.length;
    document.getElementById('score').textContent = score;

    showQuestion();
}

function showQuestion() {
    const q = currentQuestions[currentQuestionIndex];

    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
    progressFill.style.width = ((currentQuestionIndex) / currentQuestions.length * 100) + '%';

    // Zorluk badge
    difficultyBadge.className = 'difficulty-badge';
    if (q.d === 'easy') {
        difficultyBadge.textContent = 'Kolay';
        difficultyBadge.classList.add('easy');
    } else if (q.d === 'medium') {
        difficultyBadge.textContent = 'Orta';
        difficultyBadge.classList.add('medium');
    } else {
        difficultyBadge.textContent = 'Zor';
        difficultyBadge.classList.add('hard');
    }

    questionText.textContent = q.q;
    optionsContainer.innerHTML = '';
    feedbackContainer.classList.add('hidden');

    q.o.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.addEventListener('click', () => selectAnswer(index));
        optionsContainer.appendChild(btn);
    });
}

function selectAnswer(selectedIndex) {
    const q = currentQuestions[currentQuestionIndex];
    const buttons = optionsContainer.querySelectorAll('.option-btn');

    buttons.forEach((btn, index) => {
        btn.classList.add('disabled');
        btn.disabled = true;
        if (index === q.a) {
            btn.classList.add('correct');
        } else if (index === selectedIndex) {
            btn.classList.add('wrong');
        }
    });

    const isCorrect = selectedIndex === q.a;
    if (isCorrect) {
        score++;
        document.getElementById('score').textContent = score;
        feedbackText.className = 'correct';
        feedbackText.innerHTML = '✓ Doğru! ' + q.exp;
    } else {
        feedbackText.className = 'wrong';
        feedbackText.innerHTML = '✗ Yanlış! Doğru cevap: <strong>' + q.o[q.a] + '</strong><br><br>' + q.exp;
    }

    feedbackContainer.classList.remove('hidden');

    if (currentQuestionIndex === currentQuestions.length - 1) {
        document.getElementById('next-btn').textContent = 'Sonuçları Gör';
    }
}

function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex >= currentQuestions.length) {
        showResults();
    } else {
        document.getElementById('next-btn').textContent = 'Sonraki Soru →';
        showQuestion();
    }
}

function showResults() {
    showPage(resultPage);

    const percentage = (score / currentQuestions.length) * 100;
    document.getElementById('final-score').textContent = score;
    document.getElementById('max-score').textContent = currentQuestions.length;

    const resultIcon = document.getElementById('result-icon');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');

    if (percentage >= 80) {
        resultIcon.textContent = '🏆';
        resultTitle.textContent = 'Mükemmel!';
        resultMessage.textContent = 'Ağ teknolojileri konusunda harika bir bilgiye sahipsin!';
    } else if (percentage >= 60) {
        resultIcon.textContent = '👍';
        resultTitle.textContent = 'İyi!';
        resultMessage.textContent = 'Güzel bir performans, biraz daha pratik yaparak daha da iyileşebilirsin.';
    } else if (percentage >= 40) {
        resultIcon.textContent = '📚';
        resultTitle.textContent = 'Orta';
        resultMessage.textContent = 'Konuları tekrar gözden geçirmeni öneririm.';
    } else {
        resultIcon.textContent = '💪';
        resultTitle.textContent = 'Çalışmaya Devam!';
        resultMessage.textContent = 'Daha fazla çalışma ile başarabilirsin!';
    }
}

function goHome() {
    showPage(homePage);
    currentCategory = null;
    currentQuestions = [];
    currentQuestionIndex = 0;
    score = 0;
}

function showPage(page) {
    [homePage, quizPage, resultPage].forEach(p => p.classList.remove('active'));
    page.classList.add('active');
}
