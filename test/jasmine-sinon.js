function uploadFile(url) {

  var options = { url: url,
                  method: 'POST',
                  data: {},
                  xhr: function(){
                    var xhr = $.ajaxSettings.xhr() ;
                    xhr.upload.addEventListener('progress', self.onProgress, false);
                    xhr.upload.addEventListener('load', self.onComplete, false);
                    return xhr ;
                  },
                  // do not convert data to string
                  processData: false,
                  // to avoid override header content type. particularly for boundary
                  contentType: false
                };
  return $.ajax(options);

}


describe('test XHR2 upload', function () {


  beforeEach(function () {
    this.ss = sinon.sandbox.create();
    this.ss.useFakeServer();
  });

  afterEach(function () {
    this.ss.restore();
  });

  it('shall make post request successfully', function (done) {
    var url = '/upload/image';

    this.ss.server.respondWith(
      'POST', url,
      [ 200, { 'Content-Type': 'application/json' },
        '{ "id": 12, "name": "an-test-file", "type": "cert" }'
      ]);


    uploadFile(url)
      .done(function (resp) {
        expect(resp).toEqual({
          id: 12,
          name: 'an-test-file',
          type: 'cert'
        });
      })
      .fail(function () {
        fail('test failed');
      })
      .always(done);

    this.ss.server.respond();
  });

});
