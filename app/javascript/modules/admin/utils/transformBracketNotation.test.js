/**
 * Tests for bracket notation transformation utility
 */
import { transformBracketNotationToNested } from './transformBracketNotation';

describe('transformBracketNotationToNested', () => {
    describe('two-level nesting', () => {
        it('should transform simple bracket notation to nested object', () => {
            const params = {
                access_config: {
                    '[organization_setter]display': true,
                    '[organization_setter]obligatory': false,
                },
            };

            const result = transformBracketNotationToNested(params);

            expect(result).toEqual({
                access_config: {
                    organization_setter: {
                        display: true,
                        obligatory: false,
                    },
                },
            });
        });

        it('should handle multiple setters', () => {
            const params = {
                access_config: {
                    '[organization_setter]display': true,
                    '[organization_setter]obligatory': false,
                    '[specification_setter]display': false,
                    '[specification_setter]obligatory': true,
                },
            };

            const result = transformBracketNotationToNested(params);

            expect(result).toEqual({
                access_config: {
                    organization_setter: {
                        display: true,
                        obligatory: false,
                    },
                    specification_setter: {
                        display: false,
                        obligatory: true,
                    },
                },
            });
        });

        it('should handle string values', () => {
            const params = {
                data: {
                    '[field]name': 'John Doe',
                    '[field]email': 'john@example.com',
                },
            };

            const result = transformBracketNotationToNested(params);

            expect(result).toEqual({
                data: {
                    field: {
                        name: 'John Doe',
                        email: 'john@example.com',
                    },
                },
            });
        });
    });

    describe('three-level nesting', () => {
        it('should transform three-level bracket notation', () => {
            const params = {
                access_config: {
                    '[job_description_setter][values]researcher': true,
                    '[job_description_setter][values]interviewer': false,
                },
            };

            const result = transformBracketNotationToNested(params);

            expect(result).toEqual({
                access_config: {
                    job_description_setter: {
                        values: {
                            researcher: true,
                            interviewer: false,
                        },
                    },
                },
            });
        });

        it('should handle mixed values and string values', () => {
            const params = {
                access_config: {
                    '[job_description_setter][values]researcher': 'true',
                    '[job_description_setter][values]interviewer': 'false',
                },
            };

            const result = transformBracketNotationToNested(params);

            expect(result).toEqual({
                access_config: {
                    job_description_setter: {
                        values: {
                            researcher: 'true',
                            interviewer: 'false',
                        },
                    },
                },
            });
        });
    });

    describe('mixed nesting levels', () => {
        it('should handle both 2-level and 3-level nesting', () => {
            const params = {
                access_config: {
                    '[job_description_setter]display': true,
                    '[job_description_setter]obligatory': false,
                    '[job_description_setter][values]researcher': true,
                    '[job_description_setter][values]interviewer': false,
                },
            };

            const result = transformBracketNotationToNested(params);

            expect(result).toEqual({
                access_config: {
                    job_description_setter: {
                        display: true,
                        obligatory: false,
                        values: {
                            researcher: true,
                            interviewer: false,
                        },
                    },
                },
            });
        });

        it('should handle multiple setters with mixed nesting', () => {
            const params = {
                access_config: {
                    '[organization_setter]display': true,
                    '[organization_setter]obligatory': false,
                    '[job_description_setter]display': true,
                    '[job_description_setter]obligatory': true,
                    '[job_description_setter][values]researcher': true,
                    '[job_description_setter][values]filmmaker': false,
                },
            };

            const result = transformBracketNotationToNested(params);

            expect(result).toEqual({
                access_config: {
                    organization_setter: {
                        display: true,
                        obligatory: false,
                    },
                    job_description_setter: {
                        display: true,
                        obligatory: true,
                        values: {
                            researcher: true,
                            filmmaker: false,
                        },
                    },
                },
            });
        });
    });

    describe('no transformation needed', () => {
        it('should return params unchanged when no bracket notation', () => {
            const params = {
                project: {
                    name: 'Test Project',
                    contact_email: 'test@example.com',
                },
            };

            const result = transformBracketNotationToNested(params);

            expect(result).toEqual(params);
        });

        it('should handle empty values object', () => {
            const params = {
                access_config: {},
            };

            const result = transformBracketNotationToNested(params);

            expect(result).toEqual(params);
        });
    });

    describe('edge cases', () => {
        it('should handle numeric values', () => {
            const params = {
                data: {
                    '[field]count': 42,
                    '[field]index': 0,
                },
            };

            const result = transformBracketNotationToNested(params);

            expect(result).toEqual({
                data: {
                    field: {
                        count: 42,
                        index: 0,
                    },
                },
            });
        });

        it('should handle boolean false', () => {
            const params = {
                access_config: {
                    '[organization_setter]display': false,
                    '[organization_setter]obligatory': false,
                },
            };

            const result = transformBracketNotationToNested(params);

            expect(result).toEqual({
                access_config: {
                    organization_setter: {
                        display: false,
                        obligatory: false,
                    },
                },
            });
        });
    });
});
