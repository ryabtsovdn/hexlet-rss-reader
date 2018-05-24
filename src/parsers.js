const parser = new DOMParser();

export default (response) => {
  const xml = parser.parseFromString(response.data.body, 'text/xml');
  return xml.querySelector('channel');
};
