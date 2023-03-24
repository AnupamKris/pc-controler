<template>
  <div class="about">
    <h1>This is an about page</h1>
    <input type="text" v-model="loc1" />
    <input type="text" v-model="loc2" />
    <button @click="writeUserData">WriteUserData</button>

    <textarea v-model="text" @input="hanldeInput"> </textarea>

    <div class="mouse" @mousemove="handleMouse"></div>
  </div>
</template>

<script setup>
import { getDatabase, onValue, set } from "firebase/database";
import { ref as refDB } from "firebase/database";
import { database } from "../firebaseConfig";
import { ref } from "vue";

const loc1 = ref(0);
const loc2 = ref(0);
const text = ref("");

function writeUserData() {
  set(refDB(database, "locs/" + "test"), {
    loc: [loc1.value, loc2.value],
  });
}

function writeText() {
  set(refDB(database, "text/" + "test"), {
    text: text.value,
  });
}

const hanldeInput = (e) => {
  text.value = e.target.value;
  writeText();
};

const handleMouse = (e) => {
  loc1.value = e.clientX;
  loc2.value = e.clientY;
  writeUserData();
};

onValue(refDB(database, "text/" + "test"), (snapshot) => {
  let data = snapshot.val();
  text.value = data.text;
});

onValue(refDB(database, "locs/" + "test"), (snapshot) => {
  let data = snapshot.val();
  loc1.value = data.loc[0];
  loc2.value = data.loc[1];
});
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}

.mouse {
  height: 400px;
  width: 400px;
  background: #b48484;
}
</style>
