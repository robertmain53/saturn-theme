import React from 'react';
import styles from './css/index.css';

import reducers from './reducers';
// export { default as sagas } from './sagas/client';

const Theme = () => <div className={styles.red}>hi from saturn</div>;

export default Theme;
export { reducers };
