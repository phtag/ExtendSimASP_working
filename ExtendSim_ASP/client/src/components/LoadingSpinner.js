import React from 'react';

function LoadingSpinner(message) {
    return (
        <div id="my-spinner-text">
            <i className="fa fa-spinner fa-spin my-spinners"></i>
            {message.message}
        </div>
    )
};

export default LoadingSpinner;