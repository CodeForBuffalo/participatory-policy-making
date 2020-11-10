<template>
  <div>
    <b-container>
      <b-row>
        <b-col>
          <div class="mb-4"></div>
          <div
            id="textToSelect"
            @mouseup="promptSelection()"
            @touchend.prevent="promptSelection()"
          >
            <h1>HTML Ipsum Presents</h1>

            <p>
              <strong>Pellentesque habitant morbi tristique</strong> senectus et
              netus et malesuada fames ac turpis egestas. Vestibulum tortor
              quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec
              eu libero sit amet quam egestas semper.
              <em>Aenean ultricies mi vitae est.</em> Mauris placerat eleifend
              leo. Quisque sit amet est et sapien ullamcorper pharetra.
              Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>,
              ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt
              condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac
              dui. <a href="#">Donec non enim</a> in turpis pulvinar facilisis.
              Ut felis.
            </p>

            <h2>Header Level 2</h2>

            <ol>
              <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
              <li>Aliquam tincidunt mauris eu risus.</li>
            </ol>

            <blockquote>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                magna. Cras in mi at felis aliquet congue. Ut a est eget ligula
                molestie gravida. Curabitur massa. Donec eleifend, libero at
                sagittis mollis, tellus est malesuada tellus, at luctus turpis
                elit sit amet quam. Vivamus pretium ornare est.
              </p>
            </blockquote>

            <h3>Header Level 3</h3>

            <ul>
              <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
              <li>Aliquam tincidunt mauris eu risus.</li>
            </ul>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import rangy from 'rangy/lib/rangy-core.js'
import 'rangy/lib/rangy-classapplier'
import 'rangy/lib/rangy-highlighter'
import 'rangy/lib/rangy-serializer'

export default {
  name: 'Test2Page',
  data() {
    return {
      data: [],
      rangy: null,
      highlighter: null,
      classApplier: null,
      old: [
        'type:textContent|259$304$7$test$',
        'type:textContent|319$361$8$test$',
      ],
    }
  },
  mounted() {
    this.initRangy()
  },
  methods: {
    initRangy() {
      this.rangy = rangy
      this.rangy.init()
      this.classApplier = this.rangy.createClassApplier('test', {
        elementAttributes: {
          'data-foo': 'Hello',
          style: 'background-color: yellow',
        },
      })
      this.highlightOld()
    },
    promptSelection() {
      if (confirm('highlight?')) {
        const highlighter = this.rangy.createHighlighter()
        highlighter.addClassApplier(this.classApplier)
        highlighter.highlightSelection('test')
        const serial = highlighter.serialize()
        this.data.push(serial)
      }
    },
    highlightOld() {
      const highlighter = this.rangy.createHighlighter()
      highlighter.addClassApplier(this.classApplier)
      this.old.forEach((item) => {
        highlighter.deserialize(item)
      })
    },
  },
}
</script>
