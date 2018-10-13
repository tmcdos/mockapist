<template>
  <form @submit.prevent="applySetup">
    <table class="server_setup">
      <tr>
        <td align="right">
          <label for="port">Port</label>
        </td>
        <td>
          <input type="number" id="port" v-model.number="port" min="80" max="10000" @input="modified = port !== $root.server.port" title="80 - 50 000"/>
          &nbsp;
          <button class="bg_success upper bold" :class="{dark: !canApply}" :disabled="!canApply">Apply</button>
        </td>
      </tr>
      <tr>
        <td align="right">
          <label for="delay">Latency</label>
        </td>
        <td>
          <input type="number" id="delay" v-model.number="$root.server.delay" min="0" max="20000" title="0 - 20 000"/>
          &nbsp;ms
        </td>
      </tr>
      <tr>
        <td align="right">
          <label for="prefix">Prefix</label>
        </td>
        <td>
          <input type="text" id="prefix" v-model="$root.server.prefix" maxlength="100" placeholder="e.g. /api" @input="newPrefix"/>
        </td>
      </tr>
      <tr>
        <td align="right">
          <input type="checkbox" id="cors" v-model="$root.server.cors" />
        </td>
        <td>
          <label for="cors">Enable CORS support</label>
        </td>
      </tr>
      <tr>
        <td align="right">
          <input type="checkbox" id="ssl" v-model="$root.server.ssl" />
        </td>
        <td>
          <label for="ssl">Enable HTTPS</label>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <label for="proxy">Forward undefined routes here:</label>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <input class="proxy_value" type="text" id="proxy" v-model.trim="$root.server.proxy" :title="$root.server.proxy" placeholder="Backend API (including prefix, if any)"/>
        </td>
      </tr>
    </table>
  </form>
</template>

<script>
export default
{
  data ()
  {
    return {
      modified: false,
      port: this.$root.server.port,
    }
  },
  computed:
    {
      canApply ()
      {
        return this.modified && this.port >= 80 && this.port <= 10000;
      }
    },
  methods:
    {
      applySetup ()
      {
        this.modified = false;
        this.$root.server.port = this.port;
      },
      newPrefix ()
      {
        let srv = this.$root.server;
        if (srv.prefix && srv.prefix.substr(0, 1) !== '/') srv.prefix = '/' + srv.prefix;
      }
    }
}
</script>

<style>
  .server_setup
  {
    width: 100%;
    margin: 6px 0;
    background-color: #292D36;
  }

  .server_setup td
  {
    padding: 4px;
  }

  .server_setup button
  {
    margin: 3px 0;
  }

  .server_setup input[type=number]
  {
    max-width: 65px;
  }

  .proxy_value
  {
    width: 100%;
  }
</style>
