// It is important!
// 'convertArrayToCamelCase' expects a list of dictionaries,
// 'convertArrayToSnakeCase' expects only a dictionary!

function toCamelCase(str) {
  return str.replace(/_([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}

function convertArrayToCamelCase(jsonArray) {
  return jsonArray.map((item) => {
    let newItem = {};
    for (let key in item) {
      newItem[toCamelCase(key)] = item[key];
    }
    return newItem;
  });
}

function toSnakeCase(str) {
  return str.replace(/([A-Z])/g, function (g) {
    return "_" + g.toLowerCase();
  });
}

function convertArrayToSnakeCase(obj) {
  let newObj = {};
  for (let key in obj) {
    newObj[toSnakeCase(key)] = obj[key];
  }
  return newObj;
}

module.exports = {
  convertArrayToCamelCase,
  convertArrayToSnakeCase,
};
