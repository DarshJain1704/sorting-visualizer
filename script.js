// --- Variables and DOM Elements ---
let array = [];
let arraySize = 30;
let speed = 100;
let isPaused = false;
let pauseResolve = null;
let stopRequested = false;

const arrayContainer = document.getElementById('array-container');
const sizeRange = document.getElementById('sizeRange');
const speedRange = document.getElementById('speedRange');
const sizeValue = document.getElementById('sizeValue');
const speedValue = document.getElementById('speedValue');
const newArrayBtn = document.getElementById('newArrayBtn');
const bubbleSortBtn = document.getElementById('bubbleSortBtn');
const shellSortBtn = document.getElementById('shellSortBtn');
const heapSortBtn = document.getElementById('heapSortBtn');
const endBtn = document.getElementById('endBtn');
const customArrayInput = document.getElementById('customArray');
const useCustomBtn = document.getElementById('useCustomBtn');
const pausePlayBtn = document.getElementById('pausePlayBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');


endBtn.disabled = true;

// --- Play Pause ---
function pause() {
  isPaused = true;
  pausePlayBtn.textContent = '▶️ Play'; 
}

function play() {
  isPaused = false;
  pausePlayBtn.textContent = '⏸️ Pause'; 
  if (pauseResolve) {
    pauseResolve();
  }
}

async function checkPaused() {
  if (isPaused) {
    await new Promise(resolve => (pauseResolve = resolve));
  }
}

pausePlayBtn.disabled = true; // Corrected variable name

// --- Utility Functions ---
function disableControls() {
  sizeRange.disabled = true;
  speedRange.disabled = true;
  newArrayBtn.disabled = true;
  bubbleSortBtn.disabled = true;
  shellSortBtn.disabled = true;
  heapSortBtn.disabled = true;
}
function enableControls() {
  sizeRange.disabled = false;
  speedRange.disabled = false;
  newArrayBtn.disabled = false;
  bubbleSortBtn.disabled = false;
  shellSortBtn.disabled = false;
  heapSortBtn.disabled = false;
}

// --- Array Generation and Display ---
function generateArray() {
  play();
  pausePlayBtn.disabled = true;
  stopRequested = true;
  endBtn.disabled = true;
  arraySize = Number(sizeRange.value);
  array = [];
  for (let i = 0; i < arraySize; i++) {
    array.push(Math.floor(Math.random() * 350) + 20);
  }
  displayArray();
}

function displayArray(activeIndices = []) {
  arrayContainer.innerHTML = '';
  const barWidth = Math.max(1000 / arraySize, 5); // Responsive bar width
  array.forEach((value, idx) => {
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.style.height = `${value}px`;
    bar.style.width = `${barWidth}px`;
    if (activeIndices.includes(idx)) {
      bar.classList.add('active');
    }
    arrayContainer.appendChild(bar);
  });
}

// --- Sorting Algorithms with Visualization ---
async function bubbleSort() {
  pausePlayBtn.disabled = false;
  stopRequested = false;
  endBtn.disabled = false;
  play();
  disableControls();
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      displayArray([j, j + 1]);
      await sleep(speed);
      if(stopRequested){
        enableControls();
        pausePlayBtn.disabled = true;
        endBtn.disabled = true;
        displayArray();
        return;
      }
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        displayArray([j, j + 1]);
        await sleep(speed);
        if(stopRequested){
        enableControls();
        pausePlayBtn.disabled = true;
        endBtn.disabled = true;
        displayArray();
        return;
      }
        await checkPaused();
      }
    }
  }
  displayArray();
  enableControls();
  pausePlayBtn.disabled = true;
  endBtn.disabled = true;
}

async function shellSort(){
  pausePlayBtn.disabled = false;
  stopRequested = false;
  endBtn.disabled = false;
  play();
  disableControls();
  let n = array.length;
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      let temp = array[i];
      let j;
      for (j = i; j >= gap && array[j - gap] > temp; j -= gap) {
        array[j] = array[j - gap];
        displayArray([j, j-gap]);
        await sleep(speed);
        await checkPaused();
        if(stopRequested){
            enableControls();
            pausePlayBtn.disabled = true;
            endBtn.disabled = true;
            displayArray();
            return;}
      }
      array[j] = temp;
      displayArray([j]);
      await sleep(speed);
      if(stopRequested){
        enableControls();
        pausePlayBtn.disabled = true;
        endBtn.disabled = true;
        displayArray();
        return;
      }
    }
  }
  displayArray();
  enableControls();
  pausePlayBtn.disabled = true;
  endBtn.disabled = true;
}

async function heapSort() {
  pausePlayBtn.disabled = false;
  stopRequested = false;
  endBtn.disabled = false;
  play();
  disableControls();
  let n = array.length;

  async function heapify(n, i) {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;
    if (l < n && array[l] > array[largest]) largest = l;
    if (r < n && array[r] > array[largest]) largest = r;
    if (largest !== i) {
      [array[i], array[largest]] = [array[largest], array[i]];
      displayArray([i, largest]);
      await sleep(speed);
      await checkPaused();
      await heapify(n, largest);
      if(stopRequested){
        enableControls();
        pausePlayBtn.disabled = true;
        endBtn.disabled = true;
        displayArray();
        return;
      }
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(n, i);
  }
  for (let i = n - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    displayArray([0, i]);
    await sleep(speed);
    await checkPaused();
    await heapify(i, 0);
    if(stopRequested){
        enableControls();
        pausePlayBtn.disabled = true;
        endBtn.disabled = true;
        displayArray();
        return;
      }
  }
  displayArray();
  enableControls();
  pausePlayBtn.disabled = true;
  endBtn.disabled = true;
}

// --- Helper Sleep Function ---
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// --- Event Listeners ---
sizeRange.addEventListener('input', function() {
  arraySize = this.value;
  sizeValue.textContent = arraySize;
  generateArray();
});

speedRange.addEventListener('input', function() {
  speed = this.value;
  speedValue.textContent = speed;
});

newArrayBtn.addEventListener('click', generateArray);
bubbleSortBtn.addEventListener('click', bubbleSort);
shellSortBtn.addEventListener('click', shellSort);
heapSortBtn.addEventListener('click', heapSort);
endBtn.addEventListener('click',function(){
    stopRequested = true;
    play();
});

useCustomBtn.addEventListener('click', function(){
    const input = customArrayInput.value
    .split(',')
    .map(num => Number(num.trim()))
    .filter(num => !isNaN(num));
    if(input.length === 0){
        alert('Please enter atleast one valid number, spearated by commas.')
        return;
    }
    array = input;
    arraySize = array.length;
    sizeRange.value = arraySize;
    sizeValue.textContent = arraySize;
    displayArray();
});

pausePlayBtn.addEventListener('click', function() {
  if (isPaused) {
    play();
  } else {
    pause();
  }
});

themeToggleBtn.addEventListener('click', function() {
  const isDark = document.body.classList.contains('dark');
  setTheme(!isDark);
});


// --- Initialize ---

function setTheme(dark) {
  if (dark) {
    document.body.classList.add('dark');
    themeToggleBtn.textContent = '☀️ Light Mode';
  } else {
    document.body.classList.remove('dark');
    themeToggleBtn.textContent = '🌙 Dark Mode';
  }
}

// Detect system preference on first load
window.onload = () => {
  sizeValue.textContent = arraySize;
  speedValue.textContent = speed;
  generateArray();

  // Dark mode preference
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(prefersDark);
};