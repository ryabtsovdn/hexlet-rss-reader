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
  renderToggleLoading();
};

const corsURL = 'https://cors-proxy.htmldriven.com/?url=';

const loadFeed = (feeds, feedURL, updateItemsOnly) => {
  const requestURL = `${corsURL}${feedURL}`;
  axios.get(requestURL)
    .then((response) => {
      const newFeed = parseRSS(response.data.body, feedURL);
      if (!updateItemsOnly) {
        addFeed(feeds, newFeed);
      } else {
        const feed = _.find(feeds, { guid: newFeed.guid });
        addItems(feed, newFeed.items);
      }
      window.setTimeout(() => loadFeed(feeds, feedURL, true), 5000);
    })
    .catch((err) => {
      renderError(err);
      renderToggleLoading();
    });
};

export default loadFeed;
