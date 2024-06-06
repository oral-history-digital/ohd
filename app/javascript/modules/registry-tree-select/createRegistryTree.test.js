import createRegistryTree, { buildTree } from './createRegistryTree';

describe('createRegistryTree', () => {
    test('converts a normal tree to component format', () => {
        const data = [
            {
                "id": 456510,
                "label": "Register",
                "parent": null
            },
            {
                "id": 456512,
                "label": "Orte",
                "parent": 456510
            },
            {
                "id": 456513,
                "label": "Frankreich",
                "parent": 456512
            },
            {
                "id": 456514,
                "label": "Auvergne-Rhône-Alpes",
                "parent": 456513
            },
            {
                "id": 456515,
                "label": "Bourgogne-Franche-Comté",
                "parent": 456513
            },
            {
                "id": 456516,
                "label": "Bretagne",
                "parent": 456513
            },
            {
                "id": 456607,
                "label": "Aufnahmesituation",
                "parent": 456510
            },
            {
                "id": 456608,
                "label": "Zuhause",
                "parent": 456607
            },
            {
                "id": 456609,
                "label": "Studio",
                "parent": 456607
            },
            {
                "id": 456611,
                "label": "Draußen",
                "parent": 456607
            },
            {
                "id": 456613,
                "label": "Aufnahmegerät",
                "parent": 456510
            },
            {
                "id": 456614,
                "label": "MiniDisc (Sony® MZ-R91); condenser microphone Philips® (SBC ME570)",
                "parent": 456613
            },
        ];

        const actual = createRegistryTree(data);
        const expected = {
            "value": 456510,
            "label": "Register",
            "parent": null,
            "checked": false,
            "disabled": false,
            "children": [
                {
                    "value": 456613,
                    "label": "Aufnahmegerät",
                    "parent": 456510,
                    "checked": false,
                    "disabled": true,
                    "children": [
                        {
                            "value": 456614,
                            "label": "MiniDisc (Sony® MZ-R91); condenser microphone Philips® (SBC ME570)",
                            "parent": 456613,
                            "checked": false,
                            "disabled": false
                        }
                    ]
                },
                {
                    "value": 456607,
                    "label": "Aufnahmesituation",
                    "parent": 456510,
                    "checked": false,
                    "disabled": true,
                    "children": [
                        {
                            "value": 456611,
                            "label": "Draußen",
                            "parent": 456607,
                            "checked": false,
                            "disabled": false
                        },
                        {
                            "value": 456609,
                            "label": "Studio",
                            "parent": 456607,
                            "checked": false,
                            "disabled": false
                        },
                        {
                            "value": 456608,
                            "label": "Zuhause",
                            "parent": 456607,
                            "checked": false,
                            "disabled": false
                        }
                    ]
                },
                {
                    "value": 456512,
                    "label": "Orte",
                    "parent": 456510,
                    "checked": false,
                    "disabled": true,
                    "children": [
                        {
                            "value": 456513,
                            "label": "Frankreich",
                            "parent": 456512,
                            "checked": false,
                            "disabled": false,
                            "children": [
                                {
                                    "value": 456514,
                                    "label": "Auvergne-Rhône-Alpes",
                                    "parent": 456513,
                                    "checked": false,
                                    "disabled": false
                                },
                                {
                                    "value": 456515,
                                    "label": "Bourgogne-Franche-Comté",
                                    "parent": 456513,
                                    "checked": false,
                                    "disabled": false
                                },
                                {
                                    "value": 456516,
                                    "label": "Bretagne",
                                    "parent": 456513,
                                    "checked": false,
                                    "disabled": false
                                },
                            ]
                        },
                    ]
                }
            ]
        };
        expect(actual).toEqual(expected);
    });
});

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
