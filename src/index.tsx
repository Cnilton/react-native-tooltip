import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {RNTooltip} from '../Tooltip';

// import { Container } from './styles';

const Tooltip: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <View style={{flex: 1, padding: 16}}>
      <Text>asasdasdd</Text>
      <Text>asasdasdd</Text>
      <Text>asasdasdd</Text>
      <RNTooltip
        tooltipVisible={showTooltip}
        direction="bottom-left"
        hideTooltip={() => {
          setShowTooltip(false);
        }}
        popoverContent={
          <Text>IIIhello iahsd iahs diha adjh g h h hg c fgchg </Text>
        }>
        <TouchableOpacity onPress={() => setShowTooltip(s => !s)}>
          <Text>Testasd asd asde</Text>
        </TouchableOpacity>
      </RNTooltip>
    </View>
  );
};

export {Tooltip};
