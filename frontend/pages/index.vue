<template>
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
    }
  },
  mounted() {
    const self = this
    this.initAnnotator()
    // document.querySelector('.annotator-hl').click((e) => {
    //   this.annotationSelected(e)
    // })
    const els = document.getElementsByClassName('annotator-hl')
    Array.from(els).forEach((el) => {
      el.addEventListener('click', (e) => {
        self.annotationSelected(e)
      })
    })
  },
  methods: {
    onSelected(annotationId) {
      // Return false if the id is undefined
      if (!annotationId) {
        return false
      }
      const annotation = document.querySelector(
        `[data-annotation-id="${annotationId}"]`
      )
      console.log(annotation)
    },
    annotationSelected(e) {
      e.stopPropagation()

      // const annotationId = e.target.getAttribute('data-annotation-id')
      const target = e.target
      this.active.id = target.getAttribute('data-annotation-id')
      this.active.text = target.innerHTML
      // this.onSelected(annotationId)
    },
    initAnnotator() {
      const self = this
      const log = () => {
        return {
          annotationCreated(annotation) {
            console.log(annotation)
            // const el = document.querySelector('.annotator-hl')
            // console.log(annotation._local.highlights[0])
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
      // {
      //   src: 'https://hypothes.is/embed.js',
      //   async: true,
      // },
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
