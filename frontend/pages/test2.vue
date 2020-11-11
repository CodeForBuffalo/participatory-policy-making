<template>
  <div class="relative">
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

    <b-sidebar
      v-model="sidebarIsOpen"
      aria-label="Sidebar"
      backdrop
      shadow
      right
    >
      <div v-if="activeComment" class="p-4">
        <span class="font-weight-bold lead">"{{ activeComment.quote }}"</span>
        <div>
          <span>{{ activeComment.text }}</span>
        </div>
      </div>
    </b-sidebar>

    <b-button
      v-if="buttonActive"
      class="position-absolute"
      :style="`top: ${position.top}px; left: ${position.left}px; transform: translate(-50%, -100%)`"
      @click="showCommentField"
      >Hey</b-button
    >
  </div>
</template>

<script>
import rangy from 'rangy/lib/rangy-core.js'
import 'rangy/lib/rangy-classapplier'
import 'rangy/lib/rangy-highlighter'
import 'rangy/lib/rangy-serializer'
import 'rangy/lib/rangy-textrange'

export default {
  name: 'Test2Page',
  data() {
    return {
      buttonActive: false,
      position: {
        top: 0,
        left: 0,
      },
      data: [
        {
          id: 0,
          quote: 'sapien ullamcorper',
          range: 'type:textContent|389$407$15$test$',
          text: 'this is a great idea',
        },
        {
          id: 1,
          quote: 'libero sit amet quam egestas semper',
          range: 'type:textContent|243$278$16$test$',
          text: 'this is a bad idea',
        },
      ],
      rangy: null,
      highlighter: null,
      classApplier: null,
      activeId: null,
      sidebarIsOpen: false,
    }
  },
  computed: {
    activeComment() {
      return this.data.find((item) => {
        return item.id === Number(this.activeId)
      })
    },
  },
  mounted() {
    this.initRangy()
  },
  methods: {
    showCommentField() {
      console.log('Do something')
    },
    toggleSidebar() {
      this.sidebarIsOpen = !this.sidebarIsOpen
    },
    annotationSelected(e) {
      const target = e.target
      this.activeId = target.getAttribute('data-annotation-id')
      this.toggleSidebar()
    },
    initRangy() {
      this.rangy = rangy
      this.rangy.init()
      this.classApplier = this.rangy.createClassApplier('test', {
        elementAttributes: {
          role: 'button',
          style: 'background-color: yellow; cursor: pointer',
        },
        onElementCreate: (el) => {
          ;['click', 'touchstart'].forEach((evt) => {
            el.addEventListener(evt, (e) => {
              this.annotationSelected(e)
            })
          })
        },
      })
      this.setSelection()
    },
    promptSelection() {
      if (document.getSelection().toString().length) {
        this.rangy.getSelection().expand('word')
        const selection = window.getSelection()
        const getRange = selection.getRangeAt(0)
        const selectionRect = getRange.getBoundingClientRect()
        this.position = {
          top: selectionRect.top - 12,
          left: selectionRect.left + selectionRect.width / 2,
        }
        this.buttonActive = true
        if (confirm('highlight?')) {
          const highlighter = this.rangy.createHighlighter()

          const quoteId = this.data.length + 1
          this.classApplier.elementAttributes['data-annotation-id'] = quoteId
          highlighter.addClassApplier(this.classApplier)
          highlighter.highlightSelection('test')

          this.data.push({
            id: quoteId,
            quote: this.rangy.getSelection().toString(),
            range: highlighter.serialize(),
          })
        }
      } else {
        this.position = {
          top: 0,
          left: 0,
        }
        this.buttonActive = false
      }
    },
    setSelection() {
      const highlighter = this.rangy.createHighlighter()
      const classApplier = this.classApplier
      this.data.forEach((item) => {
        classApplier.elementAttributes['data-annotation-id'] = item.id
        highlighter.addClassApplier(classApplier)
        highlighter.deserialize(item.range)
      })
    },
  },
}
</script>
