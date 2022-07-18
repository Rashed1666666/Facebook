function showOrHideNewPostCard() {
  let popUp = document.getElementById("div_modal");
  let overlay = document.getElementById("overlay");
  let textStored, linesCount;

  if (popUp.style.opacity == "1") {
    popUp.style.opacity = "0";
    popUp.style.transitionDuration = ".3s";
    popUp.style.pointerEvents = "none";

    overlay.style.opacity = "0";
    overlay.style.transitionDuration = ".2s";
    overlay.style.pointerEvents = "none";

    textStored = document.getElementById("in_new_post_content").value;
    linesCount = document.getElementById("in_new_post_content").rows;
    document.getElementById("in_new_post_starter").value = textStored;
    document.getElementById("in_new_post_starter").rows = linesCount;
    document.getElementById("in_new_post_starter").focus();
  } else {
    popUp.style.opacity = "1";
    popUp.style.transitionDuration = ".3s";
    popUp.style.pointerEvents = "auto";

    overlay.style.opacity = "1";
    overlay.style.transitionDuration = ".2s";
    overlay.style.pointerEvents = "auto";

    textStored = document.getElementById("in_new_post_starter").value;
    linesCount = document.getElementById("in_new_post_starter").rows;
    document.getElementById("in_new_post_content").value = textStored;
    document.getElementById("in_new_post_content").rows = linesCount;
    document.getElementById("in_new_post_content").focus();
  }
}

document.getElementById("img_user_modal").src = getCookie("avatar");
document.getElementById("h3_user_name").innerHTML =
  getCookie("firstname") + " " + getCookie("surname");
document.getElementById("in_new_post_content").placeholder =
  "What's in you mind, " + getCookie("firstname") + "?";
document.getElementById("in_new_post_starter").placeholder =
  "What's in you mind, " + getCookie("firstname") + "?";

document
  .getElementById("in_new_post_starter")
  .addEventListener("click", showOrHideNewPostCard);

document
  .getElementById("in_new_post_content")
  .addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      showOrHideNewPostCard();
    }
  });

document
  .getElementById("btn_confirm_post")
  .addEventListener("click", function () {
    let text = document.getElementById("in_new_post_content").value;
    let picture = document.getElementById("img_chosen").src;

    createNewPost(text, picture, null);

    //close modal and empty input
    document.getElementById("in_new_post_content").value = "";
    document.getElementById("img_chosen").src = "";
    document.getElementById("div_new_post_img").style.borderWidth = "0px";
    document.getElementById("img_chosen").style.display = "none";

    showOrHideNewPostCard();
  });

let inNewPostContent = document.getElementById("in_new_post_content");
inNewPostContent.addEventListener("input", function () {
  inNewPostContent.value.length != 0
    ? (document.getElementById("btn_confirm_post").disabled = false)
    : (document.getElementById("btn_confirm_post").disabled = true);
});

// add photo to post
var loadFile = function (event) {
  document.getElementById("div_new_post_img").style.borderWidth = "1px";
  var image = document.getElementById("img_chosen");
  image.src = URL.createObjectURL(event.target.files[0]);
  document.querySelector("#div_modal #div_new_post_img i").style.display =
    "inline-block";
};
var removeFile = function (event) {
  document.getElementById("div_new_post_img").style.borderWidth = "0px";
  var image = document.getElementById("img_chosen");
  image.src = "";
  document.querySelector("#div_modal #div_new_post_img i").style.display =
    "none";
};

//Change Writing Direction
document
  .getElementById("in_new_post_content")
  .addEventListener("input", function () {
    if (/^[^a-zA-Z0-9]+$/.test(this.value) && this.value != "") {
      document.getElementById("in_new_post_content").dir = "rtl";
    } else {
      document.getElementById("in_new_post_content").dir = "ltr";
    }
  });

// ========= Click listener to close drop list
document
  .getElementById("main_container")
  .addEventListener("click", function () {
    try {
      window.parent.showOrHideDropList(false);
      window.parent.navRightRadioGroup[
        window.parent.navRightCheckedIndex
      ].checked = false;
      window.parent.navRightCheckedIndex = -1;
    } catch (ex) {}
  });

// ========== Show Personal data came from cookies

document.getElementById("span_name").innerHTML =
  getCookie("firstname") + " " + getCookie("surname");
let personalImgs = document.getElementsByClassName("img-personal");

for (var i = 0; i < personalImgs.length; i++) {
  personalImgs[i].src = getCookie("avatar");
}

//////////////////////////////////////////////////////////////////////////////////////
// ------------------------ Data Grabbing Functions ------------------------------ //
////////////////////////////////////////////////////////////////////////////////////

let postsLayout = document.querySelector("#main_container section");
let noMorePosts = document.getElementById("div_no_more_posts");

// Show posts from local Storage

function gettingDataFromLocalServer(key, doWithData) {
  let posts;
  localStorage.getItem(key) == null
    ? (posts = [])
    : (posts = JSON.parse(localStorage.getItem(key)));
  doWithData(posts);
}

// gettingDataFromLocalServer('posts',makingPostsOutOfData)

// Show posts from API

function gettingDataFromOnlineServer(_url_req, isSubFromData, onSuccessDo) {
  let xhttp2 = new XMLHttpRequest();
  xhttp2.open("GET", _url_req, true);
  xhttp2.setRequestHeader("app-id", "62716eed4b07596db09ec071");
  xhttp2.send();
  xhttp2.onreadystatechange = function () {
    if (xhttp2.readyState == 4 && xhttp2.status == 200) {
      var response;
      isSubFromData
        ? (response = JSON.parse(this.response).data)
        : (response = JSON.parse(this.response));

      onSuccessDo(response, noMorePosts);
      return response;
    }
  };
}

gettingDataFromOnlineServer(
  "https://dummyapi.io/data/v1/post?limit=10",
  true,
  makingPostsOutOfData
);
function makingPostsOutOfData(Data, nextElement) {
  Data.forEach((post) => {
    let divCardPost = document.createElement("div");
    divCardPost.classList.add("div-card-post");
    divCardPost.id = post.postID;

    if (post.comments == undefined) post.comments = [];
    if (post.likeDetails == undefined)
      post.likeDetails = {
        like: [{ userID: "userID", firstName: "gaber", picture: "user img" }],
        love: [],
        care: [],
        hahaha: [],
        sad: [],
        wow: [],
        angry: [],
      };

    // =============== Post ================ //

    createPostHead(
      divCardPost,
      post.owner.picture,
      post.owner.firstName,
      post.owner.lastName,
      new Date(post.publishDate).toUTCString()
    );

    createPostBody(divCardPost, post.text, post.image);

    createPostCounters(
      divCardPost,
      post.likes,
      post.likeDetails,
      post.comments
    );

    createLikeCommentShareBtns(divCardPost, post);

    // =============== Comment Section ================ //

    post.comments.forEach((comment) => {
      showComment(
        divCardPost,
        comment.owner.name,
        comment.owner.picture,
        post.id,
        comment.text,
        comment.likes,
        comment.likeDetails
      );
    });

    createWriteAComment(divCardPost, getCookie("avatar"));

    //Insert post to the page
    postsLayout.insertBefore(divCardPost, nextElement);
  });
}

// searchForUserData("a.yasser20@gmail.com", "60d0fe4f5311236168a109d0")

//////////////////////////////////////////////////////////////////////////////////////
// ------------------------ Creational Functions --------------------------------- //
////////////////////////////////////////////////////////////////////////////////////

function createNewPost(text, picture, video) {
  //TODO Back to this comment
  // let comment = {
  //   owner: {
  //     name: "Ahmed Saber",
  //     userID: "c1",
  //     picture: "Resources/profile3.jpg",
  //   },
  //   text: "bla bla bla",
  //   image: "img",
  //   likes: 2,
  //   likeDetails: {
  //     like: [
  //       { userID: "userID", firstName: "gaber", picture: "user img" },
  //       { userID: "userID", firstName: "gaber", picture: "user img" },
  //     ],
  //     love: [],
  //     care: [],
  //     hahaha: [],
  //     sad: [{ userID: "", name: "Greeda", picture: "img" }],
  //     wow: [],
  //     angry: [
  //       { userID: "", name: "Greeda", picture: "img" },
  //       { userID: "", name: "Greeda", picture: "img" },
  //       { userID: "", name: "Greeda", picture: "img" },
  //     ],
  //   },
  // commentID: (Math.random() + 1).toString(36).substring(2),
  // relatedTo: null, //means not a reply
  // replies: ["c2"], //list of comments IDs related
  // };

  let newPost = {
    owner: {
      picture: getCookie("avatar"),
      firstName: getCookie("firstname"),
      lastName: getCookie("surname"),
    },
    postID: "po_" + Math.floor(Math.random() * 1000000000),
    publishDate: new Date().toUTCString(),
    text: text,
    image: picture,
    likes: 0,
    likeDetails: {
      like: [],
      love: [],
      care: [],
      hahaha: [],
      sad: [],
      wow: [],
      angry: [],
    },
    comments: [],
  };

  //Getting posts from local
  let localPosts;
  gettingDataFromLocalServer("posts", function (posts) {
    localPosts = posts;
  });

  //Adding Post
  localPosts.unshift(newPost); //Using unshift() to add for the beginning to let the new posts show up first

  //Back to save in local
  localStorage.setItem("posts", JSON.stringify(localPosts));

  makingPostsOutOfData(
    [newPost],
    document.getElementById("div_card_rooms").nextSibling
  );
}

//TODO data from comments be added dynamically / ownere
function showComment(
  divCardPost,
  ownerName,
  ownerPic,
  postID,
  commentText,
  commentLikes,
  commentLikeDetails
) {
  let divComment = document.createElement("div");
  divComment.classList.add("comment");

  let img_comment_creator = document.createElement("img");
  img_comment_creator.src = ownerPic;
  img_comment_creator.id = "img_comment_creator";

  let div1_1 = document.createElement("div");

  let divCContainer = document.createElement("div");
  divCContainer.className = "c-container";

  let h4_2 = document.createElement("h4"); //Comment Owner
  h4_2.innerHTML = ownerName;
  let p1_1 = document.createElement("p"); //Comment Body
  p1_1.innerHTML = commentText;
  let imgComment = document.createElement("img");
  imgComment.className = "img-comment";

  divCContainer.appendChild(h4_2);
  divCContainer.appendChild(p1_1);
  divCContainer.appendChild(imgComment);

  let span2_1 = document.createElement("span");

  let labelLikeComment = document.createElement("label");
  labelLikeComment.className = "l-like-comment";
  labelLikeComment.for = "checkbox_comment_like";

  let checkbox_comment_like = document.createElement("input");
  checkbox_comment_like.type = "checkbox";
  checkbox_comment_like.id = "checkbox_comment_like";

  let p1_2 = document.createElement("p");
  p1_2.innerHTML = "Like";

  labelLikeComment.appendChild(checkbox_comment_like);
  labelLikeComment.appendChild(p1_2);

  let p2_1 = document.createElement("p");
  p2_1.className = "reply-comment";
  p2_1.innerHTML = "Reply";
  let p2_2 = document.createElement("p");
  p2_2.innerHTML = "3 w";
  p2_2.className = "date-comment";

  //Publishing date for the comment

  span2_1.appendChild(labelLikeComment);
  span2_1.appendChild(p2_1);
  span2_1.appendChild(p2_2);

  let span3_1 = document.createElement("span");
  span3_1.classList.add("reactions-on-comment");

  let p3_1 = document.createElement("p");
  p3_1.classList.add("most-reaction-counter");
  p3_1.style.marginLeft = "4px";
  p3_1.innerHTML = commentLikes + "&#160;";

  if (commentLikes == 0) span3_1.style.display = "none";

  defineMostReactionsSubmitted(commentLikeDetails, span3_1, true);
  span3_1.appendChild(p3_1);

  div1_1.appendChild(divCContainer);
  div1_1.appendChild(span2_1);
  div1_1.appendChild(span3_1);

  divComment.appendChild(img_comment_creator);
  divComment.appendChild(div1_1);

  divCardPost.appendChild(divComment);
}

function createPostHead(divCardPost, avatar, firstname, lastname, publishDate) {
  let divPostHead = document.createElement("div");
  divPostHead.id = "div_post_head";
  let img_post_creator = document.createElement("img");
  img_post_creator.src = avatar;
  img_post_creator.id = "img_post_creator";

  let span1 = document.createElement("span");
  let h4_1_1 = document.createElement("h4");
  h4_1_1.id = "h4_post_creator_name";
  h4_1_1.innerHTML = firstname + " " + lastname;

  let span1_1 = document.createElement("span");
  span1_1.innerHTML = publishDate + " . ";
  let i1_1 = document.createElement("i");
  i1_1.id = "i_post_publicity_state";
  i1_1.classList.add(...["fa-solid", "fa-user-group", "fa-xs"]);
  span1_1.appendChild(i1_1);

  span1.appendChild(h4_1_1);
  span1.appendChild(span1_1);

  i2_1 = document.createElement("i");
  i2_1.id = "i_post_options";
  i2_1.classList.add("fas");
  i2_1.classList.add("fa-ellipsis");

  divPostHead.appendChild(img_post_creator);
  divPostHead.appendChild(span1);
  divPostHead.appendChild(i2_1);

  divCardPost.appendChild(divPostHead);
}

//TODO if you add video input this is the place
//TODO detect hashTag (Optional)

function createPostBody(divCardPost, text, image) {
  if (text.length != 0) {
    let p_post_caption = document.createElement("p");
    p_post_caption.innerHTML = text;
    p_post_caption.id = "p_post_caption";

    //Define direction of writing
    if (
      /^[^a-zA-Z0-9]+$/.test(p_post_caption.innerHTML) &&
      p_post_caption.innerHTML != ""
    ) {
      p_post_caption.dir = "rtl";
      p_post_caption.style.fontSize = "17px";
    } else p_post_caption.dir = "ltr";

    divCardPost.appendChild(p_post_caption);
  }

  let img_post_content = document.createElement("img");
  img_post_content.src = image;
  // img_post_content.addEventListener("error", function () {
  // p_post_caption.style.fontSize = "20px";
  // img_post_content.style.display = 'none'
  // });
  img_post_content.id = "img_post_content";
  divCardPost.appendChild(img_post_content);
}

function createPostCounters(divCardPost, likes, likeDetails, comments) {
  let div_post_interactions_counters = document.createElement("div");
  div_post_interactions_counters.id = "div_post_interactions_counters";
  let i_like_ico = document.createElement("i");

  //TODO change to love or hahaha
  i_like_ico.id = "i_like_ico";
  i_like_ico.classList.add("fas");
  i_like_ico.classList.add("fa-thumbs-up");
  i_like_ico.id = "i_like_ico";

  let span_post_interactions_counter = document.createElement("span");
  span_post_interactions_counter.id = "span_post_interactions_counter";
  span_post_interactions_counter.innerHTML = likes;

  let span_top_interactions_icons = document.createElement("span");
  span_top_interactions_icons.id = "span_top_interactions_icons";

  let span_comments_counter = document.createElement("span");
  span_comments_counter.id = "span_comments_counter";
  span_comments_counter.innerHTML = comments.length + " comments";

  let hr1 = document.createElement("hr");
  hr1.style.marginBottom = "2px";

  defineMostReactionsSubmitted(likeDetails, span_top_interactions_icons, false);

  if (likes != 0) {
    span_top_interactions_icons.appendChild(span_post_interactions_counter);
    div_post_interactions_counters.appendChild(span_top_interactions_icons);
    div_post_interactions_counters.style.marginBottom = "8px";
    divCardPost.appendChild(div_post_interactions_counters);
  }

  if (comments.length != 0) {
    div_post_interactions_counters.appendChild(span_comments_counter);
  }

  if (comments.length != 0 || likes != 0) {
    div_post_interactions_counters.style.marginBottom = "0px";
    divCardPost.appendChild(hr1);
  }
}

function createLikeCommentShareBtns(divCardPost, post) {
  let div_post_interactions = document.createElement("div");
  div_post_interactions.id = "div_post_interactions";

  let l_post_react = document.createElement("label");
  l_post_react.id = "l_post_react";
  l_post_react.for = "checkbox_like";

  let checkbox_like = document.createElement("input");
  checkbox_like.id = "checkbox_like";
  checkbox_like.type = "checkbox";
  let i_post_react = document.createElement("i");
  i_post_react.id = "i_post_react";
  i_post_react.classList.add("fa-regular");
  i_post_react.classList.add("fa-thumbs-up");
  i_post_react.style.marginRight = "6px";

  l_post_react.appendChild(checkbox_like);
  l_post_react.appendChild(i_post_react);
  l_post_react.innerHTML += "Like";

  let span_post_comment = document.createElement("span");
  span_post_comment.id = "span_post_comment";

  let i_post_comment = document.createElement("i");
  i_post_comment.id = "i_post_comment";
  i_post_comment.classList.add("fa-regular");
  i_post_comment.classList.add("fa-message");
  i_post_comment.style.marginRight = "6px";
  span_post_comment.appendChild(i_post_comment);
  span_post_comment.innerHTML += "Comment";
  span_post_comment.addEventListener("click", function () {
    document.querySelector("#" + post.postID + " #in_comment").focus();
  });

  let span_post_share = document.createElement("span");
  span_post_share.id = "span_post_share";

  let i_post_share = document.createElement("i");
  i_post_share.id = "i_post_share";
  i_post_share.classList.add("fas");
  i_post_share.classList.add("fa-share");
  i_post_share.style.marginRight = "6px";
  span_post_share.appendChild(i_post_share);
  span_post_share.innerHTML += " Share";
  //TODO share post (Optional)

  let hr2 = document.createElement("hr");
  hr2.style.marginTop = "2px";

  div_post_interactions.appendChild(l_post_react);
  div_post_interactions.appendChild(span_post_comment);
  div_post_interactions.appendChild(span_post_share);

  divCardPost.appendChild(div_post_interactions);
  divCardPost.appendChild(hr2);
}

function createWriteAComment(divCardPost, selfAvatar) {
  let div_write_comment = document.createElement("div");
  div_write_comment.id = "div_write_comment";
  let img_personal = document.createElement("img");
  img_personal.id = "img_personal";
  img_personal.className = "img-personal";
  img_personal.src = selfAvatar;

  let l_write_comment = document.createElement("label");
  l_write_comment.id = "l_write_comment";
  let in_comment = document.createElement("textarea");
  in_comment.id = "in_comment";
  in_comment.placeholder = "Write a comment";
  in_comment.rows = "1";
  in_comment.type = "text";
  in_comment.style.resize = "none";
  in_comment.style.overflow = "hidden";
  in_comment.style.padding = "4px 0px";

  let linesCount = 1;

  //reverse the typing direction based on what language you type in
  in_comment.addEventListener("input", function () {
    addOrRemoveLines(in_comment);

    if (/^[^a-zA-Z0-9]+$/.test(this.value) && this.value != "") {
      in_comment.dir = "rtl";
      span4_1.style.right = null;
      span4_1.style.left = "4px";
    } else {
      in_comment.dir = "ltr";
      span4_1.style.left = null;
      span4_1.style.right = "4px";
    }
  });

  //showComment when pressing enter or Add line when Enter + Shift
  in_comment.addEventListener("keydown", function (e) {
    addOrRemoveLines(e.target);

    if (e.key === "Enter") {
      if (e.shiftKey) {
        linesCount++;
        in_comment.rows = linesCount;
      } else {
        e.preventDefault();

        // divCardPost.removeChild(in_comment.parentNode.parentNode);

        showComment(
          divCardPost,
          getCookie("firstname") + " " + getCookie("surname"),
          getCookie("avatar"),
          divCardPost.id,
          e.target.value,
          0,
          []
        );

        // createWriteAComment(divCardPost, getCookie("avatar"));
        e.target.value = "";
        e.target.rows = "1";
      }
    }
  });

  //to decrease lines when removing

  let span4_1 = document.createElement("span");
  span4_1.className = "span-btns-in-comment";

  let i4_1 = document.createElement("i");
  i4_1.classList.add("fab");
  i4_1.classList.add("fa-pied-piper-square");
  let i5_1 = document.createElement("i");
  i5_1.classList.add("fab");
  i5_1.classList.add("fa-modx");
  let l1_1 = document.createElement("label");
  l1_1.for = "in_img_comment";
  let in_img_comment = document.createElement("input");
  in_img_comment.id = "in_img_comment";
  in_img_comment.type = "file";
  in_img_comment.style.display = "none";
  let i7_1 = document.createElement("i");
  i7_1.classList.add("fas");
  i7_1.classList.add("fa-camera");

  l1_1.appendChild(in_img_comment);
  l1_1.appendChild(i7_1);

  let i6_1 = document.createElement("i");
  i6_1.classList.add("fas");
  i6_1.classList.add("fa-face-laugh-wink");

  span4_1.appendChild(i4_1);
  span4_1.appendChild(i5_1);
  span4_1.appendChild(l1_1);
  span4_1.appendChild(i6_1);
  span4_1.style.position = "absolute";
  span4_1.style.bottom = "4px";
  span4_1.style.right = "4px";

  l_write_comment.appendChild(in_comment);
  l_write_comment.appendChild(span4_1);

  let span_comment_img = document.createElement("span");
  span_comment_img.id = "span_comment_img";
  let in_comment_img = document.createElement("img");
  in_comment_img.className = "in-comment-img";
  let i3_1 = document.createElement("i");
  i3_1.classList.add("fas");
  i3_1.classList.add("fa-xmark");

  span_comment_img.appendChild(in_comment_img);
  span_comment_img.appendChild(i3_1);

  div_write_comment.appendChild(img_personal);
  div_write_comment.appendChild(l_write_comment);
  div_write_comment.appendChild(span_comment_img);

  divCardPost.appendChild(div_write_comment);
}

//////////////////////////////////////////////////////////////////////////////////////
// ---------------------------- Helper Functions --------------------------------- //
////////////////////////////////////////////////////////////////////////////////////

function addOrRemoveLines(inputElement) {
  let calc =
    displayTextWidth(inputElement.value, "normal 14px Helvetica") -
    (inputElement.rows - 1) * inputElement.offsetWidth;

  if (calc > inputElement.offsetWidth - 200) {
    //add new line
    let lines = inputElement.rows + 1;
    inputElement.rows = lines;
  } else if (calc + 200 < 0) {
    let lines = inputElement.rows - 1;
    inputElement.rows = lines;
  }
}

function displayTextWidth(text, font) {
  let canvas =
    displayTextWidth.canvas ||
    (displayTextWidth.canvas = document.createElement("canvas"));
  let context = canvas.getContext("2d");
  context.font = font;
  let metrics = context.measureText(text);
  return metrics.width;
}

function defineMostReactionsSubmitted(likeDetails, parent) {
  let arrReactions = [
    likeDetails.like.length,
    likeDetails.love.length,
    likeDetails.care.length,
    likeDetails.hahaha.length,
    likeDetails.angry.length,
    likeDetails.wow.length,
    likeDetails.sad.length,
  ];

  checkMaxReaction(arrReactions, 3, parent);
  checkMaxReaction(arrReactions, 2, parent);
  checkMaxReaction(arrReactions, 1, parent);
}

function checkMaxReaction(arrReactions, zIndex, parent) {
  let max = Math.max(...arrReactions);
  if (max != 0) {
    let guide = arrReactions.indexOf(max);
    addReactionBasedOnComparison(guide, zIndex, parent);
    arrReactions[guide] = 0; //to work on the next max reaction
  }
}

function addReactionBasedOnComparison(guide, zIndex, parent) {
  switch (guide) {
    case 0:
      createReactionIcon("icons/react (1).svg", zIndex, parent);
      break;
    case 1:
      createReactionIcon("icons/react (2).svg", zIndex, parent);
      break;
    case 2:
      createReactionIcon("icons/react (3).svg", zIndex, parent);
      break;
    case 3:
      createReactionIcon("icons/react (4).svg", zIndex, parent);
      break;
    case 4:
      createReactionIcon("icons/react (5).svg", zIndex, parent);
      break;
    case 5:
      createReactionIcon("icons/react (6).svg", zIndex, parent);
      break;
    case 6:
      createReactionIcon("icons/react (7).svg", zIndex, parent);
      break;
  }
}

function createReactionIcon(img, zIndex, parent) {
  let img_like_ico = document.createElement("img");
  img_like_ico.src = img;
  img_like_ico.zIndex = zIndex; //TODO zIndex has to be checked again
  parent.appendChild(img_like_ico);
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

//TODO show comments
function showComments(comments) {
  comments.forEach((comment) => {
    if (comment.relatedTo == null) {
      //Create comments
    } else {
      //Create Replies
    }
  });
}

function likeDetection() {
  let checkboxReact = document.getElementById("checkbox_like");
  let iPostReact = document.getElementById("i_post_react");
  let wordReact = document.getElementById("p_post_like_word");
  checkboxReact.addEventListener("click", function () {
    var likes = eval(
      document.getElementById("span_post_interactions_counter").innerHTML
    );

    if (checkboxReact.checked) {
      //Change Like word color

      //Change Like sign and animate it
      iPostReact.classList.remove("fa-regular");
      iPostReact.classList.add("fas");
      iPostReact.style.transitionDuration = "2";
      iPostReact.style.transform = "rotate(-15deg) scale(1.5) translateY(-4px)";
      setTimeout(
        () => (iPostReact.style.transform = "rotate(0deg) scale(1)"),
        500
      );

      //increase Likes counter in post
      likes++;

      //TODO increase Likes in local Storage

      //icons
    } else {
      wordReact.style.color = "#535151";

      iPostReact.classList.add("fa-regular");
      iPostReact.classList.remove("fas");
      likes--;
    }
    document.getElementById("span_post_interactions_counter").innerHTML = likes;
  });
}
likeDetection();

//TODO later for final touch
function formatPublishDate(publishDate) {
  publishDate.split("T");
}

//TODO put this function in profile.js
function searchForUserData(email, userID) {
  //Search in local
  let users = JSON.parse(localStorage.getItem("users"));
  let userData;
  users.forEach((user) => {
    if (user.email == email) {
      userData = user;
      //take the data to show it with function
    }
  });
  if (userData == null && userID != null)
    //Search in API users
    gettingDataFromOnlineServer(
      "https://dummyapi.io/data/v1/user/" + userID,
      false,
      function (response) {
        //take the data to show it with function
      }
    );
  else alert("Something went wrong. No user data was found !");
}
