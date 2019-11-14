'use strict';

const avsc = require('avsc');
const pushSchema = require('./push-schema');

const bySchema = (type, registry) => (topic, schema, parseOptions = null) => (() => {
  const schemaString = JSON.stringify(schema);
  const parsedSchema = avsc.parse(schema, parseOptions);
  let id = registry.cache.getBySchema(parsedSchema);
  if (id) {
    return Promise.resolve(id);
  }

  return pushSchema(registry, topic, schemaString, type)
    .then(id => registry.cache.set(id, parsedSchema));
})();

module.exports = {
  bySchema,
};
