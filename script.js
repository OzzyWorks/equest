// ===== プレイヤー =====
let player = {
  level: Number(localStorage.getItem("level")) || 1,
  exp: Number(localStorage.getItem("exp")) || 0,
  hp: 100
};

// ===== モンスター =====
let monster = {};
const monsters = [
  { name: "スライム", hp: 30 },
  { name: "ゴブリン", hp: 40 },
  { name: "コウモリ", hp: 35 }
];

// ===== 問題データ =====
const questions = [
  { q: "cat", choices: ["猫", "犬", "鳥", "魚"], a: "猫" },
  { q: "book", choices: ["机", "本", "紙", "ペン"], a: "本" },
  { q: "run", choices: ["歩く", "走る", "寝る", "見る"], a: "走る" },
  { q: "get up", choices: ["寝る", "起きる", "行く", "取る"], a: "起きる" },
  { q: "look at", choices: ["探す", "見る", "考える", "使う"], a: "見る" }
];

let currentQuestion;

// ===== DOM =====
const levelEl = document.getElementById("level");
const expEl = document.getElementById("exp");
const hpEl = document.getElementById("hp");
const monsterNameEl = document.getElementById("monster-name");
const monsterHpEl = document.getElementById("monster-hp");
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const logEl = document.getElementById("log");
const nextBtn = document.getElementById("next");

updateStatus();
nextBattle();

function updateStatus() {
  levelEl.textContent = player.level;
  expEl.textContent = player.exp;
  hpEl.textContent = player.hp;
}

function nextBattle() {
  monster = { ...monsters[Math.floor(Math.random() * monsters.length)] };
  monster.maxHp = monster.hp;
  monsterNameEl.textContent = monster.name;
  logEl.textContent = "";
  nextBtn.style.display = "none";
  loadQuestion();
  updateMonsterHp();
}

function loadQuestion() {
  currentQuestion = questions[Math.floor(Math.random() * questions.length)];
  questionEl.textContent = currentQuestion.q;
  choicesEl.innerHTML = "";
  currentQuestion.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => answer(choice, btn);
    choicesEl.appendChild(btn);
  });
}

function answer(choice, btn) {
  const buttons = document.querySelectorAll("#choices button");
  buttons.forEach(b => b.disabled = true);
  if (choice === currentQuestion.a) {
    btn.classList.add("correct");
    logEl.textContent = "正解！攻撃！";
    monster.hp -= 15;
    player.exp += 10;
  } else {
    btn.classList.add("wrong");
    logEl.textContent = "不正解…ダメージ！";
    player.hp -= 10;
  }
  checkBattle();
  updateStatus();
  save();
}

function checkBattle() {
  if (monster.hp <= 0) {
    logEl.textContent = "🎉 勝利！";
    nextBtn.style.display = "inline-block";
    levelUpCheck();
  } else if (player.hp <= 0) {
    logEl.textContent = "💀 敗北…HP回復";
    player.hp = 100;
    nextBtn.style.display = "inline-block";
  } else {
    setTimeout(loadQuestion, 500);
  }
  updateMonsterHp();
}

function updateMonsterHp() {
  const percent = (monster.hp / monster.maxHp) * 100;
  monsterHpEl.style.width = Math.max(percent, 0) + "%";
}

function levelUpCheck() {
  if (player.exp >= player.level * 50) {
    player.level++;
    player.exp = 0;
    player.hp = 100;
    logEl.textContent += " レベルアップ！";
  }
}

function save() {
  localStorage.setItem("level", player.level);
  localStorage.setItem("exp", player.exp);
}

nextBtn.onclick = nextBattle;
