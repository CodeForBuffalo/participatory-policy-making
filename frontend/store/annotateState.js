import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'

const state = () => {
  return {
    documentId: null,
    comments: [],
    votes: [],
    userVote: {},
  }
}

const mutations = {
  initState(state, { comments = [], votes = [], documentId }) {
    state.comments = comments
    state.votes = votes
    state.documentId = documentId
  },
  getVotes(state) {
    // TODO: Get votes
    // state.votes = []
  },
  getUserVote(state) {
    if (localStorage.getItem(state.documentId)) {
      state.userVote = JSON.parse(localStorage.getItem(state.documentId)) || {}
    }
  },
  postVote(state, didSupport) {
    if (state.userVote.uid == null) {
      const uid = uuidv4()
      state.userVote = { didSupport, uid }
      const stringified = JSON.stringify(state.userVote)
      state.votes.push(state.userVote)
      localStorage.setItem(state.documentId, stringified)
      // TODO: Create vote
      // this.$axios.$post('api/v1/votes', state.userVote)
    } else {
      const existingVote = state.votes.find((vote) => {
        return vote.uid === state.userVote.uid
      })
      state.userVote.didSupport = didSupport
      existingVote.didSupport = didSupport
      const stringified = JSON.stringify(state.userVote)
      localStorage.setItem(state.documentId, stringified)
      // TODO: Update vote
      // this.$axios.$post('api/v1/votes', state.userVote)
    }
  },
  getComments(state) {
    // TODO: Get comments
    // state.comments = []
  },
  postComment(
    state,
    {
      uid = uuidv4(),
      author = null,
      text = null,
      replyToUid = null,
      quote = null,
      range = null,
      isHighlight = false,
    }
  ) {
    const comment = {
      uid,
      text,
      quote,
      range,
      author,
      replyToUid,
      isHighlight,
      documentId: state.documentId,
      createdAt: dayjs().format(),
    }
    state.comments.push(comment)
    // TODO: Post comment
    // this.$axios.$post('api/v1/comments', comment)
  },
}

export { state, mutations }
