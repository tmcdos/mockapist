<template>
  <div id="route_details" class="route_details" v-if="route">
    <div style="display: inline-block; min-width: 100%">
      <!-- Display: Inline-Block is required, otherwise child elements which are Flexbox containers do not expand to accommodate the size of Flexbox items -->
      <div class="route_name">
        <span>ROUTE &nbsp;</span>
        <input type="text" class="route_pathname" v-model.trim="route.path" @input="ensurePath" required/>
        <!--
        <span>&nbsp; Latency &nbsp;</span>
        <input type="number" v-model.number="route.latency" min="0" max="20000" title="0 - 20 000"/>
        <span>&nbsp; ms</span>
        -->
      </div>
      <route-headers :list="route.headers" title="Per route Headers (overriding global headers)" wide></route-headers>
      <div class="section_list">
        <div class="route_name">
          <span>RESPONSE TYPES</span>
        </div>
        <response-list v-for="(section,idx) in route.sections" :section="section" :key="idx" @verb="updateVerb" @remove="removeResponse(idx)"></response-list>
        <response-list :section="newSection" append remove @verb="updateVerb"></response-list>
      </div>
    </div>
  </div>
</template>

<script>
import routeHeaders from '../environment/Headers'
import responseList from './ResponseList'
import { makeRegex } from '@/util'

export default
{
  components:
    {
      routeHeaders,
      responseList
    },
  props:
    {
      route:
        {
          type: Object
        }
    },
  data ()
  {
    return {
      newSection:
        {
          latency: 0,
          headers: [],
          methods: [],
          activeBody: 0,
          body: [{status: 200, file: '', text: ''}]
        }
    };
  },
  watch:
    {
      'newSection.methods': 'addResponse',
      'route': 'newClear'
    },
  methods:
    {
      ensurePath ()
      {
        if (!this.route.path) this.route.path = '/';
        else
        {
          let parts = this.route.path.split('/'), trailing = this.route.path.length > 1 && this.route.path[this.route.path.length - 1] === '/';
          this.route.path = '/' + parts.filter(item => item !== '').join('/') + (trailing ? '/' : '');
          this.route.regex = makeRegex(this.route.path);
        }
      },
      updateVerb (section, verb)
      {
        if (!section.methods.includes(verb))
        {
          this.route.sections.forEach(item =>
          {
            if (item !== section)
            {
              let idx = item.methods.indexOf(verb);
              if (idx !== -1) item.methods.splice(idx, 1);
            }
          });
          if (section !== this.newSection)
          {
            let idx = this.newSection.methods.indexOf(verb);
            if (idx !== -1) this.newSection.methods.splice(idx, 1);
          }
        }
      },
      newClear ()
      {
        this.newSection = {
          latency: 0,
          headers: [],
          methods: [],
          activeBody: 0,
          body: [{status: 200, file: '', text: ''}]
        };
      },
      addResponse ()
      {
        if (this.newSection.methods.length)
        {
          this.route.sections.push(this.newSection);
          this.newClear();
        }
      },
      removeResponse (idx)
      {
        this.route.sections.splice(idx, 1);
      }
    }
}
</script>

<style>
  .route_details
  {
    flex: 1 1 0;
    background-color: #252D36;
    padding: 4px 8px 0;
    overflow: auto;
  }

  .route_details .global_headers_panel
  {
    background: #21232A;
    padding: 0 8px 8px;
  }

  .route_details .global_headers_title
  {
    padding-top: 4px;
  }

  .route_name
  {
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    padding-bottom: 6px;
    margin-left: auto;
  }

  .route_name > *:first-child
  {
    margin-left: auto;
  }

  .route_name > *:last-child
  {
    margin-right: auto;
    min-width: 250px;
  }

  .route_name input[type=number]
  {
    max-width: 65px;
  }

  .section_list .route_name
  {
    padding: 4px 6px 0;
  }
</style>
