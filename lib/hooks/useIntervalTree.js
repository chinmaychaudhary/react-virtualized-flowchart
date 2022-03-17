"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(
  require("@babel/runtime/helpers/toConsumableArray")
);

var _slicedToArray2 = _interopRequireDefault(
  require("@babel/runtime/helpers/slicedToArray")
);

var React = _interopRequireWildcard(require("react"));

var _invariant = _interopRequireDefault(require("invariant"));

var _useFirstMountState = _interopRequireDefault(
  require("./useFirstMountState")
);

var _helper = require("../helper");

var _intervalTree = _interopRequireDefault(require("../lib/intervalTree"));

// Libraries
// Hooks
// Helpers
var useIntervalTree = function useIntervalTree(edges, verticesMap) {
  var isFirstMount = (0, _useFirstMountState.default)();
  var xIntervalTreeRef = (0, React.useRef)((0, _intervalTree.default)());
  var xIntervalTreeNodesRef = (0, React.useRef)({});
  var yIntervalTreeRef = (0, React.useRef)((0, _intervalTree.default)());
  var yIntervalTreeNodesRef = (0, React.useRef)({});
  var addToXIntervalTree = (0, React.useCallback)(function(edge, verticesMap) {
    var edgeId = edge.id;

    if (xIntervalTreeNodesRef.current[edgeId]) {
      return;
    }

    var sourceVertex = verticesMap.get(edge.sourceId);
    (0,
    _invariant.default)(sourceVertex, "sourceVertex missing for the edgeId - ".concat(edgeId));
    var targetVertex = verticesMap.get(edge.targetId);
    (0,
    _invariant.default)(targetVertex, "targetVertex missing for the edgeId - ".concat(edgeId));
    var interval = (0, _helper.makeXIntervalForEdge)(
      edge,
      sourceVertex.vertex,
      targetVertex.vertex
    );
    xIntervalTreeNodesRef.current[edgeId] = interval;
    xIntervalTreeRef.current.insert(interval);
  }, []);
  var addToYIntervalTree = (0, React.useCallback)(function(edge, verticesMap) {
    var edgeId = edge.id;

    if (yIntervalTreeNodesRef.current[edgeId]) {
      return;
    }

    var sourceVertex = verticesMap.get(edge.sourceId);
    (0,
    _invariant.default)(sourceVertex, "sourceVertex missing for the edgeId - ".concat(edgeId));
    var targetVertex = verticesMap.get(edge.targetId);
    (0,
    _invariant.default)(targetVertex, "targetVertex missing for the edgeId - ".concat(edgeId));
    var interval = (0, _helper.makeYIntervalForEdge)(
      edge,
      sourceVertex.vertex,
      targetVertex.vertex
    );
    yIntervalTreeNodesRef.current[edgeId] = interval;
    yIntervalTreeRef.current.insert(interval);
  }, []);

  if (isFirstMount) {
    edges.forEach(function(edge) {
      return addToXIntervalTree(edge, verticesMap);
    });
    edges.forEach(function(edge) {
      return addToYIntervalTree(edge, verticesMap);
    });
  }

  var updateIntervalTrees = (0, React.useCallback)(
    function(_ref, verticesMap, verticesToEdgesMap) {
      var itemsAdded = _ref.itemsAdded,
        itemsRemoved = _ref.itemsRemoved;
      itemsRemoved.forEach(function(vertex) {
        var vertexId = vertex.id;
        var edges = verticesToEdgesMap.get(vertexId) || [];
        edges.forEach(function(edge) {
          (0,
          _helper.removeNode)(xIntervalTreeRef.current, xIntervalTreeNodesRef.current, edge.id);
          (0,
          _helper.removeNode)(yIntervalTreeRef.current, yIntervalTreeNodesRef.current, edge.id);
        });
      });
      itemsAdded.forEach(function(vertex) {
        var edges = verticesToEdgesMap.get(vertex.id);
        edges.forEach(function(edge) {
          addToXIntervalTree(edge, verticesMap);
          addToYIntervalTree(edge, verticesMap);
        });
      });
    },
    [addToXIntervalTree, addToYIntervalTree]
  );
  var updateEdges = (0, React.useCallback)(
    function(_ref2, verticesMap, verticesToEdgesMap) {
      var itemsAdded = _ref2.itemsAdded,
        itemsRemoved = _ref2.itemsRemoved;
      var xIntervalIdToIndex = new Map(
        xIntervalTreeRef.current.intervals.map(function(_ref3, index) {
          var _ref4 = (0, _slicedToArray2.default)(_ref3, 3),
            a = _ref4[0],
            b = _ref4[1],
            edge = _ref4[2];

          return [edge.id, index];
        })
      );
      var xSortedItemsToRemove = (0, _toConsumableArray2.default)(
        itemsRemoved
      ).sort(function(itemA, itemB) {
        return (
          (xIntervalIdToIndex.get(itemA.id) || 0) -
          (xIntervalIdToIndex.get(itemB.id) || 0)
        );
      });
      var yIntervalIdToIndex = new Map(
        yIntervalTreeRef.current.intervals.map(function(_ref5, index) {
          var _ref6 = (0, _slicedToArray2.default)(_ref5, 3),
            a = _ref6[0],
            b = _ref6[1],
            edge = _ref6[2];

          return [edge.id, index];
        })
      );
      var ySortedItemsToRemove = (0, _toConsumableArray2.default)(
        itemsRemoved
      ).sort(function(itemA, itemB) {
        return (
          (yIntervalIdToIndex.get(itemA.id) || 0) -
          (yIntervalIdToIndex.get(itemB.id) || 0)
        );
      });
      itemsRemoved.forEach(function(edge) {
        (0, _helper.removeEdgeFromVerticesToEdgesMap)(edge, verticesToEdgesMap);
      });
      xSortedItemsToRemove.forEach(function(edge) {
        var edgeId = edge.id;
        (0,
        _helper.removeNode)(xIntervalTreeRef.current, xIntervalTreeNodesRef.current, edgeId);
      });
      ySortedItemsToRemove.forEach(function(edge) {
        var edgeId = edge.id;
        (0,
        _helper.removeNode)(yIntervalTreeRef.current, yIntervalTreeNodesRef.current, edgeId);
      });
      itemsAdded.forEach(function(edge) {
        (0, _helper.addEdgeToVerticesToEdgesMap)(edge, verticesToEdgesMap);
        addToXIntervalTree(edge, verticesMap);
        addToYIntervalTree(edge, verticesMap);
      });
      return {
        verticesToEdgesMap: verticesToEdgesMap
      };
    },
    [addToXIntervalTree, addToYIntervalTree]
  );
  var getVisibleEdgesHelper = (0, React.useCallback)(function(viewport) {
    var xEdgesMap = new Map();
    var yEdgesMap = new Map();
    var visibleVertices = new Map();
    xIntervalTreeRef.current.queryInterval(
      viewport.xMin,
      viewport.xMax,
      function(_ref7) {
        var _ref8 = (0, _slicedToArray2.default)(_ref7, 3),
          low = _ref8[0],
          high = _ref8[1],
          edge = _ref8[2];

        xEdgesMap.set(edge.id, edge);
      }
    );
    yIntervalTreeRef.current.queryInterval(
      viewport.yMin,
      viewport.yMax,
      function(_ref9) {
        var _ref10 = (0, _slicedToArray2.default)(_ref9, 3),
          low = _ref10[0],
          high = _ref10[1],
          edge = _ref10[2];

        yEdgesMap.set(edge.id, edge);
      }
    );
    xEdgesMap.forEach(function(edge, edgeId) {
      if (yEdgesMap.has(edgeId)) {
        visibleVertices.set(edgeId, edge);
      }
    });
    return visibleVertices;
  }, []);
  return {
    getVisibleEdgesHelper: getVisibleEdgesHelper,
    updateIntervalTrees: updateIntervalTrees,
    updateEdges: updateEdges
  };
};

var _default = useIntervalTree;
exports.default = _default;
