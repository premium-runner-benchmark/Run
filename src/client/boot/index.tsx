import Sentry from './Sentry';

import moment from 'moment';
import Logger from '../helpers/Logger';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';

import { hot } from 'react-hot-loader/root';

import { ConnectedRouter } from 'connected-react-router';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { default as store, history } from '../state/store';
import App from '../views';

import theme from '../theme';
import SnackbarProvider from '../theme/Snackbar';

const log = new Logger('root');

log.info(`booting v${process.env.VERSION}`);
Sentry.captureMessage('start');

declare var window: any;

window.editor = {};

moment.locale('de');

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <SnackbarProvider>
                    <Switch>
                        <Route path="/" component={hot(App)} />
                    </Switch>
                </SnackbarProvider>
            </ThemeProvider>
        </ConnectedRouter>
    </Provider>,
    document.querySelector('#root')
);
