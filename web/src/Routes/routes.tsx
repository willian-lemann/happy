import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Landing from '../pages/Landing';
import OrphanagesMap from '../pages/OrphanagesMap';
import CreateOrphanage from '../pages/CreateOrphanage';
import Orphanage from '../pages/Orphanage';

const Routes: React.FC = () => (
    <BrowserRouter>
        <Switch>
            <Route name='Landing' exact path='/' component={Landing} />
            <Route name='OrphanagesMap' path='/app' component={OrphanagesMap} />
            <Route name='CreateOrphanage' path='/orphanages/create' component={CreateOrphanage} />
            <Route name='Orphanage' path='/orphanages/:id' component={Orphanage} />
        </Switch>
    </BrowserRouter>
);

export default Routes;