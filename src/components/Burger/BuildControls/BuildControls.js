import React from 'react';

import classes from './BuildControls.css';
import BuildControl from './BuildControl/BuildControl';

const controls = [
    {label: 'Salad', type: 'salad'},
    {label: 'Bacon', type: 'bacon'},
    {label: 'Cheese', type: 'cheese'},
    {label: 'Meat', type: 'meet'}
];

const buildControls = (prop) => (
    <div className={classes.BuildControls}>
        {controls.map( cntrl => (
            <BuildControl label={cntrl.label} key={cntrl.type} />
        ))}
    </div>
)

export default buildControls;
