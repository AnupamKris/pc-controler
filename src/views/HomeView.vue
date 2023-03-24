<script setup>
import { io } from "socket.io-client";
import { ref, onMounted, onUnmounted } from "vue";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

const socket = ref(null);
const ip = ref("10.10.8.162");
const pos = ref({ top: 0, left: 0 });
const mouseDown = ref(false);
const prevTouches = ref([]);
const sensitivity = ref(0);

const hapticsImpactLight = async () => {
  await Haptics.impact({ style: ImpactStyle.Light });
};

const handleTouchMove = (e) => {
  // if (!mouseDown.value) return;
  // for (let i = 0; i < e.touches.length; i++) {
  // const touch = e.touches[0];

  // // if (touch.target.id === "touchpad") {
  // const prevTouch = prevTouches.value[0];
  // const movementX =
  //   ((touch.clientX - prevTouch.clientX) * sensitivity.value) / 100;
  // const movementY =
  //   ((touch.clientY - prevTouch.clientY) * sensitivity.value) / 100;
  // pos.value = {
  //   top: pos.value.top + movementY,
  //   left: pos.value.left + movementX,
  // };
  // socket.value.emit("mouse", {
  //   movementX,
  //   movementY,
  // });
  // }
  // }
  for (let i = 0; i < e.touches.length; i++) {
    const touch = e.touches[i];
    if (touch.target.id === "touchpad") {
      const prevTouch = prevTouches.value;
      const movementX =
        ((touch.clientX - prevTouch.clientX) * sensitivity.value) / 100;
      const movementY =
        ((touch.clientY - prevTouch.clientY) * sensitivity.value) / 100;
      pos.value = {
        top: pos.value.top + movementY,
        left: pos.value.left + movementX,
      };
      prevTouches.value = touch;

      socket.value.emit("mouse", {
        movementX,
        movementY,
      });
    }
  }
};

const handleTouchStart = (e) => {
  for (let i = 0; i < e.touches.length; i++) {
    const touch = e.touches[i];
    if (touch.target.id === "touchpad") {
      prevTouches.value = touch;
      mouseDown.value = true;
    }
  }
  // store lastclicktime
};

const connectToSocket = () => {
  socket.value = io(`http://${ip.value}:5000`);
  socket.value.on("connect", () => {
    socket.value.emit("messagee", "hello");
    console.log("connected");
    hapticsImpactLight();
  });

  socket.value.on("success", () => {
    console.log("success");
    hapticsImpactLight();
  });
};

const tapHandler = (e) => {
  if (e.target.id === "touchpad" && mouseDown.value == false) {
    // socket.value.emit("click", "left");
    socket.value.emit("click-rel", "left");
    hapticsImpactLight();
  }
};

const movingHandler = (e) => {
  if (!mouseDown.value) return;
  console.log(e, e.movementY);
  pos.value = {
    top: pos.value.top + e.movementY,
    left: pos.value.left + e.movementX,
  };
  console.log(pos.value);
  // socket.value.emit("mouse", e);
};

const handleDoubleTap = (e) => {
  console.log("double tap");
};
</script>

<template>
  <main>
    <input type="text" v-model="ip" />
    <button @click="connectToSocket">connect</button>

    <button @click="socket.emit('message', 'hello')">Send</button>
    <button @click="socket.emit('mouse', 'hello')">Send N</button>

    <div
      class="touch-area"
      id="touchpad"
      @touchstart="handleTouchStart"
      @touchend="mouseDown = false"
      @touchmove="handleTouchMove"
      @click="tapHandler"
    >
      <div
        class="moverdot"
        :style="{ top: pos.top + 'px', left: pos.left + 'px' }"
      ></div>
    </div>
    <input type="range" min="0" max="300" v-model="sensitivity" />
    <div class="buttons">
      <button
        @touchstart="
          socket.emit('click', 'left');
          hapticsImpactLight();
        "
        @touchend="socket.emit('release', 'left')"
      ></button>
      <button
        @touchstart="
          socket.emit('click', 'middle');
          hapticsImpactLight();
        "
        class="middle"
        @touchend="socket.emit('release', 'middle')"
      ></button>
      <button
        @touchstart="
          socket.emit('click', 'right');
          hapticsImpactLight();
        "
        @touchend="socket.emit('release', 'right')"
      ></button>
    </div>
  </main>
</template>

<style lang="scss" scoped>
main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  background: #141414;
  input {
    margin: 20px 0;
    width: 90%;
  }
}
.touch-area {
  width: 400px;
  height: 400px;
  background-color: #b6b6b6;
  position: relative;
  overflow: hidden;
  .moverdot {
    position: absolute;
    top: 10px;
    left: 10px;

    height: 10px;
    width: 10px;

    border-radius: 5px;
    background: #ff0000;
  }
}

.buttons {
  width: 90%;
  height: 60px;

  display: flex;
  justify-content: center;
  align-items: center;

  button {
    user-select: none;
    width: 150px;
    height: 100%;
    border-radius: 10px;
  }
  .middle {
    width: 50px;
  }
}
</style>
