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
    id: number;
}

// tslint:disable-next-line: variable-name
export default (props: IProps) => {
    // const classes = useStyles();
    const { id } = props;
    return (
        <Card>
            <CardHeader title="Run" />
            <Divider />
            <CardContent>
                <Grid container={true} justify="space-between">
                    <Grid item={true}>
                        <Typography variant="h3"> ID: {id}</Typography>

                        <Typography
                            color="textSecondary"
                            gutterBottom={true}
                            variant="body2"
                        >
                            {`http://Lumi.run/${id}`}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
