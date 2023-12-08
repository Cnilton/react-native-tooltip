import {useRef, useMemo, useState, useEffect} from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {IController, ILayout, IUseTooltip} from './types';

export const useTooltip = ({
  backgroundColor,
  caretColor,
  tooltipVisible,
  caretSize,
  caretStyles,
  direction,
  hideTooltip,
  popoverHeight,
  popoverWidth,
  tooltipStyles,
}: IController): IUseTooltip => {
  const backdropViewRef = useRef<View>(null);
  const [backdropMeasure, setBackdropMeasure] = useState<ILayout>({
    height: 0,
    pageX: 0,
    pageY: 0,
    width: 0,
    x: 0,
    y: 0,
  });
  const animatedOpacity = useMemo(() => new Animated.Value(0), []);
  const animatedBackdropOpacity = useMemo(() => new Animated.Value(0), []);

  const panResponder = useRef(
    PanResponder.create({
      onPanResponderStart() {
        handlePressOutside();
      },
      onStartShouldSetPanResponder: () => true,
    }),
  ).current;

  let firstDirection =
    direction.split('-')[0] === 'left'
      ? 'right'
      : direction.split('-')[0] === 'right'
      ? 'left'
      : direction.split('-')[0];

  const secondDirection = direction.split('-')[1];
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [popoverPosition, setPopoverPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [maxWidth, setMaxWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    setMaxWidth(m =>
      m
        ? m
        : !popoverWidth && popoverPosition.width
        ? secondDirection === 'right'
          ? popoverPosition.width - Math.abs(popoverPosition.x) + 1
          : Dimensions.get('window').width - popoverPosition.x - 32
        : undefined,
    );
  }, [popoverWidth, popoverPosition, secondDirection]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedOpacity, {
        toValue: tooltipVisible ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(animatedBackdropOpacity, {
        toValue: tooltipVisible ? 0.5 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [tooltipVisible, animatedOpacity, animatedBackdropOpacity]);

  const caretIosOrAndroid =
    Platform.OS === 'ios'
      ? {
          transform: [
            {
              rotate:
                firstDirection === 'top'
                  ? '0deg'
                  : firstDirection === 'bottom'
                  ? '180deg'
                  : firstDirection === 'left'
                  ? '90deg'
                  : '270deg',
            },
          ],
          borderStyle: 'solid',
          borderLeftWidth: caretSize / 2,
          borderRightWidth: caretSize / 2,
          borderTopWidth: caretSize,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: 'transparent',
          borderTopColor: caretColor,
        }
      : {
          width: caretSize,
          height: caretSize,
          transform: [
            {
              rotate:
                firstDirection === 'top'
                  ? '-45deg'
                  : firstDirection === 'bottom'
                  ? '45deg'
                  : firstDirection === 'left'
                  ? '45deg'
                  : '45deg',
            },
          ],
        };

  const styles = StyleSheet.create({
    tooltip: {
      position: 'absolute',
      elevation: 5,
      zIndex: tooltipVisible ? 2 : -1,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: {
        height: 2,
        width: 2,
      },
      shadowRadius: 5,
      shadowOpacity: 0.2,
      borderRadius: 8,
      backgroundColor,
      opacity: animatedOpacity,
      flex: 1,
      maxWidth,
      width: popoverWidth,
      height: popoverHeight,
      [firstDirection]:
        firstDirection === 'top' || firstDirection === 'bottom'
          ? -popoverPosition.height - caretSize / 2
          : position.width + caretSize / 2,
      [secondDirection === 'center'
        ? firstDirection === 'top' || firstDirection === 'bottom'
          ? 'left'
          : 'top'
        : secondDirection]:
        secondDirection === 'center'
          ? firstDirection === 'top' || firstDirection === 'bottom'
            ? (position.width - popoverPosition.width) / 2
            : (position.height - popoverPosition.height) / 2
          : secondDirection === 'top' || secondDirection === 'bottom'
          ? -caretSize / 2
          : 0,
      ...tooltipStyles,
    },
    container: {alignSelf: 'flex-start'},
    // @ts-ignore
    triangle: {
      [firstDirection]:
        firstDirection === 'top' || firstDirection === 'bottom'
          ? -caretSize - (Platform.OS === 'ios' ? 0 : caretSize / 5)
          : position.width + (Platform.OS === 'ios' ? 0 : caretSize / 5),
      [secondDirection === 'center'
        ? firstDirection === 'top' || firstDirection === 'bottom'
          ? 'left'
          : 'top'
        : secondDirection]:
        secondDirection === 'center'
          ? firstDirection === 'top' || firstDirection === 'bottom'
            ? (position.width - caretSize) / 2
            : (position.height - caretSize) / 2
          : secondDirection === 'top' || secondDirection === 'bottom'
          ? 6
          : Platform.OS === 'ios'
          ? 6
          : 12,
      opacity: animatedOpacity,
      position: 'absolute',
      shadowColor: '#000',
      shadowOffset: {
        height: 2.5,
        width: 0,
      },
      elevation: 5,
      shadowRadius: 1,
      shadowOpacity: 0.1,
      zIndex: tooltipVisible ? 3 : -1,

      backgroundColor: caretColor,
      ...caretIosOrAndroid,
      ...caretStyles,
    },
    backdrop: {
      position: 'absolute',
      elevation: 3,
      zIndex: 999,
      opacity: animatedBackdropOpacity,
      top: -backdropMeasure.pageY,
      left: -backdropMeasure.pageX,
      backgroundColor: 'black',
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
    },
  });

  const handlePressOutside = () => {
    if (hideTooltip) {
      hideTooltip();
    }
  };

  return {
    // @ts-ignore
    styles,
    setPopoverPosition,
    setPosition,
    panResponder,
    backdropViewRef,
    setBackdropMeasure,
    backdropMeasure,
  };
};
