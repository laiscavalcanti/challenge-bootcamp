let globalUsers = [];
let globalCountries = [];
let globalUsersCountries = [];
let globalFilteredUsersCountries = [];

async function start() {
  //normal
  // await fetchUsers();
  // await fetchCountries();

  //Promise sequencial
  //await promiseCountries();
  //await promiseUsers();

  //promise paralela
  const p1 = promiseUsers();
  const p2 = promiseCountries();

  await Promise.all([p1, p2]);

  hideSpinner();
  mergeUsersAndCountries();
  render();
  configFilter();
}
function promiseUsers() {
  return new Promise(async (resolve, reject) => {
    const users = await fetchUsers();
    setTimeout(() => {
      console.log("promise resolvida");
      resolve(users);
    }, 1000);
  });
}
function promiseCountries() {
  return new Promise(async (resolve, reject) => {
    const countries = await fetchCountries();
    setTimeout(() => {
      console.log("promise resolvida");
      resolve(countries);
    }, 500);
  });
}
async function fetchUsers() {
  const resource = await fetch("http://localhost:3002/users");
  const json = await resource.json();

  globalUsers = json.map(({ name, picture, login, nat }) => {
    return {
      userId: login.uuid,
      userCountry: nat,
      userName: name.first,
      userPicture: picture.large,
    };
  });
}
async function fetchCountries() {
  const resource = await fetch("http://localhost:3001/countries");
  const json = await resource.json();

  globalCountries = json.map(({ alpha2Code, name, flag }) => {
    return {
      countryId: alpha2Code,
      countryName: name,
      countryFlag: flag,
    };
  });
  console.log(globalCountries);
}
function hideSpinner() {
  const spinner = document.querySelector("#spinner");
  spinner.classList.add("hide");
}
function mergeUsersAndCountries() {
  globalUsersCountries = [];

  globalUsers.forEach((user) => {
    const country = globalCountries.find(
      (country) => country.countryId === user.userCountry
    );
    globalUsersCountries.push({
      ...user,
      countryName: country.countryName,
      countryFlag: country.countryFlag,
    });
  });

  globalUsersCountries.sort((a, b) => a.userName.localeCompare(b.userName));
  globalFilteredUsersCountries = [...globalUsersCountries];
}
function render() {
  const divUsers = document.querySelector("#users");
  divUsers.innerHTML = `
    <div class='row'>
        ${globalUsersCountries
          .map(({ countryFlag, userPicture, userName, countryName }) => {
            return `
            <div class='col s6 m4 l3'>
                <div class="flex-row bordered">
                    <img class='avatar' src='${userPicture}' alt='${userName}' />
                    </div class="flex-column">
                        <span>${userName}</span>
                        <img class="flag"  src="${countryFlag}" alt=${countryName}  />        
                    </div>
              </div>
            </div>
            `;
          })
          .join("")}
    </div>
    `;
}
function configFilter() {
  const buttonFilter = document.querySelector("#buttonFilter");
  const inputFilter = document.querySelector("#inputFilter");

  inputFilter.addEventListener("keyup", handleFilterKeyUp);
  buttonFilter.addEventListener("click", handleButtonClick);
}
function handleButtonClick() {
  const inputFilter = document.querySelector("#inputFilter");
  const filterValue = inputFilter.value.toLowerCase().trim();

  globalFilteredUsersCountries = globalUsersCountries.filter((item) => {
    return item.userName.toLowerCase().includes(filterValue);
  });
  render();
}
function handleFilterKeyUp({key}) {
  if (key !== "Enter") return;
  handleButtonClick();
}
start();
