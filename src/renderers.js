const createItemHTML = (link, guid, title, description) =>
  `<div class="card" id="${guid}"><div class="card-body">
  <a class="card-title" href="#" data-toggle="modal" data-target="#${guid}modal">${title}</a>
  </div></div>
  <div class="modal fade" id="${guid}modal" tabindex="-1" role="dialog" 
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

export const renderItems = (feed) => {
  const pane = document.getElementById(feed.guid);
  const html = feed.items
    .map(({
      link,
      guid,
      title,
      description,
    }) => createItemHTML(link, guid, title, description))
    .reduce((acc, str) => `${acc}${str}`);
  pane.innerHTML = html;
};

export const renderFeed = (feed) => {
  const { guid, title, description } = feed;
  const rootTab = document.getElementById('v-pills-tab');
  const rootPane = document.getElementById('v-pills-tabContent');
  const isEmptyList = rootTab.children.length === 0;

  rootTab.innerHTML = `${rootTab.innerHTML}
  <a class="nav-link${isEmptyList ? ' active show' : ''}" id="${guid}-tab" data-toggle="pill" 
  href="#${guid}" role="tab" aria-controls="guid" aria-selected="false">${title}</a>`;

  rootPane.innerHTML = `${rootPane.innerHTML}
  <div class="tab-pane fade${isEmptyList ? ' active show' : ''}" id="${guid}" role="tabpanel" 
  aria-labelledby="${guid}-tab"><h3 class="card text-center">${description}</h3><hr></div>`;

  if (isEmptyList) {
    const empty = document.getElementById('emptyNotice');
    empty.parentNode.removeChild(empty);
  }

  renderItems(feed);
};

export const renderError = (err) => {
  const errorMessage = err.response
    ? 'Please, check if your feed address is correct.'
    : 'Please, check the internet connection.';
  const errorElement = document.createElement('div');
  errorElement.innerHTML = `<div class="alert alert-warning alert-dismissible fade fixed-bottom show text-center" 
  role="alert"><strong>Unable to add this RSS feed!</strong> ${errorMessage}
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
  <span aria-hidden="true">&times;</span></button></div>`;
  document.body.append(errorElement);
  window.setTimeout(() => errorElement.parentNode.removeChild(errorElement), 5000);
};

export default renderFeed;
