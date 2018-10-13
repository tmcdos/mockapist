<template>
  <aside>
    <import-export></import-export>
    <server-setup></server-setup>
    <hr color="white" size="2"/>
    <global-headers :list="$root.headers"></global-headers>
  </aside>
</template>

<script>
import project from './Project'
import serverSetup from './ServerSetup'
import globalHeaders from './Headers'

export default
{
  name: 'SideBar',
  components:
    {
      'import-export': project,
      serverSetup,
      globalHeaders
    }
}
</script>

<style>
  aside
  {
    flex: 0 0 350px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    overflow: auto;
  }
</style>
