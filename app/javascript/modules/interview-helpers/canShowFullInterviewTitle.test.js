import canShowFullInterviewTitle from './canShowFullInterviewTitle';

describe('canShowFullInterviewTitle', () => {
    /**
     * Returns an auth callback that always resolves to the given value.
     */
    function authResolver(result) {
        return () => result;
    }

    it('returns false when interview is missing', () => {
        expect(
            canShowFullInterviewTitle(null, true, null, authResolver(false))
        ).toBe(false);
    });

    it('returns false when workflow state is missing and user cannot update', () => {
        expect(
            canShowFullInterviewTitle(
                { id: 1 },
                true,
                { interview_permissions: [] },
                authResolver(false)
            )
        ).toBe(false);
    });

    it('returns true when workflow state is missing but user can update', () => {
        expect(
            canShowFullInterviewTitle(
                { id: 1 },
                true,
                { interview_permissions: [] },
                authResolver(true)
            )
        ).toBe(true);
    });

    it('returns true for public interview when project access is granted', () => {
        expect(
            canShowFullInterviewTitle(
                { id: 1, workflow_state: 'public' },
                true,
                { interview_permissions: [] },
                authResolver(false)
            )
        ).toBe(true);
    });

    it('returns true for public interview even when project access is not granted', () => {
        expect(
            canShowFullInterviewTitle(
                { id: 1, workflow_state: 'public' },
                false,
                { interview_permissions: [] },
                authResolver(false)
            )
        ).toBe(true);
    });

    it('returns true for restricted interview when user has interview permission', () => {
        expect(
            canShowFullInterviewTitle(
                { id: 1, workflow_state: 'restricted' },
                true,
                { interview_permissions: [{ interview_id: 1 }] },
                authResolver(false)
            )
        ).toBe(true);
    });

    it('returns false for restricted interview without permission and no update rights', () => {
        expect(
            canShowFullInterviewTitle(
                { id: 1, workflow_state: 'restricted' },
                true,
                { interview_permissions: [] },
                authResolver(false)
            )
        ).toBe(false);
    });
});
