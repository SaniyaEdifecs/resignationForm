import * as React from 'react';
import { sp } from '@pnp/sp';

export class SharePointServiceManager {

    getCurrentUserGroups() {
        return sp.web.currentUser.groups.get()
    };
    getCurrentUser() {
        return sp.web.currentUser.get()
    };
    getListByTitle(title) {
        return sp.web.lists.getByTitle(title)
    };
    redirectTo = (url, resignationId) => {
        event.preventDefault();
        window.location.href = resignationId ? "?component=" + url + "&resignationId=" + resignationId : url;
    };
}

const SharePointService = new SharePointServiceManager();
export default SharePointService;