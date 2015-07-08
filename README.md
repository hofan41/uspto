**uspto** is a library for retrieve USPTO patent information directly from their website

Lead Maintainer: [Ho-Fan Kang](https://github.com/hofan41)

<!-- toc -->

- [Example](#example)
- [Usage](#usage)
    - [`listPatents(options, callback)`](#listPatentsoptions-callback)

<!-- tocstop -->

### Example

```javascript
var Uspto = require('uspto');

var options = {
  query: 'IN/KANG-HO-FAN',  // [USPTO Query String](http://patft.uspto.gov/netahtml/PTO/search-adv.htm)
  page: 1
};

Uspto.listPatents(options, function (err, data) {
  
  if (!err) {
    data.forEach(function (element) {

      console.log('patent number: ' + element.id);
      console.log('patent link: ' + element.link);
      console.log('patent title: ' + element.title);      
    });
  }
});
```
# Usage

### `listPatents(options, callback)`

Retrieves a list of up to 50 patents/grants based on:
- `options` - required:
  - `query` - [USPTO Query String](http://patft.uspto.gov/netahtml/PTO/search-adv.htm), required.
  - `page` - used when it is necessary to retrieve beyond the first 50 patents, defaults to 1.
- `callback` - the callback method using the signature `function(err, data)` where:
  - `err` - if retrieval failed, the error reason, otherwise `null`.
  - `data` - the retrieved patents as an array of objects containing:
    - `id` - the patent number.
    - `url` - a link to the patent on the USPTO website.
    - `title` - the patent title.
