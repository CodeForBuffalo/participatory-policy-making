<template>
  <div>
    <b-container>
      <b-row>
        <b-col>
          <div class="mb-4"></div>
          <div
            id="textToSelect"
            @mouseup="promptSelection()"
            @touchend.prevent="promptSelection()"
          >
            <h1>HTML Ipsum Presents</h1>

            <p>
              <strong>Pellentesque habitant morbi tristique</strong> senectus et
              netus et malesuada fames ac turpis egestas. Vestibulum tortor
              quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec
              eu libero sit amet quam egestas semper.
              <em>Aenean ultricies mi vitae est.</em> Mauris placerat eleifend
              leo. Quisque sit amet est et sapien ullamcorper pharetra.
              Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>,
              ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt
              condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac
              dui. <a href="#">Donec non enim</a> in turpis pulvinar facilisis.
              Ut felis.
            </p>

            <h2>Header Level 2</h2>

            <ol>
              <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
              <li>Aliquam tincidunt mauris eu risus.</li>
            </ol>

            <blockquote>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                magna. Cras in mi at felis aliquet congue. Ut a est eget ligula
                molestie gravida. Curabitur massa. Donec eleifend, libero at
                sagittis mollis, tellus est malesuada tellus, at luctus turpis
                elit sit amet quam. Vivamus pretium ornare est.
              </p>
            </blockquote>

            <h3>Header Level 3</h3>

            <ul>
              <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
              <li>Aliquam tincidunt mauris eu risus.</li>
            </ul>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'TestPage',
  data() {
    return {
      key: 0,
      selectArray: [],
    }
  },
  mounted() {
    this.addKey(document.body)
  },
  methods: {
    promptSelection() {
      const self = this
      const range = document.getSelection().getRangeAt(0)
      if (document.getSelection().toString().length) {
        if (confirm('highlight?')) {
          self.selectArray.push(self.rangeToObj(range))
          document.designMode = 'on'
          document.execCommand('HiliteColor', false, 'yellow')
          document.designMode = 'off'
        }
      }
    },
    getSelection() {
      alert(
        'Copy string to save selections: ' + JSON.stringify(this.selectArray)
      )
    },
    setSelection() {
      const selStr = prompt('Paste string')
      const selArr = JSON.parse(selStr)
      const sel = getSelection()
      selArr.forEach((each) => {
        sel.removeAllRanges()
        sel.addRange(this.objToRange(each))
        document.execCommand('HiliteColor', false, 'yellow')
      })
    },
    objToRange(rangeStr) {
      const range = document.createRange()
      range.setStart(
        document.querySelector('[data-key="' + rangeStr.startKey + '"]')
          .childNodes[rangeStr.startTextIndex],
        rangeStr.startOffset
      )
      range.setEnd(
        document.querySelector('[data-key="' + rangeStr.endKey + '"]')
          .childNodes[rangeStr.endTextIndex],
        rangeStr.endOffset
      )
      return range
    },
    rangeToObj(range) {
      return {
        startKey: range.startContainer.parentNode.dataset.key,
        startTextIndex: Array.prototype.indexOf.call(
          range.startContainer.parentNode.childNodes,
          range.startContainer
        ),
        endKey: range.endContainer.parentNode.dataset.key,
        endTextIndex: Array.prototype.indexOf.call(
          range.endContainer.parentNode.childNodes,
          range.endContainer
        ),
        startOffset: range.startOffset,
        endOffset: range.endOffset,
      }
    },
    addKey(element) {
      if (element.children.length > 0) {
        Array.from(element.children).forEach((child) => {
          child.dataset.key = this.key++
          this.addKey(child)
        })
      }
    },
  },
}
</script>
