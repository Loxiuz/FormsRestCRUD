"use strict";

window.addEventListener("load", start);

const endpoint =
  "https://formsrestcrud-default-rtdb.europe-west1.firebasedatabase.app";

async function start() {
  updatePostsGrid();

  document.querySelector("#create_btn").addEventListener("click", () => {
    const stats = { str: 0, dex: 0, con: 0, int: 0 };
    createPost("", "", "", "", "", stats, "", 0, 0);
  });
}

function showCreateDialog() {}

async function submitCreate() {}

function showUpdateDialog() {}

async function getPosts() {
  const response = await fetch(`${endpoint}/monsters.json`);
  const data = await response.json();
  return prepareData(data);
}

function showPosts(posts) {
  console.log("Show posts");
  //Deletes content in table before adding new content to make sure it updates correctly
  document.querySelector(".post-grid").innerHTML = "";
  //Shows data in html
  function showPost(post) {
    const htmlPostData = /*html*/ `
          <div class="post-item">
            <div><image src=${post.image}></>
            <div id="post_name">Name: ${post.name}</div>
            <div id="post_creature">Creature: ${post.creature}</div>
            <div>Size: ${post.size}</div>
            <div>Hitpoints: ${post.hitpoints}</div>
            <div>Stats: ${JSON.stringify(post.stats)}</div>
            <div>Attack: ${post.attack}</div>
            <div>Armor: ${post.armor}</div>
            <div>Level: ${post.level}</div>
            
          </div>
          `;
    document
      .querySelector(".post-grid")
      .insertAdjacentHTML("beforeend", htmlPostData);
  }
  posts.forEach(showPost);
}
//Creates new post from the json structure
async function createPost(
  image,
  name,
  creature,
  size,
  hitPoints,
  stats,
  attack,
  armor,
  level
) {
  const newPost = {
    image,
    name,
    creature,
    size,
    hitPoints,
    stats,
    attack,
    armor,
    level,
  };
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

// TEST OM MERGE VIRKER
