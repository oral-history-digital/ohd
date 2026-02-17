/**
 * Comprehensive test suite for Loader
 * Tests all methods and parameter types for API interactions
 */
import request from 'superagent';
import noCache from 'superagent-no-cache';

import Loader from './Loader';

// Mock superagent - needs to be defined before usage
const mockRequestInstance = {
    get: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    put: jest.fn().mockReturnThis(),
    post: jest.fn().mockReturnThis(),
    use: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    query: jest.fn().mockReturnThis(),
    field: jest.fn().mockReturnThis(),
    attach: jest.fn().mockReturnThis(),
    end: jest.fn((callback) => {
        callback(null, {
            text: '{"data": "test"}',
            error: null,
        });
        return mockRequestInstance;
    }),
};

jest.mock('superagent', () => ({
    __esModule: true,
    default: {
        get: jest.fn(() => mockRequestInstance),
        delete: jest.fn(() => mockRequestInstance),
        put: jest.fn(() => mockRequestInstance),
        post: jest.fn(() => mockRequestInstance),
    },
}));

jest.mock('superagent-no-cache', () => jest.fn());

describe('Loader', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Reset the end handler to default success response
        mockRequestInstance.end = jest.fn((callback) => {
            callback(null, {
                text: '{"success": true, "data": {"id": 1}}',
                error: null,
            });
            return mockRequestInstance;
        });
    });

    describe('getJson', () => {
        let mockDispatch;
        let mockCallback;

        beforeEach(() => {
            mockDispatch = jest.fn();
            mockCallback = jest.fn();
        });

        test('makes GET request with correct configuration', () => {
            Loader.getJson(
                '/api/projects',
                { locale: 'de', page: 1 },
                mockDispatch,
                mockCallback
            );

            expect(request.get).toHaveBeenCalledWith('/api/projects');
            expect(mockRequestInstance.set).toHaveBeenCalledWith(
                'Accept',
                'application/json'
            );
            expect(mockRequestInstance.query).toHaveBeenCalledWith({
                locale: 'de',
                page: 1,
            });
        });

        test('uses noCache middleware', () => {
            Loader.getJson('/api/projects', {}, mockDispatch, mockCallback);

            expect(mockRequestInstance.use).toHaveBeenCalledWith(noCache);
        });

        test('calls callback with parsed JSON on success', () => {
            mockRequestInstance.end = jest.fn((callback) => {
                callback(null, {
                    text: '{"data": "test"}',
                    error: null,
                });
                return mockRequestInstance;
            });

            Loader.getJson('/api/projects', {}, mockDispatch, mockCallback);

            expect(mockCallback).toHaveBeenCalledWith({ data: 'test' });
            expect(mockDispatch).toHaveBeenCalledWith(
                mockCallback({ data: 'test' })
            );
        });

        test('handles error response', () => {
            mockRequestInstance.end = jest.fn((callback) => {
                const error = new Error('Network error');
                error.original = new Error('ECONNREFUSED');
                callback(error, null);
                return mockRequestInstance;
            });

            const consoleErrorSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            Loader.getJson('/api/projects', {}, mockDispatch, mockCallback);

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'loading json from /api/projects failed: Error: Network error'
            );
            expect(mockCallback).toHaveBeenCalledWith(expect.any(Error));
            expect(mockDispatch).toHaveBeenCalledWith(
                mockCallback(expect.any(Error))
            );

            consoleErrorSpy.mockRestore();
        });

        test('handles response with error flag', () => {
            mockRequestInstance.end = jest.fn((callback) => {
                callback(null, {
                    text: '{"data": "test"}',
                    error: 'Server error',
                });
                return mockRequestInstance;
            });

            const consoleErrorSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            Loader.getJson('/api/projects', {}, mockDispatch, mockCallback);

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'loading json from /api/projects failed: Server error'
            );

            consoleErrorSpy.mockRestore();
        });

        test('does not call callback if not provided', () => {
            Loader.getJson('/api/projects', {}, mockDispatch, undefined);

            expect(mockDispatch).not.toHaveBeenCalled();
        });
    });

    describe('delete', () => {
        let mockDispatch;
        let mockCallback;
        let mockCb;

        beforeEach(() => {
            mockDispatch = jest.fn();
            mockCallback = jest.fn();
            mockCb = jest.fn();
        });

        test('makes DELETE request with correct configuration', () => {
            Loader.delete(
                '/api/projects/123',
                mockDispatch,
                mockCallback,
                mockCb
            );

            expect(request.delete).toHaveBeenCalledWith('/api/projects/123');
            expect(mockRequestInstance.set).toHaveBeenCalledWith(
                'Accept',
                'application/json'
            );
        });

        test('calls both callback and cb on success', () => {
            mockRequestInstance.end = jest.fn((callback) => {
                callback(null, {
                    text: '{"success": true, "id": 123}',
                    error: null,
                });
                return mockRequestInstance;
            });

            Loader.delete(
                '/api/projects/123',
                mockDispatch,
                mockCallback,
                mockCb
            );

            const expectedJson = { success: true, id: 123 };
            expect(mockCallback).toHaveBeenCalledWith(expectedJson);
            expect(mockDispatch).toHaveBeenCalledWith(
                mockCallback(expectedJson)
            );
            expect(mockCb).toHaveBeenCalledWith(expectedJson);
        });

        test('handles error response', () => {
            mockRequestInstance.end = jest.fn((callback) => {
                const error = new Error('Delete failed');
                error.original = new Error('Not found');
                callback(error, null);
                return mockRequestInstance;
            });

            const consoleErrorSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            Loader.delete(
                '/api/projects/123',
                mockDispatch,
                mockCallback,
                mockCb
            );

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'loading json from /api/projects/123 failed: Error: Delete failed'
            );
            expect(mockCallback).toHaveBeenCalledWith(expect.any(Error));
            expect(mockDispatch).toHaveBeenCalledWith(
                mockCallback(expect.any(Error))
            );

            consoleErrorSpy.mockRestore();
        });

        test('handles response with error flag', () => {
            mockRequestInstance.end = jest.fn((callback) => {
                callback(null, {
                    text: '{"error": "Cannot delete"}',
                    error: 'Cannot delete',
                });
                return mockRequestInstance;
            });

            const consoleErrorSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            Loader.delete(
                '/api/projects/123',
                mockDispatch,
                mockCallback,
                mockCb
            );

            expect(consoleErrorSpy).toHaveBeenCalled();

            consoleErrorSpy.mockRestore();
        });
    });

    describe('put', () => {
        test('creates PUT request and delegates to submit', () => {
            const params = { project: { name: 'Updated' } };

            Loader.put(
                '/api/projects/1',
                params,
                jest.fn(),
                jest.fn(),
                jest.fn(),
                jest.fn()
            );

            expect(request.put).toHaveBeenCalledWith('/api/projects/1');
            expect(mockRequestInstance.field).toHaveBeenCalledWith(
                'project[name]',
                'Updated'
            );
        });
    });

    describe('post', () => {
        test('creates POST request and delegates to submit', () => {
            const params = { project: { name: 'New Project' } };

            Loader.post(
                '/api/projects',
                params,
                jest.fn(),
                jest.fn(),
                jest.fn(),
                jest.fn()
            );

            expect(request.post).toHaveBeenCalledWith('/api/projects');
            expect(mockRequestInstance.field).toHaveBeenCalledWith(
                'project[name]',
                'New Project'
            );
        });
    });

    describe('submit', () => {
        let mockDispatch;
        let mockSuccessCallback;
        let mockErrorCallback;
        let mockCallback;

        beforeEach(() => {
            mockDispatch = jest.fn();
            mockSuccessCallback = jest.fn();
            mockErrorCallback = jest.fn();
            mockCallback = jest.fn();
        });

        describe('Simple scalar values', () => {
            test('handles string values', () => {
                const params = {
                    project: {
                        name: 'Test Project',
                        domain: 'test.example.com',
                    },
                };

                Loader.submit(
                    mockRequestInstance,
                    '/test/url',
                    params,
                    mockDispatch,
                    mockSuccessCallback,
                    mockErrorCallback,
                    mockCallback
                );

                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'project[name]',
                    'Test Project'
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'project[domain]',
                    'test.example.com'
                );
            });

            test('handles number values', () => {
                const params = {
                    interview: {
                        duration: 3600,
                        archive_id_number: 42,
                    },
                };

                Loader.submit(
                    mockRequestInstance,
                    '/test/url',
                    params,
                    mockDispatch,
                    mockSuccessCallback,
                    mockErrorCallback,
                    mockCallback
                );

                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'interview[duration]',
                    3600
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'interview[archive_id_number]',
                    42
                );
            });

            test('handles boolean values', () => {
                const params = {
                    project: {
                        is_catalog: true,
                        has_newsletter: false,
                    },
                };

                Loader.submit(
                    mockRequestInstance,
                    '/test/url',
                    params,
                    mockDispatch,
                    mockSuccessCallback,
                    mockErrorCallback,
                    mockCallback
                );

                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'project[is_catalog]',
                    true
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'project[has_newsletter]',
                    false
                );
            });

            test('handles empty string values', () => {
                const params = {
                    user: {
                        organization: '',
                        specification: '',
                    },
                };

                Loader.submit(
                    mockRequestInstance,
                    '/test/url',
                    params,
                    mockDispatch,
                    mockSuccessCallback,
                    mockErrorCallback,
                    mockCallback
                );

                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'user[organization]',
                    ''
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'user[specification]',
                    ''
                );
            });
        });

        describe('File uploads', () => {
            test('handles File instances via attach', () => {
                const mockFile = new File(['content'], 'test.pdf', {
                    type: 'application/pdf',
                });
                const params = {
                    material: {
                        data: mockFile,
                        title: 'Test Document',
                    },
                };

                Loader.submit(
                    mockRequestInstance,
                    '/test/url',
                    params,
                    mockDispatch,
                    mockSuccessCallback,
                    mockErrorCallback,
                    mockCallback
                );

                expect(mockRequestInstance.attach).toHaveBeenCalledWith(
                    'material[data]',
                    mockFile
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'material[title]',
                    'Test Document'
                );
            });
        });

        describe('Arrays with simple values', () => {
            test('handles array of strings', () => {
                const params = {
                    project: {
                        tags: ['history', 'oral-history', 'archive'],
                    },
                };

                Loader.submit(
                    mockRequestInstance,
                    '/test/url',
                    params,
                    mockDispatch,
                    mockSuccessCallback,
                    mockErrorCallback,
                    mockCallback
                );

                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'project[tags][]',
                    'history'
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'project[tags][]',
                    'oral-history'
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'project[tags][]',
                    'archive'
                );
            });

            test('handles array of numbers', () => {
                const params = {
                    project: {
                        registry_entry_ids: [1, 2, 3, 5, 8],
                    },
                };

                Loader.submit(
                    mockRequestInstance,
                    '/test/url',
                    params,
                    mockDispatch,
                    mockSuccessCallback,
                    mockErrorCallback,
                    mockCallback
                );

                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'project[registry_entry_ids][]',
                    1
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'project[registry_entry_ids][]',
                    2
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'project[registry_entry_ids][]',
                    3
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'project[registry_entry_ids][]',
                    5
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'project[registry_entry_ids][]',
                    8
                );
            });
        });

        describe('Arrays with object elements', () => {
            test('handles array of simple objects', () => {
                const params = {
                    registry_entry: {
                        registry_names_attributes: [
                            {
                                descriptor: 'Main Name',
                                name_position: 1,
                            },
                            {
                                descriptor: 'Alternative Name',
                                name_position: 2,
                            },
                        ],
                    },
                };

                Loader.submit(
                    mockRequestInstance,
                    '/test/url',
                    params,
                    mockDispatch,
                    mockSuccessCallback,
                    mockErrorCallback,
                    mockCallback
                );

                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'registry_entry[registry_names_attributes][0][descriptor]',
                    'Main Name'
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'registry_entry[registry_names_attributes][0][name_position]',
                    1
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'registry_entry[registry_names_attributes][1][descriptor]',
                    'Alternative Name'
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'registry_entry[registry_names_attributes][1][name_position]',
                    2
                );
            });

            test('handles nested arrays within object arrays (3 levels deep)', () => {
                const params = {
                    registry_entry: {
                        workflow_state: 'public',
                        registry_names_attributes: [
                            {
                                registry_entry_id: '28205',
                                translations_attributes: [
                                    {
                                        locale: 'de',
                                        id: '',
                                        descriptor: 'Deutsche Beschreibung',
                                    },
                                    {
                                        locale: 'en',
                                        id: '123',
                                        descriptor: 'English Description',
                                    },
                                ],
                                name_position: '3',
                                registry_name_type_id: '4',
                            },
                        ],
                    },
                };

                Loader.submit(
                    mockRequestInstance,
                    '/test/url',
                    params,
                    mockDispatch,
                    mockSuccessCallback,
                    mockErrorCallback,
                    mockCallback
                );

                // Check simple field
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'registry_entry[workflow_state]',
                    'public'
                );

                // Check nested array fields
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'registry_entry[registry_names_attributes][0][registry_entry_id]',
                    '28205'
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'registry_entry[registry_names_attributes][0][name_position]',
                    '3'
                );

                // Check deeply nested translations
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'registry_entry[registry_names_attributes][0][translations_attributes][0][locale]',
                    'de'
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'registry_entry[registry_names_attributes][0][translations_attributes][0][descriptor]',
                    'Deutsche Beschreibung'
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'registry_entry[registry_names_attributes][0][translations_attributes][1][locale]',
                    'en'
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'registry_entry[registry_names_attributes][0][translations_attributes][1][descriptor]',
                    'English Description'
                );
            });

            test('skips empty strings in nested array objects', () => {
                const params = {
                    registry_entry: {
                        registry_names_attributes: [
                            {
                                translations_attributes: [
                                    {
                                        locale: 'de',
                                        id: '', // Empty string should not be added
                                        descriptor: 'Test',
                                    },
                                ],
                            },
                        ],
                    },
                };

                Loader.submit(
                    mockRequestInstance,
                    '/test/url',
                    params,
                    mockDispatch,
                    mockSuccessCallback,
                    mockErrorCallback,
                    mockCallback
                );

                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'registry_entry[registry_names_attributes][0][translations_attributes][0][locale]',
                    'de'
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'registry_entry[registry_names_attributes][0][translations_attributes][0][descriptor]',
                    'Test'
                );
                // Should NOT be called with empty id
                expect(mockRequestInstance.field).not.toHaveBeenCalledWith(
                    'registry_entry[registry_names_attributes][0][translations_attributes][0][id]',
                    ''
                );
            });
        });

        describe('Nested objects', () => {
            test('handles nested objects with two levels', () => {
                const params = {
                    access_config: {
                        organization_setter: {
                            display: true,
                            obligatory: false,
                        },
                    },
                };

                Loader.submit(
                    mockRequestInstance,
                    '/test/url',
                    params,
                    mockDispatch,
                    mockSuccessCallback,
                    mockErrorCallback,
                    mockCallback
                );

                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'access_config[organization_setter][display]',
                    true
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'access_config[organization_setter][obligatory]',
                    false
                );
            });

            test('handles nested objects with three levels', () => {
                const params = {
                    access_config: {
                        job_description_setter: {
                            display: true,
                            obligatory: true,
                            values: {
                                researcher: true,
                                filmmaker: false,
                                journalist: true,
                            },
                        },
                    },
                };

                Loader.submit(
                    mockRequestInstance,
                    '/test/url',
                    params,
                    mockDispatch,
                    mockSuccessCallback,
                    mockErrorCallback,
                    mockCallback
                );

                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'access_config[job_description_setter][display]',
                    true
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'access_config[job_description_setter][obligatory]',
                    true
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'access_config[job_description_setter][values][researcher]',
                    true
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'access_config[job_description_setter][values][filmmaker]',
                    false
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'access_config[job_description_setter][values][journalist]',
                    true
                );
            });

            test('handles multiple nested objects', () => {
                const params = {
                    access_config: {
                        organization_setter: {
                            display: true,
                            obligatory: false,
                        },
                        specification_setter: {
                            display: true,
                            obligatory: true,
                        },
                    },
                };

                Loader.submit(
                    mockRequestInstance,
                    '/test/url',
                    params,
                    mockDispatch,
                    mockSuccessCallback,
                    mockErrorCallback,
                    mockCallback
                );

                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'access_config[organization_setter][display]',
                    true
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'access_config[organization_setter][obligatory]',
                    false
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'access_config[specification_setter][display]',
                    true
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'access_config[specification_setter][obligatory]',
                    true
                );
            });

            test('skips null values in nested objects', () => {
                const params = {
                    access_config: {
                        organization_setter: {
                            display: true,
                            obligatory: null, // Should be skipped
                            description: undefined, // Should be skipped
                        },
                    },
                };

                Loader.submit(
                    mockRequestInstance,
                    '/test/url',
                    params,
                    mockDispatch,
                    mockSuccessCallback,
                    mockErrorCallback,
                    mockCallback
                );

                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'access_config[organization_setter][display]',
                    true
                );
                expect(mockRequestInstance.field).not.toHaveBeenCalledWith(
                    'access_config[organization_setter][obligatory]',
                    expect.anything()
                );
                expect(mockRequestInstance.field).not.toHaveBeenCalledWith(
                    'access_config[organization_setter][description]',
                    expect.anything()
                );
            });
        });

        describe('Null and undefined handling', () => {
            test('removes top-level null values from params', () => {
                const params = {
                    project: {
                        name: 'Test',
                        description: null,
                        metadata: undefined,
                    },
                };

                Loader.submit(
                    mockRequestInstance,
                    '/test/url',
                    params,
                    mockDispatch,
                    mockSuccessCallback,
                    mockErrorCallback,
                    mockCallback
                );

                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'project[name]',
                    'Test'
                );
                expect(mockRequestInstance.field).not.toHaveBeenCalledWith(
                    'project[description]',
                    expect.anything()
                );
                expect(mockRequestInstance.field).not.toHaveBeenCalledWith(
                    'project[metadata]',
                    expect.anything()
                );

                // Verify the params object was mutated to remove null/undefined
                expect(params.project.description).toBeUndefined();
                expect(params.project.metadata).toBeUndefined();
            });
        });

        describe('Mixed types', () => {
            test('handles mixed parameter types in single submission', () => {
                const mockFile = new File(['content'], 'doc.pdf', {
                    type: 'application/pdf',
                });
                const params = {
                    interview: {
                        archive_id: 'abc123',
                        duration: 3600,
                        public: true,
                        data: mockFile,
                        tags: ['history', 'science'],
                        translations_attributes: [
                            {
                                locale: 'de',
                                title: 'Deutscher Titel',
                            },
                        ],
                        workflow_state: 'published',
                    },
                };

                Loader.submit(
                    mockRequestInstance,
                    '/test/url',
                    params,
                    mockDispatch,
                    mockSuccessCallback,
                    mockErrorCallback,
                    mockCallback
                );

                // Scalar values
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'interview[archive_id]',
                    'abc123'
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'interview[duration]',
                    3600
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'interview[public]',
                    true
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'interview[workflow_state]',
                    'published'
                );

                // File
                expect(mockRequestInstance.attach).toHaveBeenCalledWith(
                    'interview[data]',
                    mockFile
                );

                // Array of simple values
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'interview[tags][]',
                    'history'
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'interview[tags][]',
                    'science'
                );

                // Array of objects
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'interview[translations_attributes][0][locale]',
                    'de'
                );
                expect(mockRequestInstance.field).toHaveBeenCalledWith(
                    'interview[translations_attributes][0][title]',
                    'Deutscher Titel'
                );
            });
        });

        describe('Response handling', () => {
            test('calls success callback on successful response', () => {
                const params = { project: { name: 'Test' } };

                Loader.submit(
                    mockRequestInstance,
                    '/test/url',
                    params,
                    mockDispatch,
                    mockSuccessCallback,
                    mockErrorCallback,
                    mockCallback
                );

                expect(mockSuccessCallback).toHaveBeenCalledTimes(1);
                expect(mockDispatch).toHaveBeenCalledWith(
                    mockSuccessCallback({ success: true, data: { id: 1 } })
                );
            });

            test('calls custom callback on successful response', () => {
                const params = { project: { name: 'Test' } };

                Loader.submit(
                    mockRequestInstance,
                    '/test/url',
                    params,
                    mockDispatch,
                    mockSuccessCallback,
                    mockErrorCallback,
                    mockCallback
                );

                expect(mockCallback).toHaveBeenCalledTimes(1);
                expect(mockCallback).toHaveBeenCalledWith({
                    success: true,
                    data: { id: 1 },
                });
            });

            test('calls error callback when response has error flag', () => {
                mockRequestInstance.end = jest.fn((callback) => {
                    callback(null, {
                        text: '{"error": "Validation failed"}',
                        error: true,
                    });
                    return mockRequestInstance;
                });

                const params = { project: { name: 'Test' } };

                Loader.submit(
                    mockRequestInstance,
                    '/test/url',
                    params,
                    mockDispatch,
                    mockSuccessCallback,
                    mockErrorCallback,
                    mockCallback
                );

                expect(mockErrorCallback).toHaveBeenCalledTimes(1);
                expect(mockDispatch).toHaveBeenCalledWith(
                    mockErrorCallback({ error: 'Validation failed' })
                );
            });

            test('calls error callback when JSON contains error property', () => {
                mockRequestInstance.end = jest.fn((callback) => {
                    callback(null, {
                        text: '{"error": "Something went wrong", "success": false}',
                        error: null,
                    });
                    return mockRequestInstance;
                });

                const params = { project: { name: 'Test' } };

                Loader.submit(
                    mockRequestInstance,
                    '/test/url',
                    params,
                    mockDispatch,
                    mockSuccessCallback,
                    mockErrorCallback,
                    mockCallback
                );

                expect(mockErrorCallback).toHaveBeenCalledTimes(1);
                expect(mockDispatch).toHaveBeenCalledWith(
                    mockErrorCallback({
                        error: 'Something went wrong',
                        success: false,
                    })
                );
            });

            test('calls error callback on network error', () => {
                const networkError = new Error('Network failure');
                networkError.original = new Error('ECONNREFUSED');

                mockRequestInstance.end = jest.fn((callback) => {
                    callback(networkError, null);
                    return mockRequestInstance;
                });

                const consoleErrorSpy = jest
                    .spyOn(console, 'error')
                    .mockImplementation();
                const params = { project: { name: 'Test' } };

                Loader.submit(
                    mockRequestInstance,
                    '/test/url',
                    params,
                    mockDispatch,
                    mockSuccessCallback,
                    mockErrorCallback,
                    mockCallback
                );

                expect(mockErrorCallback).toHaveBeenCalledTimes(1);
                expect(mockDispatch).toHaveBeenCalledWith(
                    mockErrorCallback(networkError)
                );
                expect(consoleErrorSpy).toHaveBeenCalledWith(
                    'loading json from /test/url failed: Error: Network failure'
                );

                consoleErrorSpy.mockRestore();
            });

            test('logs to console when error callback not provided', () => {
                mockRequestInstance.end = jest.fn((callback) => {
                    callback(null, {
                        text: '{"error": "Validation failed"}',
                        error: true,
                    });
                    return mockRequestInstance;
                });

                const consoleErrorSpy = jest
                    .spyOn(console, 'error')
                    .mockImplementation();
                const params = { project: { name: 'Test' } };

                // Pass undefined as error callback
                Loader.submit(
                    mockRequestInstance,
                    '/test/url',
                    params,
                    mockDispatch,
                    mockSuccessCallback,
                    undefined,
                    mockCallback
                );

                expect(consoleErrorSpy).toHaveBeenCalled();

                consoleErrorSpy.mockRestore();
            });
        });

        describe('Request headers', () => {
            test('sets Accept header to application/json', () => {
                const params = { project: { name: 'Test' } };

                Loader.submit(
                    mockRequestInstance,
                    '/test/url',
                    params,
                    mockDispatch,
                    mockSuccessCallback,
                    mockErrorCallback,
                    mockCallback
                );

                expect(mockRequestInstance.set).toHaveBeenCalledWith(
                    'Accept',
                    'application/json'
                );
            });
        });
    });
});
