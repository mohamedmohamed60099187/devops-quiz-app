// Quiz state
let questions = [];
let currentTopic = '';
let currentQuestionIndex = 0;
let selectedOptionIndex = null;

// DOM elements
const topicSelectionEl = document.getElementById('topic-selection');
const topicButtonsEl = document.getElementById('topic-buttons');
const quizSectionEl = document.getElementById('quiz-section');
const feedbackSectionEl = document.getElementById('feedback-section');
const questionTextEl = document.getElementById('question-text');
const optionsContainerEl = document.getElementById('options-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const feedbackTextEl = document.getElementById('feedback-text');
const explanationTextEl = document.getElementById('explanation-text');
const restartBtn = document.getElementById('restart-btn');

// Fetch questions from JSON
async function loadQuestions() {
    try {
        const response = await fetch('data/questions.json');
        questions = await response.json();
        populateTopics();
    } catch (error) {
        console.error('Failed to load questions:', error);
    }
}

// Populate unique topics
function populateTopics() {
    const topics = [...new Set(questions.map(q => q.topic))];
    topicButtonsEl.innerHTML = '';
    topics.forEach(topic => {
        const button = document.createElement('button');
        button.className = 'topic-btn';
        button.textContent = topic;
        button.addEventListener('click', () => startQuiz(topic));
        topicButtonsEl.appendChild(button);
    });
}

// Start quiz for selected topic
function startQuiz(topic) {
    currentTopic = topic;
    currentQuestionIndex = 0;
    topicSelectionEl.classList.add('hidden');
    quizSectionEl.classList.remove('hidden');
    loadQuestion();
}

// Load current question
function loadQuestion() {
    const filtered = questions.filter(q => q.topic === currentTopic);
    if (filtered.length === 0) return;

    const question = filtered[currentQuestionIndex];
    questionTextEl.textContent = question.question;

    optionsContainerEl.innerHTML = '';
    selectedOptionIndex = null;
    question.options.forEach((option, idx) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'option';
        optionEl.textContent = `${String.fromCharCode(65 + idx)}. ${option}`;
        optionEl.addEventListener('click', () => selectOption(idx));
        optionsContainerEl.appendChild(optionEl);
    });

    updateNavigation(filtered.length);
}

// Select an option
function selectOption(index) {
    selectedOptionIndex = index;
    document.querySelectorAll('.option').forEach((opt, idx) => {
        opt.classList.toggle('selected', idx === index);
    });
    submitBtn.classList.remove('hidden');
}

// Update navigation buttons
function updateNavigation(totalQuestions) {
    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.disabled = currentQuestionIndex === totalQuestions - 1;
}

// Event listeners
prevBtn.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
});

nextBtn.addEventListener('click', () => {
    const filtered = questions.filter(q => q.topic === currentTopic);
    if (currentQuestionIndex < filtered.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    }
});

submitBtn.addEventListener('click', () => {
    if (selectedOptionIndex === null) return;

    const filtered = questions.filter(q => q.topic === currentTopic);
    const question = filtered[currentQuestionIndex];
    const isCorrect = selectedOptionIndex === question.answerIndex;

    // Show feedback
    quizSectionEl.classList.add('hidden');
    feedbackSectionEl.classList.remove('hidden');
    feedbackTextEl.textContent = isCorrect ? '✅ Correct!' : '❌ Incorrect!';
    explanationTextEl.textContent = question.explanation;

    // Highlight correct/incorrect
    document.querySelectorAll('.option').forEach((opt, idx) => {
        if (idx === question.answerIndex) opt.classList.add('correct');
        if (idx === selectedOptionIndex && !isCorrect) opt.classList.add('incorrect');
    });
});

restartBtn.addEventListener('click', () => {
    feedbackSectionEl.classList.add('hidden');
    topicSelectionEl.classList.remove('hidden');
    selectedOptionIndex = null;
});

// Initialize
loadQuestions();