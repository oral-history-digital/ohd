/* eslint-disable react/prop-types */
import { act, render } from '@testing-library/react';
import { submitDataWithFetch } from 'modules/api';
import { Form } from 'modules/forms';

import BiographicalEntryForm from './BiographicalEntryForm';

const mockMutatePeople = jest.fn();
const mockMutatePerson = jest.fn();
jest.mock('modules/api', () => ({ submitDataWithFetch: jest.fn() }));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ locale: 'en' }) }));
jest.mock('modules/routes', () => ({ usePathBase: () => '/pilot/en' }));
jest.mock('modules/forms', () => ({ Form: jest.fn(() => <p>Biography</p>) }));
jest.mock('./hooks', () => ({
    useMutatePeople: () => mockMutatePeople,
    useMutatePersonWithAssociations: () => mockMutatePerson,
}));

beforeEach(() => jest.clearAllMocks());

test.each([false, true])(
    'biography form preserves localized values and person cache updates (existing: %s)',
    async (existing) => {
        const entry = existing
            ? {
                  id: 8,
                  person_id: 5,
                  text: { en: 'Biography' },
                  start_date: {},
                  end_date: {},
              }
            : undefined;
        const onSubmit = jest.fn();
        render(
            <BiographicalEntryForm
                biographicalEntry={entry}
                person={existing ? undefined : { id: 5 }}
                onSubmit={onSubmit}
            />
        );
        const form = Form.mock.lastCall[0];
        expect(form.values).toEqual({ person_id: 5 });
        expect(form.elements[0].value).toBe(existing ? 'Biography' : undefined);
        const params = {
            biographical_entry: {
                ...(existing ? { id: 8 } : {}),
                person_id: 5,
                translations_attributes: [{ locale: 'en', text: 'Updated' }],
            },
        };
        const updatedPerson = { id: 5, biographical_entries: { 8: { id: 8 } } };
        submitDataWithFetch.mockResolvedValue({ data: updatedPerson });
        await act(async () => {
            await form.onSubmit(params);
            const people = await mockMutatePeople.mock.lastCall[0]({
                data: { 6: { id: 6 } },
            });
            expect(people.data).toEqual({ 5: updatedPerson, 6: { id: 6 } });
        });
        expect(submitDataWithFetch).toHaveBeenCalledWith('/pilot/en', params);
        expect(mockMutatePerson).toHaveBeenCalledWith(5);
        expect(onSubmit).toHaveBeenCalledTimes(1);
    }
);
