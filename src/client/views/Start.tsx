import { push } from 'connected-react-router';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Logger from '../helpers/Logger';

import Center from 'client/views/components/CenterContent';

import Footer from 'client/views/components/Footer';

import GradientBackground from 'client/views/components/GradientBackground';

import LinearProgress from '@material-ui/core/LinearProgress';

import { actions, IState, selectors, types } from '../state';

import * as UI from 'client/state/ui';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import Logo from 'client/views/components/Logo';

import { trackEvent } from 'client/helpers/track';

const log = new Logger('container:app');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    getH5PRequestMessage: string;
    getH5PRequestState: UI.types.RequestStates;
}

interface IDispatchProps {
    changeRequestState: typeof actions.ui.changeRequestState;
    getH5P: typeof actions.run.getH5P;

    notify: typeof actions.notifications.notify;

    push: (url: string) => void;
}

interface IComponentState {
    error: boolean;

    id?: number;
}

interface IProps extends IStateProps, IDispatchProps {}

export class RunAdminContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            error: false,
            id: undefined
        };

        this.changeId = this.changeId.bind(this);
        this.push = this.push.bind(this);
        this.onEnter = this.onEnter.bind(this);
    }

    public async changeId(e: any): Promise<void> {
        if (this.props.getH5PRequestState) {
            this.props.changeRequestState('run_geth5p', undefined);
        }
        const id = e.target.value;
        if (id.match(/^[0-9]*$/) && id.length <= 6) {
            this.setState({ id });
        }
    }

    public componentDidMount(): void {
        if (this.props.getH5PRequestState === 'error') {
            this.props.notify(
                `We couldn't find that ID. Please check and try again.`,
                'error'
            );
        }
    }

    public async onEnter(e: any): Promise<void> {
        if (e.key === 'Enter') {
            this.push();
        }
    }

    public async push(event?: React.ChangeEvent<{}>): Promise<void> {
        if (this.state.id) {
            const getAction = await this.props.getH5P(this.state.id);

            if (getAction.error) {
                trackEvent('run', 'not-found');
                this.props.notify(
                    `We couldn't find that ID. Please check and try again.`,
                    'error'
                );
            } else {
                trackEvent('run', 'found');
                this.props.push(`/${this.state.id}`);
                window.location.href = `${window.location.origin}/${this.state.id}`;
            }
        }
    }

    public render(): JSX.Element {
        log.info(`rendering`);

        const { getH5PRequestMessage, getH5PRequestState } = this.props;

        return (
            <div id="run">
                <GradientBackground error={getH5PRequestState === 'error'}>
                    <Center>
                        <Logo />
                        <Paper style={{ padding: '20px' }}>
                            {getH5PRequestState === 'pending' ? (
                                <LinearProgress />
                            ) : (
                                <TextField
                                    autoFocus={true}
                                    id="h5p_id"
                                    label="ID"
                                    variant="outlined"
                                    type="tel"
                                    fullWidth={true}
                                    error={getH5PRequestState === 'error'}
                                    helperText={getH5PRequestMessage}
                                    onChange={this.changeId}
                                    value={this.state.id}
                                    onKeyPress={this.onEnter}
                                />
                            )}
                        </Paper>
                        <Button
                            disabled={Boolean(getH5PRequestState)}
                            type="submit"
                            fullWidth={true}
                            variant="contained"
                            style={{ marginTop: '20px' }}
                            onClick={this.push}
                        >
                            Enter
                        </Button>
                    </Center>
                    <Center>
                        <Footer />
                    </Center>
                </GradientBackground>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: IPassedProps): IStateProps {
    return {
        getH5PRequestMessage: selectors.ui.requestMessage(state, 'run_geth5p'),
        getH5PRequestState: selectors.ui.requestState(state, 'run_geth5p')
    };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
    return bindActionCreators(
        {
            changeRequestState: actions.ui.changeRequestState,
            getH5P: actions.run.getH5P,

            notify: actions.notifications.notify,

            // tslint:disable-next-line: object-shorthand-properties-first
            push
        },
        dispatch
    );
}

export default connect<IStateProps, IDispatchProps, IPassedProps, IState>(
    mapStateToProps,
    mapDispatchToProps
)(RunAdminContainer);
