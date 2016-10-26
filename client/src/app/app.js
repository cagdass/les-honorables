import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from "react-router";
import injectTapEventPlugin from 'react-tap-event-plugin';
import routes from "../routes.js";
import Main from "../components/main";


// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

render(<Router routes={routes} history={browserHistory}/>, document.getElementById("app"));

// render(<Main />, document.getElementById('app'));
