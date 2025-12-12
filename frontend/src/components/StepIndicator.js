import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { colors } from '../theme/colors';

export default function StepIndicator({ currentStep, maxStepReached, totalSteps = 5, onStepPress }) {
  return (
    <View style={styles.container}>
      {[...Array(totalSteps)].map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        const isReached = stepNumber <= (maxStepReached || currentStep);
        const isClickable = isReached && onStepPress && stepNumber !== currentStep;

        return (
          <View key={stepNumber} style={styles.stepWrapper}>
            <TouchableOpacity
              onPress={() => isClickable && onStepPress(stepNumber)}
              disabled={!isClickable}
              activeOpacity={isClickable ? 0.7 : 1}
            >
              <Surface
                style={[
                  styles.bubble,
                  isActive && styles.bubbleActive,
                  isCompleted && styles.bubbleCompleted,
                ]}
                elevation={isActive ? 4 : 1}
              >
                <Text
                  style={[
                    styles.stepText,
                    (isActive || isCompleted) && styles.stepTextActive,
                  ]}
                >
                  {stepNumber}
                </Text>
              </Surface>
            </TouchableOpacity>
            {stepNumber < totalSteps && (
              <View
                style={[
                  styles.connector,
                  isCompleted && styles.connectorCompleted,
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  bubbleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  bubbleCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  stepText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  stepTextActive: {
    color: colors.secondary,
  },
  connector: {
    width: 30,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  connectorCompleted: {
    backgroundColor: colors.success,
  },
});
