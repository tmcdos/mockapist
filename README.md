# mockAPIst

> A simple tool to help you mock REST APIs locally

This tool was made out of necessity. I needed something simple (not like Postman) so I tried [Mockoon](https://github.com/255kb/mockoon)  
I soon realized that it lacks some bells and whistles - so I decided to build a tool to suit my requirements.

## Features

- the web server is active automatically on start (no need to start it manually)
- the web server does not need restart when you define a new route (restart is needed only when changing the port)
- CORS (if selected) works for all HTTP verbs (not only for OPTIONS)
- ability to define global headers (will be applied on all defined routes - but not on undefined ones, which will be proxied)
- automatically prevents defining duplicate routes (this also catches glob patterns - i.e. **"/user/add"** will be considered the same as **"/user/*"**)
- global headers can be overridden for each route
- a route may have multiple responses
- a response can match to more than 1 HTTP verb (e.g. both PATCH and PUT) - you do not have to copy/paste the same response
- route headers can be overridden by each response
- a response may have several variants so you can quickly switch between them
- each variant may either specify its content as text or reference a file (MIME type of the file will be used for the **"Content-Type"** header) - file takes precedence over the text content
- for `application/json` responses [ACE editor](https://github.com/ajaxorg/ace) is used for highlighting

### Limitations

- Latency is planned but not yet implemented
- Templating/interpolation (for `application/json`) is not currently planned but would be nice to have
- Unlike **Mockoon**, there is only 1 environment at any given time though you can import/export the current environment
- The fact that you can't have both **"/user/add"** and **"/user/*"** as separate routes (so that you define what is common for the pattern and then add an exception) may be inconvenient in some situations
- The tool is slightly opinionated so it may not be suitable for everyone

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build
```

## License

[The MIT License](https://raw.githubusercontent.com/stylelint/stylelint/master/LICENSE)