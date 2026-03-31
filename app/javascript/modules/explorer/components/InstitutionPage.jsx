import { useTrackPageView } from 'modules/analytics';
import { useGetInstitution } from 'modules/data';
import { ErrorBoundary } from 'modules/react-toolbox';
import { ScrollToTop } from 'modules/user-agent';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';

import { ArchivesList } from './ArchivesList';
import {
    Address,
    GenericDetail,
    Institutions,
    InterviewStats,
    RichtextDetail,
    Website,
} from './details';

export function InstitutionPage() {
    const id = Number(useParams().id);
    const { institution } = useGetInstitution(id);
    useTrackPageView();

    const title = institution?.name;

    // Get IDs for institution & children to show archives list
    const idsForArchivesList = [
        ...(institution?.id ? [institution.id] : []),
        ...(institution?.children?.map((child) => child.id) || []),
    ];

    return (
        <ScrollToTop>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <ErrorBoundary>
                <div className="wrapper-content InstitutionDetails">
                    <h1 className="Page-main-title InstitutionDetails-title">
                        {title}
                    </h1>

                    <dl className="DescriptionList">
                        <Institutions
                            institutions={institution?.parent}
                            labelKey="modules.catalog.part_of_institution"
                        />

                        <Institutions
                            institutions={institution?.children}
                            labelKey="explorer.sub_institutions"
                        />

                        <RichtextDetail
                            richtext={institution?.description}
                            labelKey="modules.catalog.description"
                        />

                        <Address
                            address={institution?.address}
                            lat={institution?.latitude}
                            lon={institution?.longitude}
                        />

                        <Website url={institution?.website} />

                        <InterviewStats counts={institution?.interviews} />

                        <GenericDetail
                            value={institution?.isil}
                            labelKey="activerecord.attributes.institution.isil"
                            groupClassName="InstitutionDetails-isil"
                        />

                        <GenericDetail
                            value={institution?.gnd}
                            labelKey="activerecord.attributes.institution.gnd"
                            groupClassName="InstitutionDetails-gnd"
                        />
                    </dl>

                    {idsForArchivesList && institution?.archives.length > 0 && (
                        <ArchivesList
                            institutionIds={idsForArchivesList}
                            showTotals={false}
                            hideifEmpty={true}
                        />
                    )}
                </div>
            </ErrorBoundary>
        </ScrollToTop>
    );
}

export default InstitutionPage;
