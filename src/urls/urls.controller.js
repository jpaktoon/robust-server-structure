const urls = require("../data/urls-data");
const uses = require("../data/uses-data");

function list(req, res) {
  res.json({ data: urls });
}

let lasturlId = urls.reduce((maxId, url) => Math.max(maxId, url.id), 0);

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({
      status: 400,
      message: `Must include a ${propertyName}`,
    });
  };
}

function create(req, res) {
  const { data: { href } = {} } = req.body;
  const newurl = {
    id: ++lasturlId, // Increment last id then assign as the current ID
    href: href,
  };
  urls.push(newurl);
  res.status(201).json({ data: newurl });
}

function urlExists(req, res, next) {
  const { urlId } = req.params;
  const foundurl = urls.find((url) => url.id === Number(urlId));
  if (foundurl) {
    res.locals.url = foundurl;
    return next();
  }
  next({
    status: 404,
    message: `url id not found: ${urlId}`,
  });
}

function read(req, res, next) {
  const { urlId } = req.params;
  let lastuseId = uses.reduce((maxId, use) => Math.max(maxId, use.id), 0);
  const newuse = {
    id: ++lastuseId, // Increment last id then assign as the current ID
    urlId: Number(urlId),
    time: Date.now(),
  };
  uses.push(newuse);
  //console.log(uses);
  res.json({ data: res.locals.url });
}

function update(req, res) {
  const url = res.locals.url;
  const { data: { href } = {} } = req.body;

  // update the url
  url.href = href;

  res.json({ data: url });
}

module.exports = {
  create: [
    bodyDataHas("href"),
    create,
  ],
  list,
  read: [urlExists, read],
  update: [
    urlExists,
    bodyDataHas("href"),
    update,
  ],
  urlExists,
};
