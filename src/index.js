import React from "react";
import ReactDOM from "react-dom";
import Login from "@pages/Login";
import PageNotFound from "@pages/PageNotFound";
import "antd/dist/antd.css";
import "./index.css";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";
import moment from "moment";
import "moment/locale/zh-cn";
import zhCN from "antd/es/locale/zh_CN";
import { ConfigProvider } from "antd";
import * as serviceWorker from "./serviceWorker";
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
moment.locale("zh-cn");
ReactDOM.render(
  <Provider store={store}>
    <ConfigProvider locale={zhCN}>
      <Router>
        <Switch>
          <Route path="/admin" render={routeProps => <App {...routeProps} />} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/404" component={PageNotFound} />
          <Redirect to="/admin" from="/" />
          <Redirect to="/404" />
        </Switch>
      </Router>
    </ConfigProvider>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
