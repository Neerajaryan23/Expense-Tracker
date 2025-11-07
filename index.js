let budget = 0;
let totalExpense = 0;

const budgetInput = document.getElementById("budget-input");
const totalBudget = document.getElementById("total-budget");
const totalSpent = document.getElementById("total-spent");
const remaining = document.getElementById("remaining-balance");
const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");
const expenseList = document.getElementById("expense-list");

// Set initial budget
document.getElementById(`set-budget-btn`).addEventListener(`click`, () => {
  const value = parseFloat(budgetInput.value);
  if (value === `` || value <= 0) {
    alert(`Please enter a valid budget`);
    return;
  }
  budget = value;
  totalBudget.innerText = `₹${budget.toFixed(2)}`;
  budgetInput.value = ``;

  updateSummary();
  saveData();
});

// Add expense
let AddButton = document.querySelector(`#add-expense-btn`);

AddButton.addEventListener(`click`, () => {
  let desc = document.getElementById(`expense-input`).value;
  let category = document.getElementById(`category-select`).value;
  let amount = document.getElementById(`amount-input`).value;

  if (desc === `` || amount === ``) {
    alert(`Please enter valid data`);
    return;
  }

  totalExpense += parseFloat(amount);

  // Create table row for the expense
  let row = document.createElement(`tr`);
  row.innerHTML = `
  <td>${desc}</td>
  <td>${category}</td>
  <td>${amount}</td>
`;
  // Edit button
  const editBtn = document.createElement(`edit`);
  editBtn.textContent = `🖊️`;
  editBtn.className = `edit`;
  editBtn.onclick = () => {
    const newText = prompt(`edit text`, desc);
    if (newText !== null && newText.trim() !== ``) {
      desc = newText;
      row.children[0].innerText = desc;
      const categoryText = prompt(`edit category`, category);
      if (categoryText !== null && categoryText.trim() !== ``) {
        category = categoryText;
        row.children[1].innerText = category;
      }
      const newAmount = prompt(`edit amount`, amount);
      if (newAmount !== null && !isNaN(newAmount) && newAmount.trim() !== ``) {
        totalExpense = totalExpense - parseFloat(amount) + parseFloat(newAmount);
        amount = newAmount;
        row.children[2].innerText = parseFloat(newAmount).toFixed(2);
        updateSummary();
        saveData();
      }
    }
  };

  // Delete button
  const deleteBtn = document.createElement(`delete`);
  deleteBtn.textContent = `🗑️`;
  deleteBtn.className = `delete`;
  deleteBtn.onclick = () => {
    totalExpense -= parseFloat(amount);
    expenseList.removeChild(row);
    updateSummary();
    saveData();
  };

  row.appendChild(deleteBtn);
  row.appendChild(editBtn);
  expenseList.appendChild(row);

  //clear input fields
  document.getElementById(`expense-input`).value = ``;
  document.getElementById(`category-select`).value = ``;
  document.getElementById(`amount-input`).value = ``;

  updateSummary();
  saveData();
});

// Update summary
function updateSummary() {
  const budgetLeft = Math.max(budget - totalExpense);
  const progress =
    budget > 0 ? Math.min((totalExpense / budget) * 100, 100) : 0;

  totalSpent.innerText = `₹${totalExpense.toFixed(2)}`;

  remaining.innerText = `₹${budgetLeft.toFixed(2)}`;

  progressText.innerText = `${progress.toFixed()}% Used`;

  progressBar.style.width = `${progress}%`;

  if (progress < 50) {
    document.getElementById(`progress-bar`).style.backgroundColor = `#4caf50`;
  } else if (progress < 75) {
    document.getElementById(`progress-bar`).style.backgroundColor = `#ff9800`;
  } else {
    document.getElementById(`progress-bar`).style.backgroundColor = `#f44336`;
  }
}

//Initial summary update
updateSummary();

// save data to local storage
function saveData() {
  const expenses = [];
  const rows = expenseList.querySelectorAll(`tr`);
  rows.forEach((row) => {
    const desc = row.children[0].innerText;
    const category = row.children[1].innerText;
    const amount = row.children[2].innerText;
    expenses.push({ desc, category, amount });
  });

  const data = {
    budget,
    totalExpense,
    expenses,
  };

  localStorage.setItem(`AppData`, JSON.stringify(data));
}

// load data from local storage

function loadData() {
  const data = JSON.parse(localStorage.getItem(`AppData`));
  if (data) {
    budget = data.budget;
    totalExpense = data.totalExpense;
    document.getElementById(`total-budget`).innerText = `₹${budget.toFixed(2)}`;

    data.expenses.forEach((expense) => {
      let row = document.createElement(`tr`);
      row.innerHTML = `
        <td>${expense.desc}</td>
        <td>${expense.category}</td>
        <td>${expense.amount}</td>
      `;
      let editBtn = document.createElement(`edit`);
      editBtn.textContent = `🖊️`;
      editBtn.className = `edit`;
      editBtn.onclick = () => {
        const newText = prompt(`edit text`, expense.desc);
        if (newText !== null && newText.trim() !== ``) {
          expense.desc = newText;
          row.children[0].innerText = expense.desc;
          const categoryText = prompt(`edit category`, expense.category);
          if (categoryText !== null && categoryText.trim() !== ``) {
            expense.category = categoryText;
            row.children[1].innerText = expense.category;
          }
          const newAmount = prompt(`edit amount`, expense.amount);
          if (
            newAmount !== null &&
            !isNaN(newAmount) &&
            newAmount.trim() !== ``
          ) {
            totalExpense =
              totalExpense - parseFloat(expense.amount) + parseFloat(newAmount);
            expense.amount = newAmount;
            row.children[2].innerText = expense.amount;
            updateSummary();
            saveData();
          }
        }
      };

      const deleteBtn = document.createElement(`delete`);
      deleteBtn.textContent = `🗑️`;
      deleteBtn.className = `delete`;
      deleteBtn.onclick = () => {
        totalExpense -= parseFloat(expense.amount);
        expenseList.removeChild(row);
        updateSummary();
        saveData();
      };
      row.appendChild(editBtn);
      row.appendChild(deleteBtn);
      expenseList.appendChild(row);
    });
  }
  updateSummary();
}

// reset app
document.getElementById(`reset-btn`).addEventListener(`click`, () => {
  if (
    confirm(`Are you sure you want to reset the app? This will clear all data.`)
  ) {
    budget = 0;
    totalExpense = 0;
    expenseList.innerHTML = ``;
    totalBudget.innerText = `₹0.00`;
    totalSpent.innerText = `₹0.00`;
    remaining.innerText = `₹0.00`;
    progressText.innerText = `0% Used`;
    progressBar.style.width = `0%`;
    updateSummary();
    localStorage.removeItem(`AppData`);
  }
});

// Load data on page load
window.onload = () => {
  loadData();
};
