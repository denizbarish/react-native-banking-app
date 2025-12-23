import React, { useState } from 'react';
import { Alert } from 'react-native';
import { authService } from '../services/authService';
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

  const handleStep5Complete = async (data) => {
    const finalData = { ...applicationData, ...data };
    setApplicationData(finalData);
    console.log('Application completed:', finalData);
    
    try {
      
      const response = await authService.submitApplication({
        
        tcNo: finalData.tcNo,
        phone: finalData.fullPhone || finalData.phone,
        countryCode: finalData.countryCode,
        agreedToTerms: finalData.agreedToTerms,
        
        
        smsCode: finalData.smsCode,
        smsVerified: finalData.smsVerified,
        
        
        selectedProducts: finalData.selectedProducts,
        income: finalData.income,
        wealthSource: finalData.wealthSource,
        transactionVolume: finalData.transactionVolume,
        education: finalData.education,
        employmentStatus: finalData.employmentStatus,
        sector: finalData.sector,
        occupation: finalData.occupation,
        email: finalData.email,
        dataConsent: finalData.dataConsent,
        marketingConsent: finalData.marketingConsent,
        
        
        faceVerified: finalData.faceVerified,
        faceVerificationTimestamp: finalData.faceVerificationTimestamp,
        
        
        hearingImpaired: finalData.hearingImpaired,
        
        
        applicationDate: new Date().toISOString(),
      });
      
      Alert.alert(
        'Başvuru Başarılı',
        'Başvurunuz başarıyla alınmıştır. En kısa sürede tarafınıza dönüş yapılacaktır.',
        [
          {
            text: 'Tamam',
            onPress: () => {
              if (onComplete) {
                onComplete(response);
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        'Başvuru Hatası',
        error.message || 'Başvurunuz gönderilirken bir hata oluştu. Lütfen tekrar deneyin.',
        [
          {
            text: 'Tamam'
          }
        ]
      );
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
