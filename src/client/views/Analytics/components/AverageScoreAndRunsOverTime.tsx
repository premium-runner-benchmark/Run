import { groupBy } from 'lodash';
import moment from 'moment';
import React from 'react';

import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

import {
    Button,
    ButtonGroup,
    Card,
    CardContent,
    CardHeader,
    Divider
} from '@material-ui/core';

moment.locale('de');

export default (props: { data: any[] }): JSX.Element => {
    const data = props.data;

    const groupedData = groupBy(data, entry => {
        return moment(entry.finished).format('L');
    });

    const d = [];
    // tslint:disable-next-line: forin
    for (const key in groupedData) {
        const runs = groupedData[key].length;
        const averageScore = (
            (groupedData[key]
                .map(a => {
                    return a.score / a.maxScore;
                })
                .reduce((p, c) => p + c) /
                runs) *
            100
        ).toFixed(0);

        d.push({
            averageScore,
            runs,
            // tslint:disable-next-line: object-literal-sort-keys
            name: key
        });
    }

    return (
        <Card>
            <CardHeader
                action={
                    <ButtonGroup variant="outlined" color="primary">
                        <Button color="primary" size="small" variant="outlined">
                            Resolution: 1 Day
                        </Button>
                        {/* <Button
                            color="primary"
                            size="small"
                            aria-label="select merge strategy"
                            aria-haspopup="menu"
                        >
                            <ArrowDropDownIcon />
                        </Button> */}
                    </ButtonGroup>
                }
                title="Average Score & Runs over Time"
            />
            <Divider />
            <CardContent>
                <ResponsiveContainer minHeight={300}>
                    <LineChart
                        // width={600}
                        // height={300}
                        data={d}
                        margin={{
                            bottom: 5,
                            left: 20,
                            right: 30,
                            top: 5
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis unit="%" domain={[0, 100]} />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="averageScore"
                            name="Average Score"
                            stroke="#2980b9"
                            activeDot={{ r: 8 }}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="runs"
                            name="Runs"
                            stroke="#27ae60"
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
