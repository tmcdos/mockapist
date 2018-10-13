<template>
  <div class="routes_panel">
    <form class="form_route" @submit.prevent="addRoute">
      <table align="center" class="add_route">
        <tr>
          <td>
            <label for="route_path">Route:</label>
          </td>
        </tr>
        <tr>
          <td>
            <input class="header_text" type="text" id="route_path" v-model.trim="routePath" :title="routePath"
                   pattern="/?:?[\*a-zA-Z0-9_-]+(/:?[\*a-zA-Z0-9_-]+)*/?" ref="path" required/>
          </td>
        </tr>
        <tr>
          <td align="center">
            <button class="bg_primary upper">Append</button>
            &nbsp;
            <button class="bg_warning upper dark bold reset" :style="{opacity: $root.sortedRoutes.length ? 1 : 0.6}" type="button" title="Delete all routes" @click="resetRoutes">Reset</button>
          </td>
        </tr>
      </table>
    </form>
    <div class="route_scroll">
      <div v-for="route in $root.sortedRoutes" :key="route.path" class="route" :class="{selected: current === route}">
        <div class="route_info" @click="$emit('select',route)">
          <div class="route_path">{{ route.path }}</div>
          <div class="route_method">
            <div v-for="met in listMethods(route)" :key="met" class="method_badge" :style="{backgroundColor: bgMethod[met], color: methodColor(met)}">{{ met }}</div>
          </div>
        </div>
        <div class="remove_route" @click="removeRoute(route)">
          <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 512 512">
            <circle cx="256" cy="256" r="256" fill="#DF7F7F"/>
            <rect x="88" y="224" width="336" height="60" transform="rotate(45 256 256)" fill="#FFF"/>
            <rect x="88" y="224" width="336" height="60" transform="rotate(-45 256 256)" fill="#FFF"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setRoute, getMethods, makeRegex } from '@/util'
import mixinColor from './MethodColors'

export default
{
  props:
    {
      current:
        {
          type: Object
        }
    },
  mixins: [mixinColor],
  data ()
  {
    return {
      routePath: '',
    }
  },
  methods:
    {
      addRoute ()
      {
        let parts = this.routePath.split('/'), trailing = this.routePath.length > 1 && this.routePath[this.routePath.length - 1] === '/',
          path = '/' + parts.filter(item => item !== '').join('/') + (trailing ? '/' : ''),
          route = {
            path: path,
            regex: makeRegex(path),
            headers: [],
            latency: 0,
            sections:
              [
                {
                  latency: 0,
                  headers: [],
                  methods: ['GET'],
                  activeBody: 0,
                  body: [{status: 200, file: '', text: ''}]
                }
              ],
          };
        if (route.path !== '')
        {
          setRoute(this.$root.routes, route);
        }
        if (!this.current) this.$emit('select', route);
        this.routePath = '';
        this.$refs.path.focus();
      },
      resetRoutes ()
      {
        this.$root.routes = [];
      },
      removeRoute (route)
      {
        let idxOrig = this.$root.routes.indexOf(this.current), idxSort = this.$root.sortedRoutes.indexOf(this.current);
        this.$root.routes.splice(idxOrig, 1);
        if (this.current === route)
        {
          if (idxSort >= this.$root.routes.length) idxSort = this.$root.routes.length - 1;
          this.$emit('select', idxSort < 0 ? null : this.$root.sortedRoutes[idxSort]);
        }
      },
      listMethods (route)
      {
        return getMethods(route);
      }
    }
}
</script>

<style>
  .routes_panel
  {
    display: flex;
    flex-direction: column;
    min-width: 300px;
    max-width: 500px;
    padding-right: 8px;
  }

  .form_route
  {
    background-color: #21232A;
    padding: 6px;
    margin-bottom: 8px;
  }

  .add_route
  {
    width: 100%;
  }

  .add_route td
  {
    padding: 4px;
  }

  .add_route input
  {
    width: 100%;
  }

  .route_scroll
  {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 4px 2px;
    background-color: #21232A;
  }

  .route
  {
    display: flex;
    padding: 3px 6px;
  }

  .route.selected
  {
    background-color: #353944;
    color: orange;
  }

  .route_info
  {
    flex: 1 1 0;
    display: flex;
    flex-wrap: wrap;
  }

  .route:not(.selected) .route_info
  {
    cursor: pointer;
  }

  .route_path
  {
    flex: 1 1 0;
    padding-right: 8px;
  }

  .route:not(.selected) .route_path:hover
  {
    color: #00B999;
  }

  .route_method
  {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .method_badge
  {
    border-radius: 4px;
    font-size: 0.7rem;
    margin: 2px 3px;
    padding: 2px 4px;
  }

  .remove_route
  {
    display: flex;
    cursor: pointer;
    padding-left: 4px;
  }

  .remove_route svg
  {
    margin: auto;
    transition: transform 0.2s;
  }

  .remove_route:hover svg
  {
    transform: scale(1.2);
  }

</style>
