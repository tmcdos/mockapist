<template>
  <div class="global_headers_panel">
    <div class="global_headers_title">{{ title }}</div>
    <div :class="{wide_headers: wide}">
      <form class="form_headers" @submit.prevent="addHeader">
        <table align="center" class="global_headers_list">
          <tr>
            <td>
              <label for="header_name">Header name:</label>
            </td>
            <td v-if="wide">
              <input type="text" id="header_name" v-model.trim="headerName" :title="headerName"
                     :list="'headers' + _uid" pattern="[a-zA-Z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*" ref="head_name"
                     onchange="this.form.header_value.focus()" required/>
            </td>
          </tr>
          <tr v-if="!wide">
            <td>
              <input type="text" id="header_name" v-model.trim="headerName" :title="headerName"
                     :list="'headers'+_uid" pattern="[a-zA-Z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*" ref="head_name"
                     onchange="this.form.header_value.focus()" required/>
            </td>
          </tr>
          <tr>
            <td>
              <label for="header_value">Header value:</label>
            </td>
            <td v-if="wide">
              <input type="text" id="header_value" v-model.trim="headerValue" :list="'values'+_uid"
                     onchange="this.form.append.click()" required/>
            </td>
          </tr>
          <tr v-if="!wide">
            <td>
              <input type="text" id="header_value" v-model.trim="headerValue" :list="'values'+_uid"
                     onchange="this.form.append.click()" required/>
            </td>
          </tr>
          <tr>
            <td align="center" :colspan="wide ? 2 : 1">
              <button class="bg_primary upper" name="append">Append</button>
              &nbsp;
              <button class="bg_warning upper dark bold reset" :style="{opacity: sortedHeaders.length ? 1 : 0.6}" type="button" title="Delete all headers" @click="resetHeaders">Reset</button>
            </td>
          </tr>
        </table>
      </form>
      <div class="header_scroll">
        <table class="header_list" v-if="wide">
          <tbody>
            <tr>
              <th>Name</th>
              <td v-for="head in sortedHeaders" :key="head.name">{{ head.name }}</td>
            </tr>
            <tr>
              <th>Value</th>
              <td v-for="head in sortedHeaders" :key="head.name">{{ head.value }}</td>
            </tr>
            <tr v-if="sortedHeaders.length">
              <th>&nbsp;</th>
              <td v-for="head in sortedHeaders" :key="head.name" class="remove_header" width="25px" @click="removeHeader(head.name)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 512 512">
                  <circle cx="256" cy="256" r="256" fill="#DF7F7F"/>
                  <rect x="88" y="224" width="336" height="60" transform="rotate(45 256 256)" fill="#FFF"/>
                  <rect x="88" y="224" width="336" height="60" transform="rotate(-45 256 256)" fill="#FFF"/>
                </svg>
              </td>
            </tr>
          </tbody>
        </table>
        <table class="header_list" v-else>
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
              <th v-if="sortedHeaders.length">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="head in sortedHeaders" :key="head.name">
              <td>{{ head.name }}</td>
              <td>{{ head.value }}</td>
              <td class="remove_header" width="25px" @click="removeHeader(head.name)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 512 512">
                  <circle cx="256" cy="256" r="256" fill="#DF7F7F"/>
                  <rect x="88" y="224" width="336" height="60" transform="rotate(45 256 256)" fill="#FFF"/>
                  <rect x="88" y="224" width="336" height="60" transform="rotate(-45 256 256)" fill="#FFF"/>
                </svg>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <datalist :id="'headers'+_uid">
      <option v-for="header in suggestHeaders" :value="header" :key="header"></option>
    </datalist>
    <datalist :id="'values'+_uid">
      <option v-for="value in suggestValues" :value="value" :key="value"></option>
    </datalist>
  </div>
</template>

<script>
import data from './headers.json'
import { strCompare, setHeader } from "@/util"

export default
{
  props:
    {
      wide:
        {
          type: Boolean,
          default: false
        },
      title:
        {
          type: String,
          default: 'Global Headers'
        },
      list:
        {
          type: Array,
          required: true
        }
    },
  data ()
  {
    return {
      headerName: '',
      headerValue: '',
    }
  },
  computed:
    {
      suggestHeaders ()
      {
        return data.map(item =>
        {
          return item.header
        }).sort((a, b) =>
        {
          return strCompare(a, b);
        })
      },
      suggestValues ()
      {
        let re = new RegExp('^' + this.headerName + '$', 'i'), header = data.find(item =>
        {
          return re.test(item.header);
        });
        return header ? header.values : [];
      },
      sortedHeaders ()
      {
        return this.list.slice().sort((a, b) =>
        {
          return strCompare(a.name, b.name);
        })
      }
    },
  methods:
    {
      addHeader ()
      {
        if (!this.headerName || !this.headerValue) return;
        setHeader(this.list, this.headerName, this.headerValue);
        this.headerName = '';
        this.headerValue = '';
        this.$refs.head_name.focus();
      },
      removeHeader (name)
      {
        let idx = this.list.findIndex(item =>
        {
          return item.name === name;
        });
        if (idx !== -1)
        {
          this.list.splice(idx, 1);
        }
      },
      resetHeaders ()
      {
        this.list.splice(0);
      }
    }
}
</script>

<style>
  .global_headers_title
  {
    padding: 8px 0;
    text-align: center;
    font-size: 1.1rem;
  }

  .global_headers_list
  {
    width: 100%;
  }

  .global_headers_list td
  {
    padding: 4px;
  }

  .form_headers
  {
    background-color: #292D36;
  }

  .form_headers input
  {
    width: 100%;
    min-width: 200px;
  }

  .header_list
  {
    border-collapse: collapse;
    width: 100%;
    margin: 6px 0;
  }

  .header_list th
  {
    background-color: #D08800;
  }

  .header_list td,
  .header_list th
  {
    border: 1px solid white;
    padding: 3px 4px;
    min-height: 1.5rem;
    word-break: break-word;
  }

  .remove_header
  {
    cursor: pointer;
    text-align: center;
  }

  .remove_header svg
  {
    transition: transform 0.3s;
  }

  .remove_header:hover svg
  {
    transform: rotate(360deg);
  }

  .wide_headers
  {
    display: flex;
  }

  .wide_headers .form_headers
  {
    margin-right: 8px;
  }

  .wide_headers .header_scroll
  {
    padding-right: 8px;
  }

  .wide_headers .header_list td,
  .wide_headers .header_list th
  {
    white-space: nowrap;
  }

  .header_list tr:nth-child(odd) td
  {
    background-color: #292D36;
  }

  .wide_headers .header_list td:nth-child(odd)
  {
    background-color: #292D36;
  }

  .wide_headers .header_list td:nth-child(even)
  {
    background-color: transparent;
  }
</style>
