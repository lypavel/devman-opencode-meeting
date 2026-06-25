const EMOJIS = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍒', '🍑', '🥝'];
const TIMER_INTERVAL = 1000;

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let lockBoard = false;
let timerSeconds = 0;
let timerInterval = null;

const board = document.getElementById('board');
const movesEl = document.getElementById('moves');
const timerEl = document.getElementById('timer');
const winMessage = document.getElementById('win-message');

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function updateTimerDisplay() {
  timerEl.textContent = formatTime(timerSeconds);
}

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    timerSeconds++;
    updateTimerDisplay();
  }, TIMER_INTERVAL);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  stopTimer();
  timerSeconds = 0;
  updateTimerDisplay();
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createBoard() {
  const pairs = [...EMOJIS, ...EMOJIS];
  shuffle(pairs);
  cards = pairs.map((emoji, index) => ({
    id: index,
    emoji,
    matched: false,
  }));
}

function renderBoard() {
  board.innerHTML = '';
  cards.forEach((card, index) => {
    const el = document.createElement('div');
    el.className = 'card';
    el.dataset.index = index;
    el.innerHTML = `
      <div class="card-inner">
        <div class="card-front">${card.emoji}</div>
        <div class="card-back">?</div>
      </div>
    `;
    el.addEventListener('click', () => onCardClick(index));
    board.appendChild(el);
  });
}

function onCardClick(index) {
  if (lockBoard) return;
  const card = cards[index];
  if (card.matched) return;
  const el = board.children[index];
  if (el.classList.contains('flipped')) return;

  el.classList.add('flipped');
  flippedCards.push(index);

  if (flippedCards.length === 2) {
    moves++;
    movesEl.textContent = moves;
    checkMatch();
  }
}

function checkMatch() {
  lockBoard = true;
  const [i1, i2] = flippedCards;
  const c1 = cards[i1];
  const c2 = cards[i2];

  if (c1.emoji === c2.emoji) {
    c1.matched = true;
    c2.matched = true;
    matchedPairs++;
    board.children[i1].classList.add('matched');
    board.children[i2].classList.add('matched');
    flippedCards = [];
    lockBoard = false;

    if (matchedPairs === EMOJIS.length) {
      stopTimer();
      winMessage.classList.remove('hidden');
      winMessage.textContent = `Поздравляем! Вы выиграли за ${moves} ходов!`;
    }
  } else {
    setTimeout(() => {
      board.children[i1].classList.remove('flipped');
      board.children[i2].classList.remove('flipped');
      flippedCards = [];
      lockBoard = false;
    }, 800);
  }
}

function resetGame() {
  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  lockBoard = false;
  movesEl.textContent = '0';
  winMessage.classList.add('hidden');
  resetTimer();
  startTimer();
  createBoard();
  renderBoard();
}

document.getElementById('new-game').addEventListener('click', resetGame);

resetGame();
