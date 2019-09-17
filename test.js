const acorn = require('acorn');
const jsx = require('acorn-jsx');
const astring = require('./');
const tape = require('tape');

process.stdout.write('\x1Bc');

tape.test('no children', t => {
  const input = `const someVar = 2;\nconst instance = <SpacedLine someProp='hello' anotherProp={someVar} />;`;
  const expected = `const someVar = 2;\nconst instance = c(new SpacedLine(), { someProp: 'hello', anotherProp: someVar });\n`;
  const ast = acorn.Parser.extend(jsx()).parse(input);
  const actual = astring(ast, {indent: '  '});
  t.equals(actual, expected);
  t.end();
});

tape.test('one child', t => {
  const input = `const someVar = 2;\nconst instance = <SpacedLine someProp={'hello'} anotherProp={someVar}><Label text={'this is a label'} /></SpacedLine>;`;
  const expected = `const someVar = 2;\nconst instance = c(new SpacedLine(), { someProp: 'hello', anotherProp: someVar },c(new Label(), { text: 'this is a label' }));\n`;
  const ast = acorn.Parser.extend(jsx()).parse(input);
  const actual = astring(ast, {indent: '  '});
  t.equals(actual, expected);
  t.end();
});

tape.test('no children, inside ES6 class', t => {
  const input = `const someVar = 2;\nclass Test {
  render() {
    return <SpacedLine someProp='hello' anotherProp={someVar} />
  }
}`;
  const expected = `const someVar = 2;\nclass Test {
  render() {
    return c(new SpacedLine(), { someProp: 'hello', anotherProp: someVar });
  }
}\n`;

  const ast = acorn.Parser.extend(jsx()).parse(input);
  const actual = astring(ast, {indent: '  '});
  t.equals(actual, expected);
  t.end();
});
