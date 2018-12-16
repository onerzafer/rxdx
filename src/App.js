import React, { Component } from "react";
import "./App.css";
import { ToDoEnhanced } from "./pages/todo";
import { Store } from './stores/store';
import { getToDosAction } from "./stores/todo/todo.actions";

class App extends Component {
  componentDidMount() {
    Store.dispatch(getToDosAction());
  }
  render() {
    return <ToDoEnhanced />;
  }
}

export default App;
