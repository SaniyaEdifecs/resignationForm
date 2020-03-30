import * as React from 'react';
import { sp } from '@pnp/sp';

export class SharePointServiceManager {
    
    checkResignationOwner() {
       return  sp.web.currentUser.groups.get()
    }
}
const SharePointService = new SharePointServiceManager();
export default SharePointService;