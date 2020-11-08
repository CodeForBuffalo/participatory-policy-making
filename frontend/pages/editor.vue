<template>
  <div>
    <b-container>
      <b-row>
        <b-col md="9">
          <client-only>
            <editor-menu-bar
              v-slot="{ commands, isActive }"
              :editor="editor"
              class="mb-1"
            >
              <b-button-toolbar>
                <b-button-group size="sm" class="mr-1">
                  <b-select
                    :value="getFormatValue()"
                    :options="formatOptions"
                    size="sm"
                    @change.native="
                      setFormatValue($event.target.value, commands)
                    "
                  >
                  </b-select>
                </b-button-group>

                <b-button-group size="sm" class="mr-1">
                  <b-button :pressed="isActive.bold()" @click="commands.bold">
                    <b-icon icon="type-bold" aria-hidden="true" />
                  </b-button>

                  <b-button
                    :pressed="isActive.italic()"
                    @click="commands.italic"
                  >
                    <b-icon icon="type-italic" aria-hidden="true" />
                  </b-button>

                  <b-button
                    :pressed="isActive.strike()"
                    @click="commands.strike"
                  >
                    <b-icon icon="type-strikethrough" aria-hidden="true" />
                  </b-button>
                  <b-button
                    :pressed="isActive.underline()"
                    @click="commands.underline"
                  >
                    <b-icon icon="type-underline" aria-hidden="true" />
                  </b-button>

                  <b-button :pressed="isActive.code()" @click="commands.code">
                    <b-icon icon="code" aria-hidden="true" />
                  </b-button>
                </b-button-group>

                <b-button-group size="sm" class="mr-1">
                  <b-button
                    :pressed="isActive.paragraph()"
                    @click="commands.paragraph"
                  >
                    <b-icon icon="paragraph" aria-hidden="true" />
                  </b-button>

                  <!-- <b-button
                    v-for="heading in 6"
                    :key="heading"
                    :pressed="isActive.heading({ level: heading })"
                    @click="commands.heading({ level: heading })"
                  >
                    {{ `H${heading}` }}
                  </b-button> -->
                </b-button-group>

                <b-button-group size="sm" class="mr-1">
                  <b-button
                    :pressed="isActive.bullet_list()"
                    @click="commands.bullet_list"
                  >
                    <b-icon icon="list-ul" aria-hidden="true" />
                  </b-button>

                  <b-button
                    :pressed="isActive.ordered_list()"
                    @click="commands.ordered_list"
                  >
                    <b-icon icon="list-ol" aria-hidden="true" />
                  </b-button>

                  <b-button
                    :pressed="isActive.blockquote()"
                    @click="commands.blockquote"
                  >
                    <b-icon icon="chat-quote" aria-hidden="true" />
                  </b-button>

                  <b-button @click="commands.hard_break">
                    <pre class="text-white mb-0">&lt;br&gt;</pre>
                    <!-- <b-icon icon="file-break" aria-hidden="true" /> -->
                  </b-button>
                </b-button-group>

                <b-button-group size="sm">
                  <b-button @click="commands.undo">
                    <b-icon icon="arrow-counterclockwise" aria-hidden="true" />
                  </b-button>

                  <b-button @click="commands.redo">
                    <b-icon icon="arrow-clockwise" aria-hidden="true" />
                  </b-button>
                </b-button-group>
              </b-button-toolbar>
            </editor-menu-bar>
            <editor-content :editor="editor" />
          </client-only>
        </b-col>
        <b-col md="3"></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Blockquote,
  HardBreak,
  Heading,
  OrderedList,
  BulletList,
  ListItem,
  Bold,
  Code,
  Italic,
  Strike,
  Underline,
  History,
} from 'tiptap-extensions'
import {
  BIcon,
  BIconChatQuote,
  BIconCode,
  BIconListOl,
  BIconListUl,
  BIconTypeBold,
  BIconTypeItalic,
  BIconTypeStrikethrough,
  BIconTypeUnderline,
  BIconArrowClockwise,
  BIconArrowCounterclockwise,
  BIconParagraph,
  BIconFileBreak,
} from 'bootstrap-vue'

export default {
  name: 'Editor',
  components: {
    EditorContent,
    EditorMenuBar,
    BIcon,
    /* eslint-disable vue/no-unused-components */
    BIconChatQuote,
    BIconCode,
    BIconListOl,
    BIconListUl,
    BIconTypeBold,
    BIconTypeItalic,
    BIconTypeStrikethrough,
    BIconTypeUnderline,
    BIconArrowClockwise,
    BIconArrowCounterclockwise,
    BIconParagraph,
    BIconFileBreak,
    /* eslint-enable vue/no-unused-components */
  },
  data() {
    return {
      editor: null,
      htmlContent: '',
      jsonContent: '',
      formatOptions: [
        { text: 'Paragraph', value: 'paragraph' },
        { text: 'H1', value: 'h1' },
        { text: 'H2', value: 'h2' },
        { text: 'H3', value: 'h3' },
        { text: 'H4', value: 'h4' },
        { text: 'H5', value: 'h5' },
        { text: 'H6', value: 'h6' },
      ],
    }
  },
  mounted() {
    this.editor = new Editor({
      onUpdate: ({ getHTML, getJSON }) => {
        this.htmlContent = getHTML()
        this.jsonContent = getJSON()
      },
      extensions: [
        new Blockquote(),
        new HardBreak(),
        new Heading({ levels: [1, 2, 3, 4, 5, 6] }),
        new BulletList(),
        new OrderedList(),
        new ListItem(),
        new Bold(),
        new Code(),
        new Italic(),
        new Strike(),
        new Underline(),
        new History(),
      ],
      content:
        '<h1>Yay Headlines!</h1> <p>All these <strong>cool tags</strong> are working now.</p>',
    })
    this.editor.view.dom.classList.add('form-control', 'h-auto')
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    getFormatValue() {
      const isActive = this.editor.isActive
      const headings = this.formatOptions.filter((opt) => {
        return opt.value.startsWith('h')
      })
      const activeHeading = headings.find((h) => {
        const level = Number(h.value.slice(-1))
        return isActive.heading({ level })
      })

      if (activeHeading) {
        return activeHeading.value
      } else {
        return 'paragraph'
      }
    },
    setFormatValue(value) {
      const commands = this.editor.commands
      if (value.startsWith('h')) {
        const level = Number(value.slice(-1))
        return commands.heading({ level })
      } else {
        return commands[value]()
      }
    },
  },
}
</script>
