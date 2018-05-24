export const replaceCDATA = str =>
  str.replace('<![CDATA[', '').replace(']]>', '');

export const cleanDescription = str =>
  str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/<\/img>/g, '');

export const getProp = (element, prop) =>
  replaceCDATA(element.querySelector(prop).innerHTML);

export default getProp;
