//TODO get the firstname and avatar from cookie to use in the span

document.querySelector(
  "#div_nav_right label:first-of-type span"
).innerHTML = getCookie('firstname');

document.querySelector(
  "#div_nav_right label:first-of-type img"
).src = getCookie('avatar')

//To Get Data from the cookies
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const iframePages = document.getElementById("iframe_pages");

/////////////////////////////////////////////////////////////
// ------------------------ NavBar -----------------------//
///////////////////////////////////////////////////////////

document.getElementById("i_logo").addEventListener("click", function () {
  //remove selected effects from PersonalSpan
  document.querySelector(
    "#div_nav_right label:first-of-type"
  ).style.backgroundColor = "transparent";
  document.querySelector(
    "#div_nav_right label:first-of-type span"
  ).style.color = "black";

  iframePages.src = "login_int.html"; //TODO LINK
  navMiddleCheckedIndex = 0;
  navMiddleRadioGroup[0].checked = true;
  moveBlueSignUnderRadio(navMiddleRadioGroup[0]);
});

//TODO Search Effects when clicked & Facebook icon eventListener
let inputSearch = document.getElementById("in_search");
document.getElementById("span_search").addEventListener("click", function () {
  inputSearch.focus();
});

// ============== Middle Nav Buttons =============//

let navMiddleCheckedIndex = 0;
const navMiddleRadioGroup = document.getElementsByName("secNavMiddle");
const pages = [
  "home.html",
  "login.html",
  "marketplace.html",
  "groups.html",
  "gaming.html",
  "profile.html",
]; //TODO LINKS

navMiddleRadioGroup.forEach((radio, index) => {
  radio.addEventListener("click", function () {
    //remove selected effects from PersonalSpan
    profileBtnBackToUncheckedState(document.querySelector("#div_nav_right label:first-of-type"))

    //Remove red mark & reset the counter (as notification counter for example)
    radio.parentNode.style.setProperty("--contentBefore", "''");
    radio.parentNode.style.setProperty("--displayBefore", "none");

    moveBlueSignUnderRadio(radio);

    iframePages.contentDocument.location.replace(pages[index]);
    
    // iframePages.src = pages[index];
    navMiddleCheckedIndex = index;
  });
});

//TODO detect back pressing with this
// window.onhashchange = function() {
//   alert('baaaaaaaack')
//  }

function profileBtnBackToUncheckedState(element){

  //remove the light blue background and font color
  element.style.backgroundColor = "transparent";
  document.querySelector(
    "#div_nav_right label:first-of-type span"
  ).style.color = "black";

  //make the hover effect back
  element.addEventListener('mouseover',()=>{
    element.style.backgroundColor = "#64646411";
  })
  element.addEventListener('mouseout',()=>{
    element.style.backgroundColor = "transparent";
  })
  
}

function moveBlueSignUnderRadio(radio) {
  //All blue signs go down
  var i = 0;
  while(i < navMiddleRadioGroup.length){
    navMiddleRadioGroup[i].parentNode.style.setProperty("--bottomAfter", "-10px");
    i++;
  }

  //The chosen one comes up
  if (radio != null) radio.parentNode.style.setProperty("--bottomAfter", "-1px");
}

// ============== Right Side Nav Buttons =============//

let floatingDropList = document.getElementById("sec_drop_down");
let iframeDropList = document.getElementById("iframe_drop_down");

//Adding EventListeners to every icon in the right side
var navRightCheckedIndex = -1;
var navRightRadioGroup = document.getElementsByName("secNavRight");
const dropDownUrls = ["drop1.html", "drop2.html", "drop3.html", "droplists/logout_list.html"]; //TODO LINKS

navRightRadioGroup.forEach((radio, index) => {
  if (index == 0) {
    //index 0 means (personal img & name) in the nav bar
    radio.addEventListener("click", function () {
      iframePages.src = pages[5]; //Show Profile Page

      //Change PersonalSpan to get selected effects
      document.querySelector(
        "#div_nav_right label:first-of-type"
      ).style.backgroundColor = "#e7f3ff";
      document.querySelector(
        "#div_nav_right label:first-of-type span"
      ).style.color = "#1876f2";

      navMiddleRadioGroup[navMiddleCheckedIndex].checked = false;
      navMiddleCheckedIndex = -1;
      moveBlueSignUnderRadio(null);

      showOrHideDropList(false);
      navRightCheckedIndex = -1;
      document.getElementById;
    });
  } else {
    radio.addEventListener("click", function () {
      if (navRightCheckedIndex == index) {
        navRightCheckedIndex = -1;
        radio.checked = false;
        showOrHideDropList(false);
      } else {
        navRightCheckedIndex = index;
        radio.checked = true;
        showOrHideDropList(true);
        iframeDropList.src = dropDownUrls[index - 1]; //As index 0 is not count
      }
    });
  }
});

function showOrHideDropList(wantToShow) {
  if (wantToShow) {
    floatingDropList.style.opacity = "1";
    floatingDropList.style.pointerEvents = "auto";
    floatingDropList.style.transitionDuration = ".05s";
  } else {
    floatingDropList.style.transitionDuration = ".05s";
    floatingDropList.style.pointerEvents = "none";
    floatingDropList.style.opacity = "0";
  }
}

////////////////////////////////////////////////
// ----------------- Aside ------------------//
//////////////////////////////////////////////

let chatOptionsHead = document.querySelector("#li_chats_head_options i"),
  btnCloseAllChats = document.querySelector(
    "#li_chats_head_options #span_close_all_chats"
  );

btnCloseAllChats.style.display = "none";
chatOptionsHead.addEventListener("click", function () {
  if (btnCloseAllChats.style.display == "none") {
    btnCloseAllChats.style.display = "inline-block";
    chatOptionsHead.style.transform = "translateY(7px)";
  } else {
    btnCloseAllChats.style.display = "none";
    chatOptionsHead.style.transform = "translateY(0px)";
  }
});

//TODO check internet connection continuicely
