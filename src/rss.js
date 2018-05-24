import axios from 'axios';
import _ from 'lodash';
import { renderFeed, renderItem, renderError } from './renderers';
import parse from './parsers';

const addItems = (state, data) => {
  const { guid: feedGuid, items: newItems } = data;
  const feed = _.find(state.feeds, { guid: feedGuid });

  newItems.forEach((newItem) => {
    if (!_.find(feed.items, { guid: newItem.guid })) {
      renderItem(feed, newItem);
      feed.items.push(newItem);
    }
  });
};

const addFeed = (state, data) => {
  state.feeds.push({
    link: data.link,
    guid: data.guid,
    title: data.title,
    description: data.description,
    items: [],
  });
  renderFeed(data);
};

const loadFeed = (state, feedURL, isUpdate) => {
  axios.get(`https://cors-proxy.htmldriven.com/?url=${feedURL}`)
    .then((response) => {
      const data = parse(response);
      if (!isUpdate) {
        addFeed(state, data);
        document.getElementById('addRSS').removeAttribute('disabled');
      }
      addItems(state, data);
      window.setTimeout(() => loadFeed(state, feedURL, true), 5000);
    })
    .catch((err) => {
      renderError(err);
    });
};

export default loadFeed;
