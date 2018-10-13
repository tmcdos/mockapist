import Vue from 'vue'
import App from './App'
import fs from 'fs'
import path from 'path'
import url from 'url'
import http from 'http'
import https from 'https'
import mime from 'mime'
import {setHeader, _debounce, strCompare, getMethods, isArray, makeRegex} from './util'
import { remote } from 'electron'

if (!process.env.IS_WEB)
{
  Vue.use(require('vue-electron'));
}
Vue.config.productionTip = false;

const corsHeaders =
  [
    {
      name: 'Access-Control-Allow-Origin',
      locase: 'Access-Control-Allow-Origin'.toLowerCase(),
      value: '*'
    },
    {
      name: 'Access-Control-Allow-Methods',
      locase: 'Access-Control-Allow-Methods'.toLowerCase(),
      value: 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS'
    },
    {
      name: 'Access-Control-Allow-Headers',
      locase: 'Access-Control-Allow-Headers',
      value: 'Content-Type, Origin, Accept, Authorization, Content-Length, X-Requested-With'
    }
  ];

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>',
  data:
    {
      http: null,
      https: null,
      configFile: path.join(remote.app.getPath('userData'), 'mockapist.json'),
      options:
        {
          // can not use global.__static in development mode
          // because it points to "node_modules\\electron\\dist\\resources\\electron.asar\\renderer\\static"
          /* eslint-disable import/no-webpack-loader-syntax */
          key: require('raw-loader!./assets/localhost-key.pem'),
          /* eslint-disable import/no-webpack-loader-syntax */
          cert: require('raw-loader!./assets/localhost-cert.pem')
        },
      server:
        {
          port: 5000,
          delay: 0, // global latency
          prefix: '',
          cors: true,
          ssl: false,
        },
      headers: [],
      routes: [],
      debounceConfig: null,
      currentRoute: null
    },
  watch:
    {
      'server.port': 'restart',
      'server.ssl': 'restart',
      'server.prefix': 'setPrefix',
      'server.proxy': 'setPrefix',
      'server.delay': 'setPrefix',
      'server.cors': 'setPrefix',
      'headers': 'setPrefix',
      routes:
        {
          handler: 'setPrefix',
          deep: true
        }
    },
  created ()
  {
    this.debounceConfig = _debounce(this.saveConfig, 2000);
    this.loadConfig();
    this.http = http.createServer(this.handler);
    this.https = https.createServer(this.options, this.handler);
    // start HTTP server
    if (this.server.ssl) this.https.listen(this.server.port);
    else this.http.listen(this.server.port);
  },
  computed:
    {
      sortedRoutes ()
      {
        return this.routes.slice().sort((a, b) =>
        {
          return strCompare(a.path, b.path);
        });
      },
      validPrefix ()
      {
        if (!this.server.prefix) return true;
        return /^\/?[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/.test(this.server.prefix);
      },
      validProxy ()
      {
        let parts = {};
        try
        {
          parts = url.parse(this.server.proxy, true, true);
          return ['http', 'https'].includes(parts.protocol) && parts.hostname !== '';
        }
        catch (e)
        {
          return false;
        }
      },
      proxySSL ()
      {
        return this.server.proxy.substr(0, 6) === 'https:';
      }
    },
  methods:
    {
      handler (request, response)
      {
        // check if the route is defined
        let parts = url.parse(request.url), route = this.getRoute(parts.pathname);
        if (route)
        {
          // check if the route defines a response for the method
          let resp = route.sections.find(item =>
          {
            return item.methods.includes(request.method);
          });
          if (resp)
          {
            let current = resp.body[resp.activeBody], canRead = false, mimeType, mimeHeader = [];
            // get MIME type
            if (current.file && current.file !== '')
            {
              try
              {
                fs.accessSync(current.file, fs.constants.R_OK);
                canRead = true;
                mimeType = mime.getType(current.file.split('.').pop());
                mimeHeader.push({name: 'Content-Type', value: mimeType});
              }
              catch (e)
              {
                // can not read from file
                mimeHeader.push({name: 'X-File-Error', value: e.message});
              }
            }
            response.writeHead(current.status, this.returnHeaders(route.headers, resp.headers, mimeHeader));
            // TODO - support latency
            if (request.method === 'HEAD' || [204, 304].includes(current.status)) response.end(); // body MUST BE empty
            else
            {
              if (current.file && current.file !== '' && canRead)
              {
                let stm = fs.createReadStream(current.file);
                stm.on('error', e =>
                {
                  response.end();
                });
                stm.on('data', chunk =>
                {
                  response.write(chunk);
                });
                stm.on('end', () =>
                {
                  response.end();
                });
              }
              else response.end(current.text);
            }
          }
          else if (request.method === 'OPTIONS' && this.server.cors)
          {
            response.writeHead(200, this.returnHeaders());
            response.end();
          }
          else
          {
            // the route does not support this HTTP method
            let listHead = this.returnHeaders(), methods = getMethods(route);
            if (methods.length) listHead.Allow = methods.join(',');
            response.writeHead(405, listHead);
            response.end();
          }
        }
        else if (this.validProxy)
        {
          try
          {
            const req = (this.proxySSL ? https : http).request(this.server.proxy + parts.pathname + parts.search + parts.hash, {
              method: request.method,
              headers: request.headers
            }, function (res)
            {
              res.setEncoding('utf8');
              response.writeHead(res.statusCode, res.headers);
              res.on('data', chunk =>
              {
                response.write(chunk);
              });
              // finish sending to browser
              res.on('end', () => response.end());
            });
            req.on('error', e =>
            {
              response.writeHead(500, {
                'Content-Type': 'application/json'
              });
              response.end(JSON.stringify(e));
            });
            // read data from browser
            request.on('data', chunk =>
            {
              // send data to proxy
              req.write(chunk);
            });
            // finish sending to proxy
            request.on('end', () => req.end());
          }
          catch (e)
          {
            response.writeHead(500, {
              'Content-Type': 'application/json'
            });
            response.end(JSON.stringify(e));
          }
        }
        else
        {
          response.writeHead(404, this.returnHeaders());
          response.end();
        }
      },
      returnHeaders ()
      {
        let listHead = [], args = Array.prototype.slice.call(arguments);
        args.unshift(this.headers);
        if (this.server.cors) args.unshift(corsHeaders);
        // sequentially apply headers, each next header potentially overriding a previous one
        for (let i = 0; i < args.length; i++)
          if (isArray(args[i])) args[i].forEach(function (elem)
          {
            setHeader(listHead, elem.name, elem.value);
          });
        // convert headers from Array to Object
        // we can not work with Object directly because we want to keep the exact case in header names
        let result = {};
        listHead.forEach(function (item)
        {
          result[item.name] = item.value;
        });
        return result;
      },
      getRoute (pathname)
      {
        pathname = pathname.replace(this.server.prefix || '', '');
        return this.routes.find(item =>
        {
          return item.regex.test(pathname);
        });
      },
      setPrefix ()
      {
        // saves the config 2000ms after the last change
        this.debounceConfig();
      },
      restart ()
      {
        this.http.close();
        this.https.close();
        if (this.server.ssl) this.https.listen(this.server.port);
        else this.http.listen(this.server.port);
        this.setPrefix();
      },
      loadConfig (cfg)
      {
        // load environment
        try
        {
          if (!cfg) cfg = this.configFile;
          fs.accessSync(cfg, fs.constants.R_OK);
          const data = fs.readFileSync(cfg, 'utf8');
          let js = {};
          try
          {
            js = JSON.parse(data);
            if (js.version === 1)
            {
              this.server = js.server;
              this.headers = js.headers.map((item) =>
              {
                return {
                  name: item.name,
                  locase: item.name.toLowerCase(),
                  value: item.value
                };
              });
              this.routes = js.routes.map(item =>
              {
                item.regex = makeRegex(item.path);
                return item;
              });
            }
          }
          catch (e)
          {
            // empty file or invalid JSON
            remote.dialog.showErrorBox('Error while importing', e.message);
          }
        }
        catch (e)
        {
          // can not read from file
          remote.dialog.showErrorBox('Can not read from file', e.message);
        }
      },
      saveConfig (cfg)
      {
        try
        {
          if (!cfg) cfg = this.configFile;
          const data = JSON.stringify({
            version: 1,
            server: this.server,
            headers: this.headers.map(item =>
            {
              // do not save LOCASE
              return {
                name: item.name,
                value: item.value
              };
            }),
            routes: this.routes.map(item =>
            {
              // do not save REGEX
              return {
                path: item.path,
                headers: item.headers,
                latency: item.latency,
                sections: item.sections
              }
            })
          });
          fs.writeFileSync(cfg, data, 'utf8');
        }
        catch (e)
        {
          // error writing file
          remote.dialog.showErrorBox('Can not write to file', e.message);
        }
      }
    }
}).$mount('#app');
