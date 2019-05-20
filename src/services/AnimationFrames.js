import SystemRequirements from './SystemRequirements';
SystemRequirements.addJS('requestAnimationFrame', () => !!requestAnimationFrame);

import RafPool from 'raf-pool';
export default new RafPool();