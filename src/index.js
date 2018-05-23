import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import run from './app';

const state = {
  feeds: new Set(),
  input: {
    isValid: false,
  },
};

run(state);
