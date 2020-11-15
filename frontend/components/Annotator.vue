<template>
  <div class="position-relative">
    <div @mouseup="showButton()" @contextmenu.prevent="">
      <slot />
    </div>
    <div
      class="position-absolute"
      :style="`top: ${commentButton.position.top}px; left: ${commentButton.position.left}px; transform: translate(-50%, -100%)`"
    >
      <b-button v-if="commentButton.isShowing" @click="storeSelection()">
        <b-icon icon="chat-square-text-fill" aria-hidden="true" />
      </b-button>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import { BIcon, BIconChatSquareTextFill } from 'bootstrap-vue'
import rangy from 'rangy/lib/rangy-core.js'
import 'rangy/lib/rangy-classapplier'
import 'rangy/lib/rangy-highlighter'
import 'rangy/lib/rangy-serializer'
import 'rangy/lib/rangy-textrange'
import 'rangy/lib/rangy-selectionsaverestore'

export default {
  name: 'Annotator',
  components: {
    BIcon,
    /* eslint-disable vue/no-unused-components */
    BIconChatSquareTextFill,
    /* eslint-enable vue/no-unused-components */
  },
  props: {
    highlights: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      commentButton: {
        isShowing: false,
        position: {
          top: 0,
          left: 0,
        },
      },
      rangy: null,
      classApplier: null,
      savedSelection: {},
    }
  },
  computed: {
    isMobileDevice() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    },
  },
  mounted() {
    if (process.env.NODE_ENV !== 'production') {
      this.debug()
    }
    this.initRangy()
    if (this.isMobileDevice) {
      this.initSelectionChangeListener()
    }
  },
  methods: {
    storeSelection() {
      this.savedSelection = this.rangy.saveSelection()
      const selection = document.getSelection()
      selection.removeAllRanges()
      this.hideButton()
      this.$emit('onSelectionStored')
    },
    highlightSelected(e) {
      const target = e.target
      const uid = target.getAttribute('data-annotation-uid')
      const selectedHighlight = this.highlights.find((item) => {
        return item.uid === uid
      })
      this.$emit('onHighlightSelected', selectedHighlight)
    },
    createHighlight(comment) {
      const highlighter = this.rangy.createHighlighter()
      const uid = uuidv4()
      this.classApplier.elementAttributes['data-annotation-uid'] = uid
      this.rangy.restoreSelection(this.savedSelection)
      highlighter.addClassApplier(this.classApplier)
      highlighter.highlightSelection('default')

      this.highlights.push({
        uid,
        quote: this.rangy.getSelection().toString(),
        range: highlighter.serialize(),
        comment,
      })
      const selection = document.getSelection()
      selection.removeAllRanges()
      this.$emit('update:highlights', this.highlights)
    },
    debug() {
      const events = [
        'touchstart',
        'touchend',
        'mousedown',
        'mouseup',
        'selectionchange',
        'selectionchanged',
        'selectstart',
      ]

      const counts = events.reduce((counts, name) => {
        counts[name] = 0
        return counts
      }, {})

      events.forEach((name) => {
        document.addEventListener(name, () => {
          ++counts[name]
          // eslint-disable-next-line no-console
          console.log('%s triggered. count: %d', name, counts[name])
        })
      })
    },
    hideButton() {
      this.commentButton = {
        isShowing: false,
        position: {
          top: 0,
          left: 0,
        },
      }
    },
    initSelectionChangeListener() {
      document.addEventListener('selectionchange', (e) => {
        this.showButton()
      })
    },
    initRangy() {
      this.rangy = rangy
      this.rangy.init()
      this.classApplier = this.rangy.createClassApplier('default', {
        elementAttributes: {
          tabIndex: 0,
          role: 'button',
          style: 'background-color: yellow; cursor: pointer',
        },
        onElementCreate: (el) => {
          // TO DO: Get event to fire with keyboard
          el.addEventListener('click', (e) => {
            this.highlightSelected(e)
          })
        },
      })
      this.initExistingHighlights()
    },
    showButton() {
      if (document.getSelection().toString().length) {
        if (!this.isMobileDevice) {
          this.rangy.getSelection().expand('word') // This fires infinite selectionchange events until selection is unset. Only use on desktop, for now.
        }
        const selection = document.getSelection()
        const getRange = selection.getRangeAt(0)
        const selectionRect = getRange.getBoundingClientRect()
        this.commentButton = {
          isShowing: true,
          position: {
            top: selectionRect.top - 12,
            left: selectionRect.left + selectionRect.width / 2,
          },
        }
      } else {
        this.hideButton()
      }
    },
    initExistingHighlights() {
      const highlighter = this.rangy.createHighlighter()
      const classApplier = this.classApplier
      this.highlights.forEach((item) => {
        classApplier.elementAttributes['data-annotation-uid'] = item.uid
        highlighter.addClassApplier(classApplier)
        highlighter.deserialize(item.range)
      })
    },
  },
}
</script>
