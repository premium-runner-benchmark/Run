import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Logger from '../helpers/Logger';

import Paper from '@material-ui/core/Paper';

import Center from 'client/views/components/CenterContent';

import GradientBackground from 'client/views/components/GradientBackground';

import { actions, IState, selectors } from '../state';

import RunUploadPage from 'client/views/components/RunUploadPage';

import Logo from 'client/views/components/Logo';

import { RequestStates } from 'client/state/ui/types';

const log = new Logger('container:app');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    uploadMessage: string;
    uploadProgress: number;
    uploadState: RequestStates;
}

interface IDispatchProps {
    upload: typeof actions.run.uploadFile;
}

interface IComponentState {}

interface IProps extends IStateProps, IDispatchProps {}

export class RunContainer extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render(): JSX.Element {
        log.info(`rendering`);

        const {
            upload,
            uploadMessage,
            uploadProgress,
            uploadState
        } = this.props;
        return (
            <div id="run">
                <GradientBackground error={uploadState === 'error'}>
                    <Center>
                        <Logo />
                        <Paper>
                            <RunUploadPage
                                upload={upload}
                                state={uploadState}
                                progress={uploadProgress}
                                uploadMessage={uploadMessage}
                            />
                        </Paper>
                    </Center>
                </GradientBackground>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: IPassedProps): IStateProps {
    return {
        uploadMessage: selectors.ui.requestMessage(state, 'run_upload'),
        uploadProgress: selectors.ui.requestProgress(state, 'run_upload'),
        uploadState: selectors.ui.requestState(state, 'run_upload')
    };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
    return bindActionCreators(
        {
            upload: actions.run.uploadFile
        },
        dispatch
    );
}

export default connect<IStateProps, IDispatchProps, IPassedProps, IState>(
    mapStateToProps,
    mapDispatchToProps
)(RunContainer);
