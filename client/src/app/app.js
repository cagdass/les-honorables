import React from 'react';
import { render } from 'react-dom';
import { Router, hashHistory } from "react-router";
import routes from "../routes.js";
import injectTapEventPlugin from 'react-tap-event-plugin';
import Main from "../components/main";

injectTapEventPlugin();

render(<Router routes={routes} history={hashHistory}/>, document.getElementById("app"));

// render(<Main />, document.getElementById('app'));
