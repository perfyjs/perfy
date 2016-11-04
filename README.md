# Perfy with ♥️

The perfect companion tool for [Benchpress](https://github.com/angular/angular/tree/master/modules/%40angular/benchpress) Performance Toolkit.

![image](https://cloud.githubusercontent.com/assets/1699357/19990618/4968b246-a22f-11e6-91f9-937b71998531.png)


## How to use it (WIP)

For now, you can just clone this repo and...

1. Npm or Yarn install its deps: `npm install`
1. Build your own application you wanna test and serve it on a local port (i.e. 9999)
1. Use [angular.spec.js](https://github.com/manekinekko/perfy/blob/master/specs/angular.spec.js) as an example
1. Run `npm test`. This will run the perf compain tests
1. All reports will be generated in the [public](https://github.com/manekinekko/perfy/tree/master/public) folder
1. Run a local server to serve the public folder
1. Enjoy 🎉

## Notes

Benchpress will write all its JSON reports in the [public](https://github.com/manekinekko/perfy/tree/master/public) folder, and name them like so: `sample-id_TIMESTAMP.json`:

```
├── paint-with-web-component_1478210312207.json
├── paint-with-web-component_1478210351209.json
├── paint-with-web-component_1478210397529.json
├── paint-with-web-component_1478210444576.json
├── paint-with-web-component_1478210490802.json
├── paint-with-web-component_1478210538966.json
├── paint-with-web-component_1478210584509.json
├── paint-with-web-component_1478210605446.json
├── paint-with-web-component_1478219206794.json
├── paint-with-web-component_1478219255917.json
├── paint-with-web-component_1478219284622.json
├── paint-with-web-component_1478219319050.json
├── paint-with-web-component_1478219368862.json
├── paint-with-web-component_1478219417463.json
├── paint-with-web-component_1478219466122.json
├── paint-with-web-component_1478219515129.json
```

Perfy will then merge all those files into a single file named `paint-with-web-component.json`. This file will eventually contain all samples from each timestamped files. It will also update the [index.html](https://github.com/manekinekko/perfy/blob/master/public/index.html#L8-L9) to load that new file `paint-with-web-component.json` (or any other merged file, of course).

So, you just need to serve the public folder, run your perf compaigns and after each compaign you can refresh the perfy UI to view the updated generated data from Benchpress.


## Have a PR?

All contributions are welcome ;)

## License

The MIT License (MIT) Copyright (c) 2016 - Wassim CHEGHAM

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
