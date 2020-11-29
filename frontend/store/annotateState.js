import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'

const state = () => {
  return {
    documentId: 1234,
    comments: [],
    likes: [],
    userLiked: null,
  }
}

const mutations = {
  getLikes(state) {
    state.likes = []
  },
  getUserLiked(state) {
    if (localStorage.getItem(state.documentId)) {
      state.userLiked = JSON.parse(localStorage.getItem(state.documentId)).value
    }
  },
  postLike(state, value) {
    if (state.userLiked == null) {
      // Post liked
    }
    const parsed = JSON.stringify({ value })
    localStorage.setItem(state.documentId, parsed)
    state.userLiked = value
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
