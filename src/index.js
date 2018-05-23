import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import run from './app';

const state = {
  feeds: [],
  input: {
    isValid: false,
  },
};

run(state);
