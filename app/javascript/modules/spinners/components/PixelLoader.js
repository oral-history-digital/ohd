import React from 'react';

import styles from './PixelLoader.module.scss';

export default function PixelLoader() {
    return (
        <div className={styles.container}>
            <div className={styles.loaderPixel}>
                {
                    [...new Array(100)].map((_, index) => <div key={index} className={styles.pixels} />)
                }
            </div>
        </div>
    );
}
