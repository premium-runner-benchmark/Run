import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';

import * as Notifications from 'client/state/notifications';
import * as Run from 'client/state/run';
import * as UI from 'client/state/ui';

// state - reducer
const rootReducer = (history: any) =>
    combineReducers({
        notifications: Notifications.reducer,
        ui: UI.reducer,
        // tslint:disable-next-line: object-literal-sort-keys
        run: Run.reducer,
        router: connectRouter(history)
    });

export interface IState extends Run.types.IState {
    notifications: Notifications.types.INotificationsState;
    router: {
        location: {
            hash: string;
            key: string;
            pathname: string;
            search: string;
        };
    };
    ui: UI.types.IUIState;
}

export const actions = {
    notifications: Notifications.actions,
    run: Run.actions,
    ui: UI.actions
};

export const selectors = {
    notifications: Notifications.selectors,
    run: Run.selectors,
    ui: UI.selectors
};

export const types = {
    run: Run.types,
    ui: UI.types
};

export default rootReducer;
