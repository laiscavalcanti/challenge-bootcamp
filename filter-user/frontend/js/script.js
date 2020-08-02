let inputFilter = null,
    buttonFilter = null,
    panelUsers = null,
    panelStatistics = null;

window.addEventListener('load', () =>{
  mapElements();
  await promiseUsers();


})

function mapElements(){
  inputFilter = document.querySelector("#inputFilter");
  buttonFilter = document.querySelector("#buttonFilter");
  panelUsers = document.querySelector("#users");
  panelStatistics = document.querySelector("#statistics");
}

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
  users = json.results;

  globalUsers = json.map(({ name, picture, dob, gender, login }) => {
    return {
      userId: login.uuid,
      userName: name.first,
      userAge: dob.age,
      userPicture: picture.medium,
      userGerder: gender,
    };
  });
  console.log(globalUsers);
  globalUsers.sort((a => a.userName));
  globalFilteredUsers = [...globalUsers];
}
function hideSpinner() {
  const spinner = document.querySelector("#spinner");
  spinner.classList.add("hide");
}


function addEvents() {
 
    inputFilter.addEventListener('keyup', handleKeyUp);
}

function handleKeyUp(event){
  const currentKey = event.key;

    if(currentKey !== event.key){
      return;
    }
  const filterText = event.target.value
  console.log(filterText);
}
  const resultsUsers = document.querySelector("#resultsUsers");
  resultsUsers.innerHTML = `${globalFilteredUsers.length} usuário(s) encontrado(s)`;
  divUsers.innerHTML = `
            <div class= 'row'>
           ${globalFilteredUsers
             .map(({ userName, userAge, userGerder }) => {
               
               // console.log(userGender.length)
               return `
                <div>
                    <span>${userName}</span>
                    <span>${userAge}</span>
                    <span>${userGerder}</span>
                </div>
          
                
                `;
             })
             .join("")}
          
            </div>
        `;
}
/*function renderStatistics(){
  const divStatistics = document.querySelector("#statistics");
  //const filterGender = [d => d.userGender ==='male'];
  //console.log(filterGender.length)
       divStatistics.innerHTML = `
           <div class= 'row'> 
           ${globalFilteredUsers
           </div>
           `
    }*/

function handleButtonClick() {

  buttonFilter.addEventListener("click", () => {
    
    const filterValue = inputFilter.value.toLowerCase().trim();

    globalFilteredUsers = globalUsers.filter((item) => {
      return item.userName.toLowerCase().includes(filterValue);
    });

    renderUsers();
    //renderStatistics();
  });
}
start();
