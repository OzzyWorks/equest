// ===== プレイヤー =====
let player = {
  level: Number(localStorage.getItem("level")) || 1,
  exp: Number(localStorage.getItem("exp")) || 0,
  hp: 100
};

// ===== モンスター =====
let monster = {};
const monsters = [
  { name: "スライム", hp: 30, img: "🟢" },
  { name: "ゴブリン", hp: 40, img: "👺" },
  { name: "コウモリ", hp: 35, img: "🦇" },
  { name: "スケルトン", hp: 45, img: "💀" }
];

// ===== 問題 =====
const questions = [
  { type: "word", q: "decide", choices: ["決める", "切る", "望む", "続ける"], a: "決める" },
  { type: "word", q: "increase", choices: ["減る", "増える", "止まる", "変わる"], a: "増える" },
  { type: "phrase", q: "look for", choices: ["探す", "見る", "待つ", "世話する"], a: "探す" },
  { type: "grammar", q: "I ___ a student.", choices: ["am", "is", "are", "be"], a: "am" },
  { type: "grammar", q: "He ___ to school every day.", choices: ["go", "goes", "going", "went"], a: "goes" },
  { type: "context", q: "I get up at 6 a.m. every day.「get up」の意味は？", choices: ["起きる", "寝る", "出かける", "勉強する"], a: "起きる" }
];

let currentQuestion;

// ===== DOM =====
const levelEl = document.getElementById("level");
const expEl = document.getElementById("exp");
const hpEl = document.getElementById("hp");
const monsterNameEl = document.getElementById("monster-name");
const monsterHpEl = document.getElementById("monster-hp");
const monsterImageEl = document.getElementById("monster-image");
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
  monsterImageEl.textContent = monster.img;
  logEl.textContent = "";
  nextBtn.style.display = "none";

  loadQuestion();
  updateMonsterHp();
}

function loadQuestion() {
  currentQuestion = questions[Math.floor(Math.random() * questions.length)];

  let label = "【問題】";
  if (currentQuestion.type === "word") label = "【単語】";
  if (currentQuestion.type === "phrase") label = "【熟語】";
  if (currentQuestion.type === "grammar") label = "【文法】";
  if (currentQuestion.type === "context") label = "【文脈】";

  questionEl.textContent = label + " " + currentQuestion.q;
  choicesEl.innerHTML = "";

  currentQuestion.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => answer(choice, btn);
    choicesEl.appendChild(btn);
  });
}

function answer(choice, btn) {
  document.querySelectorAll("#choices button").forEach(b => b.disabled = true);

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
  monsterHpEl.style.width = Math.max((monster.hp / monster.maxHp) * 100, 0) + "%";
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
