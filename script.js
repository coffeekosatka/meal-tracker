const meals = [
  { name: "Куриная грудка", protein: 30, fat: 3, carbs: 0, calories: 165 },
  { name: "Овсянка на молоке", protein: 5, fat: 4, carbs: 20, calories: 120 },
  { name: "Салат Цезарь", protein: 10, fat: 8, carbs: 5, calories: 140 },
  { name: "Плов с курицей", protein: 9, fat: 10, carbs: 25, calories: 190 },
  { name: "Борщ", protein: 4, fat: 5, carbs: 7, calories: 95 },
  { name: "Котлета с пюре", protein: 12, fat: 15, carbs: 20, calories: 220 },
  { name: "Рыба на пару", protein: 22, fat: 5, carbs: 0, calories: 130 }
];

const mealSelect = document.getElementById("meal");
const caloriesEaten = document.getElementById("calories-eaten");
const caloriesLeft = document.getElementById("calories-left");
const mealList = document.getElementById("meal-list");
const dateInput = document.getElementById("date");

let dailyLog = JSON.parse(localStorage.getItem("dailyLog")) || {};

meals.forEach(meal => {
  const option = document.createElement("option");
  option.value = meal.name;
  option.textContent = meal.name;
  mealSelect.appendChild(option);
});

function updateCalories() {
  const date = dateInput.value;
  const entries = dailyLog[date] || [];
  const total = entries.reduce((sum, name) => {
    const m = meals.find(meal => meal.name === name);
    return sum + (m ? m.calories : 0);
  }, 0);
  caloriesEaten.textContent = total;
  caloriesLeft.textContent = 2000 - total;

  mealList.innerHTML = "";
  entries.forEach((mealName, index) => {
    const meal = meals.find(m => m.name === mealName);
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = `${mealName} — ${meal?.calories || 0} ккал`;

    const btn = document.createElement("button");
    btn.textContent = "Удалить";
    btn.classList.add("delete-btn");
    btn.onclick = () => deleteMeal(index);

    li.appendChild(span);
    li.appendChild(btn);
    mealList.appendChild(li);
  });

  const fullLog = JSON.stringify(dailyLog, null, 2);
  console.log("Формат для сервера:", fullLog);
}

function addMeal() {
  const date = dateInput.value;
  const mealName = mealSelect.value;
  if (!date) {
    alert("Пожалуйста, выберите дату!");
    return;
  }
  if (!dailyLog[date]) dailyLog[date] = [];
  dailyLog[date].push(mealName);
  localStorage.setItem("dailyLog", JSON.stringify(dailyLog));
  updateCalories();
}

function deleteMeal(index) {
  const date = dateInput.value;
  if (!dailyLog[date]) return;
  dailyLog[date].splice(index, 1);
  localStorage.setItem("dailyLog", JSON.stringify(dailyLog));
  updateCalories();
}

dateInput.addEventListener("change", updateCalories);

// Устанавливаем сегодняшнюю дату по умолчанию и обновляем данные
window.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;
  updateCalories();
});

