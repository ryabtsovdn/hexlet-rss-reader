import axios from 'axios';
import _ from 'lodash';
import { renderFeed, renderItems, renderError, renderToggleLoading } from './renderers';
import parseRSS from './parsers';

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

const corsURL = 'https://cors-proxy.htmldriven.com/?url=';

export const toggleLoading = (_state) => {
  const state = _state;
  state.isLoading = !state.isLoading;
  renderToggleLoading(state.isLoading);
};

export const loadFeed = (state, feedURL, updateItemsOnly) => {
  const requestURL = `${corsURL}${feedURL}`;
  axios.get(requestURL)
    .then((response) => {
      const newFeed = parseRSS(response.data.body, feedURL);
      if (!updateItemsOnly) {
        addFeed(state.feeds, newFeed);
        toggleLoading(state);
      } else {
        const feed = _.find(state.feeds, { guid: newFeed.guid });
        addItems(feed, newFeed.items);
      }
      window.setTimeout(() => loadFeed(state, feedURL, true), 5000);
    })
    .catch((err) => {
      toggleLoading(state);
      renderError(err);
    });
};

export default loadFeed;
