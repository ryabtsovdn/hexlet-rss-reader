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
  const feed = {
    link,
    guid,
    title,
    description,
    items: [],
  };
  state.feeds.push(feed);
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

  const cardTitle = document.createElement('a');
  cardTitle.classList.add('card-title');
  cardTitle.innerHTML = title;
  cardTitle.setAttribute('href', '#');
  cardTitle.setAttribute('data-toggle', 'modal');
  cardTitle.setAttribute('data-target', `#${guid}modal`);
  cardTitle.style.fontSize = 'large';

  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.classList.add('fade');
  modal.setAttribute('id', `${guid}modal`);
  modal.setAttribute('tabindex', -1);
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-labelledby', `${guid}modalLabel`);
  modal.setAttribute('aria-hidden', true);
  const modalDialog = document.createElement('div');
  modalDialog.classList.add('modal-dialog');
  modalDialog.setAttribute('role', 'document');
  modal.appendChild(modalDialog);
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  modalDialog.appendChild(modalContent);
  const modalHeader = document.createElement('div');
  modalHeader.classList.add('modal-header');
  modalContent.appendChild(modalHeader);
  const modalTitle = document.createElement('h5');
  modalTitle.classList.add('modal-title');
  modalTitle.setAttribute('id', `${guid}modalLabel`);
  modalTitle.innerText = title;
  modalHeader.appendChild(modalTitle);
  const modalCloseHiddenButton = document.createElement('button');
  modalCloseHiddenButton.classList.add('close');
  modalCloseHiddenButton.setAttribute('type', 'button');
  modalCloseHiddenButton.setAttribute('data-dismiss', 'modal');
  modalCloseHiddenButton.setAttribute('aria-label', 'Close');
  modalHeader.appendChild(modalCloseHiddenButton);
  const modalSpan = document.createElement('span');
  modalSpan.setAttribute('aria-hidden', true);
  modalSpan.innerHTML = '&times;';
  modalCloseHiddenButton.appendChild(modalSpan);
  const modalBody = document.createElement('div');
  modalBody.classList.add('modal-body');
  modalBody.innerHTML = description;
  modalContent.appendChild(modalBody);
  const modalFooter = document.createElement('div');
  modalFooter.classList.add('modal-footer');
  modalContent.appendChild(modalFooter);
  const modalCloseButton = document.createElement('button');
  modalCloseButton.classList.add('btn');
  modalCloseButton.classList.add('btn-secondary');
  modalCloseButton.setAttribute('type', 'button');
  modalCloseButton.setAttribute('data-dismiss', 'modal');
  modalCloseButton.innerText = 'Close';
  modalFooter.appendChild(modalCloseButton);
  cardTitle.appendChild(modal);
  cardBody.appendChild(cardTitle);
  pane.appendChild(card);

  const images = modal.querySelectorAll('img');
  [...images].forEach(image => image.setAttribute('width', '100%'));
};

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
