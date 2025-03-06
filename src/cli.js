#!/usr/bin/env node
"use strict";

const { program } = require("commander");
const simpleGit = require("simple-git");
const fs = require("fs-extra");
const path = require("path");

// Репозиторий с шаблоном
const TEMPLATE_REPO = "https://github.com/symbo-ls/starter-kit.git";

// Команда для клонирования шаблона
program
  .command("init")
  .description("Clone the template repository")
  .action(async () => {
    const targetDir = path.join(process.cwd(), "symbols-project");
    console.log(`Cloning template into ${targetDir}...`);

    try {
      await simpleGit().clone(TEMPLATE_REPO, targetDir);
      console.log("Template cloned successfully.");
    } catch (error) {
      console.error("Error cloning repository:", error);
    }
  });

// Команда для генерации компонента
program
  .command("create")
  .description("Generate a grid selection component")
  .option("-x, --columns <number>", "Number of columns", "16")
  .option("-y, --rows <number>", "Number of rows", "8")
  .action(({ columns, rows }) => {
    const x = parseInt(columns, 10);
    const y = parseInt(rows, 10);

    const component = generateGridComponent(x, y);

    const outputPath = path.join(process.cwd(), "GridSelection.js");
    fs.writeFileSync(outputPath, component);
    console.log(`Component saved to ${outputPath}`);
  });

program.parse(process.argv);

function generateGridComponent(x, y) {
  return `
    "use strict";

import { Div, Flex, Span } from "smbls";

const x = ${x};
const y = ${y};

export const GridItem = {
  tag: "div",
  props: {
    aspectRatio: "1/1",
    width: "26px",
    cursor: "pointer",
    transition: "0.1s ease all",
    borderRadius: "2px",
  },
  on: {
    click: (event, element, state) => {
      state.updateMain({
        row: state.row,
        col: state.col,
        selectedCells: [state.row, state.col],
      });
    },
  },
};

export const GridSelection = {
  extend: Div,

  state: {
    selectedCells: [0, 0],
  },

  props: {
    padding: "A",
    align: "center space-between",
    fontFamily: "Europa",
    fontWeight: 400,
    background: "dark",
    borderRadius: "16px",
    boxShadow: "0px 5px 35px -10px #00000059",
  },
  H4: {
    text: "Grid Selection",
    props: {
      fontSize: "16px",
      fontWeight: 700,
      margin: "0 0 B 0",
    },
  },
  Grid: {
    props: {
      gap: "4px",
      columns: "repeat(${x}, 1fr)",
      background: "white",
      padding: "A",
      borderRadius: "10px",
    },
    childExtend: {
      extend: GridItem,
      props: ({ state }) => {
        let borderRadius = "2px";

        if (state.row === 1 && state.col === 1) {
          borderRadius = "6px 2px 2px 2px";
        }

        if (state.row === 1 && state.col == y) {
          borderRadius = "2px 6px 2px 2px";
        }

        if (state.row === x && state.col === 1) {
          borderRadius = "2px 2px 2px 6px";
        }

        if (state.row === x && state.col === y) {
          borderRadius = "2px 2px 6px 2px";
        }

        return {
          background:
            state.row <= state.selectedCells[0] &&
            state.col <= state.selectedCells[1]
              ? "active"
              : "inactive",
          borderRadius,
        };
      },
    },
    $stateCollection: ({ state }) => {
      return Array.from({ length: x * y }).map((item, key) => {
        const row = Math.floor(key / x) + 1;
        const col = (key % x) + 1;

        return {
          row,
          col,
          selectedCells: state.selectedCells,
          updateMain: state.update,
        };
      });
    },
  },
  Div: {
    extend: Flex,
    props: {
      padding: "B 0 A 0",
      align: "center",
      justifyContent: "space-between",
      fontSize: "12px",
    },

    coordinates: {
      extend: Flex,
      label: {
        extend: Span,
        props: {
          margin: "0 5px 0 0",
          color: "rgba(0,0,0,0.5)",
        },
        text: "Selection coordinates: ",
      },
      count: {
        text: (element, state) =>
          state.selectedCells[0] + ", " + state.selectedCells[1],
      },
    },

    total: {
      extend: Flex,
      label: {
        extend: Span,
        props: {
          margin: "0 5px 0 0",
          color: "rgba(0,0,0,0.5)",
        },
        text: "Total cells selected: ",
      },
      count: {
        text: (element, state) =>
          state.selectedCells[0] * state.selectedCells[1],
      },
    },
  },
};
  `;
}
