import { library } from "@fortawesome/fontawesome-svg-core";
import * as Solid from "@fortawesome/free-solid-svg-icons";
import * as Reg from "@fortawesome/free-regular-svg-icons";

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
  Solid.faFileUpload,
  Solid.faTimesCircle,
  Solid.faArrowRight,
  Solid.faInfoCircle,
  Solid.faEdit,
  Solid.faPaperclip,
  Solid.faClock,
  Reg.faFilePdf
]

export default library.add(...icons);
