'use strict';

const astring = require('astring');

const generator = Object.assign({}, astring.baseGenerator, {
  JSXText: function(node, state) {
    state.write(node.value);
  },
  JSXElement: function(node, state) {
    // <div></div>
    state.write('c(');
    this[node.openingElement.type](node.openingElement, state);
    state.write(' }');
    if (node.children.length > 0) {
      state.write(',');
    }
    if (node.closingElement) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        this[child.type](child, state);
      }
      this[node.closingElement.type](node.closingElement, state);
    }
    state.write(')');
  },
  JSXOpeningElement: function(node, state) {
    // <div>
    this[node.name.type](node.name, state);
    state.write(', {');
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i];

      this[attr.type](attr, state);
      if (i < node.attributes.length - 1) {
        state.write(',');
      }
    }
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
    state.write(' ');
    this[node.name.type](node.name, state);
    state.write(': ');
    this[node.value.type](node.value, state);
  },
  JSXExpressionContainer: function(node, state) {
    this[node.expression.type](node.expression, state);
  }
});

module.exports = ast => astring.generate(ast, {generator});
