import axios from 'axios';
import hashString from 'string-hash';
import _ from 'lodash';
import { renderFeed, renderItem } from './renderers';
import { cleanDescription, getProp } from './utils';
import parser from './parsers';

const addItem = (feed, feedItem) => {
  const title = getProp(feedItem, 'title');
  const description = getProp(feedItem, 'description');
  const link = getProp(feedItem, 'link');
  const guid = hashString(link);
  const { items } = feed;
  if (_.find(items, { guid })) {
    return;
  }
  const item = {
    link,
    guid,
    title,
    description: cleanDescription(description),
  };
  items.push(item);
  renderItem(feed, item);
};

const addFeed = (state, feedChannel, link) => {
  const guid = hashString(link);
  const title = getProp(feedChannel, 'title');
  const description = getProp(feedChannel, 'description');
  const feed = {
    link,
    guid,
    title,
    description,
    items: [],
  };
  state.feeds.push(feed);
  renderFeed(feed);

  return feed;
};

const updateFeed = (feed) => {
  const { link } = feed;
  axios.get(`https://cors-proxy.htmldriven.com/?url=${link}`)
    .then((response) => {
      const channel = parser(response);
      const items = [...channel.querySelectorAll('item')];
      items.forEach((item) => {
        addItem(feed, item);
      });
      window.setTimeout(() => updateFeed(feed), 5000);
    });
};

const loadFeed = (state, url) => {
  axios.get(`https://cors-proxy.htmldriven.com/?url=${url}`)
    .then((response) => {
      const channel = parser(response);
      return addFeed(state, channel, url);
    })
    .then(feed => updateFeed(feed))
    .catch((err) => {
      console.log(err.message);
    });
};

export default loadFeed;
