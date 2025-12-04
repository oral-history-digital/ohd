export default function buildInstitutionTree(
    rootInstitutions,
    allInstitutions
) {
    const clonedInstitutions = allInstitutions.map((i) => ({ ...i }));
    const clonedRootInstitutions = rootInstitutions.map((i) => ({ ...i }));

    const institutionsByParentId = clonedInstitutions.reduce((acc, inst) => {
        if (inst.parent_id === null) {
            return acc;
        }

        if (inst.parent_id in acc) {
            acc[inst.parent_id].push(inst);
        } else {
            acc[inst.parent_id] = [inst];
        }
        return acc;
    }, {});

    clonedRootInstitutions.forEach((inst) => {
        gatherChildren(inst, institutionsByParentId);
    });

    return clonedRootInstitutions;
}

function gatherChildren(inst, institutionsByParentId) {
    inst.children = institutionsByParentId[inst.id] || [];
    delete inst.parent_id;

    inst.children.forEach((childInst) => {
        gatherChildren(childInst, institutionsByParentId);
    });
}
