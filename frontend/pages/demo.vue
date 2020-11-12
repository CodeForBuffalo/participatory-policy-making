<template>
  <div class="relative">
    <b-container>
      <b-row>
        <b-col>
          <div
            @mouseup="(e) => showButton(e)"
            @touchend="(e) => showButton(e)"
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
    </b-sidebar>

    <div
      id="commentBox"
      class="position-absolute"
      :style="`top: ${position.top}px; left: ${position.left}px; transform: translate(-50%, -100%)`"
    >
      <b-button v-show="buttonActive" id="popover-reactive-1">
        <b-icon icon="chat-square-text-fill" aria-hidden="true" />
      </b-button>
      <b-popover
        ref="popover"
        target="popover-reactive-1"
        triggers="click"
        :show.sync="popoverShow"
        placement="auto"
        container="commentBox"
        custom-class="max-w-none w-400"
      >
        <template #title>
          <b-button class="close" aria-label="Close" @click="closePopover()">
            <span class="d-inline-block" aria-hidden="true">&times;</span>
          </b-button>
          Add Comment
        </template>

        <div>
          <b-form-group label-for="popover-input-1" class="mb-1">
            <b-form-textarea
              id="popover-input-1"
              ref="comment"
              v-model="comment"
              size="sm"
            ></b-form-textarea>
          </b-form-group>

          <div class="d-flex justify-content-end">
            <b-button
              size="sm"
              variant="danger"
              class="mr-1"
              @click="onCancel()"
              >Cancel</b-button
            >
            <b-button size="sm" variant="primary" @click="onOk()"
              >Submit</b-button
            >
          </div>
        </div>
      </b-popover>
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
    onOk() {
      this.closePopover()
    },
    onCancel() {
      this.closePopover()
    },
    closePopover() {
      this.popoverShow = false
    },
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
          el.addEventListener('click', (e) => {
            this.annotationSelected(e)
          })
        },
      })
      this.setSelection()
    },
    showButton(e) {
      if (document.getSelection().toString().length) {
        e.preventDefault()
        this.rangy.getSelection().expand('word')
        const selection = window.getSelection()
        const getRange = selection.getRangeAt(0)
        const selectionRect = getRange.getBoundingClientRect()
        this.position = {
          top: selectionRect.top - 12,
          left: selectionRect.left + selectionRect.width / 2,
        }
        this.buttonActive = true
        const comment = prompt('Please enter your comment:')
        if (comment) {
          const highlighter = this.rangy.createHighlighter()

          const quoteId = this.data.length + 1
          this.classApplier.elementAttributes['data-annotation-id'] = quoteId
          highlighter.addClassApplier(this.classApplier)
          highlighter.highlightSelection('test')

          this.data.push({
            id: quoteId,
            quote: this.rangy.getSelection().toString(),
            range: highlighter.serialize(),
            comment,
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

<style lang="scss" scoped>
.max-w-none {
  max-width: none !important;
}
.w-400 {
  width: 400px;
}
</style>
