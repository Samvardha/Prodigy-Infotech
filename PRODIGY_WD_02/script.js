let startTime;
let updatedTime;
let difference;
let timerInterval;
let running = false;

const watch = document.getElementById('watch');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const laps = document.getElementById('laps');

//Function for Start and Stop Button
function startStop() {
    if (!running) {
        startTime = new Date().getTime() - (difference || 0);
        timerInterval = setInterval(updateTime, 10);
        startBtn.textContent = 'Stop';
        startBtn.classList.add('active');
        running = true;
    } else {
        clearInterval(timerInterval);
        startBtn.textContent = 'Start';
        startBtn.classList.remove('active');
        running = false;
    }
}

//Function for Reset Button
function reset() {
    clearInterval(timerInterval);
    watch.textContent = '00:00.00';
    startBtn.textContent = 'Start';
    startBtn.classList.remove('active');
    running = false;
    difference = 0;
    laps.innerHTML = '';
}

//Function for Lap Button
function lap() {
    if (running) {
        const li = document.createElement('li');
        li.textContent = watch.textContent;
        laps.appendChild(li);
    }
}

//Function for displaying the Stopwatch
function updateTime() {
    updatedTime = new Date().getTime();
    difference = updatedTime - startTime;

    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    const hundredths = Math.floor((difference % 1000) / 10);

    watch.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
}

startBtn.addEventListener('click', startStop);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', lap);