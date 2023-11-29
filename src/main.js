import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.jsx";
import router from "./router";

import "@unocss/reset/tailwind.css";
import "./styles/main.css";
import 'virtual:uno.css'

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
