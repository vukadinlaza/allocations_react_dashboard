import { library } from '@fortawesome/fontawesome-svg-core';
import * as Solid from '@fortawesome/free-solid-svg-icons';
import * as Reg from '@fortawesome/free-regular-svg-icons';

/** *
 *
 * imports all font awesome icons we use
 *
 * */

const icons = [
  Solid.faLink,
  Solid.faUser,
  Solid.faPowerOff,
  Solid.faFeather,
  Solid.faInbox,
  Solid.faFolderPlus,
  Solid.faSearchDollar,
  Solid.faExternalLinkAlt,
  Solid.faBars,
  Solid.faPlusCircle,
  Solid.faPlusSquare,
  Solid.faPlus,
  Solid.faTimes,
  Solid.faCircleNotch,
  Solid.faCheck,
  Solid.faCheckSquare,
  Solid.faFileUpload,
  Solid.faTimesCircle,
  Solid.faArrowRight,
  Solid.faInfoCircle,
  Solid.faEdit,
  Solid.faPaperclip,
  Solid.faClock,
  Solid.faCopy,
  Solid.faSignature,
  Solid.faUsers,
  Solid.faUserShield,
  Solid.faDollarSign,
  Solid.faAngleDown,
  Solid.faAngleUp,
  Solid.faPaperPlane,
  Solid.faEnvelopeOpenText,
  Solid.faEnvelope,
  Solid.faCheckCircle,
  Solid.faSpinner,
  Solid.faLock,
  Reg.faFilePdf,
  Reg.faSquare,
];

export default library.add(...icons);
