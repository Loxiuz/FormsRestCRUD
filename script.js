"use strict";

window.addEventListener("load", start);

const endpoint =
  "https://formsrestcrud-default-rtdb.europe-west1.firebasedatabase.app";

async function start() {
  updatePostsGrid();

  //---------------- Event listeners ----------------
  document
    .querySelector("#create_btn")
    .addEventListener("click", createBtnClick);
  document
    .querySelector("#creation-form")
    .addEventListener("submit", createPost);
}

//------------------CREATE FORM SECTION-----------------

//Create button click (show create dialog with form)
function createBtnClick() {
  console.log("Create button clicked!");
  document.querySelector("#creation-dialog").showModal();
}

//create post based on input in the create form. Makes the values into an object.
function createPost(event) {
  event.preventDefault();
  const elements = document.querySelector("#creation-form").elements;
  const postObject = {
    name: elements.name.value,
    creature: elements.creature.value,
    description: elements.description.value,
    size: elements.size.value,
    hitpoints: elements.hitpoints.value,
    stats_con: elements.stats_con.value,
    stats_dex: elements.stats_dex.value,
    stats_int: elements.stats_int.value,
    stats_str: elements.stats_str.value,
    attack: elements.attack.value,
    armor: elements.armor.value,
    level: elements.level.value,
    image: elements.image.value,
  };
  createPostSend(postObject);
  document.querySelector("#creation-form").reset();
  document.querySelector("#creation-dialog").close();
}

//Converts object to JSON, sends it to firebase and updates grid if response is ok.
async function createPostSend(newPost) {
  //The object gets made to a JSON-string
  const jsonString = JSON.stringify(newPost);
  //Use of fetch to POST the json string
  const response = await fetch(`${endpoint}/monsters.json`, {
    method: "POST",
    body: jsonString,
  });
  //Update to get the new post shown in the table
  if (response.ok) {
    console.log("creation successful");
    updatePostsGrid();
  }
}

//Gets posts from firebase
async function getPosts() {
  const response = await fetch(`${endpoint}/monsters.json`);
  const data = await response.json();
  return prepareData(data);
}

//shows posts in HTML.
function showPosts(posts) {
  document.querySelector(".post-grid").innerHTML = "";
  // Resets innerHTML in posts.
  for (const post of posts) {
    showPost(post);
  }

  //shows post in HTML.
  function showPost(post) {
    const htmlPostData = /*html*/ `
          <div class="post-item">
            <img src=${post.image}>
            <div id="post_name">Name: ${post.name}</div>
            <div id="post_creature">Creature: ${post.creature}</div>
            <div>Size: ${post.size}</div>
            <div>Hitpoints: ${post.hitpoints}</div>
            <div>Stats:</div>
            <div id="post_stats_section">
              <div>Constitution: ${post.stats_con}</div>
              <div>Dexterity: ${post.stats_dex}</div>
              <div>Intelligence: ${post.stats_int}</div>
              <div>Strength: ${post.stats_str}</div>
            </div>
            <div>Attack: ${post.attack}</div>
            <div>Armor: ${post.armor}</div>
            <div>Level: ${post.level}</div>
            <button class="btn-delete">Delete</button>
          </div>
          `;
    document
      .querySelector(".post-grid")
      .insertAdjacentHTML("beforeend", htmlPostData);
  }
}
//Creates new post from the json structure

function prepareData(dataObject) {
  let dataArray = [];
  for (const key in dataObject) {
    const data = dataObject[key];
    data.id = key;
    dataArray.push(data);
  }
  return dataArray;
}
//Updates post table
async function updatePostsGrid() {
  console.log("Update posts");
  const posts = await getPosts();
  showPosts(posts);
}
