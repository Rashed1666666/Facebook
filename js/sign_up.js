//Error msgs div to control later on
let divError = document.createElement("div");
let pError = document.createElement("p");
let arrowIco = document.createElement("img");

//pError position pDims = [top,right,bottom,left]
//arrowIco position aDims both based on index in iErrors array
//TODO edit the 5th & 6th element in pDims and aDims as they increase when reEmail.display = 'block'
let pDims = [
  ["2%", "100%", null, null],
  ["2%", "53%", null, null],
  ["10%", "100%", null, null],
  ["22%", "100%", null, null],
  ["24%", "100%", null, null],
  ["43%", "100%", null, null],
];
let aDims = [
  ["4%", "97.35%", null, null],
  ["4%", "50.55%", null, null],
  ["17%", "97.35%", null, null],
  ["25%", "97.35%", null, null],
  ["29%", "97.35%", null, null],
  ["48%", "97.35%", null, null],
];

///////////////////////////////////////////////////////
//---------- Selects Content & Age Errors ----------//
/////////////////////////////////////////////////////

let selectDay = document.getElementById("sel_day");
let selectMonth = document.getElementById("sel_month");
let selectYear = document.getElementById("sel_year");

let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

//===== Create days - months - years options and adding them to selects

for (var i = 1; i < 32; i++) {
  let iday = document.createElement("option");
  iday.innerHTML = i;
  selectDay.appendChild(iday);
}
for (var month of months) {
  let imonth = document.createElement("option");
  imonth.innerHTML = month;
  selectMonth.appendChild(imonth);
}
for (var i = 2022; i > 1904; i--) {
  let iyear = document.createElement("option");
  iyear.innerHTML = i;
  selectYear.appendChild(iyear);
}

// ===== to choose the current date by default

let currentDate = new Date();
selectDay.value = currentDate.getDate();
selectMonth.value = months[currentDate.getMonth()];
selectYear.value = currentDate.getFullYear();

// ========= when focus change check if the user is at least 5 years old
let selects = [selectDay, selectMonth, selectYear];
let isReadyToCheckDate = false;

selects.forEach((e) => {
  e.addEventListener("blur", function () {
    isReadyToCheckDate = true;

    setTimeout(() => {
      if (isReadyToCheckDate) {
        let age = calculateAge(
          new Date(
            selectYear.value,
            months.indexOf(selectMonth.value),
            selectDay.value
          )
        );

        checkForAgeLimit(
          age,
          document.getElementById("i_error_birth_date"),
          selects
        );
      }
    }, 50);
  });

  e.addEventListener("focus", function () {
    isReadyToCheckDate = false;
    divError.style.display = "none";

    //Just to remove ierror effects
    checkForAgeLimit(5, document.getElementById("i_error_birth_date"), selects);
  });
});

function calculateAge(dateOfBirth) {
  var x = Date.now() - dateOfBirth.getTime();
  var age = new Date(x);
  return Math.abs(age.getUTCFullYear() - 1970); //January 1st, 1970 00:00:00 UTC - first time use of Unix Time System
}

function checkForAgeLimit(age, ierror, selects) {
  if (age >= 5) {
    ierror.style.opacity = "0";
    ierror.style.pointerEvents = "none";
    selects[0].style.borderColor = "#e1e3e6";
    selects[1].style.borderColor = "#e1e3e6";
    selects[2].style.borderColor = "#e1e3e6";
  } else {
    ierror.style.opacity = "1";
    ierror.style.pointerEvents = "auto";
    selects[0].style.borderColor = "#ff0000";
    selects[1].style.borderColor = "#ff0000";
    selects[2].style.borderColor = "#ff0000";
  }
}

////////////////////////////////////////////////////////
// ------------------ Basic Data Inputs -------------//
//////////////////////////////////////////////////////

// ===== check if email is valid

let inputs = [
  "in_first_name",
  "in_surname",
  "in_email_phone",
  "in_re_email_phone",
  "in_password",
];
//TODO missing error for clicking signUp while gender is not selected
let iErrors = [
  "i_error_first_name",
  "i_error_surname",
  "i_error_email_phone",
  "i_error_re_email_phone",
  "i_error_password",
  "i_error_birth_date",
];
let msgErrors = [
  "What's your name?",
  "What's your name?",
  "You'll use this when you log in and if you ever need to reset your password.",
  "Please re-enter your email address.",
  "Enter a combination of at least six numbers, letters and punctuation marks (such as ! and &).",
  "It looks like you've entered the wrong info. Please make sure that you use your real date of birth.",
  "Please select your pronoun.",
];

let email = document.getElementById(inputs[2]);
let reEmail = document.getElementById(inputs[3]);

function checkEmailInput(event) {
  if (/^[a-z0-9+_.-]+@[a-z0-9-]+.(com|net|org)$/i.test(email.value)) {
    reEmail.style.display = "inline-block";
    pDims[4] = ["30%", "100%", null, null]
    aDims[4] = ["36%", "97.35%", null, null]
  } else {
    reEmail.style.display = "none";
    pDims[4] = ["24%", "100%", null, null]
    aDims[4] = ["29%", "97.35%", null, null]
    removeErrorMark(reEmail, 3);
  }
}

//Check if re-entering email matching
reEmail.addEventListener("blur", () => {
  if (reEmail.value == "") {
    msgErrors[3] = "Please re-enter your email address.";
    errorMarking(reEmail, 3);
  } else if (email.value != reEmail.value && reEmail.value != "") {
    msgErrors[3] = "Your emails do not match. Please try again.";
    errorMarking(reEmail, 3);
  }
});

// ======= check if element is empty when changing focus
inputs.forEach((element, index) => {
  let x = document.getElementById(element);

  x.addEventListener("focus", () => removeErrorMark(x, index));

  x.addEventListener("blur", () => {
    x.value == "" ? errorMarking(x, index) : removeErrorMark(x, index);

    if (index == 3) {
      if (email.value != reEmail.value) {
        errorMarking(x, index);
      }
    }
  });
});

function removeErrorMark(x, index) {
  x.style.outlineColor = "#ccd0d5";
  document.getElementById(iErrors[index]).style.opacity = "0";
  document.getElementById(iErrors[index]).style.pointerEvents = "none";
  divError.style.display = "none";
}
function errorMarking(x, index) {
  x.style.outlineColor = "#ff0000";
  document.getElementById(iErrors[index]).style.opacity = "1";
  document.getElementById(iErrors[index]).style.pointerEvents = "auto";
}

// ============= when i errors clicked show msg error

// Remember vars divError, pError, arrowIco

{
  //TODO (Optional) error from bottom not from the side
  divError.style.zIndex = "1";
  divError.id = "div_error";
  divError.addEventListener("click", () => {
    divError.style.display = "none";
  });

  pError.style.position = "absolute";
  pError.style.margin = "0px";
  pError.style.width = "fit-content";
  pError.style.boxShadow = "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px";
  pError.style.backgroundColor = "#be4b49";
  pError.style.color = "white";
  pError.style.border = "1px solid #9f3938";
  pError.style.borderRadius = "3px";
  pError.style.fontSize = "13px";
  pError.style.fontFamily = "Helvetica, sans-serif";
  pError.style.padding = "13px";

  arrowIco.src = "Resources/ic_arrow_s.png";
  arrowIco.style.position = "absolute";
  arrowIco.style.width = "12px";

  divError.appendChild(pError);
  divError.appendChild(arrowIco);
  divError.style.display = "none";
  document.getElementById("div_sign_up_form").appendChild(divError);
}

iErrors.forEach((element, index) => {
  let i = document.getElementById(element);
  i.addEventListener("click", () => {
    i.style.opacity = "0";
    i.pointerEvents = "none";

    //focus on the input & remove error effects
    //note index 5 means date selects error - doesn't need focus
    if (index == 5) {
      //Just to remove ierror effects
      checkForAgeLimit(
        5,
        document.getElementById("i_error_birth_date"),
        selects
      );
    } else {
      removeErrorMark(document.getElementById(inputs[index]), index);
      document.getElementById(inputs[index]).focus();
    }

    index == 3
      ? customizeErrorMsg(msgErrors[index], pDims[index], aDims[index])
      : customizeErrorMsg(msgErrors[index], pDims[index], aDims[index]);
  });
});

function customizeErrorMsg(msgError, pDim, aDim) {
  pError.innerHTML = msgError;

  pError.style.top = pDim[0];
  pError.style.right = pDim[1];
  pError.style.bottom = pDim[2];
  pError.style.left = pDim[3];

  arrowIco.style.top = aDim[0];
  arrowIco.style.right = aDim[1];
  arrowIco.style.bottom = aDim[2];
  arrowIco.style.left = aDim[3];

  divError.style.display = "block";
}

// ------------------ Gender Selects -----------------//

document.getElementById("custom").addEventListener("click", function () {
  document.getElementById("div_hidden_custom_gender").style.display = "block";
  divError.style.display = "none";
});
document.getElementById("male").addEventListener("click", function () {
  document.getElementById("div_hidden_custom_gender").style.display = "none";
  divError.style.display = "none";
});
document.getElementById("female").addEventListener("click", function () {
  document.getElementById("div_hidden_custom_gender").style.display = "none";
  divError.style.display = "none";
});

///////////////////////////////////////////////////////
// ----------------- Sign Up Confirmation ----------//
/////////////////////////////////////////////////////

document
  .getElementById("btn_sign_up")
  .addEventListener("click", () => setTimeout(signUpConfirm(), 300));

function signUpConfirm() {
  let canProcessKeepGoing = true;
  //Check that every input has a value
  inputs.forEach((e, i) => {
    let inp = document.getElementById(e);
    if (inp.value == "") {
      if (i != 5) document.getElementById(inputs[i]).focus();
      canProcessKeepGoing = false;
    }
  });

  //Check if Gender is selected and Age is reasonable
  if (getCheckedGenderIndex() == -1) {
    let genGroup = document.getElementsByName("gender");
    //Using CheckAgeLimit Function instead of creating new Function to check gender
    //TODO iErrors[6] still undefined
    checkForAgeLimit(4, iErrors[6], genGroup);
    canProcessKeepGoing = false;
    return;
  }

  //Check if there an error in any field
  iErrors.forEach((e, i) => {
    if (document.getElementById(e).style.opacity == 1) {
      //note index 5 means date selects error - doesn't need focus
      if (i != 5) document.getElementById(inputs[i]).focus();
      canProcessKeepGoing = false;
    }
  });

  //if all data are fine keep going in the registration process
  if (canProcessKeepGoing) {
    if(saveData()) location.replace("verify.html");
    else alert('Duplicated Email or User data')
  }
}

function getCheckedGenderIndex() {
  let genGroup = document.getElementsByName("gender");
  for (i = 0; i < genGroup.length; i++) {
    if (genGroup[i].checked) return i;
  }
  return -1;
}

// ------------ showSignUpCard ------------------//

function showOrHideSignUpCard() {
  let popUp = document.getElementById("div_sign_up_card");
  let overlay = document.getElementById("overlay");

  if (popUp.style.opacity == "1") {
    popUp.style.opacity = "0";
    popUp.style.transitionDuration = ".3s";
    popUp.style.pointerEvents = "none";

    overlay.style.opacity = "0";
    overlay.style.transitionDuration = ".2s";
    overlay.style.pointerEvents = "none";
  } else {
    popUp.style.opacity = "1";
    popUp.style.transitionDuration = ".3s";
    popUp.style.pointerEvents = "auto";

    overlay.style.opacity = "1";
    overlay.style.transitionDuration = ".2s";
    overlay.style.pointerEvents = "auto";
  }
}

///////////////////////////////////////////////////////////////////////
// -------- Pass Info to a cookie and Local Storage as DB ----------//
/////////////////////////////////////////////////////////////////////

/////////////////////////// USER STRUCTURE in Local Storage ///////////////////

// let user = {
//   username: "mohamed",
//   password: "12345678",
//   email: "mohamedgyaseen@gmail.com",
//   verified: false,
//   avatar: "img",
//   friends: [{
//       ffirstname: 'sameh',
//       fsurname: 'awad',
//       email: sameh97@yahoo.com,
//       avatar: Image,
//   }],
//   chats: [
//   { chatWith: 'samir Ahmed',  //FIRSTNAME + SURNAME
//     chatterEmail: 'samir@gmail.com', //EMAIL
//     messeges: [
//       {sender:'me',
//         body:'ISA',
//         c_reacts:0,//can be more as c_reacts: {love:0,like:0,sad:0,hahaha:0,angry:0}
//         seen_state: 1, //state 0: not sent yet/ 1: sent/2: delivered/3: seen
//       }
//     ]}
//    ],
//   posts: [
//     {
//       date: '1-5-2022 14:20'
//       body: "this is placeholder post text",
//       likes: 0, //p_reacts: {love:0,like:0,sad:0,hahaha:0,angry:0}
//       shares: 0,
//       reports: 0,
//       imgs: [],
//       vids: [],
//       comments: [
//         {
//           date: '1-5-2022 14:26'
//           cbody: "this is placeholder comment",
//           cname: "ahmed",
//           cavatar: "url",
//           likes: 0,
//           reports: 0,
//           replies: [],
//         },
//       ],
//     },
//   ],
// };

function saveData() {
  let _username = document.getElementById("in_email_phone").value.split("@")[0];
  let _pass = document.getElementById("in_password").value;
  // let userId = Math.random() * Math.pow(10, 9);

  let users;
  localStorage.getItem("users") != null
    ? (users = JSON.parse(localStorage.getItem("users")))
    : (users = []);

  //Get data from inputs
  let user = {
    firstname: document.getElementById(inputs[0]).value,
    surname: document.getElementById(inputs[1]).value,
    username: _username,
    password: _pass,
    email: document.getElementById(inputs[2]).value,
    avatar: "Resources/fb_starter_img.jpg", //Img by default is this until it's changed by the user
    posts: [],
    chats: [],
    friends: [],
    verified: false,
    userIndex: users.length
  };

  if (isUserAlreadyRegistered(user.email, users)) {
    return false
  } else {
    //Register New User in local Store
    if (users != null) users[users.length] = user;
    else users = [user];
    localStorage.setItem("users", JSON.stringify(users));

    //Make a cookie with user data to use it in the website
    const d = new Date();
    d.setTime(d.getTime() + 2 * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = "username" + "=" + _username + ";" + expires + ";path=/";
    document.cookie = "email" + "=" + user.email + ";" + expires + ";path=/";
    document.cookie = "avatar" + "=" + user.avatar + ";" + expires + ";path=/";
    document.cookie = "firstname" + "=" + user.firstname + ";" + expires + ";path=/";
    document.cookie = "surname" + "=" + user.surname + ";" + expires + ";path=/";
    document.cookie = "userIndex" + "=" + user.userIndex + ";" + expires + ";path=/";
    return true
  }
}

function isUserAlreadyRegistered(email, users) {
  var isAlreadyReg = false;

  if (users != null)
    users.forEach((user) => {
      if (user.email == email) isAlreadyReg = true;
    });
  else isAlreadyReg = false;

  return isAlreadyReg;
}
