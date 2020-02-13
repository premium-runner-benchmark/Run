import qs from 'query-string';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Logger from '../../helpers/Logger';

import { pieReduce } from '../../helpers/Data';

import Grid from '@material-ui/core/Grid';

import Main from 'client/views/components/Main';
import Root from 'client/views/components/Root';

import AppBar from 'client/views/components/AppBar';

import { actions, IState, selectors } from '../../state';

import AverageScoreAndRunsOverTime from './components/AverageScoreAndRunsOverTime';
import Overview from './components/Overview';
import Preview from './components/Preview';
import RawDataTable from './components/RawDataTable';
import RunID from './components/RunId';
import Summary from './components/Summary';

import { IAnalytics } from 'client/state/run/types';

const log = new Logger('container:app');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    analytics: IAnalytics;
    data: any[];
    h5pId: number;
    id?: string;
}

interface IDispatchProps {
    getAnalytics: typeof actions.run.getAnalytics;
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
        if (this.props.id) {
            this.props.getAnalytics(this.props.id);
        }
    }

    public render(): JSX.Element {
        log.info(`rendering`);

        const { analytics, data, h5pId } = this.props;
        return (
            <div id="run">
                <Root>
                    {/* <CssBaseline /> */}
                    <AppBar leftDrawerOpen={false} />
                    <Main leftDrawerOpen={false}>
                        <Grid container={true} spacing={4}>
                            <Grid item={true} lg={6} sm={6} xl={6} xs={6}>
                                <RunID id={h5pId} />
                            </Grid>
                            <Grid item={true} lg={6} sm={6} xl={6} xs={6}>
                                <Preview id={h5pId} />
                            </Grid>
                        </Grid>
                        <Grid container={true} spacing={4}>
                            <Grid item={true} lg={6} sm={6} xl={6} xs={12}>
                                <Overview data={pieReduce(this.props.data)} />
                            </Grid>
                            <Grid item={true} lg={6} sm={6} xl={6} xs={12}>
                                <Summary
                                    dataLength={data.length}
                                    lastRun={new Date(analytics.accessed_at)}
                                />
                            </Grid>
                            {/* <Grid item={true}>
                                <PerformanceOverTime data={this.props.data} />
                            </Grid> */}
                        </Grid>
                        <Grid container={true} spacing={4}>
                            <Grid item={true} lg={12} sm={12} xl={12} xs={12}>
                                <AverageScoreAndRunsOverTime data={data} />
                            </Grid>
                        </Grid>
                        <Grid container={true} spacing={4}>
                            <Grid item={true} lg={12} sm={12} xl={12} xs={12}>
                                <RawDataTable data={data} />
                            </Grid>
                        </Grid>
                    </Main>
                </Root>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: IPassedProps): IStateProps {
    const id = qs.parse((ownProps as any).location.search).id as string;
    const analytics = selectors.run.analytics(state, id) || ({} as any);
    return {
        analytics,
        data: analytics.data || [],
        h5pId: analytics.h5p_id,
        // tslint:disable-next-line: object-shorthand-properties-first
        id
    };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
    return bindActionCreators(
        {
            getAnalytics: actions.run.getAnalytics
        },
        dispatch
    );
}

export default connect<IStateProps, IDispatchProps, IPassedProps, IState>(
    mapStateToProps,
    mapDispatchToProps
)(RunAdminContainer);
