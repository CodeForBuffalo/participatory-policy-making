<template>
  <div>
    <b-container class="mt-5">
      <b-row>
        <b-col md="8">
          <editor :html.sync="editor.html" :json.sync="editor.json" />
        </b-col>
        <b-col md="4">
          <div>
            <div class="border rounded shadow-sm bg-white">
              <div v-if="document.published" class="p-4">
                <div class="mb-2">
                  <div>
                    <span class="font-weight-bold">Published On</span>
                  </div>
                  <span>
                    {{ document.publishedOn }}
                  </span>
                </div>
                <div class="mb-2">
                  <div>
                    <span class="font-weight-bold">Comment End Date</span>
                  </div>
                  <span>
                    {{ document.commentEndDate }}
                  </span>
                </div>
              </div>
              <div v-else>
                <form @submit="publish()">
                  <div class="p-4 border-bottom">
                    <label for="commentEndDate">Comment End Date</label>
                    <b-datepicker
                      id="commentEndDate"
                      v-model="document.commentEndDate"
                      :date-format-options="{
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                        weekday: 'short',
                      }"
                      :min="today"
                      :hide-header="true"
                      placeholder=""
                      locale="en"
                    >
                    </b-datepicker>
                  </div>
                  <div class="p-4">
                    <b-button
                      type="submit"
                      variant="primary"
                      block
                      :disabled="!document.commentEndDate"
                      >Publish</b-button
                    >
                  </div>
                </form>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Editor from '@/components/Editor'
export default {
  name: 'EditPage',
  components: {
    Editor,
  },
  data() {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    return {
      document: {
        commentEndDate: '',
        published: false,
        publishedOn: '',
      },
      today: new Date(today),
      editor: {
        html:
          '<h1>Yay Headlines!</h1> <p>All these <strong>cool tags</strong> are working now.</p>',
        json: {},
      },
    }
  },
  methods: {
    publish() {
      this.document.published = true
      this.document.publishedOn = new Date()
    },
  },
}
</script>
