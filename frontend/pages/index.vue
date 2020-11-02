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
    initAnnotator() {
      const self = this
      const log = () => {
        return {
          annotationCreated(annotation) {
            // console.log(annotation)
            const el = annotation._local.highlights[0]
            el.mouseover = null
            el.addEventListener('click', (e) => {
              self.annotationSelected(e)
            })
          },
        }
      }
      /* eslint-disable no-undef */
      this.annotator = new annotator.App()
      console.log(annotator.ui.tags.viewerExtension)
      this.annotator.include(annotator.ui.main, {
        element: document.querySelector('#content'),
      })
      this.annotator.include(log)
      this.annotator.start()
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
