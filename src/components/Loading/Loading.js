"use client";
import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import styles from './Loading.module.css';

const Loading = ({ 
  size = 100, 
  text = "Loading...", 
  fullScreen = false,
  title = null,
  subtitle = null,
  children = null 
}) => {
  const [animationData, setAnimationData] = useState(null);
  const [isLoading, setIsLoading] = useState(fullScreen);

  useEffect(() => {
    // Load the lottie animation
    const loadAnimation = async () => {
      try {
        const response = await fetch('/lottie/tailorTech.json');
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error('Failed to load lottie animation:', error);
        // Fallback simple animation
        setAnimationData({
          "v": "5.7.4",
          "fr": 30,
          "ip": 0,
          "op": 90,
          "w": 200,
          "h": 200,
          "nm": "Loading",
          "ddd": 0,
          "assets": [],
          "layers": [
            {
              "ddd": 0,
              "ind": 1,
              "ty": 4,
              "nm": "Circle",
              "sr": 1,
              "ks": {
                "o": {"a": 0, "k": 100},
                "r": {
                  "a": 1,
                  "k": [
                    {"i": {"x": [0.833], "y": [0.833]}, "o": {"x": [0.167], "y": [0.167]}, "t": 0, "s": [0]},
                    {"t": 90, "s": [360]}
                  ]
                },
                "p": {"a": 0, "k": [100, 100, 0]},
                "a": {"a": 0, "k": [0, 0, 0]},
                "s": {"a": 0, "k": [100, 100, 100]}
              },
              "ao": 0,
              "shapes": [
                {
                  "ty": "gr",
                  "it": [
                    {
                      "d": 1,
                      "ty": "el",
                      "s": {"a": 0, "k": [80, 80]},
                      "p": {"a": 0, "k": [0, 0]},
                      "nm": "Ellipse Path 1"
                    },
                    {
                      "ty": "st",
                      "c": {"a": 0, "k": [0.008, 0.188, 0.278, 1]},
                      "o": {"a": 0, "k": 100},
                      "w": {"a": 0, "k": 8},
                      "lc": 2,
                      "lj": 1,
                      "ml": 4,
                      "bm": 0,
                      "nm": "Stroke 1"
                    },
                    {
                      "ty": "tr",
                      "p": {"a": 0, "k": [0, 0]},
                      "a": {"a": 0, "k": [0, 0]},
                      "s": {"a": 0, "k": [100, 100]},
                      "r": {"a": 0, "k": 0},
                      "o": {"a": 0, "k": 100},
                      "sk": {"a": 0, "k": 0},
                      "sa": {"a": 0, "k": 0},
                      "nm": "Transform"
                    }
                  ],
                  "nm": "Ellipse 1",
                  "bm": 0
                }
              ],
              "ip": 0,
              "op": 90,
              "st": 0,
              "bm": 0
            }
          ],
          "markers": []
        });
      }
    };

    loadAnimation();

    // If fullScreen mode, simulate app initialization
    if (fullScreen) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [fullScreen]);

  // Full screen app loader mode
  if (fullScreen && isLoading) {
    return (
      <div className={styles.fullScreenLoading}>
        <div className={styles.loaderContent}>
          {animationData && (
            <div className={styles.lottieContainer} style={{ width: 300, height: 200 }}>
              <Lottie 
                animationData={animationData}
                loop={true}
                autoplay={true}
                style={{ 
                  width: 300, 
                  height: 300, 
                  background: 'transparent'
                }}
                rendererSettings={{
                  preserveAspectRatio: 'xMidYMid slice',
                  clearCanvas: true,
                  progressiveLoad: false,
                  hideOnTransparent: true
                }}
              />
            </div>
          )}
          <h1 className={styles.title}>{title || "TailorTech"}</h1>
          <p className={styles.subtitle}>{subtitle || "Stitching..."}</p>
        </div>
      </div>
    );
  }

  // Return children if fullScreen mode is done
  if (fullScreen && !isLoading) {
    return children;
  }

  // Regular loading component
  if (!animationData) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.fallbackLoader} style={{ width: size, height: size }}>
          <div className={styles.spinner}></div>
        </div>
        {text && <p className={styles.loadingText}>{text}</p>}
      </div>
    );
  }

  return (
    <div className={styles.loadingContainer}>
      <div style={{ width: size, height: size, background: 'transparent' }}>
        <Lottie 
          animationData={animationData}
          loop={true}
          autoplay={true}
          style={{ 
            background: 'transparent'
          }}
          rendererSettings={{
            preserveAspectRatio: 'xMidYMid slice',
            clearCanvas: true,
            progressiveLoad: false,
            hideOnTransparent: true
          }}
        />
      </div>
      {text && <p className={styles.loadingText}>{text}</p>}
    </div>
  );
};

export default Loading;