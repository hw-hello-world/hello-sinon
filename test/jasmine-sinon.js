function onProgress() {
  console.log('upload in progress');
}

function uploadFile(url) {

  var options = { url: url,
                  method: 'POST',
                  data: {},
                  xhr: function(){
                    var xhr = $.ajaxSettings.xhr() ;
                    xhr.upload.addEventListener('progress', onProgress, false);
                    return xhr ;
                  },
                  processData: false,
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
