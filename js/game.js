`use strict`;

const question = document.getElementById(`question`);
const choices = Array.from(document.getElementsByClassName(`choice-text`));
const progressText = document.getElementById(`progressText`);
const scoreText = document.getElementById(`score`);
const progressBar = document.getElementById(`progressBarFull`);
const loader = document.getElementById(`loader`);
const game = document.getElementById(`game`);

let currQues = {};
let acceptingAns = false;
let score = 0;
let quesCount = 0;
let availableQues = [];

let questions = [];

fetch(
  "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
)
  .then((res) => {
    // console.log(res);
    return res.json();
  })
  .then((loadedQues) => {
    // console.log(loadedQues.results);

    questions = loadedQues.results.map((loadQuestion) => {
      const formatQues = {
        question: loadQuestion.question,
      };

      const answerChoices = [...loadQuestion.incorrect_answers];

      formatQues.answer = Math.floor(Math.random() * 4) + 1;
      answerChoices.splice(
        formatQues.answer - 1,
        0,
        loadQuestion.correct_answer
      );

      answerChoices.forEach((choice, index) => {
        formatQues[`choice` + (index + 1)] = choice;
      });

      return formatQues;
    });

    // questions = loadedQues;
    startgame();
  })
  .catch((err) => {
    console.error(err);
  });

// CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 2;

startgame = () => {
  quesCount = 0;
  score = 0;
  availableQues = [...questions]; //making a copy of quess
  // console.log(availableQues);
  getNewQues();
  game.classList.remove(`hidden`);
  loader.classList.add(`hidden`);
};

getNewQues = () => {
  if (availableQues.length === 0 || quesCount >= MAX_QUESTIONS) {
    localStorage.setItem(`mostRecentScore`, score);
    // Go to the end Page
    return window.location.assign(`/end.html`);
  }
  quesCount++;

  progressText.innerText = `Question ${quesCount}/${MAX_QUESTIONS}`;

  //   Update Progress bar
  progressBar.style.width = `${(quesCount / MAX_QUESTIONS) * 100}%`;

  const quesIndex = Math.floor(Math.random() * availableQues.length);
  currQues = availableQues[quesIndex];
  question.innerText = currQues.question;

  choices.forEach((choice) => {
    const num = choice.dataset[`number`];
    choice.innerText = currQues[`choice` + num];
  });

  availableQues.splice(quesIndex, 1);
  //   console.log(availableQues);
  acceptingAns = true;
};

choices.forEach((choice) => {
  choice.addEventListener(`click`, (event) => {
    if (!acceptingAns) return;

    acceptingAns = false;
    const selectedChoice = event.target;
    const selectedAns = selectedChoice.dataset[`number`];

    // Checking the answer

    const classToApply =
      selectedAns == currQues.answer ? `correct` : `incorrect`;

    if (classToApply === `correct`) incrementScore(CORRECT_BONUS);

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQues();
    }, 2000);

    // console.log(selectedAns == currQues.answer, classToApply);
  });
});

incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};
