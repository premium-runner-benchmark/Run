import qs from 'query-string';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Logger from '../../helpers/Logger';

import { pieReduce } from '../../helpers/Data';

import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import LeftDrawer from 'client/views/components/LeftDrawer';
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
    allAnalytics: IAnalytics[];
    analytics: IAnalytics;
    data: any[];
    h5pId: number;
    id?: string;

    leftDrawerOpen: boolean;
}

interface IDispatchProps {
    closeLeftDrawer: typeof actions.ui.closeLeftDrawer;
    getAnalytics: typeof actions.run.getAnalytics;
    openLeftDrawer: typeof actions.ui.openLeftDrawer;
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

        const {
            allAnalytics,
            analytics,
            closeLeftDrawer,
            data,
            h5pId,
            leftDrawerOpen,
            openLeftDrawer
        } = this.props;
        return (
            <div id="run">
                <Root>
                    <AppBar
                        leftDrawerOpen={leftDrawerOpen}
                        openLeftDrawer={openLeftDrawer}
                    />
                    <LeftDrawer
                        leftDrawerOpen={leftDrawerOpen}
                        closeLeftDrawer={closeLeftDrawer}
                    >
                        <List>
                            {allAnalytics.map((a, index) => (
                                <div key={a._id}>
                                    <Link
                                        variant="button"
                                        color="textPrimary"
                                        href={`/analytics?id=${a._id}`}
                                    >
                                        <ListItem>
                                            <ListItemText
                                                primary={a.h5p_id}
                                                secondary={`${a.data.length} Runs`}
                                            />
                                        </ListItem>
                                    </Link>
                                    <Divider variant="inset" component="li" />
                                </div>
                            ))}
                        </List>
                    </LeftDrawer>
                    <Main leftDrawerOpen={leftDrawerOpen}>
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
    const allAnalytics = [];

    for (const key in state.run.analytics) {
        allAnalytics.push(state.run.analytics[key]);
    }

    return {
        allAnalytics,
        analytics,
        data: analytics.data || [],
        h5pId: analytics.h5p_id,
        leftDrawerOpen: state.ui.leftDrawerOpen,
        // tslint:disable-next-line: object-shorthand-properties-first
        id
    };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
    return bindActionCreators(
        {
            closeLeftDrawer: actions.ui.closeLeftDrawer,
            getAnalytics: actions.run.getAnalytics,
            openLeftDrawer: actions.ui.openLeftDrawer
        },
        dispatch
    );
}

export default connect<IStateProps, IDispatchProps, IPassedProps, IState>(
    mapStateToProps,
    mapDispatchToProps
)(RunAdminContainer);
