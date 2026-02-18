import { flattenNestedObject } from './flattenNestedObject';

describe('flattenNestedObject', () => {
    let mockReq;

    beforeEach(() => {
        mockReq = {
            field: jest.fn().mockReturnThis(),
        };
    });

    describe('2-level nesting', () => {
        it('should flatten simple nested object into bracket notation', () => {
            const value = {
                display: true,
                obligatory: false,
            };

            flattenNestedObject(
                mockReq,
                'access_config',
                'organization_setter',
                value
            );

            expect(mockReq.field).toHaveBeenCalledWith(
                'access_config[organization_setter][display]',
                true
            );
            expect(mockReq.field).toHaveBeenCalledWith(
                'access_config[organization_setter][obligatory]',
                false
            );
            expect(mockReq.field).toHaveBeenCalledTimes(2);
        });

        it('should handle string values', () => {
            const value = {
                name: 'John Doe',
                email: 'john@example.com',
            };

            flattenNestedObject(mockReq, 'user', 'contact_info', value);

            expect(mockReq.field).toHaveBeenCalledWith(
                'user[contact_info][name]',
                'John Doe'
            );
            expect(mockReq.field).toHaveBeenCalledWith(
                'user[contact_info][email]',
                'john@example.com'
            );
        });

        it('should handle numeric values', () => {
            const value = {
                age: 25,
                count: 0,
            };

            flattenNestedObject(mockReq, 'data', 'stats', value);

            expect(mockReq.field).toHaveBeenCalledWith('data[stats][age]', 25);
            expect(mockReq.field).toHaveBeenCalledWith('data[stats][count]', 0);
        });

        it('should skip null values', () => {
            const value = {
                display: true,
                description: null,
                obligatory: false,
            };

            flattenNestedObject(
                mockReq,
                'access_config',
                'organization_setter',
                value
            );

            expect(mockReq.field).toHaveBeenCalledTimes(2);
            expect(mockReq.field).toHaveBeenCalledWith(
                'access_config[organization_setter][display]',
                true
            );
            expect(mockReq.field).toHaveBeenCalledWith(
                'access_config[organization_setter][obligatory]',
                false
            );
        });

        it('should skip undefined values', () => {
            const value = {
                display: true,
                description: undefined,
                obligatory: false,
            };

            flattenNestedObject(
                mockReq,
                'access_config',
                'organization_setter',
                value
            );

            expect(mockReq.field).toHaveBeenCalledTimes(2);
            expect(mockReq.field).not.toHaveBeenCalledWith(
                expect.stringContaining('[description]'),
                expect.anything()
            );
        });
    });

    describe('3-level nesting', () => {
        it('should flatten deeply nested objects', () => {
            const value = {
                values: {
                    researcher: true,
                    interviewee: false,
                    interviewer: true,
                },
            };

            flattenNestedObject(
                mockReq,
                'access_config',
                'job_description_setter',
                value
            );

            expect(mockReq.field).toHaveBeenCalledWith(
                'access_config[job_description_setter][values][researcher]',
                true
            );
            expect(mockReq.field).toHaveBeenCalledWith(
                'access_config[job_description_setter][values][interviewee]',
                false
            );
            expect(mockReq.field).toHaveBeenCalledWith(
                'access_config[job_description_setter][values][interviewer]',
                true
            );
            expect(mockReq.field).toHaveBeenCalledTimes(3);
        });

        it('should handle mixed string and numeric values at 3rd level', () => {
            const value = {
                settings: {
                    timeout: 3000,
                    retry: 'true',
                    maxAttempts: 5,
                },
            };

            flattenNestedObject(mockReq, 'config', 'api', value);

            expect(mockReq.field).toHaveBeenCalledWith(
                'config[api][settings][timeout]',
                3000
            );
            expect(mockReq.field).toHaveBeenCalledWith(
                'config[api][settings][retry]',
                'true'
            );
            expect(mockReq.field).toHaveBeenCalledWith(
                'config[api][settings][maxAttempts]',
                5
            );
        });

        it('should skip null values in deep nested objects', () => {
            const value = {
                values: {
                    researcher: true,
                    interviewee: null,
                    interviewer: false,
                },
            };

            flattenNestedObject(
                mockReq,
                'access_config',
                'job_description_setter',
                value
            );

            expect(mockReq.field).toHaveBeenCalledTimes(2);
            expect(mockReq.field).not.toHaveBeenCalledWith(
                expect.stringContaining('[interviewee]'),
                expect.anything()
            );
        });

        it('should skip undefined values in deep nested objects', () => {
            const value = {
                values: {
                    researcher: true,
                    interviewee: undefined,
                    interviewer: false,
                },
            };

            flattenNestedObject(
                mockReq,
                'access_config',
                'job_description_setter',
                value
            );

            expect(mockReq.field).toHaveBeenCalledTimes(2);
            expect(mockReq.field).not.toHaveBeenCalledWith(
                expect.stringContaining('[interviewee]'),
                expect.anything()
            );
        });
    });

    describe('mixed nesting levels', () => {
        it('should handle both 2-level and 3-level nesting in same object', () => {
            const value = {
                display: true,
                obligatory: false,
                values: {
                    researcher: true,
                    interviewer: false,
                },
            };

            flattenNestedObject(
                mockReq,
                'access_config',
                'job_description_setter',
                value
            );

            expect(mockReq.field).toHaveBeenCalledWith(
                'access_config[job_description_setter][display]',
                true
            );
            expect(mockReq.field).toHaveBeenCalledWith(
                'access_config[job_description_setter][obligatory]',
                false
            );
            expect(mockReq.field).toHaveBeenCalledWith(
                'access_config[job_description_setter][values][researcher]',
                true
            );
            expect(mockReq.field).toHaveBeenCalledWith(
                'access_config[job_description_setter][values][interviewer]',
                false
            );
            expect(mockReq.field).toHaveBeenCalledTimes(4);
        });

        it('should handle multiple deep nested objects', () => {
            const value = {
                settings: {
                    option1: true,
                    option2: false,
                },
                preferences: {
                    theme: 'dark',
                    language: 'en',
                },
            };

            flattenNestedObject(mockReq, 'user', 'config', value);

            expect(mockReq.field).toHaveBeenCalledWith(
                'user[config][settings][option1]',
                true
            );
            expect(mockReq.field).toHaveBeenCalledWith(
                'user[config][settings][option2]',
                false
            );
            expect(mockReq.field).toHaveBeenCalledWith(
                'user[config][preferences][theme]',
                'dark'
            );
            expect(mockReq.field).toHaveBeenCalledWith(
                'user[config][preferences][language]',
                'en'
            );
            expect(mockReq.field).toHaveBeenCalledTimes(4);
        });
    });

    describe('edge cases', () => {
        it('should handle empty object', () => {
            const value = {};

            flattenNestedObject(mockReq, 'data', 'empty', value);

            expect(mockReq.field).not.toHaveBeenCalled();
        });

        it('should handle empty nested object at 3rd level', () => {
            const value = {
                display: true,
                values: {},
            };

            flattenNestedObject(mockReq, 'access_config', 'setter', value);

            expect(mockReq.field).toHaveBeenCalledTimes(1);
            expect(mockReq.field).toHaveBeenCalledWith(
                'access_config[setter][display]',
                true
            );
        });

        it('should handle zero as a valid value', () => {
            const value = {
                count: 0,
                index: 0,
            };

            flattenNestedObject(mockReq, 'data', 'numbers', value);

            expect(mockReq.field).toHaveBeenCalledWith(
                'data[numbers][count]',
                0
            );
            expect(mockReq.field).toHaveBeenCalledWith(
                'data[numbers][index]',
                0
            );
            expect(mockReq.field).toHaveBeenCalledTimes(2);
        });

        it('should handle empty string as a valid value', () => {
            const value = {
                name: '',
                description: 'test',
            };

            flattenNestedObject(mockReq, 'data', 'text', value);

            expect(mockReq.field).toHaveBeenCalledWith('data[text][name]', '');
            expect(mockReq.field).toHaveBeenCalledWith(
                'data[text][description]',
                'test'
            );
            expect(mockReq.field).toHaveBeenCalledTimes(2);
        });

        it('should handle false as a valid value', () => {
            const value = {
                enabled: false,
                active: false,
            };

            flattenNestedObject(mockReq, 'settings', 'flags', value);

            expect(mockReq.field).toHaveBeenCalledWith(
                'settings[flags][enabled]',
                false
            );
            expect(mockReq.field).toHaveBeenCalledWith(
                'settings[flags][active]',
                false
            );
            expect(mockReq.field).toHaveBeenCalledTimes(2);
        });

        it('should not flatten arrays (arrays are handled separately in submit)', () => {
            const value = {
                items: ['a', 'b', 'c'],
            };

            flattenNestedObject(mockReq, 'data', 'list', value);

            // Arrays should not be flattened by this function
            // They should be passed through or handled separately
            expect(mockReq.field).toHaveBeenCalledWith('data[list][items]', [
                'a',
                'b',
                'c',
            ]);
            expect(mockReq.field).toHaveBeenCalledTimes(1);
        });

        it('should handle special characters in keys', () => {
            const value = {
                'key-with-dash': 'value1',
                key_with_underscore: 'value2',
            };

            flattenNestedObject(mockReq, 'data', 'special', value);

            expect(mockReq.field).toHaveBeenCalledWith(
                'data[special][key-with-dash]',
                'value1'
            );
            expect(mockReq.field).toHaveBeenCalledWith(
                'data[special][key_with_underscore]',
                'value2'
            );
        });
    });

    describe('real-world scenarios', () => {
        it('should correctly flatten access_config organization_setter', () => {
            const value = {
                display: true,
                obligatory: false,
            };

            flattenNestedObject(
                mockReq,
                'access_config',
                'organization_setter',
                value
            );

            expect(mockReq.field).toHaveBeenCalledWith(
                'access_config[organization_setter][display]',
                true
            );
            expect(mockReq.field).toHaveBeenCalledWith(
                'access_config[organization_setter][obligatory]',
                false
            );
        });

        it('should correctly flatten access_config job_description_setter with values', () => {
            const value = {
                display: true,
                obligatory: true,
                values: {
                    researcher: true,
                    interviewee: false,
                    interviewer: true,
                    translator: false,
                },
            };

            flattenNestedObject(
                mockReq,
                'access_config',
                'job_description_setter',
                value
            );

            expect(mockReq.field).toHaveBeenCalledWith(
                'access_config[job_description_setter][display]',
                true
            );
            expect(mockReq.field).toHaveBeenCalledWith(
                'access_config[job_description_setter][obligatory]',
                true
            );
            expect(mockReq.field).toHaveBeenCalledWith(
                'access_config[job_description_setter][values][researcher]',
                true
            );
            expect(mockReq.field).toHaveBeenCalledWith(
                'access_config[job_description_setter][values][interviewee]',
                false
            );
            expect(mockReq.field).toHaveBeenCalledWith(
                'access_config[job_description_setter][values][interviewer]',
                true
            );
            expect(mockReq.field).toHaveBeenCalledWith(
                'access_config[job_description_setter][values][translator]',
                false
            );
            expect(mockReq.field).toHaveBeenCalledTimes(6);
        });
    });
});
