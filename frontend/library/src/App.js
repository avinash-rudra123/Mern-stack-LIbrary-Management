import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Dashboard from "./DashBoard/DashBoard";
import SignUp from "./user/SignUp";
import Login from "./user/Login";
import Edit from "./Admin/Edit";
import PrivateRoute from "./auth/PrivateRoute";
import Display from "./user/Display";
import AdminSignup from "./auth/AdminSignup";
import Create from "./Admin/Create";
import GetProduct from "./Admin/GetProduct";
import AdminLogin from "./auth/AdminLogin";
//import Menu from "./DashBoard/Menu";
import "./App.css";
function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Dashboard} />
        {/* <Route path="/" exact component={Menu} /> */}
        <Route path="/signup" component={SignUp} />
        <Route path="/login" exact component={Login} />
        <Route path="/admin/dashboard/create" exact component={Create} />
        <Route path="/admin/dashboard/getbook" exact component={GetProduct} />
        <Route path="/update/books/:id" exact component={Edit} />
        <Route path="/admin/signup" exact component={AdminSignup} />
        <Route path="/admin/login" exact component={AdminLogin} />
        <PrivateRoute path="/admin/login" exact component={PrivateRoute} />
        <Route path="/user/dashboard" component={Display} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
