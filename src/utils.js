export const replaceCDATA = str =>
  str.replace('<![CDATA[', '').replace(']]>', '');

export const cleanDescription = str =>
  str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/<\/img>/g, '')
    .replace(/<img(.*)>/g, '<img class="mw-100" $1>');

export const getProp = (element, prop) =>
  replaceCDATA(element.querySelector(prop).innerHTML);

export default getProp;
