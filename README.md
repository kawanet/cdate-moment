# cdate-moment - moment.js compat plugin for cdate

[![Node.js CI](https://github.com/kawanet/cdate-moment/workflows/Node.js%20CI/badge.svg?branch=main)](https://github.com/kawanet/cdate-moment/actions/)
[![npm version](https://img.shields.io/npm/v/cdate-moment)](https://www.npmjs.com/package/cdate-moment)

## SYNOPSIS

```js
// TypeScript, ESM
import {cdate} from "cdate";
import {cdateMoment} from "cdate-moment";

// CommonJS
const {cdate} = require("cdate");
const {cdateMoment} = require("cdate-moment");
```

```js
const moment = cdate(0).plugin(cdateMoment).momentFn();

moment([2022, 0, 1]).format("YYYY-MM-DD");

moment("2022-01-01").endOf("year").format("YYYY-MM-DD");
```

## LICENSE

- `cdate-moment` is freely distributable under the terms of the MIT license.

## LINKS

- https://github.com/kawanet/cdate
- https://github.com/kawanet/cdate-moment
- https://www.npmjs.com/package/cdate-moment
