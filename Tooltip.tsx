import React from 'react';
import {View, Animated} from 'react-native';
import {ITooltip} from './types';
import {useTooltip} from './controller';

const RNTooltip: React.FC<ITooltip> = ({
  caretSize = 10,
  direction = 'top-center',
  caretStyles,
  backgroundColor = 'white',
  caretColor = 'white',
  tooltipStyles,
  popoverContent,
  borderColor,
  children,
  popoverWidth,
  popoverHeight,
  tooltipVisible,
  hideTooltip,
}) => {
  const {
    backdropMeasure,
    backdropViewRef,
    panResponder,
    setBackdropMeasure,
    setPopoverPosition,
    setPosition,
    styles,
  } = useTooltip({
    tooltipVisible,
    backgroundColor,
    borderColor,
    caretColor,
    caretSize,
    caretStyles,
    direction,
    hideTooltip,
    popoverHeight,
    popoverWidth,
    tooltipStyles,
  });

  return (
    <View style={styles.container}>
      {tooltipVisible && (
        <Animated.View
          {...panResponder?.panHandlers}
          ref={backdropViewRef}
          onLayout={() => {
            if (backdropViewRef?.current && backdropMeasure.height === 0) {
              backdropViewRef.current.measure(
                (x, y, width, height, pageX, pageY) => {
                  setBackdropMeasure({
                    height,
                    pageX,
                    pageY,
                    width,
                    x,
                    y,
                  });
                },
              );
            }
          }}
          style={styles.backdrop}
        />
      )}
      <View
        onLayout={layout => {
          setPosition(layout.nativeEvent.layout);
        }}>
        {children}
      </View>
      <Animated.View style={styles.triangle} />
      <Animated.View
        {...panResponder?.panHandlers}
        onLayout={layout => {
          setPopoverPosition(layout.nativeEvent.layout);
        }}
        style={styles.tooltip}>
        {popoverContent}
      </Animated.View>
    </View>
  );
};

export {RNTooltip};
