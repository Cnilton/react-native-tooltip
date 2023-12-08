import {Ref} from 'react';
import {
  LayoutRectangle,
  PanResponderInstance,
  View,
  ViewStyle,
} from 'react-native';

export interface IController {
  direction: Direction;
  caretSize: number;
  tooltipVisible?: boolean;
  popoverWidth?: number;
  popoverHeight?: number;
  caretStyles?: ViewStyle;
  tooltipStyles?: ViewStyle;
  backgroundColor?: string;
  borderColor?: string;
  caretColor?: string;
  hideTooltip?: () => void;
}

export type Direction =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'left-top'
  | 'left-bottom'
  | 'right-top'
  | 'right-bottom'
  | 'left-center'
  | 'right-center'
  | 'top-center'
  | 'bottom-center';

export interface ILayout {
  x: number;
  y: number;
  width: number;
  height: number;
  pageX: number;
  pageY: number;
}

export interface IUseTooltip {
  styles: {
    tooltip: ViewStyle;
    triangle: ViewStyle;
    backdrop: ViewStyle;
    container: ViewStyle;
  };
  setPopoverPosition: (_: LayoutRectangle) => void;
  setPosition: (_: LayoutRectangle) => void;
  panResponder: PanResponderInstance;
  backdropViewRef: React.RefObject<View>;
  setBackdropMeasure: (_: ILayout) => void;
  backdropMeasure: ILayout;
}

export interface ITooltip {
  direction?: Direction;
  caretSize?: number;
  tooltipVisible?: boolean;
  popoverWidth?: number;
  popoverHeight?: number;
  caretStyles?: ViewStyle;
  tooltipStyles?: ViewStyle;
  backgroundColor?: string;
  borderColor?: string;
  caretColor?: string;
  popoverContent: React.ReactNode;
  children: React.ReactNode;
  hideTooltip?: () => void;
}
