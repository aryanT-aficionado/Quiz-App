`use strict`;

const userName = document.getElementById(`username`);
const saveScore = document.getElementById(`saveScoreBtn`);
const finalScore = document.getElementById(`finalScore`);

const mostRecentScore = localStorage.getItem(`mostRecentScore`);

const highScore = JSON.parse(localStorage.getItem(`highScores`)) || [];

const MAX_HIGH_SCORE = 5;

// console.log(highScore);
finalScore.innerText = mostRecentScore;

userName.addEventListener(`keyup`, () => {
  //   console.log(userName.value);
  saveScore.disabled = !userName.value;
});

saveHighScore = (event) => {
  // console.log(`Clicked saved btn`);
  event.preventDefault();

  const score = {
    // score: Math.floor(Math.random() * 100), //Test-Run
    score: mostRecentScore,
    name: userName.value,
  };

  highScore.push(score);
  highScore.sort((a, b) => b.score - a.score);
  highScore.splice(5);

  localStorage.setItem(`highScore`, JSON.stringify(highScore));
  window.location.assign(`/`);

  //   console.log(highScore);
};
