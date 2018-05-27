import _ from 'lodash';
import { isURL } from 'validator';
import { loadFeed, setValidState, toggleLoadingState } from './rss';
import { renderModal, renderValid, clearInput } from './view';

const isURLValid = (feeds, address) => {
  if (!isURL(address)) {
    return false;
  }
  const compareURLs = ({ link }) =>
    link.includes(address) || address.includes(link);

  return _.filter(feeds, compareURLs).length === 0;
};

export default (_state) => {
  const state = _state;
  const input = document.getElementById('feedInput');
  const addButton = document.getElementById('addRSS');
  const rootPane = document.getElementById('v-pills-tabContent');

  const handleValidateInput = ({ target }) => {
    const address = target.value;
    setValidState(isURLValid(state.feeds, address));
    if (address === '') {
      renderValid(true);
    } else {
      renderValid(state.isValidURL);
    }
  };

  const handleEnterKeyPress = (event) => {
    if (event.key !== 'Enter') {
      return;
    }
    addButton.click();
    event.preventDefault();
  };

  const handleAddButtonClick = (event) => {
    event.preventDefault();
    if (state.isValidURL) {
      const feedURL = input.value;
      toggleLoadingState();
      clearInput();
      setValidState(false);
      loadFeed(feedURL);
    }
  };

  const handleClickArticleLink = ({ target }) => {
    if (target.tagName !== 'A') {
      return;
    }
    const feedGuid = document.querySelector('.nav-link.active').dataset.guid;
    const itemGuid = target.dataset.item;
    const feed = _.find(state.feeds, { guid: parseInt(feedGuid, 10) });
    const item = _.find(feed.items, { guid: parseInt(itemGuid, 10) });
    renderModal(feedGuid, item);
  };

  input.addEventListener('input', handleValidateInput);
  input.addEventListener('keydown', handleEnterKeyPress);
  addButton.addEventListener('click', handleAddButtonClick);
  rootPane.addEventListener('click', handleClickArticleLink);
};
