import useSWRInfinite from 'swr/infinite';
import { useSelector } from 'react-redux';

import { fetcher } from 'modules/api';
import { getCurrentProject } from 'modules/data';
import { usePathBase } from 'modules/routes';

function transformData(data) {
    const combinedResults = [];

    data.forEach(datum => {
        datum.interviews.forEach(interview => combinedResults.push(interview));
    });

    return {
        total: data[0].results_count,
        interviews: combinedResults,
    };
}

export default function useArchiveSearch() {
    const pathBase = usePathBase();
    const project = useSelector(getCurrentProject);

    function getKey(pageIndex, previousPageData) {
        return `${pathBase}/searches/archive?page=${pageIndex + 1}`;
    }

    const { data, error, isValidating, size, setSize } =
        useSWRInfinite(getKey, fetcher);

    let transformedData;
    if (data) {
        console.log(data);
        transformedData = transformData(data);
    }

    console.log(data, error, isValidating);

    return { data: transformedData, error, isValidating };
}
