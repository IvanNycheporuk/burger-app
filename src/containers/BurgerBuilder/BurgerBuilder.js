import React, {Component} from 'react';
import { connect } from 'react-redux';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandling/withErrorHandling';
import * as actionTypes from '../../store/actions';

class BurgerBuilder extends Component{
    state = {        
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        console.log('burger-builder', this.props);
        // axios.get('https://burger-app-inych.firebaseio.com/ingredients.json')
        //     .then( response => {
        //         this.setState({ingredients: response.data})
        //         console.log(this.state.ingredients);
        //     })
        //     .catch( error => {
        //         this.setState({error: true})
        //     });
        }

    updatePurchaseState(ingredients){
        const sum = Object.keys(ingredients)
            .map(igKeys => ingredients[igKeys])
            .reduce((sum, num) => {
                return sum + num;
            }, 0);        
            
        return sum > 0       
    }

    purchaseHandler = () => {
        this.setState({
            purchasing: true
        })
    }

    purchaseCancelHandler = () => {
        this.setState({
            purchasing: false
        })
    }

    purchaseContinueHandler = () => {        
        this.props.history.push('/checkout');
    }

    render(){

        let disabledInfo = {
            ...this.props.ings
        }

        for ( let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;

        let burger = this.state.error ? <p>something went wrong</p> : <Spinner />

        if (this.props.ings) {
            burger = (
                <>  
                    <Burger ingredients={this.props.ings}></Burger>
                    <BuildControls 
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        price={this.props.price}
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        ordered={this.purchaseHandler}/>
                </>
            );

            orderSummary = <OrderSummary 
                ingredients={this.props.ings}
                purchaseCancel={this.purchaseCancelHandler}
                purchaseContinue={this.purchaseContinueHandler}
                price={this.props.price} />
        }

        if (this.state.loading){
            orderSummary = <Spinner />
        }

        return(
            <>                            
                <Modal 
                    order={this.state.purchasing}
                    show={this.state.purchasing}
                    modalClosed={this.purchaseCancelHandler}
                >                
                    {orderSummary}
                </Modal>
                {burger}
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));