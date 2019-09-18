'use strict';

const astring = require('astring');

const generator = Object.assign({}, astring.baseGenerator, {
  JSXText: function(node, state) {
    state.write(node.value);
  },
  // JSXFragment: function(node, state) {
  //   console.log('in here');
  //   state.write('x');
  // },
  JSXElement: function(node, state) {
    // <div></div>
    state.write('c(');
    this[node.openingElement.type](node.openingElement, state);
    if (node.children.length > 0) {
      // state.write(',');
    }
    const length = node.children.length;
    //   if (length === 1) {
    //     const child = node.children[0];
    //     this[child.type](child, state);
    //   } else if (length > 1) {
    for (let i = 0; i < length; i++) {
      const child = node.children[i];
      // state.write(',');
      this[child.type](child, state);
      // if (i > 0) {
      // && i < length - 2) {
      // state.write(',');
      // } else {
      // }
    }
    // }
    if (node.closingElement) {
      this[node.closingElement.type](node.closingElement, state);
    }
    // console.log(this);
    state.write(')');
    if (length > 0) {
      // state.write(',');
    }
  },
  JSXOpeningElement: function(node, state) {
    // <div>
    this[node.name.type](node.name, state);
    state.write(', { ');
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i];

      this[attr.type](attr, state);
      if (i < node.attributes.length - 1) {
        state.write(', ');
      }
    }
    // console.log('node:', node);
    state.write(' }');
  },
  JSXClosingElement: function() {
    // </div>
  },
  JSXIdentifier: function(node, state) {
    // div
    state.write(node.name);
  },
  JSXMemberExpression: function(node, state) {
    // Member.Expression
    this[node.object.type](node.object, state);
    state.write('.');
    this[node.property.type](node.property, state);
  },
  JSXAttribute: function(node, state) {
    // console.log('node:', node);
    this[node.name.type](node.name, state);
    state.write(': ');
    this[node.value.type](node.value, state);
  },
  JSXExpressionContainer: function(node, state) {
    // state.write('');
    this[node.expression.type](node.expression, state);
  }
});

module.exports = ast => astring.generate(ast, {generator});
