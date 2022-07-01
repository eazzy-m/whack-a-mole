const squares = document.querySelectorAll('.square');
const mole = document.querySelector('.mole');
const timeLeft = document.querySelector('.time-left');
const score = document.querySelector('.score');
const playSection = document.querySelector('.grid');
const newGameContainer = document.querySelector('.new-game-container');
const startGameButton = document.querySelector('.start-game-button');
const clearRecordsTableButton = document.querySelector('.clear');

const formContainer = document.querySelector('.form-container');
const form = document.querySelector('.form');
const nameInput = document.querySelector('.name-input');
const recordsTable = document.querySelector('.table');

const recordsList = [];
let sortedList = [];
let downloadedList = JSON.parse(localStorage.getItem("array")) || []; // if local storage is empty - downloadedList = []

if (downloadedList.length > 0) { // if were previous sessions, first time the high score table will be loaded from local storage
    for (let i = 0; i < downloadedList.length; i++) {
        drawTableRow(downloadedList[i].name, downloadedList[i].score);
    }
}

const PLAYINGTIME = 60; // game session time

let result = 0;
score.textContent = result + '';
let currentTime = PLAYINGTIME;
timeLeft.textContent = PLAYINGTIME + '';
let hitPosition;
let timerId;
let countDownTimerId;

const randomSquare = () => {
    squares.forEach(square => square.classList.remove('mole'));

    let randomPosition = squares[Math.floor(Math.random() * 9)]; // the mole's randomise spawn
    randomPosition.classList.add('mole');
    playSection.classList.add('game-cursor');
    hitPosition = randomPosition.id;
};

squares.forEach(square => {
    square.addEventListener('mousedown', () => {

        if (square.id === hitPosition) result++;

        score.textContent = result + ''; // results type is a Number, converting to string
        hitPosition = null;
    });
});

const moveMole = () => {
    timerId = setInterval(randomSquare, 500); // the mole's spawn rate
};

const toggleForm = () => {
    formContainer.classList.toggle('active'); // hide and spawn user-name form
};

const toggleButtonsContainer = () => {
    newGameContainer.classList.toggle('hide-new-game-container'); // hide and spawn user-name form
};

const countDown = () => {

    currentTime--;
    timeLeft.textContent = currentTime + '';

    if (currentTime === 0 ) {
        // if time is over - clean everything
        clearInterval(countDownTimerId);
        clearInterval(timerId);
        squares.forEach(square => {
            square.classList.remove('mole');
        });
        hitPosition = null;
        playSection.classList.remove('game-cursor');
        toggleButtonsContainer();
        toggleForm();
        clearRecordsTableButton.removeAttribute('disabled');
    }
};

startGameButton.addEventListener('click', gameStarting);

function gameStarting() {
    score.textContent = result + '';
    moveMole();
    countDownTimerId = setInterval(countDown, 1000);
    this.classList.add('hide-button');
    toggleButtonsContainer();
    clearRecordsTableButton.setAttribute('disabled', 'disabled');
    this.removeEventListener('click', gameStarting);
}

const newGame = () => { //
    const newGameButton = document.createElement('button');
    newGameButton.setAttribute('class', 'button');
    newGameButton.textContent = 'New game';
    newGameContainer.appendChild(newGameButton);
    newGameButton.addEventListener('click', gameStarting);
    // preparing for new game
    nameInput.value = ''
    currentTime = PLAYINGTIME;
};

function drawTableRow(userName, userScore) {
    // creating table row from the template
    const tableRow = document
        .querySelector('#table-row-template')
        .content
        .querySelector('.table-row')
        .cloneNode(true);

    const nameField = tableRow.querySelector('.user-name');
    const scoreField = tableRow.querySelector('.user-score');
    // and filling it
    nameField.textContent = userName;
    scoreField.textContent = userScore;
    recordsTable.appendChild(tableRow);
}


const drawTable = () => {
    // first step of drawing table - clear all table rows
    while (recordsTable.firstChild) {
        recordsTable.removeChild(recordsTable.firstChild);
    }
    // drawing table rows for each entry list element
    for (let i = 0; i < sortedList.length; i++) {
        drawTableRow(sortedList[i].name, sortedList[i].score);
    }
};

clearRecordsTableButton.addEventListener('click', () => {
    // clear local storage and all lists with data
    localStorage.clear();
    recordsList.length = 0;
    sortedList.length = 0;
    downloadedList.length = 0;
    // and the recordsTable
    while (recordsTable.firstChild) {
        recordsTable.removeChild(recordsTable.firstChild);
    }
    drawTable();
});


form.addEventListener('submit', e => {
    e.preventDefault();
    //creating the records list
    recordsList.push({name: nameInput.value, score: result + ''});
    // we took data from the local storage, if local storage is empty - downloadedList = []
    // and concatenate with recordsList, after that - sorting this array
    sortedList = [...downloadedList, ...recordsList].sort((a, b) => b.score - a.score);

    if (sortedList.length > 10) sortedList.length = 10; // if sorted list length bigger than 10, delete table row with the lowest score

    localStorage.setItem("array", JSON.stringify(sortedList));

    result = 0;
    score.textContent = result + '';
    timeLeft.textContent = PLAYINGTIME + '';
    toggleForm();
    drawTable();
    newGame();
});
