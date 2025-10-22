import React, { useRef, useState, useEffect } from 'react';

/**
 * Custom hook to detect when an element is visible in the viewport.
 * Uses IntersectionObserver for performance.
 * @param options - IntersectionObserver options
 * @returns A ref to attach to the element and a boolean indicating visibility.
 */
export const useAnimateOnScroll = (options: IntersectionObserverInit = { threshold: 0.1 }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const currentRef = ref.current;
        if (!currentRef) return;

        const observer = new IntersectionObserver(([entry]) => {
            // When the element is intersecting (visible), set state to true and stop observing.
            // This ensures the animation only runs once and fixes the initial load issue.
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(currentRef);
            }
        }, options);

        observer.observe(currentRef);

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef); // Cleanup on unmount
            }
        };
    }, [options]);

    return [ref, isVisible] as const;
};

/**
 * A wrapper component to apply slide-in animations on scroll.
 */
// Fix: Define props with a type alias for better readability and to resolve TS inference issues.
type AnimateOnScrollProps = {
    children: React.ReactNode;
    direction?: 'up' | 'left' | 'right';
    delay?: number;
};

// Fix: Explicitly type AnimateOnScroll as a React.FC to ensure correct handling of React props like `key` and to resolve cascading type errors.
export const AnimateOnScroll: React.FC<AnimateOnScrollProps> = ({ children, direction = 'up', delay = 0 }) => {
    const [ref, isVisible] = useAnimateOnScroll();
    
    const directionClasses = {
        up: 'translate-y-10',
        left: '-translate-x-10',
        right: 'translate-x-10',
    };

    return (
        <div 
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${directionClasses[direction]}`}`}
        >
            {children}
        </div>
    );
};
