import * as React from 'react';

import { gradeColor } from '../../../helpers/Data';

import { Card, CardContent, CardHeader, Divider } from '@material-ui/core';

import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';

interface IPassedProps {}

interface IStateProps extends IPassedProps {}

interface IDispatchProps {}

interface IProps extends IStateProps, IDispatchProps {
    data: any[];
}

// tslint:disable-next-line: variable-name
const Overview: React.FunctionComponent<IProps> = (props: IProps) => {
    // const classes = useStyles();
    const { data } = props;
    return (
        <Card>
            <CardHeader title="Overview" />
            <Divider />
            <CardContent>
                <ResponsiveContainer minHeight={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx={100}
                            cy={100}
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={true}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={gradeColor(
                                        parseFloat(entry.name) / 100
                                    )}
                                />
                            ))}
                        </Pie>
                        <Legend align="right" layout="vertical" />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default Overview;
