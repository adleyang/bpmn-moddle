var _ = require('lodash');

var Helper = require('../Helper'),
    Matchers = require('../Matchers');

var BpmnModel = Helper.bpmnModel();


describe('Model', function() {

  var createModel = Helper.createModelBuilder('resources/bpmn/json/');

  var bpmnModel = BpmnModel.instance();


  function write(element, options, callback) {
    if (_.isFunction(options)) {
      callback = options;
      options = {};
    }

    // skip preamble for tests
    options = _.extend({ preamble: false }, options);

    BpmnModel.toXML(element, options, callback);
  }

  beforeEach(Matchers.add);


  describe('toXML', function() {

    it('export empty Definitions', function(done) {

      // given
      var definitions = bpmnModel.create('bpmn:Definitions');

      var expectedXML =
        '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" />';

      // when
      write(definitions, function(err, result) {

        // then
        expect(result).toEqual(expectedXML);

        done(err);
      });
    });


    it('export BPMNShape', function(done) {

      // given
      var bounds = bpmnModel.create('dc:Bounds', { x: 100.0, y: 200.0, width: 50.0, height: 50.0 });
      var bpmnShape = bpmnModel.create('bpmndi:BPMNShape', { bounds: bounds });

      var expectedXML =
        '<bpmndi:BPMNShape xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
                          'xmlns:di="http://www.omg.org/spec/DD/20100524/DI" ' +
                          'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC">' +
          '<dc:Bounds x="100" y="200" width="50" height="50" />' +
        '</bpmndi:BPMNShape>';

      // when
      write(bpmnShape, function(err, result) {

        // then
        expect(result).toEqual(expectedXML);

        done(err);
      });
    });


    it('export extensionElements', function(done) {

      // given
      var extensionElements = bpmnModel.create('bpmn:ExtensionElements');

      var foo = bpmnModel.createAny('vendor:foo', 'http://vendor', {
        key: 'FOO',
        value: 'BAR'
      });

      extensionElements.get('values').push(foo);

      var definitions = bpmnModel.create('bpmn:Definitions', {
        extensionElements: extensionElements
      });

      var expectedXML =
        '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                          'xmlns:vendor="http://vendor">' +
          '<bpmn:extensionElements>' +
            '<vendor:foo key="FOO" value="BAR" />' +
          '</bpmn:extensionElements>' +
        '</bpmn:definitions>';


      // when
      write(definitions, function(err, result) {

        // then
        expect(result).toEqual(expectedXML);

        done(err);
      });
    });
  });
});