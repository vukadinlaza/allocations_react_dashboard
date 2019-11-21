import { library } from "@fortawesome/fontawesome-svg-core";
import * as Solid from "@fortawesome/free-solid-svg-icons";

const icons = [
  Solid.faLink,
  Solid.faUser,
  Solid.faPowerOff,
  Solid.faFeather,
  Solid.faInbox,
  Solid.faFolderPlus,
  Solid.faSearchDollar,
  Solid.faExternalLinkAlt
]

export default library.add(...icons);
