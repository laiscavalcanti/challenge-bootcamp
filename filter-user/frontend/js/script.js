let globalUsers = [];
let globalFilteredUsers = [];
let globalUsersStatistics = [];

async function start() {
    await promiseUsers();
    hideSpinner();
    handleButtonClick();
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
  globalFilteredUsers = [...globalUsers];
  console.log(globalFilteredUsers)
  
}
function hideSpinner() {
    const spinner = document.querySelector("#spinner");
    spinner.classList.add("hide")
}

/*function Users(){
      globalUsers.sort((a) => a.userName);
    
}*/
/*function configFilter(){
   
    const inputFilter = document.querySelector("#inputFilter");
  
    //inputFilter.addEventListener("keyup", handleFilterKeyUp);
    buttonFilter.addEventListener("click", handleButtonClick);
}*/

function render(){
   const divUsers = document.querySelector("#users");
        divUsers.innerHTML = `
            <div class= 'row'>
            ${globalFilteredUsers.map(({userName, userAge, userGerder}) =>{
                return `
                <div>
                    <span>${userName}</span>
                    <span>${userAge}</span>
                    <span>${userGerder}</span>
                    
                </div>
                `
            })
                .join("")}
            </div>
        `
}
function handleButtonClick(){

  const buttonFilter = document.querySelector("#buttonFilter");

  buttonFilter.addEventListener('click', () => {
    const inputFilter = document.querySelector("#inputFilter");
    const filterValue = inputFilter.value.toLowerCase().trim();

    globalFilteredUsers = globalUsers.filter((item) => {
      return item.userName.toLowerCase().includes(filterValue);
  });
  console.log(globalFilteredUsers)
  render();
})

}
start();