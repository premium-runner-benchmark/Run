import moment from 'moment';
import * as React from 'react';

import {
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    Typography
} from '@material-ui/core';

interface IPassedProps {}

interface IStateProps extends IPassedProps {}

interface IDispatchProps {}

interface IProps extends IStateProps, IDispatchProps {
    dataLength: number;
    lastRun: Date;
}

// tslint:disable-next-line: variable-name
export default (props: IProps) => {
    // const classes = useStyles();
    const { dataLength, lastRun } = props;
    return (
        <Card>
            <CardHeader title="Summary" />
            <Divider />
            <CardContent>
                <Grid container={true} justify="space-between">
                    <Grid item={true}>
                        <Typography
                            color="textSecondary"
                            gutterBottom={true}
                            variant="body2"
                        >
                            Total Runs
                        </Typography>
                        <Typography variant="h3">{dataLength}</Typography>
                    </Grid>
                </Grid>
                <Grid container={true} justify="space-between">
                    <Grid item={true}>
                        <Typography
                            color="textSecondary"
                            gutterBottom={true}
                            variant="body2"
                        >
                            Last Run
                        </Typography>
                        <Typography variant="h5">
                            {moment(lastRun).calendar()}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
