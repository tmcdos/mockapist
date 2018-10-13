// sort strings or numbers
export function strCompare (a, b)
{
  if (a === null) return 1;
  else if (b === null) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (a.match(/^[+-]?[0-9]+(\.[0-9]+)?$/) && b.match(/^[+-]?[0-9]+(\.[0-9]+)?$/)) return a - b;
  if (a < b) return -1;
  else if (a > b) return 1;
  else return 0;
}

// ensure there are no duplicate headers
export function setHeader (list, head, val)
{
  let locase = head.toLowerCase(), header = list.find(item =>
  {
    return item.locase === locase;
  });
  if (header) header.value = val;
  else list.push({
    name: head,
    locase,
    value: val
  });
}

// ensure there are no duplicate route paths
export function setRoute (list, obj)
{
  let url = obj.path, idx = list.findIndex(item =>
  {
    return item.regex.test(url);
  });
  if (idx === -1) list.push(obj);
}

// get all HTTP verbs for the given route which have a defined response
export function getMethods (route)
{
  return route.sections.reduce(function (acc, item)
  {
    return acc.concat(item.methods);
  }, []).sort((a, b) =>
  {
    return strCompare(a, b);
  });
}

export function isArray (a)
{
  return (!!a) && Object.prototype.toString.call(a) === '[object Array]';
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// Used to improve efficiency of $root.saveConfig
export function _debounce (func, wait, immediate)
{
  let timeout;
  return function ()
  {
    let context = this, args = arguments, callNow = immediate && !timeout,
      later = function ()
      {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// used to improve efficiency of $root.getRoute
export function makeRegex (route)
{
  let parts = route.split('/').filter(item => item !== ''), len = parts.length, result = parts.reduce(function (acc, item, idx)
  {
    if (item[0] === ':') return acc + '/[^/]+';
    else if (item === '*') return acc + (idx + 1 < len ? '/[^/]+' : '(/[^/]*)?');
    else if (item === '**') return acc + (idx + 1 < len ? '/([^/]+/)*[^/]+' : '(/([^/]+/)*[^/]+)?');
    else return acc + '/' + item.replace('.', '\\.');
  }, '');
  return new RegExp('^' + result + '$');
}
