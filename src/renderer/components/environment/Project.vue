<template>
  <div class="import_export">
    <button class="upper bg_primary" @click="openImport">Import</button>
    <button class="upper bg_secondary" @click="openExport">Export</button>
  </div>
</template>

<script>
import { remote } from 'electron'

export default
{
  methods:
    {
      openImport ()
      {
        let selected = remote.dialog.showOpenDialog({properties: ['openFile'], filters: [{name: 'mockAPI definition', extensions: ['json']}]});
        if (selected.length)
        {
          this.$root.configFile = selected[0];
          remote.getCurrentWindow().setTitle(remote.getGlobal('appTitle') + ' (' + selected[0] + ')');
          this.$root.loadConfig(selected[0]);
        }
      },
      openExport ()
      {
        let selected = remote.dialog.showSaveDialog({defaultPath: this.$root.configFile, filters: [{name: 'mockAPI definition', extensions: ['json']}]});
        if (selected.length)
        {
          this.$root.configFile = selected;
          remote.getCurrentWindow().setTitle(remote.getGlobal('appTitle') + ' (' + selected + ')');
          this.$root.saveConfig(selected);
        }
      }
    }
}
</script>

<style>
  .import_export
  {
    background-color: #292D36;
    padding: 4px;
    flex: 0 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .import_export button
  {
    margin: 3px 4px;
  }
</style>
