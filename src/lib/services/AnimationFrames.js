import SystemRequirements from './SystemRequirements';
SystemRequirements.addJS('requestAnimationFrame', () => !!requestAnimationFrame);

import RafPool from 'raf-pool';
export default RafPool;