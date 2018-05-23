import axios from 'axios';
import hashString from 'string-hash';
import _ from 'lodash';

const replaceCDATA = str =>
  str.replace('<![CDATA[', '').replace(']]>', '');

const cleanDescription = str =>
  str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/<\/img>/g, '');

const getProp = (element, prop) =>
  replaceCDATA(element.querySelector(prop).innerHTML);

const renderFeed = (feed) => {
  const { guid, title, description } = feed;
  const rootTab = document.querySelector('#v-pills-tab');
  const rootPane = document.querySelector('#v-pills-tabContent');
  const isEmptyList = rootTab.children.length === 0;
  const tab = document.createElement('a');
  tab.classList.add('nav-link');
  tab.innerHTML = title;
  tab.setAttribute('id', `${guid}-tab`);
  tab.setAttribute('data-toggle', 'pill');
  tab.setAttribute('href', `#${guid}`);
  tab.setAttribute('role', 'tab');
  tab.setAttribute('aria-controls', guid);
  tab.setAttribute('aria-selected', false);
  const pane = document.createElement('div');
  pane.classList.add('tab-pane');
  pane.classList.add('fade');
  pane.innerHTML = `<h3>${description}</h3><hr>`;
  pane.setAttribute('id', `${guid}`);
  pane.setAttribute('role', 'tabpanel');
  pane.setAttribute('aria-labelledby', `${guid}-tab`);
  if (isEmptyList) {
    tab.classList.add('active');
    tab.classList.add('show');
    pane.classList.add('active');
    pane.classList.add('show');
  }
  rootTab.appendChild(tab);
  rootPane.appendChild(pane);
};

const addFeed = (state, link, guid, title, description) => {
  const feed = _.find(state.feeds, { link });
  feed.guid = guid;
  feed.title = title;
  feed.description = description;
  feed.items = [];
  renderFeed(feed);
};

const renderItem = (feed, item) => {
  const pane = document.getElementById(feed.guid);
  const {
    link,
    guid,
    title,
    description,
  } = item;
  const card = document.createElement('div');
  card.classList.add('card');
  card.setAttribute('id', guid);
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  card.appendChild(cardBody);
  const cardTitle = document.createElement('h5');
  cardTitle.classList.add('card-title');
  cardTitle.innerHTML = title;
  cardBody.appendChild(cardTitle);
  const cardDescription = document.createElement('div');
  cardDescription.classList.add('card-text');
  cardDescription.innerHTML = cleanDescription(description);
  cardBody.appendChild(cardDescription);
  const cardButton = document.createElement('a');
  cardButton.classList.add('btn');
  cardButton.classList.add('btn-primary');
  cardButton.innerText = 'Read more...';
  cardButton.setAttribute('href', link);
  cardButton.setAttribute('target', '_blank');
  cardBody.appendChild(cardButton);
  pane.appendChild(card);
};

const addItem = (feed, item) => {
  const title = getProp(item, 'title');
  const description = getProp(item, 'description');
  const link = getProp(item, 'link');
  const guid = hashString(link);
  const { items } = feed;
  if (_.find(items, { guid })) {
    return;
  }
  const stateItem = {
    link,
    guid,
    title,
    description,
  };
  items.push(stateItem);
  renderItem(feed, stateItem);
};

const updateFeed = (state, guid, items) => {
  const feed = _.find(state.feeds, { guid });
  items.forEach((item) => {
    addItem(feed, item);
  });
};

const loadRSS = (state, url) => {
  axios.get(`https://cors-proxy.htmldriven.com/?url=${url}`)
    .then((response) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(response.data.body, 'text/xml');

      const feed = xml.querySelector('channel');
      const feedLink = url;
      const feedGuid = hashString(url);
      const feedTitle = getProp(feed, 'title');
      const feedDescription = getProp(feed, 'description');
      addFeed(state, feedLink, feedGuid, feedTitle, feedDescription);
      return [feed, feedGuid];
    })
    .then(([feed, feedGuid]) => {
      updateFeed(state, feedGuid, [...feed.querySelectorAll('item')]);
      /** */console.log(state);
    })
    .catch((err) => {
      console.log(err.message);
    });
};

export default loadRSS;
