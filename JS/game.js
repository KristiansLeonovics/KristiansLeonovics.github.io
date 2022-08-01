const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressStatus = document.getElementById('progressStatus');
const quiz = document.getElementById('quiz');

let currentQuizQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuizQuestions = [];

let questions = [];
async function getData(){
    try {
        const response = await fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple");
        const responsedData = await response.json();
        questions = responsedData.results.map((responsedQuestion) => {
            const formattedQuestion = {
                question: responsedQuestion.question,
            };
            const answerChoices = [...responsedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                responsedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });
        startQuiz();
    } catch (error) {
        console.log(error);
    }
}
getData();

const pointOnCorrectAnswer = 10;
const totalQuestions = 10;

startQuiz = () => {
    questionCounter = 0;
    score = 0;
    availableQuizQuestions = [...questions];
    getNewQuestion();
    quiz.classList.remove('hidden');
    loader.classList.add('hidden');
};

getNewQuestion = () => {
    if (availableQuizQuestions.length === 0 || questionCounter >= totalQuestions) {
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign('./end.html');
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${totalQuestions}`;
    progressStatus.style.width = `${(questionCounter / totalQuestions) * 100}%`;
    const questionIndex = Math.floor(Math.random() * availableQuizQuestions.length);
    currentQuizQuestion = availableQuizQuestions[questionIndex];
    question.innerHTML = currentQuizQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuizQuestion['choice' + number];
    });
    availableQuizQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach((choice) => {

    choice.addEventListener('click', (e) => {
    
        if (!acceptingAnswers) return;
        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        const classToApply =
            selectedAnswer == currentQuizQuestion.answer ? 'correct' : 'incorrect';
        if (classToApply === 'correct') {
            incrementScore(pointOnCorrectAnswer);
        }

        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};
