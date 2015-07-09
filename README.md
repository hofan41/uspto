**uspto** is a library for directly retrieving USPTO patent information

Lead Maintainer: [Ho-Fan Kang](https://github.com/hofan41)

<!-- toc -->

- [Example](#example)
- [Usage](#usage)
    - [`listPatents(options, callback)`](#listpatentsoptions-callback)

<!-- tocstop -->

### Example

```javascript
var Uspto = require('uspto');

var options = {
  query: 'IN/KANG-HO-FAN'
};

Uspto.listPatents(options, function (err, data) {
  
  if (!err) {
    data.forEach(function (element) {

      console.log('\n\n');
      console.log('patent number: ' + element.id);
      console.log('patent link: ' + element.url);
      console.log('patent title: ' + element.title);
      console.log('patent pdf link: ' + element.pdf);
    });
  }
});```
# Usage

### `listPatents(options, callback)`

Retrieves a list of up to 50 patents/grants based on:
- `options` - required:
  - `query` - [USPTO Query String](http://patft.uspto.gov/netahtml/PTO/search-adv.htm), required.
  - `page` - number, used when retrieving beyond the first 50 search results, defaults to 1.
- `callback` - the callback method using the signature `function(err, data)` where:
  - `err` - if retrieval failed, the error reason, otherwise `null`.
  - `data` - the retrieved patents as an array of objects containing:
    - `id` - the patent number.
    - `url` - a link to the patent on the USPTO website.
    - `title` - the patent title.
    - `pdf` - a link to a full pdf download of the patent.
