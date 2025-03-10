const myModal = new bootstrap.Modal("#transction-modal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");
let data = {
  transactions: [],
};

document.getElementById("button-logout").addEventListener("click", logout);

checkLogged();

document.getElementById("button-trash").addEventListener("click", () => {
  deleteItems();
});

document.getElementById("transction-modal").addEventListener("submit", (e) => {
  e.preventDefault();

  const value = parseFloat(document.getElementById("value-input").value);
  const description = document.getElementById("description-input").value;
  const date = document.getElementById("date-input").value;
  const type = document.querySelector('input[name="type-input"]:checked').value;

  data.transactions.unshift({
    value: value,
    type: type,
    description: description,
    date: date,
  });

  saveData(data);
  e.target.reset();
  myModal.hide();

  getTransactions();
  alert("Lançamento adicionado com sucesso.");
});

function checkLogged() {
  if (session) {
    sessionStorage.setItem("logged", session);
    logged = session;
  }
  if (!logged) {
    window.location.href = "index.html";
    return;
  }

  const dataUser = localStorage.getItem(logged);
  if (dataUser) {
    data = JSON.parse(dataUser);
  }

  getTransactions();
}

function saveData(data) {
  localStorage.setItem(data.login, JSON.stringify(data));
}

function deleteData(data_indexes) {
  const transactions = data.transactions;

  data_indexes = data_indexes.sort((a, b) => b - a);

  for (let index of data_indexes) {
    transactions.splice(index, 1);
  }

  saveData(data);
}

function logout() {
  sessionStorage.removeItem("logged");
  localStorage.removeItem("session");

  window.location.href = "index.html";
}

function getTransactions() {
  const transactions = data.transactions;
  let transactionsHtml = ``;

  if (transactions.length) {
    transactions.forEach((item) => {
      let type = "Entrada";

      if (item.type === "2") {
        type = "Saída";
      }

      transactionsHtml += `
            <tr>
                <td><input type="checkbox" class="form-check-input" name="item-checkbox" onchange="verifyCheckboxes()"></td>
                <th scope="row">${item.date}</th>
                <td>${item.value.toFixed(2)}</td>
                <td>${type}</td>
                <td>${item.description}</td>
            </tr>
            `;
    });
  }
  document.getElementById("transactions-list").innerHTML = transactionsHtml;
}

function getCheckBoxes() {
  return document.getElementsByName("item-checkbox");
}

function verifyCheckboxes() {
  const all = document.getElementById("all-checkboxes");
  const btnTrash = document.getElementById("button-trash");
  const checkboxes = Array.from(getCheckBoxes());

  const isSelected = checkboxes.some((checkbox) => checkbox.checked);
  btnTrash.style.display = isSelected ? "block" : "none";

  all.checked = checkboxes.every((checkbox) => checkbox.checked) ? true : false;
}

function selectAllCheckboxes() {
  const all = document.getElementById("all-checkboxes");
  const checkboxes = getCheckBoxes();

  value = all.checked ? true : false;

  checkboxes.forEach((checkbox) => {
    checkbox.checked = value;
  });

  verifyCheckboxes();
}

function deleteItems() {
  const checkboxes = getCheckBoxes();
  const elementsIndexes = [];
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      let index = checkbox.parentNode.parentNode.rowIndex;
      elementsIndexes.push(index - 1);
    }
  });
  deleteData(elementsIndexes);
  document.getElementById("button-trash").style.display = "none";
  getTransactions();
  alert("Lançamentos removidos com sucesso.");
}
