<template>
  <section :class="{empty: !append && !section.methods.length}">
    <div class="methods_panel">
      <button v-if="!remove" type="button" class="remove_response" @click="$emit('remove')">
        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 512 512">
          <circle cx="256" cy="256" r="256" fill="#DF7F7F"/>
          <rect x="88" y="224" width="336" height="60" transform="rotate(45 256 256)" fill="#FFF"/>
          <rect x="88" y="224" width="336" height="60" transform="rotate(-45 256 256)" fill="#FFF"/>
        </svg>
      </button>
      <label v-for="(color,name) in bgMethod" :key="name" class="method_btn" :style="{backgroundColor: color, color: methodColor(name), opacity: section.methods && section.methods.includes(name) ? 1 : 0.65}">
        <input type="checkbox" v-model="section.methods" :value="name" @input="$emit('verb',section,name)"/>
        <span>{{ name }}</span>
      </label>
      <!--
      <span>&nbsp; Latency &nbsp;</span>
      <input type="number" v-model.number="section.latency" min="0" max="20000" title="0 - 20 000"/>
      <span>&nbsp; ms</span>
      -->
      <div class="add_method_title" v-if="append">Definition of a new response</div>
    </div>
    <route-headers :list="section.headers" title="Per response Headers (overriding route headers)" wide></route-headers>
    <div class="response_body">
      <div class="tabs_body">
        <div class="body_tab">&nbsp;</div>
        <div v-for="(variant,idx) in section.body" :key="idx" class="body_tab select" :class="{selected: current === idx}" @click="current = idx">
          <input type="radio" v-model="section.activeBody" :value="idx"/>
          <span class="body_name">Variant {{ idx + 1 }}</span>
          <button v-if="section.body.length > 1" type="button" class="remove_response remove_body" @click.stop="removeBody(idx)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 512 512">
              <circle cx="256" cy="256" r="256" fill="#DF7F7F"/>
              <rect x="88" y="224" width="336" height="60" transform="rotate(45 256 256)" fill="#FFF"/>
              <rect x="88" y="224" width="336" height="60" transform="rotate(-45 256 256)" fill="#FFF"/>
            </svg>
          </button>
        </div>
        <div class="body_tab" style="flex-grow: 1">
          <button type="button" class="add_body" @click="addBody">
            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 512 512">
              <circle cx="256" cy="256" r="238" stroke="orange" stroke-width="36" fill="transparent"/>
              <rect x="116" y="224" width="280" height="60" fill="orange"/>
              <rect x="116" y="224" width="280" height="60" transform="rotate(90 256 256)" fill="orange"/>
            </svg>
            New variant
          </button>
        </div>
      </div>
      <body-variant :variant="section.body[current]" :section="section"></body-variant>
    </div>
  </section>
</template>

<script>
import mixinColor from "./MethodColors"
import routeHeaders from '../environment/Headers'
import bodyVariant from './BodyVariant'

export default
{
  components:
    {
      routeHeaders,
      bodyVariant,
    },
  props:
    {
      section:
        {
          type: Object,
          required: true
        },
      append:
        {
          type: Boolean,
          default: false
        },
      remove:
        {
          type: Boolean,
          default: false
        }
    },
  mixins: [mixinColor],
  data ()
  {
    return {
      current: this.section.activeBody
    };
  },
  methods:
    {
      addBody ()
      {
        this.section.body.push({text: ''});
      },
      removeBody (idx)
      {
        let len = this.section.body.length - 2;
        if (this.section.activeBody > len) this.section.activeBody = len;
        if (this.current > len) this.current = len;
        this.section.body.splice(idx, 1);
      },
    }
}
</script>

<style>
  section
  {
    background: #21232A;
    margin: 6px 0;
  }

  section.empty .global_headers_title
  {
    color: #00B999;
  }

  .methods_panel
  {
    display: flex;
    align-items: center;
  }

  .remove_response
  {
    background-color: transparent;
    padding: 0;
    margin: 6px 2px 6px 6px;
  }

  .remove_response > svg
  {
    transition: transform 0.2s;
  }

  .remove_response:not(.remove_body):hover > svg
  {
    transform: scale(1.2);
  }

  .remove_response.remove_body:hover > svg
  {
    transform: rotate(360deg);
  }

  .method_btn
  {
    cursor: pointer;
    border-radius: 6px;
    padding: 4px 8px 3px;
    margin: 6px;
    font-size: 0.8rem;
    letter-spacing: 0.35px;
    display: flex;
    align-items: center;
  }

  .method_btn:hover
  {
    opacity: 1 !important;
  }

  .method_btn:active
  {
    transform: translate(1px, 1px);
  }

  .method_btn + .method_btn
  {
    margin-left: 0;
  }

  .method_btn > input
  {
    margin-right: 6px;
  }

  .method_btn > span
  {
    background-color: transparent;
  }

  .add_method_title
  {
    flex: 1 1 auto;
    text-align: center;
    font-size: 1.1rem;
    padding-right: 8px;
    color: orange;
  }

  .response_body
  {
    padding: 3px 8px;
  }

  .tabs_body
  {
    display: flex;
    padding-bottom: 4px;
  }

  .body_tab
  {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #DDD;
    padding: 2px 6px;
  }

  .body_tab.select
  {
    cursor: pointer;
  }

  .body_tab.selected
  {
    color: #00B999;
    background-color: #292D36;
    border-top-left-radius: 6px;
    border-top-right-radius: 4px;
    border: 1px solid #DDD;
    border-bottom: 1px solid transparent;
  }

  .body_tab > * + *
  {
    margin-left: 6px;
  }

  .add_body
  {
    display: flex;
    align-items: center;
    padding: 4px 8px 3px;
    background-color: #353944;
    border-radius: 4px;
    margin: 0 4px 1px;
    color: orange;
  }

  .add_body > *
  {
    margin-right: 6px;
  }

  .add_body:hover
  {
    color: #00B999;
    background-color: #383C48;
  }

</style>
