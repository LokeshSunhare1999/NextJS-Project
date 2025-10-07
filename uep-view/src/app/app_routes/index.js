import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import AuthRoutes from './AuthRoutes'
import LoginPage  from 'components/authentication';
import NotFound from 'shared/NotFound';
import Files from 'components/files';
import Events from 'components/events';
import CustomerAccounts from 'components/customerAccounts';
import Staff from 'components/staff';
import Producers from 'components/producers';
import Orders from 'components/orders';
import ZendeskChat from 'components/zendeskChat';
import Reports from 'components/reports';
import AdminDashboard from 'components/dashboard';
import PreOrder from 'components/preOrders';
import Report from 'components/report';
import ScannedOrders from 'components/scannedOrder';
const AppRoutes = () => (
    <Router>
        <Switch>
            <AuthRoutes  exact path="/" component={ LoginPage } />
            <AuthRoutes  exact path="/profile" component={ AdminDashboard } />
            <AuthRoutes  exact path="/reports" component={ Reports } />
            <AuthRoutes  exact path="/files" component={ Files  } />
            <AuthRoutes  exact path="/events" component={ Events } />
            <AuthRoutes  exact path="/customer-accounts" component={ CustomerAccounts } />
            <AuthRoutes  exact path="/staff" component={ Staff } />
            <AuthRoutes  exact path="/orders" component={ Orders } />
            <AuthRoutes  exact path="/order-scanner" component={ ScannedOrders } />
            <AuthRoutes  exact path="/staff" component={ Staff } />
            <AuthRoutes  exact path="/producers" component={ Producers } />
            <AuthRoutes  exact path="/zendesk-chat" component={ ZendeskChat } />
            <AuthRoutes  exact path="/not-found" component={ NotFound } />
            <AuthRoutes  exact path="/preorders" component={ PreOrder } />
            <AuthRoutes  exact path="/report" component={ Report } />
        </Switch>
    </Router>
);

export default AppRoutes;