<template>
  <div>
    <b-container>
      <b-row>
        <b-col>
          <client-only>
            <editor-menu-bar
              v-slot="{ commands, isActive }"
              :editor="editor"
              class="mb-1"
            >
              <b-button-toolbar>
                <b-button-group class="mr-1">
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
                </b-button-group>

                <b-button-group class="mr-1">
                  <b-button :pressed="isActive.code()" @click="commands.code">
                    <b-icon icon="code" aria-hidden="true" />
                  </b-button>

                  <b-button
                    :pressed="isActive.paragraph()"
                    @click="commands.paragraph"
                  >
                    <b-icon icon="paragraph" aria-hidden="true" />
                  </b-button>
                </b-button-group>

                <b-button-group class="mr-1">
                  <b-button
                    :pressed="isActive.heading({ level: 1 })"
                    @click="commands.heading({ level: 1 })"
                  >
                    H1
                  </b-button>

                  <b-button
                    :pressed="isActive.heading({ level: 2 })"
                    @click="commands.heading({ level: 2 })"
                  >
                    H2
                  </b-button>

                  <b-button
                    :pressed="isActive.heading({ level: 3 })"
                    @click="commands.heading({ level: 3 })"
                  >
                    H3
                  </b-button>
                </b-button-group>

                <b-button-group class="mr-1">
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
                    <b-icon icon="blockquote-left" aria-hidden="true" />
                  </b-button>

                  <b-button
                    :pressed="isActive.code_block()"
                    @click="commands.code_block"
                  >
                    <b-icon icon="code" aria-hidden="true" />
                  </b-button>

                  <b-button @click="commands.horizontal_rule">
                    <b-icon icon="dash" aria-hidden="true" />
                  </b-button>
                </b-button-group>

                <b-button-group>
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
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
} from 'tiptap-extensions'
import {
  BIcon,
  BIconBlockquoteLeft,
  BIconCode,
  BIconTypeH1,
  BIconTypeH2,
  BIconTypeH3,
  BIconListOl,
  BIconListUl,
  BIconListCheck,
  BIconTypeBold,
  BIconTypeItalic,
  BIconLink,
  BIconTypeStrikethrough,
  BIconTypeUnderline,
  BIconArrowCounterclockwise,
  BIconArrowClockwise,
  BIconParagraph,
  BIconDash,
} from 'bootstrap-vue'

export default {
  name: 'Editor',
  components: {
    EditorContent,
    EditorMenuBar,
    BIcon,
    /* eslint-disable vue/no-unused-components */
    BIconBlockquoteLeft,
    BIconCode,
    BIconTypeH1,
    BIconTypeH2,
    BIconTypeH3,
    BIconListOl,
    BIconListUl,
    BIconListCheck,
    BIconTypeBold,
    BIconTypeItalic,
    BIconLink,
    BIconTypeStrikethrough,
    BIconTypeUnderline,
    BIconArrowCounterclockwise,
    BIconParagraph,
    BIconArrowClockwise,
    BIconDash,
    /* eslint-enable vue/no-unused-components */
  },
  data() {
    return {
      editor: null,
    }
  },
  mounted() {
    this.editor = new Editor({
      extensions: [
        new Blockquote(),
        new CodeBlock(),
        new HardBreak(),
        new Heading({ levels: [1, 2, 3] }),
        new HorizontalRule(),
        new BulletList(),
        new OrderedList(),
        new ListItem(),
        new TodoItem(),
        new TodoList(),
        new Bold(),
        new Code(),
        new Italic(),
        new Link(),
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
}
</script>
