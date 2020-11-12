<template>
  <div class="relative">
    <b-container>
      <b-row>
        <b-col>
          <div
            @mouseup="promptSelection()"
            @touchend.prevent="promptSelection()"
            v-html="$md.render(md.body)"
          />
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
import fm from 'front-matter'
import rangy from 'rangy/lib/rangy-core.js'
import 'rangy/lib/rangy-classapplier'
import 'rangy/lib/rangy-highlighter'
import 'rangy/lib/rangy-serializer'
import 'rangy/lib/rangy-textrange'

export default {
  name: 'DemoPage',
  asyncData({ $axios, route, error, $config }) {
    return $axios.$get(`/content/rental_inspection.md`).then((res) => {
      return {
        md: fm(res),
      }
    })
  },
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
          quote: 'that rental properties in the City',
          range: 'type:textContent|279$313$17$test$',
          text: 'this is a great idea',
        },
        {
          id: 1,
          quote: 'The legislation mirrors successful programs',
          range: 'type:textContent|718$761$18$test$',
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
          ;['click', 'touchend'].forEach((evt) => {
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
        selection.removeAllRanges()
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
