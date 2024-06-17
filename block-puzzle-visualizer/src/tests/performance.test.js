import { performance } from 'perf_hooks';
import { renderSolution } from '../App';

const blockDataSmall = `1 0 0   1 1 0   1 2 0   0 0 0   0 1 0`;
const blockDataSinglePiece = `1 0 0   1 1 0   1 2 0   0 0 0   0 1 0`;
const blockDataTwoPieces = `
1 1 1   1 1 2   1 2 1   1 2 2 
 0 0 0   0 0 1   0 0 2   0 1 0
 `;

const blockDataSevenPieces = `
2 0 1   2 0 2   2 1 2   2 2 2
0 1 1   0 2 0   0 2 1   0 2 2
0 0 0   0 1 0   1 1 0   1 2 0
2 1 0   2 1 1   2 2 0
0 0 1   0 0 2   0 1 2   1 0 2
1 1 2   1 2 1   1 2 2   2 2 1
1 0 0   1 0 1   1 1 1   2 0 0

`;

const blockDataEightPieces = `
0 3 2   0 3 3   1 3 2   1 3 3   2 3 1   2 3 2   3 3 1   3 3 2
0 1 3   0 2 3   1 1 3   1 2 3   2 2 3   2 3 3   3 2 3   3 3 3
2 0 1   2 0 2   3 0 1   3 0 2   3 1 1   3 1 2   3 2 1   3 2 2
1 1 2   1 2 2   2 0 3   2 1 2   2 1 3   2 2 2   3 0 3   3 1 3
0 3 0   0 3 1   1 3 0   1 3 1   2 2 0   2 3 0   3 2 0   3 3 0
0 0 0   0 0 1   1 0 0   1 0 1   2 0 0   2 1 0   3 0 0   3 1 0
0 1 0   0 2 0   1 1 0   1 1 1   1 2 0   1 2 1   2 1 1   2 2 1
0 0 2   0 0 3   0 1 1   0 1 2   0 2 1   0 2 2   1 0 2   1 0 3

`;

const blockDataNinePieces = `
1 2 0   1 3 0   2 2 0   2 2 1   2 3 0   2 3 1   3 2 0   3 3 0
0 1 2   0 1 3   0 2 3   0 3 3   1 1 2   1 1 3   1 2 3   1 3 3
2 3 2   2 3 3   3 1 3   3 2 1   3 2 2   3 2 3   3 3 1   3 3 2   3 3 3
1 1 0   1 1 1   2 0 0   2 1 0   2 1 1   3 0 0   3 1 0   3 1 1
0 0 1   0 0 2   0 0 3   0 1 1   1 0 1   1 0 2   1 0 3
0 2 2   0 3 0   0 3 1   0 3 2   1 3 1   1 3 2
1 2 2   2 0 2   2 1 2   2 2 2   2 2 3   3 1 2
0 0 0   0 1 0   0 2 0   0 2 1   1 0 0   1 2 1
2 0 1   2 0 3   2 1 3   3 0 1   3 0 2   3 0 3
`;

const blockDataTenPieces = `
2 1 0   2 2 0   2 3 0   2 4 0
0 1 0   0 2 0   1 1 0   1 2 0
0 3 0   0 4 0   0 5 0   1 3 0
3 1 0   3 2 0   4 0 0   4 1 0
3 4 0   3 5 0   3 6 0   4 5 0
0 0 0   1 0 0   2 0 0   3 0 0
0 6 0   0 7 0   1 6 0   1 7 0
2 7 0   3 7 0   4 6 0   4 7 0
1 4 0   1 5 0   2 5 0   2 6 0
3 3 0   4 2 0   4 3 0   4 4 0
`;

const blockDataTwelvePieces = `
0 1 3   0 2 3   0 2 4   0 3 2   0 3 3
0 0 1   0 0 2   0 0 3   0 0 4   0 0 5
2 0 3   3 0 0   3 0 1   3 0 2   3 0 3
1 0 2   1 0 3   2 0 0   2 0 1   2 0 2
0 0 0   0 1 0   1 0 0   1 1 0   2 1 0
1 3 0   2 3 0   2 3 1   2 3 2   3 3 0
0 1 4   0 1 5   0 2 5   0 3 4   0 3 5
1 3 1   1 3 2   1 3 3   2 3 3   3 3 3
0 1 2   0 2 1   0 2 2   0 3 0   0 3 1
0 1 1   1 0 1   1 1 1   1 2 1   2 1 1
0 2 0   1 2 0   2 2 0   2 2 1   3 2 0
3 1 0   3 1 1   3 2 1   3 3 1   3 3 2
`;

const blockDataFifteenPieces = `
0 0 0   0 0 1
0 0 2   0 1 2
0 2 2   1 2 2
2 2 2   2 1 2
2 0 2   2 0 1
2 0 0   1 0 0
0 1 0   0 2 0
1 2 0   2 2 0
2 2 1   2 1 1
1 1 2   1 1 1
0 1 1   1 1 0
1 0 1   1 0 2
1 2 1   1 1 0
0 0 1   0 1 1
1 2 1   2 1 1
`;

const blockDataThirtyPieces = `
0 0 0   0 0 1
0 0 2   0 0 3
0 1 0   0 1 1
0 1 2   0 1 3
0 2 0   0 2 1
0 2 2   0 2 3
0 3 0   0 3 1
0 3 2   0 3 3
1 0 0   1 0 1
1 0 2   1 0 3
1 1 0   1 1 1
1 1 2   1 1 3
1 2 0   1 2 1
1 2 2   1 2 3
1 3 0   1 3 1
1 3 2   1 3 3
2 0 0   2 0 1
2 0 2   2 0 3
2 1 0   2 1 1
2 1 2   2 1 3
2 2 0   2 2 1
2 2 2   2 2 3
2 3 0   2 3 1
2 3 2   2 3 3
3 0 0   3 0 1
3 0 2   3 0 3
3 1 0   3 1 1
3 1 2   3 1 3
3 2 0   3 2 1
3 2 2   3 2 3
`;

const blockDataFiftyPieces = `
0 0 0   0 0 1   0 1 0
0 0 2   0 1 2   0 1 3
0 2 0   0 2 1   0 3 0
0 2 2   0 2 3   0 3 3
0 4 0   0 4 1   0 5 1
0 4 2   0 4 3   0 5 2
0 0 3   1 0 3   2 0 3
1 0 0   2 0 0   3 0 0
1 1 0   1 1 1   2 1 0
1 1 2   2 1 2   3 1 2
1 2 1   2 2 1   3 2 1
1 2 3   1 3 3   2 3 3
1 4 0   2 4 0   2 4 1
1 4 2   2 4 2   2 4 3
1 5 1   2 5 1   3 5 1
1 5 3   2 5 3   3 5 3
2 0 1   3 0 1   4 0 1
2 0 2   3 0 2   4 0 2
2 1 1   3 1 1   4 1 1
2 1 3   3 1 3   4 1 3
2 2 0   3 2 0   4 2 0
2 2 2   3 2 2   4 2 2
2 3 0   3 3 0   4 3 0
2 3 1   3 3 1   4 3 1
2 3 2   3 3 2   4 3 2
2 4 3   3 4 3   4 4 3
3 0 0   4 0 0   5 0 0
3 0 3   4 0 3   5 0 3
3 1 0   4 1 0   5 1 0
3 1 2   4 1 2   5 1 2
3 2 3   4 2 3   5 2 3
3 4 0   4 4 0   5 4 0
3 4 1   4 4 1   5 4 1
3 4 2   4 4 2   5 4 2
3 5 0   4 5 0   5 5 0
3 5 2   4 5 2   5 5 2
4 0 1   5 0 1   5 1 1
4 0 2   5 0 2   5 1 2
4 1 3   5 1 3   5 2 3
4 2 1   5 2 1   5 3 1
4 2 2   5 2 2   5 3 2
4 3 3   5 3 3   5 4 3
4 5 1   5 5 1   5 5 3
5 0 0   5 1 0   5 2 0
5 3 0   5 4 0   5 5 0
5 0 3   5 1 3   5 2 3
5 3 3   5 4 3   5 5 3
5 3 1   5 4 1   5 5 1
5 3 2   5 4 2   5 5 2
5 1 1   5 2 1   5 3 1

`;


describe('Performance tests', () => {
  test('Render small block data', () => {
    const start = performance.now();
    renderSolution(blockDataSmall);
    const end = performance.now();
    const duration = end - start;
    console.log(`Small block data rendered in ${duration}ms`);
    expect(duration).toBeLessThan(500);
  });

  test('Render a single piece', () => {
    const start = performance.now();
    renderSolution(blockDataSinglePiece);
    const end = performance.now();
    const duration = end - start;
    console.log(`Single piece rendered in ${duration}ms`);
    expect(duration).toBeLessThan(500);
  });

  test('Render two pieces', () => {
    const start = performance.now();
    renderSolution(blockDataTwoPieces);
    const end = performance.now();
    const duration = end - start;
    console.log(`Two pieces rendered in ${duration}ms`);
    expect(duration).toBeLessThan(500);
  });

  test('Render seven pieces', () => {
    const start = performance.now();
    renderSolution(blockDataSevenPieces);
    const end = performance.now();
    const duration = end - start;
    console.log(`Seven pieces rendered in ${duration}ms`);
    expect(duration).toBeLessThan(500);
  });

  test('Render eight pieces', () => {
    const start = performance.now();
    renderSolution(blockDataEightPieces);
    const end = performance.now();
    const duration = end - start;
    console.log(`Eight pieces rendered in ${duration}ms`);
    expect(duration).toBeLessThan(1500);
  });

  test('Render nine pieces', () => {
    const start = performance.now();
    renderSolution(blockDataNinePieces);
    const end = performance.now();
    const duration = end - start;
    console.log(`Nine pieces rendered in ${duration}ms`);
    expect(duration).toBeLessThan(1500);
  });

  test('Render ten pieces', () => {
    const start = performance.now();
    renderSolution(blockDataTenPieces);
    const end = performance.now();
    const duration = end - start;
    console.log(`Ten pieces rendered in ${duration}ms`);
    expect(duration).toBeLessThan(500);
  });

  test('Render twelve pieces', () => {
    const start = performance.now();
    renderSolution(blockDataTwelvePieces);
    const end = performance.now();
    const duration = end - start;
    console.log(`Twelve pieces rendered in ${duration}ms`);
    expect(duration).toBeLessThan(500);
  });

  test('Render fifteen pieces', () => {
    const start = performance.now();
    renderSolution(blockDataFifteenPieces);
    const end = performance.now();
    const duration = end - start;
    console.log(`Fifteen pieces rendered in ${duration}ms`);
    expect(duration).toBeLessThan(5000);
  });

  test('Render thirty pieces', () => {
    const start = performance.now();
    renderSolution(blockDataThirtyPieces);
    const end = performance.now();
    const duration = end - start;
    console.log(`Thirty pieces rendered in ${duration}ms`);
    expect(duration).toBeLessThan(5000);
  });

  test('Render fifty pieces', () => {
    const start = performance.now();
    renderSolution(blockDataFiftyPieces);
    const end = performance.now();
    const duration = end - start;
    console.log(`Fifty pieces rendered in ${duration}ms`);
    expect(duration).toBeLessThan(5000);
  });



});
