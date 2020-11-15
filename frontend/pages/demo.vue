<template>
  <div class="relative">
    <b-container>
      <b-row>
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
          <div class="border-bottom pb-2 px-4">
            <div class="mb-2">
              <div class="d-flex" style="line-height: 0.75">
                <i class="font-weight-bold">{{ selectedHighlight.author }}</i>
              </div>
              <span class="small text-muted">
                {{ selectedHighlight.onCreated | date('MMM DD, YYYY, hh:mmA') }}
              </span>
            </div>
            <div class="d-flex">
              <span>{{ selectedHighlight.comment }}</span>
            </div>
            <div>
              <b-button variant="link" class="shadow-none px-0" size="sm">
                Reply
              </b-button>
            </div>
          </div>
        </div>

        <div v-else class="p-4">
          <form @submit.prevent="createHighlight()">
            <b-form-group label-for="newHighlightComment" class="mb-1">
              <b-form-textarea
                id="newHighlightComment"
                v-model="newHighlight.comment"
                size="sm"
              ></b-form-textarea>
            </b-form-group>
            <b-button type="submit">Add Comment</b-button>
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
  methods: {
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
}
</script>
