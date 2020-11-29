<template>
  <div class="relative">
    <b-container>
      <b-row>
        <b-col offset-lg="2" lg="8">
          <b-form-group>
            <b-form-radio-group
              id="supportToggle"
              buttons
              button-variant="outline-secondary"
              class="w-100"
              :checked="
                userVote.didSupport == null ? null : userVote.didSupport
              "
              @input="(value) => toggleVote(value)"
            >
              <b-form-radio :value="true" class="w-100">
                I Support This. Votes: {{ votes.likes.length }}
              </b-form-radio>
              <b-form-radio :value="false" class="w-100">
                I Do Not Support This. Votes: {{ votes.dislikes.length }}
              </b-form-radio>
            </b-form-radio-group>
          </b-form-group>
        </b-col>
        <b-col offset-lg="2" lg="8" class="position-static">
          <client-only>
            <Annotator
              ref="annotator"
              :highlights.sync="highlights"
              @onHighlightSelected="(e) => showHighlightComment(e)"
              @onSelectionStored="(e) => initNewHighlight(e)"
            >
              <div v-html="$md.render(md.body)" />
            </Annotator>
          </client-only>
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
                    selectedHighlight.createdAt | date('MMM DD, YYYY, hh:mmA')
                  }}
                </span>
              </div>
              <div class="d-flex">
                <span>{{ selectedHighlight.text }}</span>
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
                <CommentBox @onSubmit="(e) => createComment(e)" />
              </b-collapse>
              <div>
                <CommentThread
                  :reply-to-uid="selectedHighlight.uid"
                  :comments="comments"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-else>
          <div class="px-4 pt-4">
            <div class="p-2 bg-light rounded border">
              <span class="font-weight-bold lead d-flex"
                >"{{ newHighlight.quote }}"</span
              >
            </div>
          </div>
          <form class="p-4" @submit.prevent="createHighlight()">
            <b-form-group
              label="Your Name"
              label-for="newHightlightAuthor"
              label-class="font-weight-bold mb-1 py-0"
              class="mb-2"
              label-size="sm"
            >
              <b-form-input
                id="newHightlightAuthor"
                v-model="newHighlight.author"
                type="text"
                size="sm"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              label="Add New Comment"
              label-for="newHighlightComment"
              label-class="font-weight-bold mb-1 py-0"
              class="mb-2"
              label-size="sm"
            >
              <b-form-textarea
                id="newHighlightComment"
                v-model="newHighlight.text"
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
import CommentBox from '../components/CommentBox'
import CommentThread from '../components/CommentThread'

export default {
  name: 'DemoPage',
  components: {
    Annotator,
    CommentBox,
    CommentThread,
  },
  filters: {
    date(val, format = 'MMM DD, YYYY, hh:mmA') {
      return dayjs(val).format(format)
    },
  },
  asyncData({ $axios, route, error, $config, store }) {
    store.commit('annotateState/getComments')
    return $axios.$get(`/content/rental_inspection.md`).then((res) => {
      return {
        md: fm(res),
      }
    })
  },
  data() {
    return {
      newHighlight: {
        author: '',
        text: '',
      },
      newComment: {
        author: '',
        text: '',
      },
      selectedHighlight: {},
      sidebarIsOpen: false,
    }
  },
  computed: {
    highlights() {
      return this.$store.state.annotateState.comments.filter((comment) => {
        return comment.isHighlight === true
      })
    },
    comments() {
      return this.$store.state.annotateState.comments
    },
    userVote() {
      return this.$store.state.annotateState.userVote
    },
    votes() {
      const votes = this.$store.state.annotateState.votes
      return votes.reduce(
        (acc, vote) => {
          acc[vote.didSupport ? 'likes' : 'dislikes'].push(vote)
          return acc
        },
        { likes: [], dislikes: [] }
      )
    },
  },
  mounted() {
    this.$store.commit('annotateState/getUserVote')
  },
  methods: {
    toggleVote(value) {
      if (this.userVote.didSupport !== value) {
        this.$store.commit('annotateState/postVote', value)
      }
    },
    showHighlightComment(e) {
      this.selectedHighlight = e
      this.toggleSidebar()
    },
    toggleSidebar() {
      this.sidebarIsOpen = !this.sidebarIsOpen

      const body = document.getElementsByTagName('body')[0]
      if (this.sidebarIsOpen) body.classList.add('overflow-hidden')
      else body.classList.remove('overflow-hidden')
    },
    initNewHighlight(e) {
      const { range, quote } = e
      this.newHighlight = {
        range,
        quote,
        author: '',
        text: '',
      }
      this.toggleSidebar()
    },
    unsetSelectedHighlight() {
      this.selectedHighlight = {}
    },
    createComment(e) {
      const { author, text } = e
      const replyToUid = this.selectedHighlight.uid
      this.$store.commit('annotateState/postComment', {
        author,
        text,
        replyToUid,
      })
    },
    createHighlight() {
      this.$refs.annotator.createHighlight(this.newHighlight)
      this.newHighlight = {}
      this.toggleSidebar()
    },
  },
  head() {
    return {
      title: 'Demo',
    }
  },
}
</script>
