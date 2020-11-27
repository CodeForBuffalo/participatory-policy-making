<template>
  <div>
    <div v-for="(comment, idx) in comments" :key="idx">
      <div class="px-4 border-bottom py-3">
        <div class="mb-2">
          <div class="d-flex" style="line-height: 0.75">
            <i class="font-weight-bold">{{ comment.author || 'Anonymous' }}</i>
          </div>
          <span class="small text-muted">
            {{ comment.createdOn | date('MMM DD, YYYY, hh:mmA') }}
          </span>
        </div>
        <div class="d-flex">
          <span>{{ comment.comment }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'CommentThread',
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
  },
}
</script>
