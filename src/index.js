"use strict";

import { create, Flex } from "smbls";

import designSystem from "./designSystem";
import * as components from "./GridSelection";
import pages from "./pages";

create(
  {
    extend: Flex,

    props: {
      theme: "document",
      flow: "column",
      height: "100vh",
      align: "center center",
    },

    GridSelection: {},
  },
  {
    designSystem,
    components,
    pages,
  }
);
