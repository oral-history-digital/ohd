import photoComparator from './photoComparator';

describe('if both photos do not have a public id', () => {
    it('compares internal ids correctly #1', () => {
        const photo1 = { id: 1 };
        const photo2 = { id: 2 };

        expect(photoComparator(photo1, photo2)).toBe(-1);
    });

    it('compares internal ids correctly #2', () => {
        const photo1 = { id: 2 };
        const photo2 = { id: 1 };

        expect(photoComparator(photo1, photo2)).toBe(1);
    });
});

test('if only the first photo does have a public id return -1', () => {
    const photo1 = { id: 1, public_id: 'aaa' };
    const photo2 = { id: 2 };

    expect(photoComparator(photo1, photo2)).toBe(-1);
});

test('if only the second photo does have a public id return 1', () => {
    const photo1 = { id: 1 };
    const photo2 = { id: 2, public_id: 'bbb' };

    expect(photoComparator(photo1, photo2)).toBe(1);
});

describe('if both photos have a public id', () => {
    it('compares public ids correctly #1', () => {
        const photo1 = { id: 1, public_id: 'id1' };
        const photo2 = { id: 2, public_id: 'id2' };

        expect(photoComparator(photo1, photo2)).toBe(-1);
    });

    it('compares public ids correctly #2', () => {
        const photo1 = { id: 1, public_id: 'zebra' };
        const photo2 = { id: 2, public_id: 'ghost' };

        expect(photoComparator(photo1, photo2)).toBe(1);
    });

    it('compares public ids correctly #3', () => {
        const photo1 = { id: 1, public_id: 'aaa' };
        const photo2 = { id: 2, public_id: 'aaa' };

        expect(photoComparator(photo1, photo2)).toBe(0);
    });
});
