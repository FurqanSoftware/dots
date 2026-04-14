import "@picocss/pico/css/pico.min.css";
import "./styles/app.css";
import { render } from "preact";
import { App } from "./app";

render(<App />, document.getElementById("app"));
