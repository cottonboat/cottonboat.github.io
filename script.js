// ฟังก์ชันสุ่มโจทย์เลขบวก 4 หลัก
function generateQuestion() {
  // สุ่มว่าโจทย์จะเป็น 3 หลักหรือ 4 หลัก
  const digits1 = Math.random() < 0.5 ? 3 : 4;
  const digits2 = Math.random() < 0.5 ? 3 : 4;

  const num1 = Math.floor(Math.pow(10, digits1 - 1) + Math.random() * (Math.pow(10, digits1) - Math.pow(10, digits1 - 1)));
  const num2 = Math.floor(Math.pow(10, digits2 - 1) + Math.random() * (Math.pow(10, digits2) - Math.pow(10, digits2 - 1)));

  // ตรวจว่ามีเลข 4 หลักไหม ถ้ามีให้เลข 4 หลักอยู่ด้านบน
  let top, bottom;
  if (num1 >= 1000 || num2 >= 1000) {
    if (num1 >= num2) {
      top = num1;
      bottom = num2;
    } else {
      top = num2;
      bottom = num1;
    }
  } else {
    top = num1;
    bottom = num2;
  }

const html = `
  <div class="equation">
    <div class="numbers">
      <div>${top.toLocaleString()}</div>
      <div>${bottom.toLocaleString()}</div>
    </div>
    <div class="operator">+</div>
  </div>
`;

  return {
    question: html,
    correctAnswer: (num1 + num2).toString()
  };
}

let currentQuestion = generateQuestion();
let score = 0;
let questionCount = 0;

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");

// ฟังก์ชันแสดงโจทย์
function showQuestion() {
  if (questionCount >= 10) {
    // ครบ 10 ข้อ → ซ่อนโจทย์ + ปุ่ม
    questionEl.style.display = "none";
    answersEl.style.display = "none";

  // สร้าง element score
  const scoreEl = document.createElement("div");
  scoreEl.id = "score-display"; // ใช้ CSS ใหม่
  scoreEl.textContent = `SCORE: ${score}/10`;
  document.body.appendChild(scoreEl);

  // สร้างปุ่มรีสตาร์ท
  const restartBtn = document.createElement("button");
  restartBtn.id = "restart-btn"; // ใช้ CSS ใหม่
  restartBtn.textContent = "RESTART";
  restartBtn.onclick = () => {
    score = 0;
    questionCount = 0;
    currentQuestion = generateQuestion();
    scoreEl.remove();
    restartBtn.remove();
    questionEl.style.display = "block";
    answersEl.style.display = "block";
    showQuestion();
    };
    document.body.appendChild(restartBtn);

    return;
  }

  // แสดงโจทย์และปุ่ม
  questionEl.style.display = "block";
  answersEl.style.display = "block";
  questionEl.innerHTML = currentQuestion.question;

  answersEl.innerHTML = "";
  const correct = currentQuestion.correctAnswer;
  let options = [correct];

  while (options.length < 3) {
    let fake = (parseInt(correct) + Math.floor(Math.random() * 200 - 100)).toString();
    if (!options.includes(fake) && parseInt(fake) > 0) options.push(fake);
  }

  options.sort(() => Math.random() - 0.5);

  options.forEach(answer => {
    let btn = document.createElement("button");
    btn.textContent = parseInt(answer).toLocaleString(); // แสดง comma
    btn.onclick = () => checkAnswer(answer, btn);
    answersEl.appendChild(btn);
  });
}

// ฟังก์ชันตรวจคำตอบ
function checkAnswer(answer, btn) {
  const buttons = answersEl.querySelectorAll("button");

  // ปิดการกดทุกปุ่ม
   buttons.forEach(b => {
    b.disabled = true;  // ป้องกันกดซ้ำ
    if (b !== btn) b.classList.add("inactive"); // ทำปุ่มอื่นจาง
  });

  // เปลี่ยนสีปุ่มที่ถูกกด
  if (answer === currentQuestion.correctAnswer) {
    btn.classList.add("correct"); // ฟ้า
    score++;
  } else {
    btn.classList.add("wrong");   // แดง
  }

  questionCount++;


  // รอ 1.2 วิแล้วสุ่มโจทย์ใหม่
  setTimeout(() => {
    currentQuestion = generateQuestion();
    showQuestion();
  }, 600);
}

// เริ่มต้น
showQuestion();
