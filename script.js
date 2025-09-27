// ตัวแปรต่างๆ ที่ใช้ในเกม
let score = 0;
let timeCountDown = 0;
let timerInterval;
let answer = 0;
let inputIndex = 0;
let allQuiz = ["quizOne", "quizTwo"];
let currentQuizId = "";
let isReverseMode = false;

// Elements จาก HTML
const scoreElement = document.getElementById('live-score');
const timerElement = document.getElementById('timer');
const playPauseBtn = document.getElementById('play-pause-btn');
const pauseScreenElement = document.getElementById('pause-screen');

const topBarElement = document.getElementById('top-bar');
const activityAreaElement = document.getElementById('activity-area');
const appEndedDisplayElement = document.getElementById('app-ended-display');
const finalScoreElement = document.getElementById('final-score');
const userInputAreaElement = document.getElementById('user-input-area');
const userInputElement = document.getElementById('user-input');

// ปุ่มควบคุม
const reverseBtn = document.getElementById('reverse-btn');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const submitBtn = document.getElementById('submit-btn');

// Quiz elements
const quizOneElement = document.getElementById('quiz-one');
const quizTwoElement = document.getElementById('quiz-two');
const quizThreeElement = document.getElementById('quiz-three');
const quizOneNumOneElement = document.getElementById('quiz-one-number-one');
const quizOneNumTwoElement = document.getElementById('quiz-one-number-two');
const quizTwoNumOneElement = document.getElementById('quiz-two-number-one');
const quizTwoNumTwoElement = document.getElementById('quiz-two-number-two');

// Function เริ่มต้นเกม
function startApp() {
    score = 0;
    updateLiveScore();
    timeCountDown = 3 * 60; // 3 นาที
    updateTimer();

    // เริ่มจับเวลา
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    
    // ตั้งค่าหน้าจอ
    topBarElement.style.visibility = 'visible';    
    activityAreaElement.style.removeProperty('display');
    appEndedDisplayElement.style.visibility = 'hidden';
    timerElement.classList.remove('warning');

    // ซ่อน quiz ทั้งหมด
    quizOneElement.style.visibility = 'hidden';
    quizTwoElement.style.visibility = 'hidden';
    quizThreeElement.style.visibility = 'hidden';
    userInputAreaElement.style.visibility = 'hidden';

    // เริ่ม quiz แรก
    randomQuiz();
}

// Function อัปเดตคะแนน
function updateLiveScore() {
    scoreElement.textContent = `score: ${score}`;
}

// Function อัปเดตเวลา
function updateTimer() {
    timeCountDown--;
    const minutes = Math.floor(timeCountDown / 60);
    const seconds = timeCountDown % 60;
    timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // เพิ่ม class warning เมื่อเวลาน้อยกว่า 10 วินาที
    if (timeCountDown <= 10) {
        timerElement.classList.add('warning');
    }

    if (timeCountDown <= 0) {
        clearInterval(timerInterval);
        endApp();
    }
}

// Function สำหรับหยุดเกม
function pauseGame() {
    clearInterval(timerInterval);
    pauseScreenElement.style.visibility = 'visible';
}

// เพิ่ม: Function สำหรับเล่นเกมต่อ
function resumeGame() {
    clearInterval(timerInterval); // **แก้ไข: เคลียร์ interval เก่าก่อนเริ่มใหม่**
    timerInterval = setInterval(updateTimer, 1000);
    pauseScreenElement.style.visibility = 'hidden';
}

// Function สลับปุ่ม pause-play-btn
playPauseBtn.onclick = () => {
    if (playPauseBtn.textContent === '⏸') {
        playPauseBtn.textContent = '▶';
        playPauseBtn.style.paddingRight = "2px";
        pauseGame();
    } else {
        playPauseBtn.textContent = '⏸';
        playPauseBtn.style.paddingRight = ''; 
        resumeGame();
    }
};

// Function จบเกม
function endApp() {
    topBarElement.style.visibility = 'hidden';
    activityAreaElement.style.display = 'none';
    appEndedDisplayElement.style.visibility = 'visible';
    finalScoreElement.textContent = `SCORE: ${score}`;
    timerElement.classList.remove('warning');
}

// Function สุ่ม Quiz
function randomQuiz() {
    // เช็คว่าเวลาหมดรึยัง ถ้าหมดแล้วให้หยุดการทำงาน่ของ function
    if (timeCountDown <= 0) {
        return;
    }

    // ซ่อน quiz ก่อนหน้า
    if (currentQuizId) {
        document.getElementById(currentQuizId).style.visibility = 'hidden';
        userInputAreaElement.style.visibility = 'hidden';
    }
    
    // สุ่ม quiz
    const randomIdx = Math.floor(Math.random() * allQuiz.length);
    const selectedQuiz = allQuiz[randomIdx];

    switch (selectedQuiz) {
        case "quizOne":
            quizOne();
            break;
        case "quizTwo":
            quizTwo();
            break;
        case "quizThree":
            quizThree();
            break;
    }
}

// Helper function สำหรับการ random เลข
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function สำหรับการ format ตัวเลขด้วย comma
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Quiz One (บวก)
function quizOne() {
    currentQuizId = 'quiz-one';
    quizOneElement.style.visibility = 'visible';
    userInputAreaElement.style.visibility = 'visible';

    let num1, num2;
    do {
        // สุ่มเลขหลักร้อยหรือพัน (100-9999)
        num1 = getRandomNumber(100, 9999);
        num2 = getRandomNumber(100, 9999);
        // เช็คเงื่อนไข: ถ้า num2 เป็นหลักพัน แต่ num1 เป็นหลักร้อย ให้สุ่มใหม่
    } while (num2 >= 1000 && num1 < 1000);
    
    quizOneNumOneElement.textContent = formatNumber(num1);
    quizOneNumTwoElement.textContent = formatNumber(num2);
    
    answer = num1 + num2;
    createUserInputArea(String(answer).length);
}

// Quiz Two (ลบ)
function quizTwo() {
    currentQuizId = 'quiz-two';
    quizTwoElement.style.visibility = 'visible';
    userInputAreaElement.style.visibility = 'visible';
    
    let num1, num2;
    do {
        // สุ่มเลขหลักร้อยหรือพัน (100-9999)
        num1 = getRandomNumber(100, 9999);
        // สุ่มเลขหลักสิบ, ร้อย, พัน (10-9999)
        num2 = getRandomNumber(10, 9999);
    } while (num2 >= num1);
    
    quizTwoNumOneElement.textContent = formatNumber(num1);
    quizTwoNumTwoElement.textContent = formatNumber(num2);
    
    answer = num1 - num2;
    createUserInputArea(String(answer).length);
}

// Quiz Three
function quizThree() {
    currentQuizId = 'quiz-three';
    quizThreeElement.style.visibility = 'visible';
    
    setTimeout(() => {
        if (timeCountDown > 0) {
            randomQuiz();
        }
    }, 3000);
}

// Function สร้างช่องกรอกคำตอบ
function createUserInputArea(length) {
    userInputElement.innerHTML = '';
    const answerStr = String(answer);
    let commaAdded = false;

    for (let i = 0; i < length; i++) {
        // เพิ่ม comma ถ้ามี และยังไม่ได้เพิ่ม
        if (answerStr.length > 3 && i === answerStr.length - 3 && !commaAdded) {
            const commaSpan = document.createElement('span');
            commaSpan.className = 'comma';
            commaSpan.textContent = ',';
            userInputElement.appendChild(commaSpan);
            commaAdded = true;
        }

        const span = document.createElement('span');
        span.textContent = ' ';
        userInputElement.appendChild(span);
    }

    // กำหนด index การกรอก
    inputIndex = 0;
    checkInputDirection();
    updateHilightedSpan();   
}

// Function อัปเดต span ที่กำลังจะกรอก
function updateHilightedSpan() {
    const spans = userInputElement.querySelectorAll('span');
    spans.forEach(span => span.classList.remove('hilighted'));
    
    // หา span ที่ไม่ใช่ comma
    let realSpans = [];
    spans.forEach(span => {
        if (!span.classList.contains('comma')) {
            realSpans.push(span);
        }
    });

    // hilight ตำแหน่งที่กำลังกรอก
    if (inputIndex >= 0 && inputIndex < realSpans.length) {
        realSpans[inputIndex].classList.add('hilighted');
    }
}

// Function ตรวจสอบทิศทางการกรอก และสลับ hilight ไปที่ตำแหน่งแรกของการกรอก
function checkInputDirection() {
    const inputSpans = userInputElement.querySelectorAll('span:not(.comma)');
    const spansCount = inputSpans.length;
    if (isReverseMode) {
        inputIndex = spansCount - 1; // สลับไปที่หลักสุดท้าย
    } else {
        inputIndex = 0; // สลับไปที่หลักแรก
    }
    updateHilightedSpan();
}

// Function เมื่อกดปุ่มตัวเลข
function numberPadOnClick(number) {
    const spans = userInputElement.querySelectorAll('span:not(.comma)');
    if (inputIndex >= 0 && inputIndex < spans.length) {
        spans[inputIndex].textContent = number;
        // check ว่าจะเลื่อนการกรอกไปทิศทางไหน
        if (isReverseMode) {
            // โหมดกรอกย้อนกลับ: เลื่อนไปทางซ้าย (inputIndex--)
            if (inputIndex > 0) {
                inputIndex--;
            }
        } else {
            // โหมดปกติ: เลื่อนไปทางขวา (inputIndex++)
            if (inputIndex < spans.length - 1) {
                inputIndex++;
            }
        }
        updateHilightedSpan();
    }
}

// Function reverse ทิศทางการกรอก
reverseBtn.onclick = () => {
    isReverseMode = !isReverseMode;
    checkInputDirection();    
};

// Function เมื่อกดปุ่มซ้าย
leftBtn.onclick = () => {
    if (inputIndex > 0) {
        inputIndex--;
        updateHilightedSpan();
    }
};

// Function เมื่อกดปุ่มขวา
rightBtn.onclick = () => {
    const spans = userInputElement.querySelectorAll('span:not(.comma)');
    if (inputIndex < spans.length - 1) {
        inputIndex++;
        updateHilightedSpan();
    }
};

// Function เมื่อกดปุ่ม Submit
submitBtn.onclick = () => {
    // เลือกเฉพาะ span ตัวเลขสำหรับตรวจสอบคำตอบ
    const numberSpans = userInputElement.querySelectorAll('span:not(.comma)');
    let userAns = "";
    numberSpans.forEach(span => {
        userAns += span.textContent.trim();
    });

    // เลือกทุก span สำหรับการเปลี่ยนสี
    const allSpans = userInputElement.querySelectorAll('span');

    // ตรวจสอบคำตอบ
    if (parseInt(userAns, 10) === answer) {
        allSpans.forEach(span => span.classList.add('correct'));
        score++;
        updateLiveScore();
    } else {
        allSpans.forEach(span => span.classList.add('wrong'));
    }

    // รอ 1 วินาทีแล้วไป Quiz ต่อไป
    setTimeout(() => {
        allSpans.forEach(span => {
            span.classList.remove('correct');
            span.classList.remove('wrong');
        });
        randomQuiz();
    }, 1000);
};

// เริ่มต้นแอปเมื่อโหลดหน้าเว็บ
window.onload = startApp;
