import axios from 'axios';
import _ from 'lodash';
import { renderFeed, renderItems, renderError, renderLoading } from './view';
import parseRSS from './parsers';
import init from './app';

const state = {
  feeds: [],
  isValidURL: false,
  isLoading: false,
};

const isModalActive = ({ guid }) =>
  document.querySelector(`[id='${guid}'] .modal.show`);

const addItems = (_feed, newItems) => {
  const feed = _feed;
  const addingItems = _.filter(newItems, ({ guid }) => !_.find(feed.items, { guid }));
  feed.items = [...feed.items, ...addingItems];
  if (!_.isEmpty(addingItems) && !isModalActive(feed)) {
    renderItems(feed);
  }
};

const addFeed = (feeds, newFeed) => {
  feeds.push(newFeed);
  renderFeed(newFeed);
};

export const setValidState = (isValidURL) => {
  state.isValidURL = isValidURL;
};

export const toggleLoadingState = () => {
  state.isLoading = !state.isLoading;
  renderLoading(state.isLoading);
};

const corsURL = 'https://cors-proxy.htmldriven.com/?url=';

export const loadFeed = (feedURL, updateItemsOnly) => {
  const requestURL = `${corsURL}${feedURL}`;
  axios.get(requestURL)
    .then((response) => {
      const newFeed = parseRSS(response.data.body, feedURL);
      if (!updateItemsOnly) {
        addFeed(state.feeds, newFeed);
        toggleLoadingState();
      } else {
        const feed = _.find(state.feeds, { guid: newFeed.guid });
        addItems(feed, newFeed.items);
      }
      window.setTimeout(() => loadFeed(feedURL, true), 5000);
    })
    .catch((err) => {
      toggleLoadingState();
      renderError(err);
    });
};

export default () => init(state);
