import React from 'react';
import UserContext from '../utils/UserContext'; 

class Login extends React.Component {
  state = {
    username: "",
    password: "",
    currentUser: null
  }
  
  componentDidMount () {
  };

  handleChange = (event, onChangeFunction) => {
    const { name, value } = event.target;
    onChangeFunction(name, value, 'login');
  }

  handleLogin = (event, onSubmitLoginFunction) => {
    const { history } = this.props;
    onSubmitLoginFunction(event, history);
  }

  render() {
    return (
      <UserContext.Consumer>
        {({
          handleUserInputChange, 
          handleLoginSubmit, 
          username, 
          password, 
          errorLoginPage,
          validationObjects
        }) => (
          <div id="home">
            <div className="container">
                <div className="row">
                    <header id="ExtendSim-header">
                    </header>
                </div>
                <div className="row">
                    <div className="col-8">
                        <h2>ExtendSim ASP Server Login Page</h2>
                        <form className="clearfix mb-4" action="POST">
                            <div className="form-group">
                                <label htmlFor="username-text">Username</label>
                                <input 
                                    onChange={(e) => this.handleChange(e, handleUserInputChange)}
                                    autoComplete="off"
                                    type="text" 
                                    id="username-text" 
                                    name="username"
                                    className="form-control input-text" 
                                    aria-describedby="username-text" 
                                    placeholder="Enter username"
                                    value={username}>
                                </input>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password-text">Password</label>
                                <input 
                                    onChange={(e) => this.handleChange(e, handleUserInputChange)}
                                    autoComplete="off"
                                    type="password" 
                                    id="password-text" 
                                    name="password"
                                    className="form-control input-text" 
                                    aria-describedby="password-text"
                                    value={password}>
                                </input>                            
                            </div>
                            <button 
                                onClick={(e) => this.handleLogin(e, handleLoginSubmit)}
                                disabled={!validationObjects[validationObjects.findIndex(obj => obj.name==="loginSubmitButton")].enabled}
                                id="submit-login-info" className="btn btn-primary float-left">Submit
                            </button>
                            <br></br>
                            { errorLoginPage && (
                              <div className="login-errors">
                                <h3>{errorLoginPage}</h3>
                              </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
          </div>
        )}
      </UserContext.Consumer>
    );
  }
}

export default Login;
