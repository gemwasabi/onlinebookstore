import { useState } from 'react';
import CheckoutPage1 from './checkout-1';
import CheckoutPage2 from './checkout-2';
import CheckoutPage3 from './checkout-3';
import c1 from '../../assets/img/progress-bar/c1.svg';
import c2 from '../../assets/img/progress-bar/c2.svg';
import c3 from '../../assets/img/progress-bar/c3.svg';
import check from '../../assets/img/progress-bar/check.svg';

const CheckoutProcess = () => {
    const [currentStep, setCurrentStep] = useState(1);

    const nextStep = () => {
        setCurrentStep((prevStep) => Math.min(prevStep + 1, 3));
    };

    const prevStep = () => {
        setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <CheckoutPage1 nextStep={nextStep} />;
            case 2:
                return <CheckoutPage2 prevStep={prevStep} nextStep={nextStep} />;
            case 3:
                return <CheckoutPage3 prevStep={prevStep} />;
            default:
                return <CheckoutPage1 nextStep={nextStep} />;
        }
    };

   return (
        <div className="min-h-screen items-center justify-center bg-[#7B8E76] flex flex-col">
            <ProgressBar currentStep={currentStep} />
            <div className= "mx-auto w-full lg:p-4">
                {renderStep()}
            </div>
        </div>
    );
};

const ProgressBar = ({ currentStep }) => {
    return (
        <div className="flex items-center justify-center md:mt-2 md:mb-2 lg:mt-3 lg:mb-[-50px] p-2 z-10 relative w-full max-w-6xl">
            <Step number={1} currentStep={currentStep} icon={c1} />
            <Line currentStep={currentStep} />
            <Step number={2} currentStep={currentStep} icon={c2} />
            <Line currentStep={currentStep} />
            <Step number={3} currentStep={currentStep} icon={c3} />
        </div>
    );
};

const Step = ({ number, currentStep, icon }) => {
    const isCompleted = number < currentStep;
    const isActive = number === currentStep;

    let iconElement = null;
    if (isCompleted) {
        iconElement = <img src={check} alt={`Step ${number} done`} className="w-8 h-8 cursor-pointer" />;
    } else {
        iconElement = <img src={icon} alt={`Step ${number}`} className="w-8 h-8 cursor-pointer bg-[#96A493] p-1 rounded-full" />;
    }

    return (
        <div className={`step relative ${isCompleted ? 'completed' : ''}`}>
            {iconElement}
            <div
                className="caption absolute bottom-full left-1/2 transform -translate-x-1/2 opacity-0 pointer-events-none bg-white text-gray-700 px-2 py-1 rounded shadow-sm transition-opacity duration-300"
                style={{ backgroundColor: isActive ? '#4CAF50' : '#96A493' }}
            >
                Step {number}
            </div>
        </div>
    );
};

const Line = ({ currentStep }) => {
    return (
        <div className="line flex-1 h-1 bg-[#96A493] mx-2 relative">
            <div className={`connector absolute top-0 bottom-0 left-0 ${currentStep >= 2 ? 'bg-green-500' : 'bg-[#96A493]'}`}></div>
        </div>
    );
};

export default CheckoutProcess;
