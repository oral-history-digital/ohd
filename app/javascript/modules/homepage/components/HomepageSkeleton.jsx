import Skeleton from 'react-loading-skeleton';

export default function HomepageSkeleton() {
    return (
        <div
            className="Homepage project-index wrapper-content"
            data-testid="homepage-skeleton"
        >
            <section className="Hero" style={{ minHeight: 240 }}>
                <div className="Hero-content">
                    <h1 className="Hero-heading">
                        <Skeleton width={420} height={48} />
                    </h1>
                    <p className="Hero-text">
                        <Skeleton count={2} />
                    </p>
                    <div className="CtaWrapper">
                        <Skeleton
                            width={160}
                            height={48}
                            style={{ marginRight: 12 }}
                        />
                        <Skeleton width={220} height={48} />
                    </div>
                </div>
            </section>

            <div
                className="Grid Grid--2"
                data-testid="homepage-panels-grid-skeleton"
            >
                <div className="Panel">
                    <div className="Panel-content">
                        <Skeleton width="100%" height={220} />
                        <h2 className="Panel-heading u-mt-small">
                            <Skeleton width={200} height={24} />
                        </h2>
                        <p className="Panel-text">
                            <Skeleton count={2} />
                        </p>
                        <div className="CtaWrapper">
                            <Skeleton
                                width={120}
                                height={36}
                                style={{ marginRight: 8 }}
                            />
                            <Skeleton width={140} height={36} />
                        </div>
                    </div>
                </div>

                <div className="Panel">
                    <div className="Panel-content">
                        <Skeleton width="100%" height={220} />
                        <h2 className="Panel-heading u-mt-small">
                            <Skeleton width={200} height={24} />
                        </h2>
                        <p className="Panel-text">
                            <Skeleton count={2} />
                        </p>
                        <div className="CtaWrapper">
                            <Skeleton
                                width={120}
                                height={36}
                                style={{ marginRight: 8 }}
                            />
                            <Skeleton width={140} height={36} />
                        </div>
                    </div>
                </div>
            </div>

            <article className="u-mt-xlarge">
                <div className="HomepageProjects-header">
                    <h3 className="Homepage-heading u-mt-none u-mb-none">
                        <Skeleton width={320} height={28} />
                    </h3>
                </div>

                <div
                    className="HomepageProjects-scroll"
                    style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}
                >
                    {Array.from({ length: 3 }).map((_, idx) => (
                        <div key={idx} style={{ width: 220 }}>
                            <Skeleton height={120} />
                            <Skeleton height={18} style={{ marginTop: 8 }} />
                            <Skeleton height={16} style={{ marginTop: 6 }} />
                        </div>
                    ))}
                </div>
            </article>
        </div>
    );
}
