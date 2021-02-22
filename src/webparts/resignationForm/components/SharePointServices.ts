import * as React from 'react';
import { sp } from '@pnp/sp';

export class SharePointServiceManager {
    public getCurrentUserGroups() {
        return sp.web.currentUser.groups.get();
    };
    public getCurrentUser() {
        return sp.web.currentUser.get();
    };
    public getListByTitle(title) {
        return sp.web.lists.getByTitle(title);
    }
    public redirectTo = (url, resignationId) => {
        event.preventDefault();
        window.location.href = resignationId ? "?component=" + url + "&resignationId=" + resignationId : url;
    }
}

const SharePointService = new SharePointServiceManager();
export default SharePointService;