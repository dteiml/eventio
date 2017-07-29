import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/lib/Modal'
import { confirmable } from 'react-confirm';

class Confirm extends React.Component {
  render() {
    const {
      okLabbel,
      cancelLabel,
      confirmation,
      show,
      proceed,
      dismiss,
      cancel,
      enableEscape = true,
    } = this.props;
    return (
        <Modal show={show} onHide={dismiss} backdrop={enableEscape ? true : 'static'} keyboard={enableEscape}>
            <h2>{confirmation}</h2>
            <span className='modal__buttons'>
              <button className='btn--join' onClick={cancel}>{cancelLabel}</button>
              <button className='btn--leave' onClick={proceed}>{okLabbel}</button>
            </span>
        </Modal>
    )
  }
}

Confirm.propTypes = {
  okLabbel: PropTypes.string,
  cancelLabel: PropTypes.string,
  title: PropTypes.string,
  confirmation: PropTypes.string,
  show: PropTypes.bool,
  proceed: PropTypes.func,     // called when ok button is clicked.
  cancel: PropTypes.func,      // called when cancel button is clicked.
  dismiss: PropTypes.func,     // called when backdrop is clicked or escaped.
  enableEscape: PropTypes.bool,
}

export default confirmable(Confirm);
