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

const parseRSS = (body, link) => {
  const xml = parser.parseFromString(body, 'text/xml');
  const channel = xml.querySelector('channel');
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

export default parseRSS;
