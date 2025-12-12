import React, { useState } from 'react';
import Step1PersonalInfo from './Step1PersonalInfo';
import Step2SmsVerification from './Step2SmsVerification';
import Step3ProductInfo from './Step3ProductInfo';
import Step4FaceVerification from './Step4FaceVerification';
import Step5CustomerRepresentative from './Step5CustomerRepresentative';

export default function ApplicationFlow({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);
  const [applicationData, setApplicationData] = useState({});

  const handleStepPress = (stepNumber) => {
    if (stepNumber <= maxStepReached) {
      setCurrentStep(stepNumber);
    }
  };

  const handleStep1Complete = (data) => {
    setApplicationData({ ...applicationData, ...data });
    setCurrentStep(2);
    setMaxStepReached(Math.max(maxStepReached, 2));
  };

  const handleStep2Complete = (data) => {
    setApplicationData({ ...applicationData, ...data });
    setCurrentStep(3);
    setMaxStepReached(Math.max(maxStepReached, 3));
  };

  const handleStep2Timeout = () => {
    if (onComplete) {
      onComplete(null);
    }
  };

  const handleStep3Complete = (data) => {
    setApplicationData({ ...applicationData, ...data });
    setCurrentStep(4);
    setMaxStepReached(Math.max(maxStepReached, 4));
  };

  const handleStep4Complete = (data) => {
    setApplicationData({ ...applicationData, ...data });
    setCurrentStep(5);
    setMaxStepReached(Math.max(maxStepReached, 5));
  };

  const handleStep5Complete = (data) => {
    const finalData = { ...applicationData, ...data };
    setApplicationData(finalData);
    console.log('Application completed:', finalData);
    if (onComplete) {
      onComplete(finalData);
    }
  };

  switch (currentStep) {
    case 1:
      return (
        <Step1PersonalInfo 
          onNext={handleStep1Complete} 
          currentStep={currentStep} 
          maxStepReached={maxStepReached}
          onStepPress={handleStepPress}
          initialData={applicationData}
        />
      );
    case 2:
      return (
        <Step2SmsVerification
          onNext={handleStep2Complete}
          phoneNumber={applicationData.fullPhone || applicationData.phone}
          onTimeout={handleStep2Timeout}
          currentStep={currentStep}
          maxStepReached={maxStepReached}
          onStepPress={handleStepPress}
        />
      );
    case 3:
      return (
        <Step3ProductInfo 
          onNext={handleStep3Complete} 
          currentStep={currentStep} 
          maxStepReached={maxStepReached}
          onStepPress={handleStepPress}
          initialData={applicationData}
        />
      );
    case 4:
      return (
        <Step4FaceVerification 
          onNext={handleStep4Complete} 
          currentStep={currentStep} 
          maxStepReached={maxStepReached}
          onStepPress={handleStepPress}
        />
      );
    case 5:
      return (
        <Step5CustomerRepresentative 
          onComplete={handleStep5Complete} 
          currentStep={currentStep} 
          maxStepReached={maxStepReached}
          onStepPress={handleStepPress}
        />
      );
    default:
      return (
        <Step1PersonalInfo 
          onNext={handleStep1Complete} 
          currentStep={currentStep} 
          maxStepReached={maxStepReached}
          onStepPress={handleStepPress}
          initialData={applicationData}
        />
      );
  }
}
