import buildFormData from './buildFormData';

test('builds simple params correctly', () => {
    const formData = new FormData();
    const params = { id: 1 };
    buildFormData(formData, params);

    expect(formData.get('id')).toEqual('1');
});

test('builds more complex params correctly', () => {
    const formData = new FormData();
    const params = {
        material: {
            id: 1,
            public: false,
        },
    };
    buildFormData(formData, params);

    expect(formData.get('material[id]')).toEqual('1');
    expect(formData.get('material[public]')).toEqual('false');
});

test('copes with arrays', () => {
    const formData = new FormData();
    const params = {
        material: {
            data: {},
            interview_id: 8,
            translation_attributes: [
                {
                    locale: 'de',
                    title: 'dish washer',
                },
            ],
        },
    };
    buildFormData(formData, params);

    expect(formData.get('material[interview_id]')).toEqual('8');
    expect(formData.get('material[translation_attributes][0][locale]')).toEqual(
        'de'
    );
    expect(formData.get('material[translation_attributes][0][title]')).toEqual(
        'dish washer'
    );
});
