/* eslint no-console:0, react/no-multi-comp:0 */

const expect = require('expect.js');
const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-addons-test-utils');
require('./index.spec.css');
const $ = require('jquery');

module.exports = function test(createClass, title) {
  function getOpacity(node) {
    return parseFloat($(node).css('opacity'));
  }

  describe(title, () => {
    describe('when remove is true', () => {
      let instance;
      let div;

      beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
        const Component = createClass({ transitionEnter: true, component: '', remove: true });

        instance = ReactDOM.render(<Component/>, div);
      });

      afterEach(() => {
        try {
          ReactDOM.unmountComponentAtNode(div);
          document.body.removeChild(div);
        } catch (e) {
          console.log(e);
        }
      });

      describe('when transitionAppear', () => {
        it('should render children', () => {
          expect(TestUtils.scryRenderedDOMComponentsWithTag(instance, 'span')[0]).not.to.be.ok();
          const child = TestUtils.findRenderedDOMComponentWithTag(instance, 'div');
          expect(getOpacity(ReactDOM.findDOMNode(child))).to.be(1);
        });

        it('should anim children', (done) => {
          const innerDiv = document.createElement('div');
          document.body.appendChild(innerDiv);
          const Component = createClass({
            transitionEnter: true,
            transitionAppear: true,
            component: '',
            remove: true,
          });

          const innerInstance = ReactDOM.render(<Component/>, innerDiv);
          expect(TestUtils.scryRenderedDOMComponentsWithTag(innerInstance,
            'span')[0]).not.to.be.ok();
          const child = TestUtils.findRenderedDOMComponentWithTag(innerInstance, 'div');
          expect(getOpacity(ReactDOM.findDOMNode(child))).not.to.be(1);
          setTimeout(() => {
            expect(getOpacity(ReactDOM.findDOMNode(child))).to.be(1);
            ReactDOM.unmountComponentAtNode(innerDiv);
            document.body.removeChild(innerDiv);
            done();
          }, 900);
        });
      });

      describe('when transitionEnter', () => {
        it('should render children', () => {
          expect(TestUtils.scryRenderedDOMComponentsWithTag(instance, 'span')[0]).not.to.be.ok();
          const child = TestUtils.findRenderedDOMComponentWithTag(instance, 'div');
          expect($(ReactDOM.findDOMNode(child)).text()).to.be('child element');
        });
      });

      describe('when toggle transitionEnter', () => {
        it('should remove children after transition', (done) => {
          if (window.callPhantom) {
            return done();
          }
          instance.setState({ transitionEnter: false });
          expect(TestUtils.scryRenderedDOMComponentsWithTag(instance, 'div')[0]).to.be.ok();
          setTimeout(() => {
            expect(TestUtils.scryRenderedDOMComponentsWithTag(instance, 'div')[0]).not.to.be.ok();
            done();
          }, 1000);
        });
      });

      describe('toggle transitionEnter after remove', () => {
        it('should render again', () => {
          instance.setState({ transitionEnter: true });
          const child = TestUtils.findRenderedDOMComponentWithTag(instance, 'div');
          expect($(ReactDOM.findDOMNode(child)).text()).to.be('child element');
        });
      });
    });

    describe('when remove is false', () => {
      let instance;

      before(() => {
        const Component = createClass({ transitionEnter: true, remove: false });
        instance = TestUtils.renderIntoDocument(<Component/>);
      });

      describe('when toggle transitionEnter', () => {
        it('child still exists after transition', () => {
          instance.setState({ transitionEnter: false });
          const child = TestUtils.findRenderedDOMComponentWithTag(instance, 'div');
          expect($(ReactDOM.findDOMNode(child)).text()).to.be('child element');
        });
      });
    });

    describe('when define container', () => {
      let instance;

      before(() => {
        const Component = createClass({
          transitionEnter: true,
          remove: false,
          component: 'ul',
        });

        instance = TestUtils.renderIntoDocument(<Component/>);
      });

      describe('when transitionEnter', () => {
        it('will render container', () => {
          const child = TestUtils.findRenderedDOMComponentWithTag(instance, 'ul');
          expect($(ReactDOM.findDOMNode(child)).text()).to.be('child element');
        });
      });
    });
  });
};
