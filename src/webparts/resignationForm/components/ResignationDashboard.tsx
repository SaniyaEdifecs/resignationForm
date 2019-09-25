import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ResignationForm from './ResignationFormComponent/ResignationForm';
import ResignationList from './ResignationList';
import { sp } from '@pnp/sp';
import ManagerApprovalForm from './ResignationFormComponent/ManagerApprovalForm';

interface ITabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;

}

function TabPanel(props: ITabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            <Box>{children}</Box>
        </Typography>
    );
}

function tabProps(index: any) {

    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}


const ResignationDashboard = (props) => {
    const [value, setValue] = React.useState(0);
    function handleChange(event: React.ChangeEvent<{}>, newValue: number) {
        setValue(newValue);
    }

    return (
        <div>
            <AppBar position="static" color="default">
                <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary"
                    variant="scrollable" scrollButtons="auto" aria-label="scrollable auto tabs example">
                    <Tab label="Resignation Form" {...tabProps(0)} />
                    <Tab label="Resignations " {...tabProps(1)} />
                    <Tab label="Manager's Approval " {...tabProps(2)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <ResignationForm context={props.context} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ResignationList />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <ManagerApprovalForm />
            </TabPanel>
        </div>
    );
};

export default ResignationDashboard;