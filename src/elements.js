export const createTab = (guid, title, description) => {
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
  rootTab.append(tab);
  rootPane.append(pane);
};

export const createCard = (feed, item) => {
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
  card.append(cardBody);

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
  modalDialog.classList.add('modal-lg');
  modalDialog.setAttribute('role', 'document');
  modal.append(modalDialog);
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  modalDialog.append(modalContent);
  const modalHeader = document.createElement('div');
  modalHeader.classList.add('modal-header');
  modalContent.append(modalHeader);
  const modalTitle = document.createElement('h5');
  modalTitle.classList.add('modal-title');
  modalTitle.setAttribute('id', `${guid}modalLabel`);
  modalTitle.innerText = title;
  modalHeader.append(modalTitle);
  const modalCloseHiddenButton = document.createElement('button');
  modalCloseHiddenButton.classList.add('close');
  modalCloseHiddenButton.setAttribute('type', 'button');
  modalCloseHiddenButton.setAttribute('data-dismiss', 'modal');
  modalCloseHiddenButton.setAttribute('aria-label', 'Close');
  modalHeader.append(modalCloseHiddenButton);
  const modalSpan = document.createElement('span');
  modalSpan.setAttribute('aria-hidden', true);
  modalSpan.innerHTML = '&times;';
  modalCloseHiddenButton.append(modalSpan);
  const modalBody = document.createElement('div');
  modalBody.classList.add('modal-body');
  modalBody.innerHTML = description;
  modalContent.append(modalBody);
  const modalFooter = document.createElement('div');
  modalFooter.classList.add('modal-footer');
  modalContent.append(modalFooter);
  const modalReadMoreButton = document.createElement('button');
  modalReadMoreButton.classList.add('btn');
  modalReadMoreButton.classList.add('btn-primary');
  modalReadMoreButton.setAttribute('type', 'button');
  modalReadMoreButton.innerHTML = 'Read more';
  modalReadMoreButton.addEventListener('click', () => window.open(link, '_blank'));
  modalFooter.append(modalReadMoreButton);
  const modalCloseButton = document.createElement('button');
  modalCloseButton.classList.add('btn');
  modalCloseButton.classList.add('btn-secondary');
  modalCloseButton.setAttribute('type', 'button');
  modalCloseButton.setAttribute('data-dismiss', 'modal');
  modalCloseButton.innerText = 'Close';
  modalFooter.append(modalCloseButton);
  cardBody.append(cardTitle);
  cardBody.append(modal);
  pane.append(card);
};

export default createTab;
