import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'

const state = () => {
  return {
    documentId: 1234,
    comments: [],
    votes: [
      {
        id: 0,
        createdAt: '2020-12-12',
        didSupport: true,
        uid: '1234',
      },
      {
        id: 1,
        createdAt: '2020-12-13',
        didSupport: false,
        uid: '1235',
      },
      {
        id: 2,
        createdAt: '2020-12-13',
        didSupport: false,
        uid: '1236',
      },
      { didSupport: false, uid: 'f1713e9c-452e-4217-8721-1ef390bb389b' },
    ],
    userVote: {},
  }
}

const mutations = {
  getVotes(state) {
    state.votes = []
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
    } else {
      const existingVote = state.votes.find((vote) => {
        return vote.uid === state.userVote.uid
      })
      state.userVote.didSupport = didSupport
      existingVote.didSupport = didSupport
      const stringified = JSON.stringify(state.userVote)
      localStorage.setItem(state.documentId, stringified)
      // TODO: Update vote
    }
  },
  getComments(state) {
    state.comments = [
      {
        uid: '0',
        quote: 'that rental properties in the City',
        range: 'type:textContent|279$313$17$default$',
        text: 'this is a great idea',
        author: 'Anonymous',
        createdAt: '2020-12-12',
        isHighlight: true,
      },
      {
        uid: '1',
        quote: 'The legislation mirrors successful programs',
        range: 'type:textContent|718$761$18$default$',
        text: 'this is a bad idea',
        author: 'Anonymous',
        createdAt: '2020-12-13',
        isHighlight: true,
      },
    ]
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
    state.comments.push({
      uid,
      text,
      quote,
      range,
      author,
      replyToUid,
      isHighlight,
      documentId: state.documentId,
      createdAt: dayjs().format(),
    })
    // Post comment
  },
}

export { state, mutations }
