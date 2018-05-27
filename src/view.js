const input = document.getElementById('feedInput');
const addButton = document.getElementById('addRSS');
const loader = document.getElementById('loader');

export const isModalActive = ({ guid }) =>
  document.querySelector(`[id='${guid}'] .modal.show`);

export const renderValid = isValid =>
  input.classList[isValid ? 'remove' : 'add']('is-invalid');

export const renderLoading = (isLoading) => {
  if (isLoading) {
    addButton.setAttribute('disabled', 'disabled');
  } else {
    addButton.removeAttribute('disabled');
  }
  loader.classList[isLoading ? 'add' : 'remove']('show');
};

export const clearInput = () => {
  renderValid(true);
  input.value = '';
  input.focus();
};

export const renderModal = ({
  guid,
  link,
  title,
  description,
}) => {
  const modal = document.getElementById('modal');
  modal.innerHTML = `<div class="modal fade show" id="${guid}modal" tabindex="-1" role="dialog" 
  aria-labelledby="${guid}modalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document"><div class="modal-content">
  <div class="modal-header"><h5 class="modal-title" id="${guid}modalLabel">${title}</h5>
  <button class="close" type="button" data-dismiss="modal" aria-label="Close">
  <span aria-hidden="true">&times;</span></button></div><div class="modal-body">${description}</div>
  <div class="modal-footer">
  <button class="btn btn-primary" type="button" 
  onclick="window.open('${link}', '_blank'); return false;">Read more</button>
  <button class="btn btn-secondary" type="button" data-dismiss="modal">Close</button>
  </div></div></div></div>`;
};

const createItemElement = (item) => {
  const {
    guid,
    title,
  } = item;
  const itemElement = document.createElement('div');
  itemElement.className = 'card mb-2';
  itemElement.setAttribute('id', `${guid}`);
  itemElement.innerHTML = `<div class="card-body pt-2 pb-1 text-center">
  <h5><a class="card-title" href="#" data-toggle="modal" data-target="#${guid}modal" 
  data-item="${guid}">${title}</a></h5></div>`;
  itemElement.onclick = () => renderModal(item);
  return itemElement;
};

export const renderItems = ({ guid, description, items }) => {
  const pane = document.getElementById(guid);
  pane.innerHTML = `<h4 class="card text-center">${description}</h4>`;
  items
    .map(item => createItemElement(item))
    .forEach(element => pane.appendChild(element));
};

export const renderFeed = (feed) => {
  const { guid, title } = feed;
  const rootTab = document.getElementById('v-pills-tab');
  const rootPane = document.getElementById('v-pills-tabContent');
  const isEmptyList = rootTab.children.length === 0;

  rootTab.innerHTML = `${rootTab.innerHTML}
  <a class="nav-link${isEmptyList ? ' active show' : ''}" id="${guid}-tab" data-guid="${guid}" data-toggle="pill" 
  href="#${guid}" role="tab" aria-controls="guid" aria-selected="false">${title}</a>`;

  rootPane.innerHTML = `${rootPane.innerHTML}<div class="tab-pane fade${isEmptyList ? ' active show' : ''}" id="${guid}"
  role="tabpanel" aria-labelledby="${guid}-tab"></div>`;

  if (isEmptyList) {
    const empty = document.getElementById('emptyNotice');
    empty.parentNode.removeChild(empty);
  }

  renderItems(feed);
};

export const renderError = (err) => {
  const errorMessage = err.message
    ? `${err.message}. Please, check if your feed address is correct.`
    : 'Unable to receive the feed. Please, check the internet connection.';

  const errorElement = document.createElement('div');
  errorElement.innerHTML = `<div class="alert alert-warning alert-dismissible fade fixed-bottom show text-center" 
  role="alert"><strong>Unable to add this RSS feed!</strong> ${errorMessage}
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
  <span aria-hidden="true">&times;</span></button></div>`;
  document.body.append(errorElement);
  window.setTimeout(() => errorElement.parentNode.removeChild(errorElement), 5000);
};

export default renderFeed;
