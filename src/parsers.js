import hashString from 'string-hash';
import { getProp, cleanDescription } from './utils';

const parser = new DOMParser();

const getItems = channel =>
  [...channel.querySelectorAll('item')].map((item) => {
    const title = getProp(item, 'title');
    const description = cleanDescription(getProp(item, 'description'));
    const link = getProp(item, 'link');
    const guid = hashString(link);
    return {
      link,
      guid,
      title,
      description,
    };
  });

const parse = (response) => {
  const xml = parser.parseFromString(response.data.body, 'text/xml');
  const channel = xml.querySelector('channel');
  const link = getProp(channel, 'link');
  const guid = hashString(link);
  const title = getProp(channel, 'title');
  const description = getProp(channel, 'description');
  const items = getItems(channel);
  return {
    link,
    guid,
    title,
    description,
    items,
  };
};

export default parse;
