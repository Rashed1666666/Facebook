// ------------------- Check if the user account can be found in the database -----------------//

document.getElementById("in_email_phone_login").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    console.log('triggered')
    pass.focus()
  }
})
document.getElementById("in_password_login").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    loginUser()
  }
});

function loginUser() {
  let email = document.getElementById("in_email_phone_login");
  let pass = document.getElementById("in_password_login");
  let users;
  localStorage.getItem("users") != null
    ? (users = JSON.parse(localStorage.getItem("users")))
    : (users = []);

  let userState = 0; //0: not registered / 1: registered but not verified / 2: registered & verified

  users.forEach((user) => {
    if (user.email == email.value && user.password == pass.value) {
      saveUserDataInCookie(
        user.email,
        user.username,
        user.firstname,
        user.surname,
        user.avatar,
        user.userIndex
      );
      user.verified == true ? (userState = 2) : (userState = 1);
      return;
    } else userState = 0;
  });

  if (userState == 0) {
    open("login_int.html", "_self");
  } else if (userState == 1) {
    window.location.replace("verify.html");
  } else window.location.replace("main_frame.html");
}

function saveUserDataInCookie(
  _email,
  _username,
  _firstname,
  _surname,
  _avatar,
  _userIndex
) {
  const d = new Date();
  d.setTime(d.getTime() + 2 * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();

  document.cookie = "email" + "=" + _email + ";" + expires + ";path=/";
  document.cookie = "username" + "=" + _username + ";" + expires + ";path=/";
  document.cookie = "firstname" + "=" + _firstname + ";" + expires + ";path=/";
  document.cookie = "surname" + "=" + _surname + ";" + expires + ";path=/";
  document.cookie = "avatar" + "=" + _avatar + ";" + expires + ";path=/";
  document.cookie = "userIndex" + "=" + _userIndex + ";" + expires + ";path=/";
}
