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

  document
    .querySelector("#form-delete-post")
    .addEventListener("submit", deletePostClicked);

  document
    .querySelector("#btn-cancel")
    .addEventListener("click", closeDeleteDialog);

  makeFilterCreatureButtons();
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
  console.log("Get posts");
  const response = await fetch(`${endpoint}/monsters.json`);
  const data = await response.json();
  return prepareData(data);
}

//shows posts in HTML.
function showPosts(posts) {
  console.log("Show posts");
  //Deletes content in table before adding new content to make sure it updates correctly
  document.querySelector("#posts").innerHTML = "";
  //Shows data in html
  function showPost(post) {
    const htmlPostData = /*html*/ `
           <article class="post-item">
              <div id="post_name">${post.name}</div>
              <img src=${post.image}></>
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
              <button id="update_btn">Update Post</button>
              <button class="btn-delete" data-id="${post.id}">Delete</button>
           </article>
          `;
    document
      .querySelector(".post-grid")
      .insertAdjacentHTML("beforeend", htmlPostData);

    document
      .querySelector(".post-grid .post-item:last-child #update_btn")
      .addEventListener("click", () => {
        updateBtnClicked(post);
      });

    // delete btn
    document
      .querySelector(".post-grid .post-item:last-child .btn-delete")
      .addEventListener("click", deleteClicked);

    //delete clicked function
    function deleteClicked() {
      document.querySelector("#dialog-delete-post-title").textContent =
        post.title;
      document
        .querySelector("#form-delete-post")
        .setAttribute("data-id", post.id);
      document.querySelector("#dialog-delete-post").showModal();
    }
  }
  posts.forEach(showPost);
}
/* ------------------UPDATE FORM SECTION----------------- */
function updateBtnClicked(post) {
  console.log("Update button clicked");
  const updateForm = document.querySelector("#update-form");
  //Auto fill current values in post into input
  updateForm.name.value = post.name;
  updateForm.creature.value = post.creature;
  updateForm.description.value = post.description;
  updateForm.size.value = post.size;
  updateForm.hitpoints.value = post.hitpoints;
  updateForm.stats_con.value = post.stats_con;
  updateForm.stats_dex.value = post.stats_dex;
  updateForm.stats_int.value = post.stats_int;
  updateForm.stats_str.value = post.stats_str;
  updateForm.attack.value = post.attack;
  updateForm.armor.value = post.armor;
  updateForm.level.value = post.level;
  updateForm.image.value = post.image;

  //Show update post dialog
  const dialog = document.querySelector("#update-dialog");
  dialog.showModal();
  //Event for submitting update form
  document.querySelector("#update-form").addEventListener("submit", updatePost);

  async function updatePost(event) {
    console.log("Update post");
    event.preventDefault();

    const postToUpdate = {
      armor: updateForm.armor.value,
      attack: updateForm.attack.value,
      creature: updateForm.creature.value,
      description: updateForm.description.value,
      hitpoints: updateForm.hitpoints.value,
      image: updateForm.image.value,
      level: updateForm.level.value,
      name: updateForm.name.value,
      size: updateForm.size.value,
      stats_con: updateForm.stats_con.value,
      stats_dex: updateForm.stats_dex.value,
      stats_int: updateForm.stats_int.value,
      stats_str: updateForm.stats_str.value,
    };
    //Send the post to update with post id
    await updatePostSend(post.id, postToUpdate);
    dialog.close();
  }
}
//Update content of a post by id
async function updatePostSend(postId, postObjectToUpdate) {
  console.log("Send Updated post");
  const jsonString = JSON.stringify(postObjectToUpdate); //Javascript object to JSON string
  //Fetch PUT request with the specified element(id)
  const response = await fetch(`${endpoint}/monsters/${postId}.json`, {
    method: "PUT",
    body: jsonString,
  });
  //Only updates table if response is successful
  if (response.ok) {
    console.log("Update successful");
    updatePostsGrid();
  }
}

//Creates array from the json structure
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

function deletePostClicked(event) {
  const id = event.target.getAttribute("data-id"); // event.target is the delete form
  deletePost(id); // call deletePost with id
  console.log("im here");
}

async function deletePost(id) {
  const response = await fetch(`${endpoint}/monsters/${id}.json`, {
    method: "DELETE",
  });
  if (response.ok) {
    console.log("post deleted");
    updatePostsGrid();
    document.querySelector("#dialog-delete-post").close();
  }
}

function closeDeleteDialog() {
  document.querySelector("#dialog-delete-post").close();
}

/* ------------- Filter Buttons ------------- */

//Makes the buttons for the creature filter in html
async function makeFilterCreatureButtons() {
  console.log("Make Filter Creature Buttons");
  const creatures = await getCreaturesFromPosts();
  for (let i = 0; i < creatures.length; i++) {
    const creatureFilterBtnHtml = /* html */ `
      <input
        type="checkbox"
        name="creature"
        id="${creatures[i].toLowerCase()}"
        value="${creatures[i]}"
      />
      <label for="${creatures[i].toLowerCase()}">${creatures[i]}</label>
      <br/>
    `;
    document
      .querySelector("#filter-creature-form")
      .insertAdjacentHTML("beforeend", creatureFilterBtnHtml);
  }
  async function getCreaturesFromPosts() {
    console.log("Get creatures from posts");
    const posts = await getPosts();
    let differntCreatures = [];
    for (let i = 0; i < posts.length; i++) {
      if (!differntCreatures.includes(posts[i].creature)) {
        differntCreatures.push(posts[i].creature);
      }
    }
    return differntCreatures;
  }

  filterPostsByCheckedCreatures();
}
//Gets one of each different type of creature and puts it in a new array

//Filters post by creature
async function filterPostsByCheckedCreatures() {
  console.log("Filtered posts by creature");
  const posts = await getPosts();
  const filterForm = document.querySelector("#filter-creature-form");
  //Add event to form when it changes
  filterForm.addEventListener("change", () => {
    const selected = []; //Array with checkboxes that are checked
    const inputs = filterForm.querySelectorAll("input[type='checkbox']");
    const filteredPosts = []; //Array with post after being filterd
    //Makes the array with the checked boxes
    for (const input of inputs) {
      if (input.checked) {
        selected.push(input.value);
      }
    }
    //Fills the filteredPosts with posts that matches the checked boxes
    for (let i = 0; i < posts.length; i++) {
      if (selected.includes(posts[i].creature)) {
        filteredPosts.push(posts[i]);
      }
    }
    //Checks filteredPosts to make sure it only shows if it is not empty
    if (!filteredPosts.length == 0) {
      showPosts(filteredPosts);
    } else {
      updatePostsGrid();
    }
  });
}
