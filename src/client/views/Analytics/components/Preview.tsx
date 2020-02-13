import * as React from 'react';

import { Card, CardContent, CardHeader, Divider } from '@material-ui/core';

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
            <CardHeader title="Preview" />
            <Divider />
            <CardContent>
                <iframe
                    title="H5PView"
                    frameBorder={0}
                    width="100%"
                    // height="800px"
                    src={`http://api.lumi.run/v0/h5p/render?id=${id}`}
                />
            </CardContent>
        </Card>
    );
};
