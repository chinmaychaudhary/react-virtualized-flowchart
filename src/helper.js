import _map from "lodash/map";

export function getAddedOrRemovedItems(prevItems, nextItems) {
  const prevMap = new Map(prevItems.map(i => [i.id, i]));
  const nextMap = new Map(nextItems.map(i => [i.id, i]));
  const itemsAdded = [];
  const itemsRemoved = [];
  const itemsUpdated = [];

  prevMap.forEach((value, id) => {
    if (!nextMap.has(id)) {
      itemsRemoved.push(value);
    } else if (prevMap.get(id) !== nextMap.get(id)) {
      itemsRemoved.push(value);
      itemsUpdated.push(value);
    }
  });

  nextMap.forEach((value, id) => {
    if (!prevMap.has(id) || prevMap.get(id) !== nextMap.get(id)) {
      itemsAdded.push(value);
    }
  });

  return {
    itemsAdded,
    itemsRemoved,
    itemsUpdated
  };
}

export function getOverlayId(edge, overlay) {
  const { sourceId, targetId } = edge;
  return `${sourceId}-${targetId}-${overlay.id}`;
}

export function getOverlays(edge) {
  const customOverlays = _map(edge.customOverlays, customOverlay => {
    const { id, location } = customOverlay;
    return [
      "Custom",
      {
        create: () => {
          const overlayDiv = document.createElement("div");
          overlayDiv.setAttribute("id", getOverlayId(edge, customOverlay));
          return overlayDiv;
        },
        location,
        id
      }
    ];
  });

  return [...(edge.overlays || []), ...customOverlays];
}
