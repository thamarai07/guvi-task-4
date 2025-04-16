const form = document.querySelector(".form");
const names = document.getElementById("name");
const amount = document.getElementById("amount");
const error = document.querySelectorAll(".error");
const eday = document.getElementById("eday");
const type = document.getElementById("type");
const dummypara = document.querySelector(".dummypara");
const submit = document.querySelector(".submit-btn");
const hidden_input = document.querySelector(".hidden_input");
const ul = document.querySelector("ul");
const filterButtons = document.querySelectorAll(".filter_btn");
const totalIncome = document.getElementById("total_income");
const totalExpenses = document.getElementById("total_expenses");
const netBalance = document.getElementById("net_balance");
const isValidChar = /^[a-zA-Z0-9\s]+/;
const isValidInt = /^\d+/;
const list = [];
let init = 0;
let currentFilter = "all";

const CharCheck = (input, value) => {
  error.forEach((item) => {
    if (item.classList.contains(input.name)) {
      item.classList.remove("hidden");
      if (input.name === "name") {
        if (!isValidChar.test(value) && value.length > 0) {
          item.innerHTML = "Please enter only alphanumeric characters";
        } else {
          item.innerHTML = "";
        }
      } else if (input.name === "amount") {
        if (!isValidInt.test(value) && value.length > 0) {
          item.innerHTML = "Please enter only numeric values";
        } else {
          item.innerHTML = "";
        }
      }
    }
  });
};

names.addEventListener("input", (e) => CharCheck(names, e.target.value));
amount.addEventListener("input", (e) => CharCheck(amount, e.target.value));

const calculateTotals = () => {
  const income = list
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + parseInt(item.amount), 0);
  const expenses = list
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + parseInt(item.amount), 0);
  const balance = income - expenses;

  totalIncome.textContent = `{income}`;
  totalExpenses.textContent = `{expenses}`;
  netBalance.textContent = `{balance}`;
  netBalance.style.color = balance >= 0 ? "green" : "red";
};

const renderList = () => {
  ul.innerHTML = "";
  const filteredList = list.filter(
    (item) => currentFilter === "all" || item.type === currentFilter
  );

  if (filteredList.length > 0) {
    ul.classList.remove("hidden");
    dummypara.classList.add("hidden");
    filteredList.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.className = "list_item";

      const nameSpan = document.createElement("span");
      nameSpan.className = "item_name";
      nameSpan.textContent = `Name: ${item.name}`;

      const amountSpan = document.createElement("span");
      amountSpan.className = "item_amount";
      amountSpan.textContent = `Amount: ${item.amount}`;

      const dateSpan = document.createElement("span");
      dateSpan.className = "item_date";
      dateSpan.textContent = `Date: ${item.date}`;

      const typeSpan = document.createElement("span");
      typeSpan.className = "item_type";
      typeSpan.textContent = `Type: ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}`;

      const viewBtn = document.createElement("button");
      viewBtn.className = "view_details";
      viewBtn.textContent = "Edit";
      viewBtn.dataset.id = item.id;

      const hiddenDataInput = document.createElement("input");
      hiddenDataInput.type = "hidden";
      hiddenDataInput.dataset.id = item.id;
      hiddenDataInput.dataset.name = item.name;
      hiddenDataInput.dataset.amount = item.amount;
      hiddenDataInput.dataset.date = item.date;
      hiddenDataInput.dataset.type = item.type;

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete";
      deleteBtn.textContent = "Delete";
      deleteBtn.dataset.id = item.id;

      listItem.append(
        nameSpan,
        amountSpan,
        dateSpan,
        typeSpan,
        hiddenDataInput,
        viewBtn,
        deleteBtn
      );
      ul.appendChild(listItem);
    });
  } else {
    ul.classList.add("hidden");
    dummypara.classList.remove("hidden");
  }

  calculateTotals();
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderList();
  });
});

ul.addEventListener("click", (e) => {
  if (e.target.classList.contains("view_details")) {
    const id = parseInt(e.target.dataset.id);
    const item = list.find((item) => item.id === id);
    if (item) {
      names.value = item.name;
      amount.value = item.amount;
      eday.value = item.date;
      type.value = item.type;
      hidden_input.value = id;
      submit.textContent = "Update";
      submit.style.background = "black";
      submit.style.color = "white";
    }
  } else if (e.target.classList.contains("delete")) {
    const id = parseInt(e.target.dataset.id);
    const index = list.findIndex((item) => item.id === id);
    if (index !== -1) {
      list.splice(index, 1);
      renderList();
    }
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let isValid = true;

  error.forEach((item) => {
    item.classList.add("hidden");
    item.innerHTML = "";
  });

  if (!names.value.trim()) {
    isValid = false;
    error.forEach((item) => {
      if (item.classList.contains("name")) {
        item.classList.remove("hidden");
        item.innerHTML = "Please enter the name of the entry";
      }
    });
  } else if (!isValidChar.test(names.value.trim())) {
    isValid = false;
    error.forEach((item) => {
      if (item.classList.contains("name")) {
        item.classList.remove("hidden");
        item.innerHTML = "Please enter only alphanumeric characters";
      }
    });
  }

  if (!amount.value.trim()) {
    isValid = false;
    error.forEach((item) => {
      if (item.classList.contains("amount")) {
        item.classList.remove("hidden");
        item.innerHTML = "Please enter the amount";
      }
    });
  } else if (!isValidInt.test(amount.value.trim())) {
    isValid = false;
    error.forEach((item) => {
      if (item.classList.contains("amount")) {
        item.classList.remove("hidden");
        item.innerHTML = "Please enter only numeric values";
      }
    });
  }

  if (!eday.value) {
    isValid = false;
    error.forEach((item) => {
      if (item.classList.contains("eday")) {
        item.classList.remove("hidden");
        item.innerHTML = "Please select a date";
      }
    });
  }

  if (!type.value) {
    isValid = false;
    error.forEach((item) => {
      if (item.classList.contains("type")) {
        item.classList.remove("hidden");
        item.innerHTML = "Please select a type";
      }
    });
  }

  if (isValid) {
    const id = parseInt(hidden_input.value);
    const data = {
      name: names.value.trim(),
      amount: amount.value.trim(),
      date: eday.value,
      type: type.value,
    };

    if (id) {
      const index = list.findIndex((item) => item.id === id);
      if (index !== -1) {
        list[index] = { ...data, id };
      }
    } else {
      init += 1;
      data.id = init;
      list.push(data);
    }
    console.log(data);
    renderList();
    names.value = "";
    amount.value = "";
    eday.value = "";
    type.value = "income";
    hidden_input.value = "";
    submit.textContent = "Submit";
    submit.style.background = "";
    submit.style.color = "";
  }
});
