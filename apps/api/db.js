const { MongoClient, ObjectId } = require('mongodb')

const mongoURI = process.env.MONGO_URI
const opts = {
  dbName: process.env.MONGO_DB,
  authSource: process.env.MONGO_DB,
  useUnifiedTopology: true,
  directConnection: true,
  useNewUrlParser: true,
  replicaSet: 'rs-dev'
};

let _db = null
const connectionReady = MongoClient.connect(mongoURI, opts)
  .then((client) => {
    _db = client.db(process.env.MONGO_DB)
    return _db
  })

function getDbAsync() {
  return connectionReady
}

function getDb() {
  return _db
}

function getCollection(name) {
  return _db.collection(name)
}

/**
 * convert a string into a mongodb id
 * @param {string | ObjectId} id
 * @returns {ObjectId}
 */
function toObjectId(id) {
  return id instanceof ObjectId ? id : new ObjectId(id.toString())
}

module.exports = {
  getCollection,
  getDbAsync,
  getDb,
  toObjectId
}