import _ from 'lodash';
import { isURL } from 'validator';
import loadFeed from './rss';

export default (_state) => {
  const state = _state;
  const input = document.getElementById('feedInput');
  const addButton = document.getElementById('addRSS');

  const isURLValid = (url) => {
    const isAdded = _.find(state.feeds, { link: url });
    if (url === '' || isAdded || !isURL(url)) {
      return false;
    }
    return true;
  };

  const handleValidateInput = ({ target }) => {
    const url = target.value;
    if (isURLValid(url)) {
      state.isValidURL = true;
      target.classList.remove('is-invalid');
    } else {
      state.isValidURL = false;
      if (url === '') {
        target.classList.remove('is-invalid');
      } else {
        target.classList.add('is-invalid');
      }
    }
  };

  const handleAddRSS = (event) => {
    event.preventDefault();
    input.focus();

    if (state.isValidURL) {
      const feedURL = input.value;
      loadFeed(state, feedURL);
      input.value = '';
      state.isValidURL = false;
    }
  };

  input.addEventListener('input', handleValidateInput);
  addButton.addEventListener('click', handleAddRSS);
};
