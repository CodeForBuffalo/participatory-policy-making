<template>
  <div class="relative">
    <b-container>
      <b-row>
        <b-col>
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
      aria-label="Sidebar"
      backdrop
      shadow
      right
      @hidden="unsetSelectedHighlight()"
    >
      <div class="p-4">
        <div v-if="selectedHighlight.uid">
          <span class="font-weight-bold lead"
            >"{{ selectedHighlight.quote }}"</span
          >
          <div>
            <span>{{ selectedHighlight.comment }}</span>
          </div>
        </div>

        <div v-else>
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

export default {
  name: 'DemoPage',
  components: {
    Annotator,
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
        },
        {
          uid: '1',
          quote: 'The legislation mirrors successful programs',
          range: 'type:textContent|718$761$18$default$',
          comment: 'this is a bad idea',
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
