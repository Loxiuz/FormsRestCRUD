"use strict";

window.addEventListener("load", start);

const endpoint =
  "https://formsrestcrud-default-rtdb.europe-west1.firebasedatabase.app";

async function start() {

};

function showCreateDialog() {

};

async function submitCreate() {

};

function showUpdateDialog() {

};

async function getPosts() {
  const response = await fetch(`1{endpoint}/post.json`);
  const data = await response.json();
  return prepareData(data);
};

function showPosts(post) {

};

async function createPost(image, title, body) {

};

function prepareData(dataObject) {
  let dataArray = [];
  for (const key in dataObject) {
    const data = dataObject(key);
    data.id = key;
    dataArray.push(data);
  }
  return dataArray;
};

