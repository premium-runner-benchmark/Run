import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { bindActionCreators } from 'redux';

import Logger from '../helpers/Logger';

import LinearProgress from '@material-ui/core/LinearProgress';

// import GradientBackground from 'lib/components/GradientBackground';

import H5PClientRenderer from 'client/views/components/H5PClientRenderer';

// import PaperContent from 'lib/components/ContentPaper';

import * as UI from 'client/state/ui';

import { actions, IState, selectors } from '../state';

const log = new Logger('container:app');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    h5p:
        | {
              id: number;
              metadata: any;
              parameters: any;
          }
        | undefined;
    id: number;

    requestState: UI.types.RequestStates;
}

interface IDispatchProps {
    getH5P: typeof actions.run.getH5P;
}

interface IComponentState {}

interface IProps extends IStateProps, IDispatchProps {}

export class RunAdminContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentDidMount(): void {
        if (!this.props.h5p) {
            this.props.getH5P(this.props.id);
        }
    }

    public render(): JSX.Element {
        log.info(`rendering`);

        const { h5p, requestState } = this.props;

        return (
            <div id="run">
                {requestState === 'pending' ? <LinearProgress /> : null}
                {requestState === 'success' ? (
                    <div style={{ padding: '10px' }}>
                        {h5p ? (
                            <H5PClientRenderer
                                id={h5p.id}
                                metadata={h5p.metadata}
                                parameters={h5p.parameters}
                            />
                        ) : null}
                    </div>
                ) : null}
                {requestState === 'error' ? <Redirect to="/" /> : null}
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: any): IStateProps {
    const id = parseInt(ownProps.match.params.id, 10);
    return {
        id,
        // tslint:disable-next-line: object-literal-sort-keys
        h5p: selectors.run.h5p(state, id),
        requestState: selectors.ui.requestState(state, 'run_geth5p')
    };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
    return bindActionCreators(
        {
            getH5P: actions.run.getH5P
        },
        dispatch
    );
}

export default connect<IStateProps, IDispatchProps, IPassedProps, IState>(
    mapStateToProps,
    mapDispatchToProps
)(RunAdminContainer);
