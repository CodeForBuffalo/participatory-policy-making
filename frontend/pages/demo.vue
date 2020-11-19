<template>
  <div class="relative">
    <b-container>
      <b-row>
        <b-col offset-lg="2" lg="8">
          <b-form-group>
            <b-form-radio-group
              id="supportToggle"
              v-model="support.value"
              buttons
              button-variant="outline-secondary"
              class="w-100"
              @input="toggleLiked()"
            >
              <b-form-radio
                v-for="(option, idx) in support.options"
                :key="idx"
                :value="option.value"
                class="w-100"
              >
                {{ option.text }}
              </b-form-radio>
            </b-form-radio-group>
          </b-form-group>
        </b-col>
        <b-col offset-lg="2" lg="8">
          <Annotator
            ref="annotator"
            :highlights.sync="highlights"
            @onHighlightSelected="(e) => showHighlightComment(e)"
            @onSelectionStored="() => initNewHighlight()"
          >
            <div v-html="$md.render(md.body)" />
          </Annotator>
        </b-col>
      </b-row>
    </b-container>

    <b-sidebar
      v-model="sidebarIsOpen"
      bg-variant="white"
      aria-label="Sidebar"
      backdrop
      shadow
      right
      @hidden="unsetSelectedHighlight()"
    >
      <div>
        <div v-if="selectedHighlight.uid">
          <div class="p-4">
            <div class="p-2 bg-light rounded border">
              <span class="font-weight-bold lead d-flex"
                >"{{ selectedHighlight.quote }}"</span
              >
            </div>
          </div>
          <div class="pb-3">
            <div class="px-4">
              <div class="mb-2">
                <div class="d-flex" style="line-height: 0.75">
                  <i class="font-weight-bold">{{ selectedHighlight.author }}</i>
                </div>
                <span class="small text-muted">
                  {{
                    selectedHighlight.onCreated | date('MMM DD, YYYY, hh:mmA')
                  }}
                </span>
              </div>
              <div class="d-flex">
                <span>{{ selectedHighlight.comment }}</span>
              </div>
            </div>
            <div>
              <div class="px-4 border-bottom pb-2">
                <b-button
                  v-b-toggle.collapseComment
                  variant="link"
                  class="shadow-none px-0"
                  size="sm"
                >
                  Reply
                </b-button>
              </div>
              <b-collapse id="collapseComment" class="px-4 border-bottom">
                <form class="py-3" @submit.prevent="">
                  <b-form-group
                    label="Add Reply"
                    label-for="commentReply"
                    label-class="font-weight-bold mb-1"
                    class="mb-2"
                  >
                    <b-form-textarea
                      id="commentReply"
                      placeholder="Enter your comment"
                      size="sm"
                      rows="4"
                      no-resize
                    ></b-form-textarea>
                  </b-form-group>
                  <b-button variant="primary" size="sm" type="submit"
                    >Add Reply</b-button
                  >
                </form>
              </b-collapse>
            </div>
          </div>
        </div>

        <div v-else class="p-4">
          <form @submit.prevent="createHighlight()">
            <b-form-group
              label="Add New Comment"
              label-for="newHighlightComment"
              label-class="font-weight-bold mb-1"
              class="mb-2"
            >
              <b-form-textarea
                id="newHighlightComment"
                v-model="newHighlight.comment"
                size="sm"
                rows="6"
              ></b-form-textarea>
            </b-form-group>
            <b-button variant="primary" size="sm" type="submit"
              >Add New Comment</b-button
            >
          </form>
        </div>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
import Annotator from '@/components/Annotator'
import fm from 'front-matter'
import dayjs from 'dayjs'

export default {
  name: 'DemoPage',
  components: {
    Annotator,
  },
  filters: {
    date(val, format = 'MMM DD, YYYY, hh:mmA') {
      return dayjs(val).format(format)
    },
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
      support: {
        value: null,
        options: [
          { text: 'I Support This', value: true },
          { text: 'I Do Not Support This', value: false },
        ],
      },
      highlights: [
        {
          uid: '0',
          quote: 'that rental properties in the City',
          range: 'type:textContent|279$313$17$default$',
          comment: 'this is a great idea',
          author: 'Anonymous',
        },
        {
          uid: '1',
          quote: 'The legislation mirrors successful programs',
          range: 'type:textContent|718$761$18$default$',
          comment: 'this is a bad idea',
          author: 'Anonymous',
        },
      ],
      newHighlight: {
        comment: '',
      },
      selectedHighlight: {},
      sidebarIsOpen: false,
    }
  },
  mounted() {
    if (localStorage.getItem('liked')) {
      const value = JSON.parse(localStorage.getItem('liked')).value
      this.support.value = value
    }
  },
  methods: {
    toggleLiked() {
      const parsed = JSON.stringify({ value: this.support.value })
      localStorage.setItem('liked', parsed)
    },
    showHighlightComment(e) {
      this.selectedHighlight = e
      this.toggleSidebar()
    },
    toggleSidebar() {
      this.sidebarIsOpen = !this.sidebarIsOpen
    },
    initNewHighlight() {
      this.toggleSidebar()
    },
    createHighlight() {
      this.$refs.annotator.createHighlight(this.newHighlight.comment)
      this.newHighlight.comment = ''
      this.toggleSidebar()
    },
    unsetSelectedHighlight() {
      this.selectedHighlight = {}
    },
  },
  head() {
    return {
      title: 'Demo',
    }
  },
}
</script>
