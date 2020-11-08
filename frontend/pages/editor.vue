<template>
  <div>
    <b-container>
      <b-row>
        <b-col md="9">
          <editor :html.sync="editor.html" :json.sync="editor.json" />
        </b-col>
        <b-col md="3"></b-col>
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
    return {
      editor: {
        html:
          '<h1>Yay Headlines!</h1> <p>All these <strong>cool tags</strong> are working now.</p>',
        json: {},
      },
    }
  },
}
</script>
