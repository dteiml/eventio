import Confirm from '../ui/Components/Items/Confirm';
import Alert from '../ui/Components/Items/Alert';
import { createConfirmation } from 'react-confirm';

const alertConfirmation = createConfirmation(Alert);

const confirmConfirmation = createConfirmation(Confirm);

export function confirm(confirmation, options = {}) {
  return confirmConfirmation({ confirmation, ...options });
};

export function myAlert(confirmation, options = {}) {
	return alertConfirmation({ confirmation, ...options });
}
