<template>
  <div>
    <b-container>
      <b-row>
        <b-col>
          <div>
            <ul>
              <li v-for="(attr, idx) in srcContent.attributes" :key="idx">
                <b>{{ idx }}: </b>{{ attr }}
              </li>
            </ul>
          </div>
          <!-- eslint-disable-next-line -->
          <div id="content" v-html="$md.render(srcContent.body)"></div>
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
      <div class="p-4">
        {{ active.text }}
      </div>
    </b-sidebar>
  </div>
</template>

<script>
import * as fm from 'front-matter'

export default {
  name: 'Home',
  asyncData({ $axios, route, error, $config }) {
    return $axios
      .$get(
        `https://raw.githubusercontent.com/IHIutch/bufgreencode_v2/master/content/sections/access-parking/bicycle-access-and-parking.md`
      )
      .then((res) => {
        return {
          srcContent: fm(res),
        }
      })
  },
  data() {
    return {
      annotator: null,
      active: {},
      sidebarIsOpen: false,
      annotations: [],
      existing: [
        {
          id: 1,
          text: 'this is a loaded annotation',
          ranges: [
            {
              start: '/ol[1]/li[2]',
              startOffset: 277,
              end: '/ol[1]/li[2]',
              endOffset: 315,
            },
          ],
          quote: 'The required minimum number of spaces',
        },
      ],
    }
  },
  mounted() {
    this.initAnnotator()
  },
  methods: {
    toggleSidebar() {
      this.sidebarIsOpen = !this.sidebarIsOpen
    },
    // onSelected(annotationId) {
    //   if (!annotationId) {
    //     return false
    //   }
    //   const annotation = document.querySelector(
    //     `[data-annotation-id="${annotationId}"]`
    //   )
    //   // console.log(annotation)
    // },
    annotationSelected(e) {
      e.stopPropagation()

      const target = e.target
      this.active.id = target.getAttribute('data-annotation-id')
      this.active.text = target.innerHTML
      this.toggleSidebar()
      // this.onSelected(annotationId)
    },
    attachListener(el) {
      el.mouseover = null
      el.addEventListener('click', (e) => {
        this.annotationSelected(e)
      })
    },
    initAnnotator() {
      const self = this
      const log = () => {
        return {
          annotationCreated(annotation) {
            // console.log(annotation)
            self.annotations.push({
              id: annotation.id,
              text: annotation.text,
              ranges: annotation.ranges,
              quote: annotation.quote,
            })
            const el = annotation._local.highlights[0]
            this.attachListener(el)
          },
        }
      }

      const load = () => {
        return {
          annotationsLoaded(annotations) {
            // console.log(annotations)
            annotations.forEach((a) => {
              const el = a._local.highlights[0]
              self.attachListener(el)
            })
          },
        }
      }
      /* eslint-disable no-undef */
      this.annotator = new annotator.App()
      this.annotator.include(annotator.storage.debug)
      this.annotator.include(annotator.ui.main, {
        element: document.querySelector('#content'),
      })
      this.annotator.include(log)
      this.annotator.include(load)

      this.annotator.start().then(() => {
        // console.log(this.existing)
        // this.annotator.annotations.load(this.existing)
      })
      this.annotator.runHook('annotationsLoaded', [this.existing])

      /* eslint-enable no-undef */
    },
  },
  head: {
    script: [
      {
        src: '/js/annotator.min.js',
      },
    ],
  },
}
</script>

<style>
.annotator-viewer {
  display: none !important;
}

.annotator-hl {
  cursor: pointer;
}
</style>
