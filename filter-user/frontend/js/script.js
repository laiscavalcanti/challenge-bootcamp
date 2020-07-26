let globalUsers = [];
let globalFilteredUsers = [];
let globalUsersStatistics = [];

async function start() {
    await promiseUsers();
    hideSpinner();
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
async function fetchUsers() {
  const resource = await fetch("http://localhost:3003/users");
  const json = await resource.json();

  globalUsers = json.map(({ name, picture, dob, gender, login }) => {
    return {
      userId: login.uuid,
      userName: name.first,
      userAge: dob.age,
      userPicture: picture.medium,
      userGerder: gender,
    };
  });
  console.log(globalUsers)
  globalUsers.sort((a) => a.userName);
  globalFilteredUsers = [...globalUsers]
  
}
function hideSpinner() {
    const spinner = document.querySelector("#spinner");
    spinner.classList.add("hide")
}
function configFilter(){
    const buttonFilter = document.querySelector("#buttonFilter");
    const inputFilter = document.querySelector("#inputFilter");
  
    //inputFilter.addEventListener("keyup", handleFilterKeyUp);
    buttonFilter.addEventListener("click", handleButtonClick);
}
function handleButtonClick(){
    const inputFilter = document.querySelector("#inputFilter");
    const filterValue = inputFilter.value.toLowerCase().trim();

    globalFilteredUsers = globalUsers.filter((item) => {
        return item.userName.toLowerCase().includes(filterValue);
    })
    render();
}


function render(){

    const divUsers = document.querySelector("#users");
        divUsers.innerHTML = `
            <div class= 'row'>
            ${globalUsers.map(({userName, userAge, userGerder}) =>{
                return `
                <div>
                    <span>${userName}</span>
                    <span>${userAge}</span>
        
                </div>
                `
            })
                .join("")}
            </div>
        `
}
start();