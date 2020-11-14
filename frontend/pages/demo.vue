<template>
  <div class="relative">
    <b-container>
      <b-row>
        <b-col>
          <div
            @mouseup="showButton()"
            @contextmenu.prevent="showButton()"
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
          <span>{{ activeComment.comment }}</span>
        </div>
      </div>
      <div v-else>
        <form class="p-4" @submit.prevent="createHighlight()">
          <b-form-group label-for="comment" class="mb-1">
            <b-form-textarea
              id="comment"
              ref="comment"
              v-model="comment"
              size="sm"
            ></b-form-textarea>
          </b-form-group>
          <b-button type="submit">Add Comment</b-button>
        </form>
      </div>
    </b-sidebar>

    <div
      id="commentBox"
      class="position-absolute"
      :style="`top: ${position.top}px; left: ${position.left}px; transform: translate(-50%, -100%)`"
    >
      <b-button
        v-show="buttonActive"
        id="popover-reactive-1"
        @click="addComment()"
      >
        <b-icon icon="chat-square-text-fill" aria-hidden="true" />
      </b-button>
    </div>
  </div>
</template>

<script>
import fm from 'front-matter'
import rangy from 'rangy/lib/rangy-core.js'
import 'rangy/lib/rangy-classapplier'
import 'rangy/lib/rangy-highlighter'
import 'rangy/lib/rangy-serializer'
import 'rangy/lib/rangy-textrange'
import 'rangy/lib/rangy-selectionsaverestore'

import { BIcon, BIconChatSquareTextFill } from 'bootstrap-vue'

export default {
  name: 'DemoPage',
  components: {
    BIcon,
    /* eslint-disable vue/no-unused-components */
    BIconChatSquareTextFill,
    /* eslint-enable vue/no-unused-components */
  },
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
      comment: '',
      data: [
        {
          id: 0,
          quote: 'that rental properties in the City',
          range: 'type:textContent|279$313$17$test$',
          comment: 'this is a great idea',
        },
        {
          id: 1,
          quote: 'The legislation mirrors successful programs',
          range: 'type:textContent|718$761$18$test$',
          comment: 'this is a bad idea',
        },
      ],
      rangy: null,
      classApplier: null,
      activeId: null,
      sidebarIsOpen: false,
      popoverShow: false,
      isCommenting: false,
      activeSelection: {},
      activeComment: null,
    }
  },
  computed: {},
  mounted() {
    this.initRangy()
  },
  methods: {
    addComment() {
      this.activeSelection = this.rangy.saveSelection()
      const selection = window.getSelection()
      selection.removeAllRanges()
      this.toggleSidebar()
      this.activeComment = null
      this.hideButton()
    },
    toggleSidebar() {
      this.sidebarIsOpen = !this.sidebarIsOpen
    },
    annotationSelected(e) {
      const target = e.target
      const activeId = target.getAttribute('data-annotation-id')
      this.activeComment = this.data.find((item) => {
        return item.id === Number(activeId)
      })
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
          el.addEventListener('click', (e) => {
            this.annotationSelected(e)
          })
        },
      })
      this.setSelection()
    },
    createHighlight() {
      // const self = this
      const highlighter = this.rangy.createHighlighter()
      const quoteId = this.data.length + 1
      this.classApplier.elementAttributes['data-annotation-id'] = quoteId
      this.rangy.restoreSelection(this.activeSelection)
      highlighter.addClassApplier(this.classApplier)
      highlighter.highlightSelection('test')

      this.data.push({
        id: quoteId,
        quote: this.rangy.getSelection().toString(),
        range: highlighter.serialize(),
        comment: this.comment,
      })
      const selection = window.getSelection()
      selection.removeAllRanges()
      this.toggleSidebar()
    },
    hideButton() {
      this.position = {
        top: 0,
        left: 0,
      }
      this.buttonActive = false
    },
    showButton() {
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
      } else {
        this.hideButton()
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
