<template>
  <div id="app">
    <left-sidebar></left-sidebar>
    <api-setup></api-setup>
  </div>
</template>

<script>
import leftSidebar from './components/environment/SideBar'
import apiSetup from './components/api/MockPanel'

export default
{
  name: 'mockapist',
  components:
    {
      leftSidebar,
      apiSetup
    },
  data ()
  {
    return {
      debug: process.NODE_ENV !== "production"
    }
  },
}
</script>

<style>
  @font-face
  {
    font-family: 'DIN';
    font-style: normal;
    font-weight: 400;
    src: url('./assets/fonts/din_pro.woff') format('woff');
  }

  *
  {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body
  {
    font-family: DIN, sans-serif;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: subpixel-antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #app
  {
    background: #21232A;
    color: white;
    height: 100vh;
    width: 100vw;
    display: flex;
    overflow: hidden;
  }

  [disabled]
  {
    opacity: 0.5;
    cursor: not-allowed;
  }

  button
  {
    border-radius: 6px;
    padding: 6px 10px 5px;
    border: none;
    cursor: pointer;
    letter-spacing: 1px;
    outline: none;
  }

  button:active
  {
    transform: translate(1px, 1px);
  }

  input
  {
    font-size: 1rem;
    padding: 2px 3px;
  }

  input[type=text],
  input[type=number]
  {
    background-color: #383C48;
    color: orange;
    border-radius: 3px;
    border: 1px solid orange;
    padding-left: 5px;
    padding-right: 5px;
  }

  input[type=date]::-webkit-inner-spin-button,
  input[type=date]::-webkit-clear-button,
  input[type=date]::-webkit-outer-spin-button,
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button
  {
    -webkit-appearance: none;
  }

  input[type=checkbox],
  input[type=radio]
  {
    width: 20px;
    height: 20px;
  }

  label
  {
    cursor: pointer;
  }

  svg
  {
    vertical-align: middle;
  }

  .upper
  {
    text-transform: uppercase;
  }

  .bold
  {
    font-weight: bold;
  }

  .reset:hover
  {
    opacity: 1 !important;
  }
</style>

<style src="./assets/css/colors.scss"></style>
