const getLegend = (item)=>{
    const getRGBAColorBy16 = (color)=>{
      let r="",g="",b="",color16 = color.value.replace(/#/g,"");
      r = color16.substring(0,2);
      g = color16.substring(2,4);
      b = color16.substring(4,6);
      return `rgba(${parseInt(r,16)},${parseInt(g,16)},${parseInt(b,16)},${color.opacity})`;
    };
    const getImageStyle = (style)=>{
      return `<image xlink:href="${style.src}" width="16" height="18"/>`;
    };
    const getCircleStyle = (style)=>{
      return `<circle r="6" cx="8" cy="8" fill="blue" style="fill:${getRGBAColorBy16(style.fill.color)};stroke-width:${2};stroke:${getRGBAColorBy16(style.stroke.color)};">`;
    };
    const getSquareStyle = (style) =>{
      return `<rect width="16" height="18" style="fill:${getRGBAColorBy16(style.fill.color)};stroke-width:${2};stroke:${getRGBAColorBy16(style.stroke.color)};" />`;
    };
    const getHexagonStyle = (style)=>{
      return `<polygon points="4 0,12 0,16 8,12 16,4 16,0 8" style="fill:${getRGBAColorBy16(style.fill.color)};stroke-width:${2};stroke:${getRGBAColorBy16(style.stroke.color)};"/>`;
    };
    const getPolygonStyle = (style)=>{
      return `<polygon points="4 0,20 4,8 10,16 8,12 16,10 8,4 16,0 8" style="fill:${getRGBAColorBy16(style.fill.color)};stroke-width:${2};stroke:${getRGBAColorBy16(style.stroke.color)};"/>`;
    },
    const getLinestringStyle = (style)=>{
      return `<line x1="0" y1="8" x2="16" y2="8" style="stroke:${getRGBAColorBy16(style.color)};stroke-width:${2}"/>`;
    };
    const getIconExampleByItemStyle = (itemStyle) =>{
      switch(itemStyle.symbolType){
        case "circle":
          return getCircleStyle(itemStyle.vectorType === "unVector"?itemStyle.image.circle:itemStyle.circle);
        case "square":
          return getSquareStyle(itemStyle.vectorType === "unVector"?itemStyle.image.square:itemStyle.square);
        case "hexagon":
          return getHexagonStyle(itemStyle.vectorType === "unVector"?itemStyle.image.hexagon:itemStyle.hexagon);
        case "icon":
          return getImageStyle(itemStyle.image.icon);
        case "polygon":
          return getPolygonStyle(itemStyle.polygon);
        case "lineString":
          return getLinestringStyle(itemStyle.lineString);
      }
    };
    return getIconExampleByItemStyle(item);
  }
  
  const getLegend = (item)=>{
    const getRGBAColorBy16 = (color)=>{
      let r="",g="",b="",color16 = color.value.replace(/#/g,"");
      r = color16.substring(0,2);
      g = color16.substring(2,4);
      b = color16.substring(4,6);
      return `rgba(${parseInt(r,16)},${parseInt(g,16)},${parseInt(b,16)},${color.opacity})`;
    };
    const getImageStyle = (style)=>{
      return `<image xlink:href="${style.src}" width="16" height="18"/>`;
    };
    const getCircleStyle = (style)=>{
      return `<circle r="6" cx="8" cy="8" fill="blue" style="fill:${getRGBAColorBy16(style.fill.color)};stroke-width:${2};stroke:${getRGBAColorBy16(style.stroke.color)};">`;
    };
    const getSquareStyle = (style) =>{
      return `<rect width="16" height="18" style="fill:${getRGBAColorBy16(style.fill.color)};stroke-width:${2};stroke:${getRGBAColorBy16(style.stroke.color)};" />`;
    };
    const getHexagonStyle = (style)=>{
      return `<polygon points="4 0,12 0,16 8,12 16,4 16,0 8" style="fill:${getRGBAColorBy16(style.fill.color)};stroke-width:${2};stroke:${getRGBAColorBy16(style.stroke.color)};"/>`;
    };
    const getPolygonStyle = (style)=>{
      return `<polygon points="4 0,20 4,8 10,16 8,12 16,10 8,4 16,0 8" style="fill:${getRGBAColorBy16(style.fill.color)};stroke-width:${2};stroke:${getRGBAColorBy16(style.stroke.color)};"/>`;
    };
    const getLinestringStyle = (style)=>{
      return `<line x1="0" y1="8" x2="16" y2="8" style="stroke:${getRGBAColorBy16(style.color)};stroke-width:${2}"/>`;
    };
    const getIconExampleByItemStyle = (itemStyle) =>{
      switch(itemStyle.symbolType){
        case "circle":
          return getCircleStyle(itemStyle.vectorType === "unVector"?itemStyle.image.circle:itemStyle.circle);
        case "square":
          return getSquareStyle(itemStyle.vectorType === "unVector"?itemStyle.image.square:itemStyle.square);
        case "hexagon":
          return getHexagonStyle(itemStyle.vectorType === "unVector"?itemStyle.image.hexagon:itemStyle.hexagon);
        case "icon":
          return getImageStyle(itemStyle.image.icon);
        case "polygon":
          return getPolygonStyle(itemStyle.polygon);
        case "lineString":
          return getLinestringStyle(itemStyle.lineString);
      }
    };
    return getIconExampleByItemStyle(item);
  };