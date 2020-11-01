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
}
</script>
