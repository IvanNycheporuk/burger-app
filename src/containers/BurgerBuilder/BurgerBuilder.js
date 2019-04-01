import React, {Component} from 'react';

import AuxC from '../../hoc/AuxC/AuxC';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandling/withErrorHandling';


const INGREDIENT_PRICES = {
    salad: 0.4,
    bacon: 0.7,
    cheese: 0.3,
    meat: 1.3
}

class BurgerBuilder extends Component{
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        axios.get('https://burger-app-inych.firebaseio.com/ingredients.json')
            .then( response => {
                this.setState({ingredients: response.data})
                console.log(this.state.ingredients);
            })
            .catch( error => {
                this.setState({error: true})
            });
        }

    updatePurchaseState(ingredients){
        const sum = Object.keys(ingredients)
            .map(igKeys => ingredients[igKeys])
            .reduce((sum, num) => {
                return sum += num;
            },0);

        this.setState({
            purchasable: sum > 0
        })
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
        //alert('You continue with the order');
        this.setState({
            loading: true
        });

        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Ivan Test',
                address: {
                    street: 'TestStreet',
                    zipCode: '1234',
                    country: 'Ukraine'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders', order)
            .then(response => {
                this.setState({
                    loading: false,
                    purchasing: false
                })
            })
            .catch(error => {
                this.setState({
                    loading: false,
                    purchasing: false
                });
            })
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;

        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        });

        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }

        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;

        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        });

        this.updatePurchaseState(updatedIngredients);
    }

    render(){

        let disabledInfo = {
            ...this.state.ingredients
        }

        for ( let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;

        let burger = this.state.error ? <p>something went wrong</p> : <Spinner />

        if (this.state.ingredients) {
            burger = (
                <AuxC>  
                    <Burger ingredients={this.state.ingredients}></Burger>
                    <BuildControls 
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        price={this.state.totalPrice}
                        purchasable={!this.state.purchasable}
                        ordered={this.purchaseHandler}/>
                </AuxC>
            );

            orderSummary = <OrderSummary 
                ingredients={this.state.ingredients}
                purchaseCancel={this.purchaseCancelHandler}
                purchaseContinue={this.purchaseContinueHandler}
                price={this.state.totalPrice} />
        }

        if (this.state.loading){
            orderSummary = <Spinner />
        }

        return(
            <AuxC>                            
                <Modal 
                    order={this.state.purchasing}
                    show={this.state.purchasing}
                    modalClosed={this.purchaseCancelHandler}
                >                
                    {orderSummary}
                </Modal>
                {burger}
            </AuxC>
        )
    }
}

export default withErrorHandler(BurgerBuilder, axios);