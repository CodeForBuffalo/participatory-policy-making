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
        <div v-html="$md.render(srcContent.body)"></div>
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
    }
  },
  mounted() {
    this.initAnnotator()
  },
  methods: {
    initAnnotator() {
      const log = () => {
        return {
          annotationCreated(annotation) {
            console.log(annotation)
          },
        }
      }
      /* eslint-disable no-undef */
      this.annotator = new annotator.App()
      this.annotator.include(annotator.ui.main)
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
