import moment from 'moment';
import * as React from 'react';

// import { makeStyles, Theme } from '@material-ui/core/styles';

import {
    Card,
    CardContent,
    CardHeader,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from '@material-ui/core';

import PerfectScrollbar from 'react-perfect-scrollbar';

// import ArrowRightIcon from '@material-ui/icons/ArrowRight';

interface IPassedProps {}

interface IStateProps extends IPassedProps {}

interface IDispatchProps {}

interface IProps extends IStateProps, IDispatchProps {
    data: any[];
}

// tslint:disable-next-line: variable-name
const RawDataTable: React.FunctionComponent<IProps> = (props: IProps) => {
    // const classes = useStyles();
    const { data } = props;
    return (
        <Card>
            <CardHeader
                // action={
                //     <Button color="primary" size="small" variant="outlined">
                //         Export as .csv
                //     </Button>
                // }
                title="Raw Data"
            />
            <Divider />
            <CardContent>
                <PerfectScrollbar>
                    <div>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Score</TableCell>
                                    <TableCell>MaxScore</TableCell>
                                    <TableCell>Percantage</TableCell>
                                    <TableCell sortDirection="desc">
                                        {/* <Tooltip enterDelay={300} title="Sort">
                                            <TableSortLabel
                                                active={true}
                                                direction="desc"
                                            > */}
                                        Opened
                                        {/* </TableSortLabel> */}
                                        {/* </Tooltip> */}
                                    </TableCell>
                                    <TableCell>Finished</TableCell>
                                    <TableCell>Time spent</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(data || []).map((d, i) => (
                                    <TableRow hover={true} key={i}>
                                        <TableCell>{d.score}</TableCell>
                                        <TableCell>{d.maxScore}</TableCell>
                                        <TableCell>
                                            {(
                                                d.score /
                                                (d.maxScore / 100)
                                            ).toFixed(0)}
                                            %
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                {moment(d.opened).format(
                                                    'LLLL'
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {moment(d.finished).format('LLLL')}
                                        </TableCell>
                                        <TableCell>
                                            {(d.finished - d.opened) / 1000} s
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </PerfectScrollbar>
            </CardContent>
            <Divider />
            {/* <CardActions>
                <Button color="primary" size="small" variant="text">
                    View all <ArrowRightIcon />
                </Button>
            </CardActions> */}
        </Card>
    );
};

export default RawDataTable;

// const useStyles = makeStyles((theme: Theme) => {
//     return {
//         paper: {
//             margin: '20px',
//             padding: '20px'
//         }
//     };
// });
