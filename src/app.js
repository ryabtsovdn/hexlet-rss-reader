import { isURL } from 'validator';
import loadRSS from './rss';

export default (arg) => {
  const state = arg;
  const feedInput = document.getElementById('feedInput');
  const addButton = document.getElementById('addRSS');

  const validateInput = ({ target }) => {
    const address = target.value;
    if (address === '') {
      state.input.isValid = false;
      target.classList.remove('is-invalid');
      return;
    }
    if (isURL(address)) {
      const isAdded = state.feeds.has(address);
      if (!isAdded) {
        state.input.isValid = true;
        target.classList.remove('is-invalid');
      }
    } else {
      state.input.isValid = false;
      target.classList.add('is-invalid');
    }
  };

  const addRSS = (event) => {
    event.preventDefault();
    feedInput.focus();

    if (!state.input.isValid) {
      return;
    }
    const feedAddress = feedInput.value;
    state.feeds.add(feedAddress);
    /** */console.log(`loadRSS from ${feedAddress}`);
    loadRSS.bind(state, feedAddress)();
    feedInput.value = '';
  };

  feedInput.addEventListener('input', validateInput);
  addButton.addEventListener('click', addRSS);
};
