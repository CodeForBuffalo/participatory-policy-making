<template>
  <div>
    <form class="py-3" @submit.prevent="(e) => submitForm(e)">
      <b-form-group
        label="Your Name"
        label-for="formAuthor"
        label-class="font-weight-bold mb-1 py-0"
        class="mb-2"
        label-size="sm"
      >
        <b-form-input
          id="formAuthor"
          v-model="form.author"
          type="text"
          size="sm"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        label="Add Reply"
        label-for="formComment"
        label-class="font-weight-bold mb-1 py-0"
        class="mb-2"
        label-size="sm"
      >
        <b-form-textarea
          id="formComment"
          v-model="form.comment"
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
        comment: '',
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
