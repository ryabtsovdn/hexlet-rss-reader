import url from 'url';
import _ from 'lodash';
import { isURL } from 'validator';
import loadFeed from './rss';

export default (_state) => {
  const state = _state;
  const input = document.getElementById('feedInput');
  const addButton = document.getElementById('addRSS');

  const isFeedAdded = (address) => {
    const { protocol, hostname } = url.parse(address);
    const link = url.format({ protocol, hostname, pathname: '/' });
    return _.find(state.feeds, { link });
  };

  const handleValidateInput = ({ target }) => {
    const address = target.value;
    if (address === '') {
      state.isValidURL = false;
      target.classList.remove('is-invalid');
      return;
    }
    if (!isURL(address)) {
      state.isValidURL = false;
      target.classList.add('is-invalid');
      return;
    }
    if (isFeedAdded(address)) {
      state.isValidURL = false;
      target.classList.add('is-invalid');
    } else {
      state.isValidURL = true;
      target.classList.remove('is-invalid');
    }
  };

  const handleAddRSS = (event) => {
    event.preventDefault();
    if (state.isValidURL) {
      const feedURL = input.value;
      addButton.setAttribute('disabled', 'disabled');
      loadFeed(state, feedURL);
      input.value = '';
      input.focus();
      state.isValidURL = false;
    }
  };

  input.addEventListener('input', handleValidateInput);
  addButton.addEventListener('click', handleAddRSS);
};
