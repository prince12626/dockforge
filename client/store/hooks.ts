import { useDispatch, useSelector, useStore } from "react-redux";

import type { AppDispatch, RootState, store } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector = useSelector.withTypes
      ? useSelector.withTypes<RootState>()
      : useSelector;

export const useAppStore = () => useStore<typeof store>();
