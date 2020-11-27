<template>
  <div>
    <div v-for="(comment, idx) in comments" :key="idx">
      <template v-if="comment.parentUid === parentUid">
        <div class="px-4 pt-3 border-bottom">
          <div class="mb-2">
            <div class="d-flex" style="line-height: 0.75">
              <i class="font-weight-bold">{{
                comment.author || 'Anonymous'
              }}</i>
            </div>
            <span class="small text-muted">
              {{ comment.createdOn | date('MMM DD, YYYY, hh:mmA') }}
            </span>
          </div>
          <div class="d-flex">
            <span>{{ comment.comment }}</span>
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
            <CommentBox @onSubmit="(e) => replyTo(e, comment.uid)" />
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
                {{ nested.createdOn | date('MMM DD, YYYY, hh:mmA') }}
              </span>
            </div>
            <div class="d-flex">
              <span>{{ nested.comment }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
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
    parentUid: {
      type: String,
      required: true,
    },
  },
  methods: {
    replyTo(e, parentUid) {
      console.log(parentUid)
      const { author, comment } = e
      this.comments.push({
        parentUid,
        author,
        comment,
        createdOn: dayjs().format(),
        uid: uuidv4(),
      })
    },
    nestedComments(parentUid) {
      return this.comments.filter((comment) => {
        return comment.parentUid === parentUid
      })
    },
  },
}
</script>
