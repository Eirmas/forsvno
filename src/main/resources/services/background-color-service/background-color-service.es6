const COLORS = [
  {
    id: "green-light",
    hex: "#F1F2F0"
  },
  {
    id: "green",
    hex: "#C6C7C4"
  },
  {
    id: "grey-light",
    hex: "#F5F7F8"
  },
  {
    id: "blue-light",
    hex: "#E2E6E9"
  },
  {
    id: "beige-light",
    hex: "#EDE9E8"
  },
  {
    id: "beige",
    hex: "#E3DDD8"
  }
];

function getIcon  (color) {
  return `
  <svg viewBox="0 0 30 30">
    <circle cx="15" cy="15" r="13" style="stroke-width: 3; fill: ${color};"></circle>
  </svg>
  `;
}

exports.get = (req) => {
  let colors = COLORS;

  if (req.params.exclude) {
    const excludedColors = req.params.exclude.split(",");
    colors = colors.filter(color => excludedColors.indexOf(color.id) === -1);
  }
  if (req.params.query && req.params.query !== "") {
    colors = colors.filter(color => color.displayName.toLowerCase().indexOf(req.params.query.toLowerCase()) !== -1);
  }

  colors = colors.map((color) => {
    const _color = color;
    _color.displayName = color.id;
    _color.description = " ";
    _color.icon = {
      data: getIcon(color.hex).trim(),
      type: "image/svg+xml"
    };
    return _color;
  });

  return {
    body: {
      total: colors.length,
      count: colors.length,
      hits: colors
    }
  };
};
