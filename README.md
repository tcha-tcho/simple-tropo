# simple-tropo

A elegant and simpler way to access [Tropo](http://tropo.com) webapi using node.js and express.


## Installation

    $ npm install simple-tropo --save

(`--save` automatically writes to your `package.json` file, tell your friends)

## Requirements

1 - You gonna have to create a account on tropo [here](https://www.tropo.com/account/register.jsp).

2 - Create a application as showed on image below.

3 - Add a Canadian phone number (internationals SMSs)

4 - Contact support@tropo.com for grant international Voice and SMS permissions


![configuration sample](http://f.tmts.co.s3.amazonaws.com/images/tropo_conf_sample.png)


## Usage

Run `node app.js` from `examples` and open `localhost:3000` to see a working example.
`Just remember to change 'token' to your own`

```javascript
var app = require('express')()
  , tropo = require('simple-tropo')({
    token    : "your-token-key"
  }).listen(app)

//[optional] you can intercept incomings to create interactive robots
tropo.listener = function(res,tropo_obj){
  res.send(tropo_obj);
}

tropo.send({ //type:'message' - (SMS) is default
   to     : "112341234"
  ,say    : "your message"
},function(res){
  console.log("message was delivered")
})

app.listen(3000);
```

## Options

You can change the type of method setting the param `type` on 'tropo.send({type:'method'},callback)'

See all methods and parameters avaiable [HERE](https://www.tropo.com/docs/scripting/element_summary.htm)

## Features

### `Chep SMS and calls`

Tropo has a good pricing you can see [here](https://www.tropo.com/pricing/)


## TODO

 - Make the others methods works
 - More Tests!

## Running Tests

To run the test suite first invoke the following command within the repo, installing the development dependencies:

    $ npm install -d

Change the keys on `test/test.partials.js`

then run the tests:

    $ npm test



## Credits

The code comes from [Tcha-Tcho](https://github.com/tcha-tcho)


## License

(The MIT License)

Copyright (c) 2012 Tcha-Tcho &lt;tchatcho66@hotmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
