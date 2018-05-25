import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import run from './app';

const state = {
  feeds: [],
  isValidURL: false,
};

run(state);
