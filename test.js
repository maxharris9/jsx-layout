const acorn = require('acorn');
const jsx = require('acorn-jsx');
const astring = require('./');
const tape = require('tape');

process.stdout.write('\x1Bc');

tape.test('no children', t => {
  const input = `const someVar = 2;\nconst instance = <SpacedLine someProp='hello' anotherProp={someVar} />;`;
  const expected = `const someVar = 2;\nconst instance = c(SpacedLine, { someProp: 'hello', anotherProp: someVar });\n`;
  const ast = acorn.Parser.extend(jsx()).parse(input);
  const actual = astring(ast, {indent: '  '});
  t.equals(actual, expected);
  t.end();
});

tape.test('one child', t => {
  const input = `const someVar = 2;\nconst instance = <SpacedLine someProp={'hello'} anotherProp={someVar}><Label text={'this is a label'} /></SpacedLine>;`;
  const expected = `const someVar = 2;\nconst instance = c(SpacedLine, { someProp: 'hello', anotherProp: someVar },c(Label, { text: 'this is a label' }));\n`;
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
    return c(SpacedLine, { someProp: 'hello', anotherProp: someVar });
  }
}\n`;

  const ast = acorn.Parser.extend(jsx()).parse(input);
  const actual = astring(ast, {indent: '  '});
  t.equals(actual, expected);
  t.end();
});

tape.test('two children', t => {
  const input = `const someVar = 2;\nconst instance = <SpacedLine someProp={'hello'} anotherProp={someVar}><Label text={'this is a label'} />\n<Label text={'this is another label'} /></SpacedLine>;`;
  const expected = `const someVar = 2;\nconst instance = c(SpacedLine, { someProp: 'hello', anotherProp: someVar },c(Label, { text: 'this is a label' })\n,c(Label, { text: 'this is another label' }));\n`;
  const ast = acorn.Parser.extend(jsx()).parse(input);
  const actual = astring(ast, {indent: '  '});
  t.equals(actual, expected);
  t.end();
});

tape.test('map', t => {
  const input = `const instance = <FlowBox
              sizingHorizontal={'shrink'}
              sizingVertical={'shrink'}
              alignHorizontal={'left'}
              alignVertical={'center'}
              stackChildren={'vertical'}
            >
            {
              options.map(option => (
                <Label
                  font={'SourceSansPro-Regular'}
                  color={'black'}
                  size={15}
                  text={option}
                  sizeMode={'capHeight'}
                  showBoxes={false}
                  onClick={() => selectPropOption(key, option)}
                />)
              )
            }
            </FlowBox>`;
  const expected = `const instance = c(FlowBox, { sizingHorizontal: 'shrink', sizingVertical: 'shrink', alignHorizontal: 'left', alignVertical: 'center', stackChildren: 'vertical' }
            ,options.map(option => c(Label, { font: 'SourceSansPro-Regular', color: 'black', size: 15, text: option, sizeMode: 'capHeight', showBoxes: false, onClick: () => selectPropOption(key, option) }))
            );
`;
  const ast = acorn.Parser.extend(jsx()).parse(input);
  const actual = astring(ast, {indent: '  '});
  t.equals(actual, expected);
  t.end();
});
