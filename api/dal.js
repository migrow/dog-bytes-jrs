const {
  allDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc
} = require('./lib/dal-helper')
const slugify = require('slugify')
const { join, toLower } = require('ramda')

const getVideos = options => allDocs(options || { include_docs: true })

const getVideo = id => getDoc(id)

const addVideo = doc => {
  // const videoTags = compose(
  //   join(' '),
  //   flatten,
  //   map(tag => tag.chips),
  //   uniq,
  //   flatten,
  //   map(video => video.tags)
  // )(doc)
  // const docId = `${doc.name} ${videoTags}`
  doc.type = 'video'
  doc._id = `${toLower(doc.type)}_${slugify(doc.name, { lower: true })}`
  // ${slugify(docId, { lower: true })}
  return addDoc(doc)
}

const updateVideo = doc => updateDoc(doc)

const deleteVideo = id => deleteDoc(id)

const dal = {
  getVideos,
  getVideo,
  addVideo,
  updateVideo,
  deleteVideo
}

module.exports = dal
