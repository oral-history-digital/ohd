import buildFormData from "./buildFormData";

test('builds simple params correctly', () => {
    const formData = new FormData();
    const params = { id: 1 };
    buildFormData(formData, params);

    expect(formData.get("id")).toEqual("1");
});

test('builds more complex params correctly', () => {
    const formData = new FormData();
    const params = {
        pdf: {
            id: 1,
            public: false,
        },
    };
    buildFormData(formData, params);

    expect(formData.get("pdf[id]")).toEqual("1");
    expect(formData.get("pdf[public]")).toEqual("false");
});

test('copes with arrays', () => {
    const formData = new FormData();
    const params = {
        pdf: {
            data: {},
            interview_id: 8,
            translation_attributes: [
                {
                    locale: "de",
                    title: "dish washer",
                },
            ],
        },
    };
    buildFormData(formData, params);

    expect(formData.get("pdf[interview_id]")).toEqual("8");
    expect(formData.get("pdf[translation_attributes][0][locale]")).toEqual("de");
    expect(formData.get("pdf[translation_attributes][0][title]")).toEqual("dish washer");
});
