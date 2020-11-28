<template>
  <div>
    <form class="py-3" @submit.prevent="(e) => submitForm(e)">
      <b-form-group
        label="Your Name"
        :label-for="`name-${_uid}`"
        label-class="font-weight-bold mb-1 py-0"
        class="mb-2"
        label-size="sm"
      >
        <b-form-input
          :id="`name-${_uid}`"
          v-model="form.author"
          type="text"
          size="sm"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        label="Add Reply"
        :label-for="`comment-${_uid}`"
        label-class="font-weight-bold mb-1 py-0"
        class="mb-2"
        label-size="sm"
      >
        <b-form-textarea
          :id="`comment-${_uid}`"
          v-model="form.text"
          placeholder="Enter your comment"
          size="sm"
          rows="3"
          no-resize
        ></b-form-textarea>
      </b-form-group>
      <b-button variant="primary" size="sm" type="submit">Add Reply</b-button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CommentBox',
  data() {
    return {
      form: {
        author: '',
        text: '',
      },
    }
  },
  methods: {
    submitForm() {
      this.$emit('onSubmit', this.form)
    },
  },
}
</script>
