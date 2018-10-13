<template>
  <main>
    <route-list :current="$root.currentRoute" @select="setRoute"></route-list>
    <route-detail :route="$root.currentRoute"></route-detail>
  </main>
</template>

<script>
import routeList from './RoutesList'
import routeDetail from './RouteDetails'

export default
{
  components:
    {
      routeList,
      routeDetail
    },
  methods:
    {
      setRoute (route)
      {
        this.$root.currentRoute = route;
      }
    }
}
</script>

<style>
  main
  {
    flex: 1 1 0;
    padding: 8px;
    background-color: #252830;
    display: flex;
    overflow: hidden;
  }
</style>
