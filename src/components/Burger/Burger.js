import React from 'react';
import BurgerIngredient from './BurgerIngridient/BurgerIngredient';

import classes from './Burger.css'

const burger = (props) => {
    let transformedIngredients = 
        Object.keys(props.ingredients)
            .map( igKeys => {
                return [...Array(props.ingredients[igKeys])]
                    .map( (_, i) => {
                        return <BurgerIngredient key={igKeys + i} type={igKeys}></BurgerIngredient>
                    })
            })
            .reduce( (arr, el) => {
                return arr.concat(el);
            }, []);
    console.log(transformedIngredients.length);

    if (transformedIngredients.length === 0) {
        transformedIngredients = <p>add some ingredients</p>;
    }        

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type='bread-top'></BurgerIngredient>
            {transformedIngredients}
            <BurgerIngredient type='bread-bottom'></BurgerIngredient>
        </div>
    )
}

export default burger;