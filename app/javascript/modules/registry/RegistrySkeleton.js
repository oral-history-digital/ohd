import Skeleton from 'react-loading-skeleton';

export default function RegistrySkeleton() {
    return (
        <div className="wrapper-content register">
            <div className="registry-entries-title" style={{ width: '25%' }}>
                <h1 className="registry-entries-title">
                    <Skeleton />
                </h1>
            </div>

            {Array.from({ length: 8 }).map((_, idx) => (
                <div
                    key={idx}
                    style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '.5rem',
                        width: '50%',
                    }}
                >
                    <Skeleton width={20} height={20} />
                    <Skeleton width={200} height={20} />
                </div>
            ))}
        </div>
    );
}
