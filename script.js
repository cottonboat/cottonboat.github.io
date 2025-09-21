// --- สุ่มโจทย์ 3-4 หลัก ---
function generateQuestion() {
  const digits1 = Math.random() < 0.5 ? 3 : 4;
  const digits2 = Math.random() < 0.5 ? 3 : 4;

  const num1 = Math.floor(Math.pow(10, digits1 - 1) + Math.random() * (Math.pow(10, digits1) - Math.pow(10, digits1 - 1)));
  const num2 = Math.floor(Math.pow(10, digits2 - 1) + Math.random() * (Math.pow(10, digits2) - Math.pow(10, digits2 - 1)));

  let top, bottom;
  if (num1 >= 1000 || num2 >= 1000) {
    top = Math.max(num1,num2);
    bottom = Math.min(num1,num2);
  } else { top = num1; bottom = num2; }

  return {
    question: `
      <div class="equation">
        <div class="numbers">
          <div>${top.toLocaleString()}</div>
          <div>${bottom.toLocaleString()}</div>
        </div>
        <div class="operator">+</div>
      </div>
    `,
    correctAnswer: (num1 + num2).toString()
  };
}

// --- ตัวแปรหลัก ---
let currentQuestion;
let score = 0;
let questionCount = 0;
let userAnswerDigits = [];
let currentIndex = 0;

let questionEl, userDigitsEl, digitPad, leftBtn, rightBtn, submitBtn;
const quizBox = document.getElementById("quiz-box");

// set timer
let totalTime = 3 * 60; // 3 นาทีเป็นวินาที
let timerInterval;

function startTimer() {
  updateTimerDisplay(); // แสดงครั้งแรก
  timerInterval = setInterval(() => {
    totalTime--;
    updateTimerDisplay();

    if (totalTime <= 0) {
      clearInterval(timerInterval);
      endQuiz(); // เวลาหมด → แสดงคะแนน
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(totalTime / 60).toString().padStart(2, "0");
  const seconds = (totalTime % 60).toString().padStart(2, "0");
  const timerEl = document.getElementById("timer");
  timerEl.textContent = `${minutes}:${seconds}`;

  // เปลี่ยนสีเมื่อเวลาน้อยกว่า 10 วินาที
  if (totalTime <= 10) {
    timerEl.classList.add("warning");
  } else {
    timerEl.classList.remove("warning");
  }
}

function endQuiz() {
  // หยุด timer
  clearInterval(timerInterval);

  // ซ่อนส่วน quiz
  quizBox.style.display = "none";

  // แสดงคะแนน
  const scoreEl = document.createElement("div");
  scoreEl.id = "score-display";
  scoreEl.textContent = `SCORE: ${score}/10`;
  document.body.appendChild(scoreEl);

  // ปุ่มรีสตาร์ท
  const restartBtn = document.createElement("button");
  restartBtn.id = "restart-btn";
  restartBtn.textContent = "RESTART";
  restartBtn.onclick = () => {
    scoreEl.remove();
    restartBtn.remove();
    quizBox.style.display = "block";
    initQuiz();  // เริ่ม quiz ใหม่
  };
  document.body.appendChild(restartBtn);
}



// --- เริ่ม quiz / รีสตาร์ท ---
function initQuiz() {
  // คืนค่า HTML ของ quizBox
  quizBox.innerHTML = `
    <div id="question"></div>
    <div id="user-digits"></div>
    <div id="digit-pad">
      <button>0</button><button>1</button><button>2</button>
      <button>3</button><button>4</button><button>5</button>
      <button>6</button><button>7</button><button>8</button>
      <button>9</button>
    </div>
    <button id="left-btn">◀</button>
    <button id="right-btn">▶</button>
    <button id="submit-btn">SUBMIT</button>
  `;

  // รีเซ็ตตัวแปร
  currentQuestion = generateQuestion();
  userAnswerDigits = [];
  currentIndex = 0;
  score = 0;
  questionCount = 0;
  totalTime = 3 * 60;   // ตั้งเวลาใหม่
  startTimer();          // เริ่มนับถอยหลัง

  // เลือก DOM ใหม่
  questionEl = document.getElementById("question");
  userDigitsEl = document.getElementById("user-digits");
  digitPad = document.getElementById("digit-pad");
  leftBtn = document.getElementById("left-btn");
  rightBtn = document.getElementById("right-btn");
  submitBtn = document.getElementById("submit-btn");

  // ผูก event ให้ปุ่มตัวเลข
  digitPad.querySelectorAll("button").forEach(btn=>{
    btn.onclick = () => {
      userAnswerDigits[currentIndex] = btn.textContent;
      if(currentIndex<userAnswerDigits.length-1) currentIndex++;
      renderUserDigits();
    };
  });

  // ปุ่มเลื่อนหลัก
  leftBtn.onclick = ()=>{ if(currentIndex>0) currentIndex--; renderUserDigits(); };
  rightBtn.onclick = ()=>{ if(currentIndex<userAnswerDigits.length-1) currentIndex++; renderUserDigits(); };

  // ปุ่ม submit
  submitBtn.onclick = checkAnswer;

  // แสดงโจทย์ข้อแรก
  showQuestion();
}

// --- แสดงโจทย์ ---
function showQuestion() {
  if(questionCount>=10) {
    // ครบ 10 ข้อ
    quizBox.innerHTML = `
      <div id="score-display">SCORE: ${score}/10</div>
      <button id="restart-btn">RESTART</button>
    `;
    document.getElementById("restart-btn").onclick = initQuiz;
    return;
  }

  currentQuestion = generateQuestion();
  questionEl.innerHTML = currentQuestion.question;

  // เตรียม array สำหรับกรอกตัวเลข
  const len = currentQuestion.correctAnswer.length;
  userAnswerDigits = Array(len).fill("");
  currentIndex = 0;

  renderUserDigits();
}

// --- แสดงตัวเลขที่กรอก พร้อม comma และ highlight หลัก ---
function renderUserDigits() {
  userDigitsEl.innerHTML = "";

  // รวมตัวเลขแล้วทำ comma
  const answerStr = userAnswerDigits.join("").padStart(currentQuestion.correctAnswer.length, "0");
  const number = parseInt(answerStr) || 0;
  const formatted = number.toLocaleString();

  let charIndex = 0;
  formatted.split("").forEach(char => {
    const span = document.createElement("span");
    span.textContent = char;

    if(char !== ",") {
      span.style.borderBottom = charIndex === currentIndex ? "3px solid #569dcd" : "1px solid #ccc";
      charIndex++;
    } else {
      span.style.borderBottom = "none";
    }

    userDigitsEl.appendChild(span);
  });
}

// --- ตรวจคำตอบ ---
function checkAnswer() {
  const answer = userAnswerDigits.join("");
  const isCorrect = answer === currentQuestion.correctAnswer;

  userDigitsEl.querySelectorAll("span").forEach(span => {
    span.classList.remove("correct","wrong");
    span.classList.add(isCorrect ? "correct" : "wrong"); // ใส่ทุก span
  });

  if(isCorrect) score++;
  questionCount++;

  const delay = isCorrect ? 800 : 1000;
  setTimeout(showQuestion, delay);
}

// --- เริ่ม ---
initQuiz();
