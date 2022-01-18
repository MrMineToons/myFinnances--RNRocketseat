import React from 'react';
import { RectButtonProps, GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  Button,
  ImageContainer,
  Text,
} from './styles';

interface Props extends RectButtonProps {
  title: string;
  svg: React.FC<SvgProps>
}

export function SignInSocialButton({
  title,
  svg: Svg,
  ...rest
}: Props){
  return(
    <GestureHandlerRootView>
      <Button {...rest}>
        <ImageContainer>
          <Svg />
        </ImageContainer>

        <Text>
          {title}
        </Text>
      </Button>
    </GestureHandlerRootView>
  );
}
