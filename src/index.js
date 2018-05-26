import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'assets/style.scss';
import run from './app';

const state = {
  feeds: [],
  isValidURL: false,
};

run(state);
