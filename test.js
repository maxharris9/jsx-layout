const acorn = require('acorn');
const jsx = require('acorn-jsx');
const astring = require('./');
const tape = require('tape');

process.stdout.write('\x1Bc');

tape.test('two children', t => {
  const input = `const someVar = 2;
const instance = <SpacedLine someProp={'hello'} anotherProp={someVar}>
  <Label text={'this is a label'} />
  <Label text={'this is a label'} />
</SpacedLine>;`;
  const expected = `const someVar = 2;
const instance = c(SpacedLine, { someProp: 'hello', anotherProp: someVar },
  c(Label, { text: 'this is a label' }),
  c(Label, { text: 'this is a label' })
);`;
  const ast = acorn.Parser.extend(jsx()).parse(input);
  const actual = astring(ast, {indent: '  '});
  t.equals(actual, expected);
  t.end();
});

tape.test('triple nesting children', t => {
  const input = `const someVar = 2;
const instance = <SpacedLine someProp={'hello'} anotherProp={someVar}>
  <SpacedLine someProp={'hello'} anotherProp={someVar}>
    <Label text={'this is a label'} />
    <Label text={'this is a label'} />
    <Label text={'this is a label'} />
  </SpacedLine>
  <SpacedLine someProp={'hello'} anotherProp={someVar}>
    <Label text={'this is a label'} />
    <Label text={'this is a label'} />
    <Label text={'this is a label'} />
  </SpacedLine>
</SpacedLine>;`;

  const expected = `const someVar = 2;
const instance = c(SpacedLine, { someProp: 'hello', anotherProp: someVar },
  c(SpacedLine, { someProp: 'hello', anotherProp: someVar },
    c(Label, { text: 'this is a label' }),
    c(Label, { text: 'this is a label' }),
    c(Label, { text: 'this is a label' })
  ),
  c(SpacedLine, { someProp: 'hello', anotherProp: someVar },
    c(Label, { text: 'this is a label' }),
    c(Label, { text: 'this is a label' }),
    c(Label, { text: 'this is a label' })
  )
);
`;
  const ast = acorn.Parser.extend(jsx()).parse(input);
  const actual = astring(ast, {indent: '  '});
  // console.log('actual', actual);
  t.equals(actual, expected);
  t.end();
});

tape.test('no children', t => {
  const input = `const someVar = 2;
const instance = <SpacedLine someProp='hello' anotherProp={someVar} />;`;
  const expected = `const someVar = 2;
const instance = c(SpacedLine, { someProp: 'hello', anotherProp: someVar });`;
  const ast = acorn.Parser.extend(jsx()).parse(input);
  const actual = astring(ast, {indent: '  '});
  t.equals(actual, expected);
  t.end();
});

tape.test('one child', t => {
  const input = `const someVar = 2;
const instance = <SpacedLine someProp={'hello'} anotherProp={someVar}>
  <Label text={'this is a label'} />
</SpacedLine>;`;
  const expected = `const someVar = 2;
const instance = c(SpacedLine, { someProp: 'hello', anotherProp: someVar },
  c(Label, { text: 'this is a label' })
);
`;
  const ast = acorn.Parser.extend(jsx()).parse(input);
  const actual = astring(ast, {indent: '  '});
  t.equals(actual, expected);
  t.end();
});

tape.test('no children, inside ES6 class', t => {
  const input = `const someVar = 2;
class Test {
  render() {
    return <SpacedLine someProp='hello' anotherProp={someVar} />
  }
}`;
  const expected = `const someVar = 2;
class Test {
  render() {
    return c(SpacedLine, { someProp: 'hello', anotherProp: someVar });
  }
}\n`;

  const ast = acorn.Parser.extend(jsx()).parse(input);
  const actual = astring(ast, {indent: '  '});
  t.equals(actual, expected);
  t.end();
});

tape.skip('complex tree', t => {
  const input = `const demoNode = ({x, y, width, height, text}) => (
  <Root x={x} y={y} width={width} height={height} color={'white'}>
    <SpacedLine mode={'vertical'} align={'center'}>
      <Label
        font={'sans'}
        color={'red'}
        size={100}
        text={'Push Me'}
        done={() => {}}
      />
      <Viewport width={500} height={284} offsetX={0.5} offsetY={1.0}>
        <SpacedLine mode={'vertical'} align={'center'}>
          <Margin top={marginA} bottom={marginA} left={marginA} right={marginA}>
            <Text
              width={textWidth}
              lineHeight={20}
              font={'sans'}
              size={100}
              // text={wordsToLiveBy}
              text={text2}
              style={{font: \`${20}px serif\`, fillStyle: 'black'}}
              polygons={polygons}
              // showBoxes={true}
              done={() => {}}
            />
          </Margin>
          <Margin top={marginA} bottom={marginA} left={marginA} right={marginA}>
            <Text
              width={textWidth}
              lineHeight={20}
              font={'sans'}
              size={100}
              text={wordsToLiveBy}
              // text={text}
              style={{font: \`${20}px serif\`, fillStyle: 'black'}}
              polygons={subjectPolygon}
              // showBoxes={true}
              done={() => {}}
            />
          </Margin>
        </SpacedLine>
      </Viewport>
    </SpacedLine>
  </Root>
);`;

  const ast = acorn.Parser.extend(jsx()).parse(input);
  const actual = astring(ast, {indent: '  '});
  console.log('actual:', actual);
  // t.equals(actual, expected);
  t.end();
});
