import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Landing from '../pages/Landing';
import OrphanagesMap from '../pages/OrphanagesMap';

const Routes: React.FC = () => (
    <BrowserRouter>
        <Switch>
            <Route name='Landing' exact path='/' component={Landing} />
            <Route name='OrphanagesMap' path='/app' component={OrphanagesMap} />
        </Switch>
    </BrowserRouter>
);

export default Routes;