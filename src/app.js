import _ from 'lodash';
import { isURL } from 'validator';
import loadFeed from './rss';

export default (_state) => {
  const state = _state;
  const feedInput = document.getElementById('feedInput');
  const addButton = document.getElementById('addRSS');

  const validateInput = ({ target }) => {
    const address = target.value;
    if (address === '') {
      state.isValidAddress = false;
      target.classList.remove('is-invalid');
      return;
    }
    if (isURL(address)) {
      const isAdded = _.find(state.feeds, { link: address });
      if (isAdded) {
        state.isValidAddress = false;
        target.classList.add('is-invalid');
      } else {
        state.isValidAddress = true;
        target.classList.remove('is-invalid');
      }
    } else {
      state.isValidAddress = false;
      target.classList.add('is-invalid');
    }
  };

  const addRSS = (event) => {
    event.preventDefault();
    feedInput.focus();

    if (!state.isValidAddress) {
      return;
    }

    const feedAddress = feedInput.value;
    loadFeed(state, feedAddress);
    feedInput.value = '';
    state.isValidAddress = false;
  };

  feedInput.addEventListener('input', validateInput);
  addButton.addEventListener('click', addRSS);
};
