let inputFilter = null,
  buttonFilter = null,
  panelUsers = null,
  panelStatistics = null;
users = [];

window.addEventListener("load", async () => {
  mapElements();
  await fetchUsers();

  addEvents();
});

function mapElements() {
  inputFilter = document.querySelector("#inputFilter");
  buttonFilter = document.querySelector("#buttonFilter");
  panelUsers = document.querySelector("#users");
  panelStatistics = document.querySelector("#statistics");
}

async function fetchUsers() {
  const resource = await fetch("http://localhost:3003/users");
  const json = await resource.json();
  users = json
    .map(({ login, name, dob, gender, picture }) => {
      const fullName = `${name.first} ${name.last}`;
      return {
        id: login.uuid,
        name: fullName,
        nameLowerCase: fullName.toLowerCase(),
        age: dob.age,
        gender: gender,
        picture: picture.large,
      };
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  console.log(users);
}
/*function promiseUsers() {
  return new Promise(async (resolve, reject) => {
    const users = await fetchUsers();
    setTimeout(() => {
      console.log("promise resolvida");
      resolve(users);
    }, 1000);
  });
}*/

function addEvents() {
  inputFilter.addEventListener("keyup", handleKeyUp);
}

function handleKeyUp(event) {
  const currentKey = event.key;

  if (currentKey !== "Enter") {
    return;
  }
  const filterText = event.target.value;

  if (filterText.trim() !== "") {
    filterUsers(filterText);
  }
}

function filterUsers(filterText) {
  const filterTextLowerCase = filterText.toLowerCase();
  const filteredUsers = users.filter((user) => {
    return user.nameLowerCase.includes(filterTextLowerCase);
  });

  renderUsers(filteredUsers);
  renderStatistics(filteredUsers);
}

function renderUsers(users) {
  panelUsers.innerHTML = "";

  const h2 = document.createElement("h2");
  h2.textContent = `${users.length} usuário(s) encontrado(s)`;
  const ul = document.createElement("ul");

  users.forEach((user) => {
    const li = document.createElement("li");
    const img = `<img class="avatar" src="${user.picture}" alt="${user.name}" />`;
    const userData = `<span>${user.name} ${user.age}</span>`

    li.innerHTML = `<span>${img} ${userData}</span>`;
    ul.appendChild(li);
  });

  panelUsers.appendChild(h2);
  panelUsers.appendChild(ul);
}

function renderStatistics(users) {
  const countMale = users.filter((user) => user.gender === "male").length;
  const countFemale = users.filter((user) => user.gender === "female").length;

  const sumAges = users.reduce((acc, crr) => {
    return acc + crr.age;
  }, 0);

  const avaregeAges = Math.round(sumAges / users.length);
  panelStatistics.innerHTML = `<h2>Estatísticas</h2>
   
    <ul>
      <li>Sexo M <strong>${countMale}</strong></li>
      <li>Sexo F <strong>${countFemale}</strong></li>
      <li>Soma idades Homens <strong>${sumAges}</strong></li>
      <li>Soma idade Mulheres <strong>${avaregeAges}</strong></li>
    </ul>
  `;
}
