import React, { useState, ReactNode } from "react";

type MultistepComponentProps<Steps extends readonly string[]> = {
    initialStep?: Steps[number];
    steps: Steps;
    children: (props: {
        currentStep: Steps[number];
        reset: () => void;
        setStep: (step: Steps[number]) => void;
    }) => ReactNode;
} & Omit<React.ComponentPropsWithoutRef<"div">, "children">;

export const MultiStepComponent = <Steps extends readonly string[]>({
    initialStep,
    steps,
    children,
    ...rest
}: MultistepComponentProps<Steps>) => {
    type Step = Steps[number];

    const [currentStep, setCurrentStep] = useState<Step>(
        initialStep || steps[0]
    );

    const reset = () => {
        setCurrentStep(steps[0]);
    };

    const setStep = (step: Step) => {
        if (steps.includes(step)) {
            setCurrentStep(step);
        } else {
            console.error(`Step "${step}" is not a valid step.`);
        }
    };

    return (
        <div {...rest}>
            {children({
                currentStep,
                reset,
                setStep
            })}
        </div>
    );
};
