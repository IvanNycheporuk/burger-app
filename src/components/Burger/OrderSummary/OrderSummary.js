import React, {Component} from 'react';
import Auxc from '../../../hoc/AuxC/AuxC';
import Button from '../../UI/Button/Button'

class OrderSummary extends Component  {
    // this could be a functional component, doesn't have to be a class
    componentWillUpdate() {
        console.log('OrderSummary componentWillUpdate');
    }

    render(){
        const ingredientSummary = Object.keys(this.props.ingredients)
        .map( i => {
            return (
                <li key={i}>
                    <span>{i}:</span> {this.props.ingredients[i]}
                </li>)
        })
        return(
            <Auxc>
                <h2>Order Summary</h2>
                <ul>
                    {ingredientSummary}
                </ul>                
                <span><strong>Total price: {this.props.price.toFixed(2)}</strong></span>
                <p>Continue to checkout?</p>
                <Button btnType="Danger" clicked={this.props.purchaseCancel}>Cancel</Button>
                <Button btnType="Success" clicked={this.props.purchaseContinue}>Continue</Button>
            </Auxc>
        )
    }

}

export default OrderSummary;