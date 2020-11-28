import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'

const state = () => {
  return {
    documentId: 1234,
    comments: [
      {
        uid: '0',
        quote: 'that rental properties in the City',
        range: 'type:textContent|279$313$17$default$',
        comment: 'this is a great idea',
        author: 'Anonymous',
        createdAt: '2020-12-12',
        isHighlight: true,
      },
      {
        uid: '1',
        quote: 'The legislation mirrors successful programs',
        range: 'type:textContent|718$761$18$default$',
        comment: 'this is a bad idea',
        author: 'Anonymous',
        createdAt: '2020-12-13',
        isHighlight: true,
      },
    ],
  }
}

const mutations = {
  createComment(state, { author, text, replyToUid, quote, range }) {
    state.comments.push({
      uid: uuidv4(),
      text,
      quote: quote || null,
      range: range || null,
      author,
      documentId: state.documentId,
      replyToUid,
      isHighlight: false,
      createdAt: dayjs().format(),
    })
  },
}

export { state, mutations }
