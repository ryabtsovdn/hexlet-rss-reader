import _ from 'lodash';
import { isURL } from 'validator';
import loadFeed from './rss';

const isURLValid = (state, address) => {
  if (!isURL(address)) {
    return false;
  }
  const compareURLs = ({ link }) =>
    link.includes(address) || address.includes(link);

  return _.filter(state.feeds, compareURLs).length === 0;
};

export default (_state) => {
  const state = _state;
  const input = document.getElementById('feedInput');
  const addButton = document.getElementById('addRSS');

  const handleValidateInput = ({ target }) => {
    const address = target.value;
    if (address === '') {
      state.isValidURL = false;
      target.classList.remove('is-invalid');
    } else if (isURLValid(state, address)) {
      state.isValidURL = true;
      target.classList.remove('is-invalid');
    } else {
      state.isValidURL = false;
      target.classList.add('is-invalid');
    }
  };

  const handleAddRSS = (event) => {
    event.preventDefault();
    if (state.isValidURL) {
      const feedURL = input.value;
      addButton.setAttribute('disabled', 'disabled');
      loadFeed(state.feeds, feedURL);
      input.value = '';
      input.focus();
      state.isValidURL = false;
    }
  };

  input.addEventListener('input', handleValidateInput);
  addButton.addEventListener('click', handleAddRSS);
};
