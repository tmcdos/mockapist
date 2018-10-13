<template>
  <table class="variant_panel">
    <tr>
      <td align="right">Status</td>
      <td width="100%">
        <input type="number" min="100" max="599" class="status_body" v-model.number="variant.status" pattern="[1-5][0-9][0-9]" required />
      </td>
    </tr>
    <tr>
      <td align="right">File</td>
      <td>
        <div class="file_chooser">
          <input type="text" class="file_body" :class="{invalid: !canRead}" v-model="variant.file" readonly :title="canRead ? '' : 'File is not accessible'"/>
          <button v-if="variant.file" type="button" class="remove_response" @click="removeFile">
            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 512 512">
              <circle cx="256" cy="256" r="256" fill="#DF7F7F"/>
              <rect x="88" y="224" width="336" height="60" transform="rotate(45 256 256)" fill="#FFF"/>
              <rect x="88" y="224" width="336" height="60" transform="rotate(-45 256 256)" fill="#FFF"/>
            </svg>
          </button>
          <button type="button" class="bg_primary" @click="selectFile">CHOOSE</button>
        </div>
      </td>
    </tr>
    <tr valign="top">
      <td align="right">Body</td>
      <td>
        <div class="highlight ace_editor ace_dark ace-vibrant-ink" :class="{ignored: variant.file ? variant.file.length && canRead : false}" ref="ace"></div>
        <div class="editor_resize" @mousedown="startResize"></div>
      </td>
      <!--
      <td v-else>
        <textarea v-model.trim="variant.text" :class="{ignored: variant.file ? variant.file.length && canRead : false}" spellcheck="false" @input="removeFile"></textarea>
      </td>
      -->
    </tr>
  </table>
</template>

<script>
import fs from 'fs'
import { remote } from 'electron'
import * as ace from 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/mode-text'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/webpack-resolver'
import './theme-custom'

export default
{
  props:
    {
      variant:
        {
          type: Object,
          required: true
        },
      section:
        {
          type: Object,
          required: true
        }
    },
  data ()
  {
    return {
      editor: null,
      resizing: false,
      wHeight: 0,
      details: null, // HTML element "route_details"
    };
  },
  computed:
    {
      canRead ()
      {
        try
        {
          if (this.variant.file && this.variant.file !== '')
          {
            fs.accessSync(this.variant.file, fs.constants.R_OK);
            return true;
          }
          else return true;
        }
        catch (e)
        {
          // can not read the file
          return false;
        }
      },
      isJson ()
      {
        let content = this.section.headers.find(item => item.locase === 'content-type');
        if (content)
        {
          return content.value.toLowerCase() === 'application/json';
        }
        content = this.$root.currentRoute.headers.find(item => item.locase === 'content-type');
        if (content)
        {
          return content.value.toLowerCase() === 'application/json';
        }
        content = this.$root.headers.find(item => item.locase === 'content-type');
        if (content)
        {
          return content.value.toLowerCase() === 'application/json';
        }
        return false;
      },
    },
  mounted ()
  {
    this.editor = ace.edit(this.$refs.ace);
    if (this.isJson) this.editor.session.setMode('ace/mode/json');
    this.editor.setOptions({
      tabSize: 2,
      showPrintMargin: false,
      enableLiveAutocompletion: true
    });
    /* eslint-disable import/no-webpack-loader-syntax */
    // ace.config.setModuleUrl('ace/theme/custom', require('file-loader!./theme-custom.js'));
    this.editor.setTheme('ace/theme/custom');
    this.aceValue();
    this.editor.session.on('change', this.updateBody);
    this.details = document.getElementById('route_details');
  },
  watch:
    {
      isJson: 'aceMode',
      variant: 'aceValue'
    },
  methods:
    {
      aceMode ()
      {
        this.editor.session.setMode(this.isJson ? 'ace/mode/json' : 'ace/mode/text');
      },
      aceValue ()
      {
        let editor = this.editor;
        editor.setValue(this.variant.text);
        editor.clearSelection();
        editor.gotoLine(1, 1);
      },
      updateBody ()
      {
        this.variant.text = this.editor.getValue();
      },
      selectFile ()
      {
        let selected = remote.dialog.showOpenDialog({properties: ['openFile']});
        if (selected.length) this.variant.file = selected[0];
      },
      removeFile ()
      {
        this.variant.file = '';
      },
      startResize ()
      {
        this.resizing = true;
        this.wHeight = this.details.clientHeight - 4;
        document.addEventListener('mousemove', this.mouseMove, false);
        document.addEventListener('mouseup', this.mouseUp, false);
      },
      mouseUp ()
      {
        if (this.resizing)
        {
          document.removeEventListener('mousemove', this.mouseMove, false);
          this.resizing = false;
        }
      },
      autoSize ()
      {
        if (!this.resizing) return;
        let editor = this.$refs.ace, h = parseFloat(editor.style.height);
        if (isNaN(h)) h = 152;
        editor.style.height = (h + 1) + 'px';
        this.details.scrollTop = this.details.scrollTop + 1;
        this.editor.resize();
        requestAnimationFrame(this.autoSize);
      },
      mouseMove (evt)
      {
        if (!this.resizing) return;
        let e = evt || window.event;
        if (e.clientY > this.wHeight)
        {
          // start auto-sizing
          requestAnimationFrame(this.autoSize);
        }
        else
        {
          let editor = this.$refs.ace, rect = editor.getBoundingClientRect();
          editor.style.height = (e.clientY - rect.top - 2) + 'px';
        }
        this.editor.resize();
      }
    }
}
</script>

<style lang="scss">
  @import '@/assets/css/colors.scss';

  .variant_panel
  {
    width: 100%;
  }

  .variant_panel td
  {
    padding: 2px;
  }

  .variant_panel .file_body
  {
    color: #00B999;
    flex-grow: 1;
    margin-right: 6px;
  }

  .variant_panel .file_body.invalid
  {
    color: $danger;
    background-color: $light;
  }

  .status_body
  {
    padding-top: 4px;
  }

  .status_body:invalid
  {
    background-color: #854580;
    color: white;
  }

  .file_chooser
  {
    display: flex;
  }

  .file_chooser .remove_response
  {
    margin: 0 6px 0 0;
  }

  .editor_resize
  {
    background-color: orange;
    height: 4px;
    cursor: ns-resize;
  }

  /* ACE-editor theme customization */
  .highlight.ace_editor
  {
    min-height: 150px;
    min-width: 300px;
    width: 100%;
    background-color: #383C48;
    border: 1px solid orange;
    color: orange;
    padding: 5px;
    font-family: 'Droid Sans Mono', 'DejaVu Sans Mono', 'Courier New', 'Lucida Console', monospace;
    font-size: 0.85rem;

    &.ignored
    {
      opacity: 0.75;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='100%' height='100%' viewBox='0 0 128 12'%3E%3Ctext x='0' y='9' font-family='Arial' font-size='9.2' fill='%23F084A4' fill-opacity='0.5'%3EIGNORED - using FILE instead%3C/text%3E%3C/svg%3E%0A") center center no-repeat;
    }
  }

  .ace-vibrant-ink.ace_autocomplete .ace_content .ace_completion-highlight
  {
    color: $warning;
  }
</style>
