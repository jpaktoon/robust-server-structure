const uses = require("../data/uses-data");

function list(req, res) {
  const { urlId } = req.params;
  res.json({
    data: uses.filter(urlId ? (use) => use.urlId == urlId : () => true),
  });
}

function useExists(req, res, next) {
  const { useId } = req.params;
  const founduse = uses.find((use) => use.id === Number(useId));
  if (founduse) {
    res.locals.use = founduse;
    return next();
  }
  next({
    status: 404,
    message: `use id not found: ${useId}`,
  });
}

function read(req, res, next) {
  res.json({ data: res.locals.use });
}

function destroy(req, res) {
  const { useId } = req.params;
  const index = uses.findIndex((use) => use.id === Number(useId));
  const deleteduses = uses.splice(index, 1);
  res.sendStatus(204);
}

module.exports = {
  list,
  read: [useExists, read],
  useExists,
  delete: [useExists, destroy],
};
