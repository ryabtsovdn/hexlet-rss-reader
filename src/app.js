import { isURL } from 'validator';
import loadRSS from './rss';
import _ from 'lodash';

export default (state) => {
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
      const isAdded = _.find(state.feeds, { link: address });
      if (isAdded) {
        state.input.isValid = false;
        target.classList.add('is-invalid');
      } else {
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
    state.feeds.push({ link: feedAddress });
    loadRSS(state, feedAddress);
    feedInput.value = '';
  };

  feedInput.addEventListener('input', validateInput);
  addButton.addEventListener('click', addRSS);
};
