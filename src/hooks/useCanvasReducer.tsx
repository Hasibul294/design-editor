import { useReducer } from "react";
import { Canvas } from "fabric";

// state types
interface CanvasState {
  canvas: Canvas | null;
  undoStack: string[];
  redoStack: string[];
}

// action types
type Action =
  | { type: "SET_CANVAS"; payload: Canvas }
  | { type: "ADD_SHAPE"; payload: string }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SAVE_STATE" };

// reducer function
const canvasReducer = (state: CanvasState, action: Action): CanvasState => {
  switch (action.type) {
    case "SET_CANVAS":
      return { ...state, canvas: action.payload };
    case "ADD_SHAPE":
      return { ...state, undoStack: [...state.undoStack, action.payload] };
    case "UNDO": {
      if (state.undoStack.length === 0 || !state.canvas) return state;
      const lastState = state.undoStack[state.undoStack.length - 1];
      state.canvas.loadFromJSON(JSON.parse(lastState), () => {
        state.canvas?.renderAll();
        state.canvas?.requestRenderAll();
      });
      return {
        ...state,
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [...state.redoStack, JSON.stringify(state.canvas.toJSON())],
      };
    }
    case "REDO": {
      if (state.redoStack.length === 0 || !state.canvas) return state;
      const nextState = state.redoStack[state.redoStack.length - 1];
      state.canvas.loadFromJSON(JSON.parse(nextState), () => {
        state.canvas?.renderAll();
        state.canvas?.requestRenderAll();
      });
      return {
        ...state,
        undoStack: [...state.undoStack, JSON.stringify(state.canvas.toJSON())],
        redoStack: state.redoStack.slice(0, -1),
      };
    }
    case "SAVE_STATE":
      if (!state.canvas) return state;
      return {
        ...state,
        undoStack: [...state.undoStack, JSON.stringify(state.canvas.toJSON())],
        redoStack: [],
      };
    default:
      return state;
  }
};

// create custom hook
const useCanvasReducer = () => {
  const [state, dispatch] = useReducer(canvasReducer, {
    canvas: null,
    undoStack: [],
    redoStack: [],
  });

  return { state, dispatch };
};

export default useCanvasReducer;
