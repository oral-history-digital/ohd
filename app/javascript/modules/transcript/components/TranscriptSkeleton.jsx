import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function TranscriptSkeleton({ count = 3 }) {
    const items = Array.from({ length: count });

    // simple, fixed array of line counts to use for skeletons
    const lengths = [2, 4, 2, 4, 3, 3, 2];
    const lineCounts = items.map((_, i) => lengths[i % lengths.length]);

    return (
        <div className="Transcript-skeleton">
            {items.map((_, i) => {
                const textLines = lineCounts[i];

                return (
                    <div
                        key={i}
                        className="Segment Segment--skeleton"
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            padding: '12px 0',
                        }}
                    >
                        <div
                            style={{
                                width: 56,
                                display: 'flex',
                                justifyContent: 'flex-start',
                            }}
                        >
                            <Skeleton height={24} width={32} />
                        </div>

                        <div
                            style={{
                                flex: 1,
                                marginLeft: 12,
                                maxWidth: '32.5rem',
                            }}
                        >
                            <div>
                                <Skeleton count={textLines} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

TranscriptSkeleton.propTypes = {
    count: PropTypes.number,
};
