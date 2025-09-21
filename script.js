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

// ตัวแปรหลัก
let currentQuestion;
let score = 0;
let questionCount = 0;
let userAnswerDigits = [];
let currentIndex = 0;

const questionEl = document.getElementById("question");
const userDigitsEl = document.getElementById("user-digits");
const digitPad = document.getElementById("digit-pad");
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");
const submitBtn = document.getElementById("submit-btn");
const quizBox = document.getElementById("quiz-box");

function initQuiz() {
  showQuestion();
}

function showQuestion() {
  if(questionCount>=10) {
    quizBox.innerHTML = `
      <div id="score-display">SCORE: ${score}/10</div>
      <button id="restart-btn">RESTART</button>
    `;
    document.getElementById("restart-btn").onclick = () => {
      score = 0; questionCount = 0;
      initQuiz();
    };
    return;
  }

  currentQuestion = generateQuestion();
  questionEl.innerHTML = currentQuestion.question;

  const len = currentQuestion.correctAnswer.length;
  userAnswerDigits = Array(len).fill("");
  currentIndex = 0;

  renderUserDigits();
}

function renderUserDigits() {
  userDigitsEl.innerHTML = "";

  // รวมตัวเลขแล้วทำ comma
  const answerStr = userAnswerDigits.join("").padStart(currentQuestion.correctAnswer.length, "0");
  const number = parseInt(answerStr) || 0;
  const formatted = number.toLocaleString();

  // แยกแต่ละตัวอักษร (ตัวเลข + comma)
  let charIndex = 0; // index สำหรับ userAnswerDigits
  formatted.split("").forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char;

    // ไฮไลท์เฉพาะตัวเลข (ไม่รวม comma)
    if (char !== ",") {
      if (charIndex === currentIndex) {
        span.style.borderBottom = "3px solid #569dcd";
      } else {
        span.style.borderBottom = "1px solid #ccc";
      }
      charIndex++;
    } else {
      // comma ไม่มีเส้นใต้
      span.style.borderBottom = "none";
    }

    userDigitsEl.appendChild(span);
  });
}


// ปุ่มตัวเลข
digitPad.querySelectorAll("button").forEach(btn=>{
  btn.onclick = () => {
    userAnswerDigits[currentIndex] = btn.textContent;
    if(currentIndex<userAnswerDigits.length-1) currentIndex++;
    renderUserDigits();
  };
});

// ปุ่มเลื่อน
leftBtn.onclick = ()=>{ if(currentIndex>0) currentIndex--; renderUserDigits(); };
rightBtn.onclick = ()=>{ if(currentIndex<userAnswerDigits.length-1) currentIndex++; renderUserDigits(); };

// ตรวจคำตอบ
submitBtn.onclick = ()=>{
  const answer = userAnswerDigits.join("");
  const isCorrect = answer===currentQuestion.correctAnswer;

  userDigitsEl.querySelectorAll("span").forEach(span=>{
    span.classList.remove("correct","wrong");
    span.classList.add(isCorrect?"correct":"wrong");
  });

  if(isCorrect) score++;
  questionCount++;

  const delay = isCorrect?800:1000;

  setTimeout(()=>{ showQuestion(); }, delay);
};

initQuiz();
