import React, {Component} from 'react';

import Modal from '../../components/UI/Modal/Modal';
import AuxC from '../AuxC/AuxC';

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {
        state = {
            error: null
        }

        componentWillMount() {
            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({error: null});
                return req;
            })
            this.resInterceptor = axios.interceptors.response.use(res => res, error => {
                this.setState({error: error})
            });
        }

        componentWillUnmount() {
            console.log('willunmount', this.reqInterceptor, this.resInterceptor);

            axios.interceptors.eject(this.reqInterceptor);
            axios.interceptors.eject(this.resInterceptor);
        }

        errorConfirmedHandler = () => {
            this.setState({error: null})
        }

        render() {
            return (
                <AuxC>
                    <Modal 
                        modalClosed={this.errorConfirmedHandler}
                        show={this.state.error}>
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </AuxC>
            )
        }
    }
}

export default withErrorHandler;
