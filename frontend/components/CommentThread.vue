<template>
  <div>
    <div v-for="(comment, idx) in comments" :key="idx">
      <template v-if="comment.replyToUid === replyToUid">
        <div class="px-4 pt-3 border-bottom">
          <div class="mb-2">
            <div class="d-flex" style="line-height: 0.75">
              <i class="font-weight-bold">{{
                comment.author || 'Anonymous'
              }}</i>
            </div>
            <span class="small text-muted">
              {{ comment.createdAt | date('MMM DD, YYYY, hh:mmA') }}
            </span>
          </div>
          <div class="d-flex">
            <span>{{ comment.text }}</span>
          </div>
          <div class="pb-2">
            <b-button
              v-b-toggle="`collapseComment-${idx}`"
              variant="link"
              class="shadow-none px-0"
              size="sm"
            >
              Reply
            </b-button>
          </div>
        </div>
        <b-collapse
          :id="`collapseComment-${idx}`"
          class="pl-2 border-bottom bg-secondary"
        >
          <div class="px-4 bg-white">
            <CommentBox @onSubmit="(e) => createComment(e, comment.uid)" />
          </div>
        </b-collapse>
        <div class="pl-2 bg-secondary">
          <div
            v-for="(nested, nestedIdx) in nestedComments(comment.uid)"
            :key="`nested-${nestedIdx}`"
            class="bg-white px-4 py-3 border-bottom"
          >
            <div class="mb-2">
              <div class="d-flex" style="line-height: 0.75">
                <i class="font-weight-bold">{{
                  nested.author || 'Anonymous'
                }}</i>
              </div>
              <span class="small text-muted">
                {{ nested.createdAt | date('MMM DD, YYYY, hh:mmA') }}
              </span>
            </div>
            <div class="d-flex">
              <span>{{ nested.text }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import CommentBox from './CommentBox.vue'

export default {
  name: 'CommentThread',
  components: { CommentBox },
  filters: {
    date(val, format = 'MMM DD, YYYY, hh:mmA') {
      return dayjs(val).format(format)
    },
  },
  props: {
    comments: {
      type: Array,
      required: true,
    },
    replyToUid: {
      type: String,
      required: true,
    },
  },
  methods: {
    createComment(e, replyToUid) {
      const { author, text } = e
      this.$store.commit('annotateState/postComment', {
        author,
        text,
        replyToUid,
      })
    },
    nestedComments(replyToUid) {
      return this.comments.filter((comment) => {
        return comment.replyToUid === replyToUid
      })
    },
  },
}
</script>
