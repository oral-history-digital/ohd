import { buildTree } from './selectors';

describe('buildTree', () => {
    test('throws an error if it does not find the root element', () => {
        const data = [
            {
                value: 5,
                label: 'Orte',
                parent: 1,
                checked: false,
                disabled: false,
            },
        ];

        expect(() => {
            buildTree(data);
        }).toThrow(TypeError);
    });
});
