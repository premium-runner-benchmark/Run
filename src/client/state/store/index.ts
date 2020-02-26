import { createBrowserHistory } from 'history';
import { throttle } from 'lodash';
import { applyMiddleware, compose, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import * as Sentry from '@sentry/browser';
import createSentryMiddleware from 'redux-sentry-middleware';

import rootReducer from '../';

import Logger from '../../helpers/Logger';
const log = new Logger('store');

declare var window: any;

export function loadState(): any {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
}

export function saveState(state: {}): void {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
}

const persistentState = loadState();
// process.env.NODE_ENV === 'production' ? loadState() : undefined;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const history = createBrowserHistory();

log.info(`initializing store`);

const middleWares = [thunk, createSentryMiddleware(Sentry)];

if (process.env.NODE_ENV === 'development' && window.localStorage.logActions) {
    middleWares.push(logger as any);
}

const store = createStore(
    rootReducer(history),
    persistentState,
    composeEnhancers(applyMiddleware(...middleWares))
);

// if (process.env.NODE_ENV === 'production') {
store.subscribe(
    throttle(() => {
        saveState(store.getState());
    }, 1000)
);
// }

export default store;
