document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options-container');
    const resultContainer = document.getElementById('result-container');
    const resultIcon = document.getElementById('result-icon');
    const resultText = document.getElementById('result-text');
    const nextButton = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const scoreElement = document.getElementById('score');
    const questionCountElement = document.getElementById('question-count');
    const timerElement = document.getElementById('timer');
    const timerCircle = document.querySelector('.timer-circle-fill');
    const finalScreen = document.getElementById('final-screen');
    const finalScoreElement = document.getElementById('final-score');
    const finalMessageElement = document.getElementById('final-message');
    const restartButton = document.getElementById('restart-btn');
    
    // Quiz variables
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    let timeLeft = 15;
    let questions = [];
    let answered = false;
    
    // Initialize the quiz
    initQuiz();
    
    function initQuiz() {
        // Sample questions
        questions = [
            {
                question: "Which planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                correctAnswer: 1
            },
            {
                question: "What is the largest mammal in the world?",
                options: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
                correctAnswer: 1
            },
            {
                question: "Which element has the chemical symbol 'O'?",
                options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
                correctAnswer: 1
            },
            {
                question: "Who painted the Mona Lisa?",
                options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
                correctAnswer: 2
            },
            {
                question: "What is the capital of Japan?",
                options: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
                correctAnswer: 2
            }
        ];
        
        currentQuestionIndex = 0;
        score = 0;
        answered = false;
        scoreElement.textContent = `Score: ${score}`;
        loadQuestion();
    }
    
    function loadQuestion() {
        answered = false;
        resetTimer();
        startTimer();
        
        const currentQuestion = questions[currentQuestionIndex];
        questionElement.textContent = currentQuestion.question;
        
        // Update progress
        const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        // Update question count
        questionCountElement.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
        
        // Clear previous options
        optionsContainer.innerHTML = '';
        
        // Add new options
        currentQuestion.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.classList.add('option-btn');
            button.textContent = option;
            button.addEventListener('click', () => selectOption(index));
            optionsContainer.appendChild(button);
        });
        
        // Hide result container
        resultContainer.classList.add('hidden');
    }
    
    function selectOption(selectedIndex) {
        if (answered) return;
        answered = true;
        
        clearInterval(timer);
        const currentQuestion = questions[currentQuestionIndex];
        const options = document.querySelectorAll('.option-btn');
        
        // Disable all options
        options.forEach(option => {
            option.disabled = true;
        });
        
        // Check if answer is correct
        const isCorrect = selectedIndex === currentQuestion.correctAnswer;
        
        if (isCorrect) {
            score++;
            scoreElement.textContent = `Score: ${score}`;
            options[selectedIndex].style.backgroundColor = '#e3f9e5';
            options[selectedIndex].style.borderColor = 'var(--success)';
            
            resultIcon.innerHTML = '✅';
            resultText.textContent = 'Correct! Well done!';
            resultText.style.color = 'var(--success)';
        } else {
            options[selectedIndex].style.backgroundColor = '#ffe3e3';
            options[selectedIndex].style.borderColor = 'var(--danger)';
            
            // Highlight correct answer
            options[currentQuestion.correctAnswer].style.backgroundColor = '#e3f9e5';
            options[currentQuestion.correctAnswer].style.borderColor = 'var(--success)';
            
            resultIcon.innerHTML = '❌';
            resultText.textContent = `Incorrect! The correct answer is: ${currentQuestion.options[currentQuestion.correctAnswer]}`;
            resultText.style.color = 'var(--danger)';
        }
        
        // Show result container
        resultContainer.classList.remove('hidden');
        
        // Enable next button
        nextButton.disabled = false;
    }
    
    function startTimer() {
        timeLeft = 15;
        timerElement.textContent = timeLeft;
        timerCircle.style.strokeDashoffset = 0;
        
        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            
            // Update circle progress
            const offset = 283 - (283 * timeLeft) / 15;
            timerCircle.style.strokeDashoffset = offset;
            
            // Change color when time is running out
            if (timeLeft <= 5) {
                timerElement.style.color = 'var(--danger)';
                timerCircle.style.stroke = 'var(--danger)';
            }
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                timeUp();
            }
        }, 1000);
    }
    
    function resetTimer() {
        clearInterval(timer);
        timerElement.textContent = '15';
        timerElement.style.color = 'var(--primary)';
        timerCircle.style.stroke = 'var(--primary)';
        timerCircle.style.strokeDashoffset = 283;
    }
    
    function timeUp() {
        if (answered) return;
        answered = true;
        
        const options = document.querySelectorAll('.option-btn');
        options.forEach(option => {
            option.disabled = true;
        });
        
        const currentQuestion = questions[currentQuestionIndex];
        
        // Highlight correct answer
        options[currentQuestion.correctAnswer].style.backgroundColor = '#e3f9e5';
        options[currentQuestion.correctAnswer].style.borderColor = 'var(--success)';
        
        resultIcon.innerHTML = '⏰';
        resultText.textContent = `Time's up! The correct answer is: ${currentQuestion.options[currentQuestion.correctAnswer]}`;
        resultText.style.color = 'var(--warning)';
        resultContainer.classList.remove('hidden');
        
        // Enable next button
        nextButton.disabled = false;
    }
    
    function showFinalScreen() {
        document.querySelector('.quiz-container').classList.add('hidden');
        finalScreen.classList.remove('hidden');
        finalScreen.classList.add('show');
        
        finalScoreElement.textContent = `You scored ${score} out of ${questions.length}`;
        
        // Set final message based on score
        const percentage = (score / questions.length) * 100;
        if (percentage >= 80) {
            finalMessageElement.textContent = "Amazing! You're a quiz wizard! 🧙‍♂️";
        } else if (percentage >= 60) {
            finalMessageElement.textContent = "Great job! You know your stuff! 👍";
        } else if (percentage >= 40) {
            finalMessageElement.textContent = "Not bad! Keep learning! 📚";
        } else {
            finalMessageElement.textContent = "Keep practicing! You'll get better! 💪";
        }
        
        // Create confetti
        createConfetti();
    }
    
    function createConfetti() {
        const colors = ['#fd79a8', '#6c5ce7', '#00b894', '#0984e3', '#fdcb6e'];
        const container = document.querySelector('.confetti-container');
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            confetti.style.animationDelay = Math.random() * 5 + 's';
            confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
            container.appendChild(confetti);
        }
    }
    
    // Event listeners
    nextButton.addEventListener('click', () => {
        // Disable next button until next question is loaded
        nextButton.disabled = true;
        
        currentQuestionIndex++;
        
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            showFinalScreen();
        }
    });
    
   

restartButton.addEventListener('click', () => {
    // Hide the final screen
    finalScreen.classList.add('hidden');
    
    // Show the quiz container
    document.querySelector('.quiz-container').classList.remove('hidden');
    
    // Clear confetti
    const confettiContainer = document.querySelector('.confetti-container');
    confettiContainer.innerHTML = '';
    
    // Reinitialize the quiz
    initQuiz();
    
    // Enable next button for new quiz
    nextButton.disabled = false;
});


    
    // Initialize next button state
    nextButton.disabled = false;
});