import axios from 'axios';
import hashString from 'string-hash';

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

const addFeed = (guid, title, description) => {
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

const addItems = (guid, items) => {
  const pane = document.getElementById(guid);
  items.forEach((item) => {
    const itemTitle = getProp(item, 'title');
    const itemDescription = getProp(item, 'description');
    const itemLink = getProp(item, 'link');
    const card = document.createElement('div');
    card.classList.add('card');
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    card.appendChild(cardBody);
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.innerHTML = itemTitle;
    cardBody.appendChild(cardTitle);
    const cardDescription = document.createElement('div');
    cardDescription.classList.add('card-text');
    cardDescription.innerHTML = cleanDescription(itemDescription);
    cardBody.appendChild(cardDescription);
    const cardButton = document.createElement('a');
    cardButton.classList.add('btn');
    cardButton.classList.add('btn-primary');
    cardButton.innerText = 'Read more...';
    cardButton.setAttribute('href', itemLink);
    cardButton.setAttribute('target', '_blank');
    cardBody.appendChild(cardButton);
    pane.appendChild(card);
  });
};

function loadRSS(url) {
  axios.get(`https://cors-proxy.htmldriven.com/?url=${url}`)
    .then((response) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(response.data.body, 'text/xml');

      const feed = xml.querySelector('channel');
      const feedGuid = hashString(getProp(feed, 'link'));
      const feedTitle = getProp(feed, 'title');
      const feedDescription = getProp(feed, 'description');
      addFeed(feedGuid, feedTitle, feedDescription);
      addItems(feedGuid, [...xml.querySelectorAll('item')]);
      /** */console.log(feed);
      /** */console.log(this);
    })
    .catch((err) => {
      console.log(err.message);
    });
}

export default loadRSS;
